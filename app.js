const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB" , {useNewUrlParser : true , useUnifiedTopology: true});
const Schema = mongoose.Schema;
const articleSchema = new Schema({
  title : String,
  content: String
});
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req,res){
  Article.find({},function(err, foundArticles){
    if(!err){
        res.send(foundArticles);
    }
else{
  res.send(err);
}
  })

})

.post(function(req,res){
  const newArticle = new Article({
    title : "req.body.title",
    content : "req.body.content"
  })
  newArticle.save(function(err){
    if(!err){
      console.log("successfully saved");
    }else{
      res.send(err);
    }
  })
})

.delete(function(err,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("deleted");
    }else{
      res.send(err);
    }
  });
});
app.listen(3000,(res)=>{
  console.log("connected on 3000");
});
