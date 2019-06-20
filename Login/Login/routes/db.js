var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  var dbo = db.db("Paytm");
  dbo.createCollection("Users", function(err, res) {
    if (err) throw err;
    console.log("Users Collection created!");
    
  });
  dbo.createCollection("Transactions", function(err, res) {
    if (err) throw err;
    console.log("Transactions Collection created!");
    db.close();
  });
  
});

exports.addData = function addData(request, callback) {
  MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if (err){ 
      console.log("mongodb connection error: ");
      callback("",'database error');
    }
    var dbo = db.db("Paytm");
    var myobj = { email: request.email, _id: request.mobile, password: request.password, wallet: 0};
    dbo.collection("Users").insertOne(myobj, function(err, res) {
      if (err) { 
        console.log(err);
        if(err.code == 11000){
          callback("",'duplicate');
        }else{
          console.log("mongodb insertion error: ");
          callback("",'database insert error');
        }
        
      }else{
        console.log("1 document inserted");
        callback("",'inserted');
      }
      db.close();
    });
  });
}

exports.findData = function findData(request, callback) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err){ 
      console.log("mongodb connection error: ");
      callback("",'database error');
    }
    var dbo = db.db("Paytm");
    var myobj = { _id: request.mobile};
    dbo.collection("Users").findOne(myobj, function(err, res) {
     if (err) { 
        console.log(err);
        console.log("mongodb find error: ");
        callback("",'database find error');
                
      }
      if(res){
        console.log("found 1 document");
        callback("",res);
      }else{
        console.log("mongodb find error: ");
          callback("",'database find error');
      }
      db.close();
    });
  });
}

exports.findAndUpdate = function findAndUpdate(request, callback) {
    console.log(request);
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err){ 
        console.log("mongodb connection error: ");
        //callback("",'database error');
      }
      var dbo = db.db("Paytm");
      var myobj = { _id: request.mobile};
      var payeeFound = false;
      var userFound = false;
      var fundCheck = false;
      dbo.collection("Users").find({}).toArray( function(err, res) {
       if (err) { 
          console.log(err);
          console.log("mongodb find error: ");
         // callback("",'database find error');
                  
        }
        if(res){
          console.log("found all document");
          console.log(res);
          var allUserData = res;
          var retRes = [];
          allUserData.forEach(function(val,index,arr){
            if(arr[index]._id == request.user){
              console.log("user Available");
              userFound = true;
              if(arr[index].wallet >= request.amount){
                fundCheck = true;
                retRes.push(arr[index]);
              }else{
                console.log("insufficient funds");
                callback('','funds');
              }
            }
            if(arr[index]._id == request.mobile){
              payeeFound=true;
              retRes.push(arr[index]);
              console.log("go ahead 3");
            }
          });
          if(userFound == false){
            callback('','userNotFound');
          }
          if(payeeFound == false){
            callback('','payeeNotFound');
          }
          if(fundCheck && payeeFound && userFound){
            callback('',retRes);
          }
        }else{
          console.log("mongodb find error: ");
           // callback("",'database find error');
        }
        db.close();
      });
    });
  
}


exports.sendMoney = function sendMoney(request, callback) {
  console.log('send');
  console.log(request);
  var finalRequest = request;
  var userWallet = finalRequest[0].wallet - finalRequest[2].amount;
  var payeeWallet = finalRequest[0].wallet + finalRequest[2].amount;
  MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if (err){ 
      console.log("mongodb connection error: ");
      callback("",'database error');
    }
    var dbo = db.db("Paytm");
    var myquery1 = { _id:  finalRequest[2].user};
    var newvalues1 = {$set: {wallet: userWallet} };
    dbo.collection("Users").updateOne(myquery1, newvalues1, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });

    var myquery2 = { _id:  finalRequest[2].mobile};
    var newvalues2 = {$set: {wallet: payeeWallet} };
    dbo.collection("Users").updateOne(myquery2, newvalues2, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });

    var myobj1 = { sender: finalRequest[2].user, wallet: userWallet, transaction: -finalRequest[2].amount, paidTo : finalRequest[2].mobile};
    dbo.collection("Transactions").insertOne(myobj1, function(err, res) {
      if (err) { 
        console.log(err);
        console.log("mongodb insertion error: ");
        callback("",'database insert error');
        
      }else{
        console.log("1 document inserted");
        callback("",'inserted');
      }
      db.close();
    });

  });
}


exports.addMoneyToWallet = function addMoneyToWallet(request, callback) {
  MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if (err){ 
      console.log("mongodb connection error: ");
      callback("",'database error');
    }
    console.log("m here");
    var dbo = db.db("Paytm");
    var myquery = { _id:  request.mobile};
    var updatedWallet = request.balance + request.amount;
    var newvalues1 = {$set: {wallet: updatedWallet} };
    dbo.collection("Users").updateOne(myquery, newvalues1, function(err, res) {
      console.log(err);
      console.log(res);
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      callback("",updatedWallet);
    });
  });
}

exports.getAllTransactions = function getAllTransactions(request, callback) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err){ 
      console.log("mongodb connection error: ");
      callback("",'database error');
    }
    var dbo = db.db("Paytm");
    if(request.mobile == '1234567890'){
      var myobj = {};
    }else{
      var myobj = { sender: request.mobile};
    }
   
    dbo.collection("Transactions").find(myobj).toArray( function(err, res) {
     if (err) { 
        console.log(err);
        console.log("mongodb find error: ");
        callback("",'database find error');
                
      }
      if(res){
        console.log("found documents");
        console.log(res);
        callback("",res);
      }else{
        console.log("mongodb find error: ");
          callback("",'database find error');
      }
      db.close();
    });
  });
}