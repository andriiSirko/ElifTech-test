//modules
var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
 
var app = express();
var jsonParser = bodyParser.json();
// compsdb
var url = "mongodb://localhost:27017/compsdb";
 
app.use(express.static(__dirname + "/public"));
app.get("/api/comps", function(req, res){
 //  Отримання даних занесених в БД
    mongoClient.connect(url, function(err, db){
        db.collection("comps").find({}).toArray(function(err, comps){
            res.send(comps)
            db.close();
        });
    });
});
app.get("/api/comps/:id", function(req, res){
    //  
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("comps").findOne({_id: id}, function(err, comp){
             
            if(err) return res.status(400).send();
             
            res.send(comp);
            db.close();
        });
    });
});
 
app.post("/api/comps", jsonParser, function (req, res) {
     //створення об’єкту, занесення його в БД
    if(!req.body) return res.sendStatus(400);
     
    var compName = req.body.name;
    var compEarn = req.body.earn;
    var comp = {name: compName, earn: compEarn};
     
    mongoClient.connect(url, function(err, db){
        db.collection("comps").insertOne(comp, function(err, result){
             
            if(err) return res.status(400).send();
             
            res.send(comp);
            db.close();
        });
    });
});
  
app.delete("/api/comps/:id", function(req, res){
      //Видалення
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("comps").findOneAndDelete({_id: id}, function(err, result){
             
            if(err) return res.status(400).send();
             
            var comp = result.value;
            res.send(comp);
            db.close();
        });
    });
});
 
app.put("/api/comps", jsonParser, function(req, res){
      //Оновлює дані, коли ми їх змінюємо
    if(!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var compName = req.body.name;
    var compEarn = req.body.earn;
     
    mongoClient.connect(url, function(err, db){
        db.collection("comps").findOneAndUpdate({_id: id}, { $set: {earn: compEarn, name: compName}},
             {returnOriginal: false },function(err, result){
             
            if(err) return res.status(400).send();
             
            var comp = result.value;
            res.send(comp);
            db.close();
        });
    });
});
  //дозвіл роботи на  сервері
app.listen(3000, function(){
    console.log("Server running...");
});
