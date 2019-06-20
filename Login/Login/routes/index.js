var express = require('express');
var router = express.Router();
var db = require('./db');

var sessionChecker = (req, res, next) => {
	console.log("session check");
	console.log(req.session.user);
	console.log(req.user);
	console.log(req.cookies.user_sid);
	if (!req.user && !req.cookies.user_sid) {
		res.status(401).send({session:"expired"});
	} else {
	  console.log("session");
	  console.log(req.user);
	  console.log(req.cookies.user_sid);
		next();
	}    
};


router.post('/register', function(req, res, next) {
	console.log(req.body);
	console.log(req.body.mobile);
	if(req.body.mobile && req.body.password){
		var request = {
			mobile: req.body.mobile,
			email: req.body.email,
			password: req.body.password
		};
		db.addData(request, function(err, response){
			if(err){
				console.log(err);
			}
			else{
				if(response == 'inserted'){
					res.status(200).send({status:200, msg: 'registered successfull'});
				}else if(response == 'duplicate'){
					res.status(406).send({msg: 'registration failed due to duplicates'});
				}else{
					res.status(406).send({msg: 'registration failed'});
				}
			}
		});
	}else{
		res.status(406).send({msg: 'registration failed'});
	}
	
});

router.post('/login', function(req, res, next) {
	console.log(req.body);
	console.log(req.body.mobile);
	if(req.body.mobile && req.body.password){
		var request = {
			mobile: req.body.mobile,
			password: req.body.password
		};
		db.findData(request, function(err, response){
			if(err){
				console.log(err);
			}
			else{
				if(response.email){
					req.session.sessionID = req.body.mobile;
					req.cookies.user_sid = req.body.mobile;
					if(req.body.mobile == response._id && req.body.password == response.password){
						res.status(200).send({status:200, msg: 'logged in successfull', sessionID: req.session.sessionID, email: response.email, mobile: response._id, wallet: response.wallet});
					}else{
						res.status(406).send({msg: 'Mobile number / password is wrong.'});
					}
				}else if(!response){
					res.status(406).send({msg: 'Login failed due to wrong inputs.'});
				}else{
					res.status(406).send({msg: 'Mobile number / password is wrong.'});
				}
			}
		});
	}else{
		res.status(406).send({msg: 'registration failed'});
	}
	
});

router.post('/getAllTransactions', function(req, res, next) {
	if(req.body.mobile){
		var request = {
			mobile: req.body.mobile,
		};
		db.getAllTransactions(request, function(err, response){
			if(err){
				console.log(err);
			}
			else{
				if(response){
					
					res.status(200).send({status:200, msg: 'user transactions found', data: response});
					
				}else if(!response){
					res.status(406).send({msg: 'something went wrong.'});
				}else{
					res.status(406).send({msg: 'something went wrong.'});
				}
			}
		});
	}else{
		res.status(406).send({msg: 'registration failed'});
	}
	
});


router.post('/sendMoneyToWallet', function(req, res, next) {
	if(req.body.mobile){
		var request = {
			mobile: req.body.mobile,
			amount: req.body.amount,
			user: req.body.user
		};
		db.findAndUpdate(request, function(err, response){
			if(err){
				console.log(err);
			}
			else{
				if(!response){
					res.status(406).send({msg: 'something went wrong.'});
				}else if(response == 'funds'){
					res.status(406).send({msg: 'insufficient funds.'});
				}else if(response == 'payeeNotFound'){
					res.status(406).send({msg: 'user is not registered with us.'});
				}else if(response.length){
					if(response.length) response.push(request);
					db.sendMoney(response, function(err, response){
						if(err) res.status(406).send({msg: 'something went wrong.'});
						if(response == 'inserted'){
							res.status(200).send({msg: 'Money added to wallet'});
						}
					});
				}else{
					res.status(406).send({msg: 'something went wrong.'});
				}
			}
		});
	}else{
		res.status(406).send({msg: 'registration failed'});
	}
	
});


router.post('/addMoneyToWallet', function(req, res, next) {
	if(req.body.mobile){
		var request = {
			mobile: req.body.mobile,
			amount: req.body.amount,
			balance: req.body.balance
		};
		db.addMoneyToWallet(request, function(err, response){
			if(err){
				console.log(err);
			}
			else{
				if(response){
					res.status(200).send({status:200, msg: 'wallet updated', wallet: response});
				}else{
					res.status(406).send({msg: 'wallet updation failed'});
				}
			}
		});
	}else{
		res.status(406).send({msg: 'wallet updation failed'});
	}
	
});




module.exports = router;
