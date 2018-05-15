const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');

const db = new Sequelize('node', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const Article = db.define('article', {
    titre: {type: Sequelize.STRING},
    article: {type: Sequelize.STRING},
    upVote: {type: Sequelize.INTEGER},
    downVote: {type: Sequelize.INTEGER}
});

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    Article
        .sync()
        .then(() => {
            return Article.findAll();
        })
        .then((articles) => {
            res.render('index', {articles});
        });
});

app.post('/', (req, res) => {


    if (req.body.type === "add") {
        Article
            .sync()
            .then(() => {
                Article.create({
                    titre: req.body.titre,
                    article: req.body.article,
                    upVote: 0,
                    downVote: 0,
                });
            })
            .then(() => {
                Article
                    .sync()
                    .then(() => {
                        return Article.findAll();
                    })
                    .then((articles) => {
                        res.render('index', {articles});
                    });
            });
    } else if (req.body.type === "plus") {
        Article
            .sync()
            .then(() => {
                return Article.find({where: {id: req.body.id}});
            })
            .then((article) => {
                console.log(article);
                Article.update(
                    {upVote: article.upVote + 1},
                    {where: {id: article.id}}
                )
            })
            .then(() => {
                Article
                    .sync()
                    .then(() => {
                        return Article.findAll();
                    })
                    .then((articles) => {
                        res.render('index', {articles});
                    });
            });
    } else if (req.body.type === "less") {
        Article
            .sync()
            .then(() => {
                return Article.find({where: {id: req.body.id}});
            })
            .then((article) => {
                console.log(article);
                Article.update(
                    {downVote: article.downVote + 1},
                    {where: {id: article.id}}
                )
            })
            .then(() => {
                Article
                    .sync()
                    .then(() => {
                        return Article.findAll();
                    })
                    .then((articles) => {
                        res.render('index', {articles});
                    });
            });
    }

});

app.get('/detail', (req, res) => {
    res.render('detail');
});


app.listen(3000);