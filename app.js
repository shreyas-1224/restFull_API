const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();


// setting up database wikiDB
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(()=>{
    console.log("successfully connected to the database");
}).catch((error)=>{
    console.log(error);
});


// setting up ejs and bodyParser
app.set("view-engine" ,"ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


// create schema and model myarticles.
const dbSchema = new mongoose.Schema({
    title : String,
    description : String
});

const Myarticle = new mongoose.model("Myarticle" , dbSchema);


app.route("/myarticles").get((req , res)=>{
    Myarticle.find({} ,(error , result)=>{
        if(!error){
            res.send(result);
        }else{
            res.send(error)
        }
    });
}).post((req , res)=>{
    const title = req.body.title;
    const description = req.body.description;

    const document = new Myarticle({
        title : title,
        description : description
    })

    document.save((error)=>{
        if(!error){
            res.send("POST request successful");
        }else{
            res.send("can not complete your request at the moment");
        }
    });

}).delete((req , res)=>{
    Myarticle.deleteMany((error)=>{
        if(!error){
            res.send("successfully deleted the database items");
        }
    });
});


app.route("/myarticles/:request_title").get((req , res)=>{
    const request_title = req.params.request_title;
    Myarticle.findOne({title: request_title} , (error , result)=>{
        if(!error){
            res.send(result);
        }
        else{
            res.send(error);
        }
    });
});

app.listen(3000 , ()=>{
    console.log("Universe is listening and helping you Shreyas");
});