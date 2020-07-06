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
//Targeting all articles
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

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("deleted");
    }else{
      res.send(err);
    }
  });
});
//Targeting a specific article

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No Articles matching that title was found");
    }
  });
})

.put(function(req,res){
  Article.update({title:req.params.articleTitle},{title:req.body.title , content : req.body.content},{overwrite:true},function(err,result){
    if(!err){
      res.send(result);

    }else{
      res.send(err)
    }
  })

})

.patch(function(req,res){
  Article.update({title:req.params.articleTitle},{$set:req.body},function(err){
    if(!err){
      res.send("Updated");

    }else{
      res.send(err)
    }
  })

})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("Deleted article")
    }else{
      res.send(err);
    }
  })
});

app.listen(3000,(res)=>{
  console.log("connected on 3000");
});
