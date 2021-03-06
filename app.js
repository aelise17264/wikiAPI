const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true})

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

//REQUESTS TARGETING ALL ARTICLES

app.route("/articles")
    .get(function(req, res){
        Article.find({}, function(err, foundArticles){
            if(!err){
            // console.log(foundArticles)
                res.send( foundArticles)
            }else{
                res.send(err)
            }
        })
    })
    .post(function(req, res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(function(err){
            if(!err){
                console.log("added to list of articles")
            }else{
                console.log(err)
            }
        })
    })
    .delete(function(req, res){
        Article.deleteMany({}, function(err){
            if(!err){
                res.send('all the articles are gone')
            }else{
                res.send(err)
            }
        })
    })


   //REQUESTS TARGETING SINGLE ARTICLES 

app.route("/articles/:articleName")
    .get(function(req, res){
        const requestedArticle = req.params.articleName
        Article.findOne({title: requestedArticle}, function(err, foundArticle){
            if(!err){
            // console.log(foundArticles)
                res.send( foundArticle)
            }else{
                res.send(err)
            }
        })
})
    .put(function(req, res){
        const requestedArticle = req.params.articleName

        Article.updateOne({title: requestedArticle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
             function(err){
                if(!err){
                    res.send("Article was updated")
                }else{
                    res.send(err)
                }
             })
    })
    .patch(function(req, res){
       
        Article.updateOne(
            {title: req.params.articleName},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Article was updated")
                }else{
                    res.send(err)
                }
            })

    })
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleName},
            function(err){
                if(!err){
                    console.log("this article is history")
                }else{
                    console.log(err)
                }
            }
            )
    })


app.listen(3000, function(){
    console.log("Server running on port 3000")
})