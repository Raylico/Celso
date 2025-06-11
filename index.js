const express = require ("express");
const app = express();
const bodyParser = require("body-parser")
const session = require("express-session");
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const UsersController = require("./users/UsersController");

const Article = require("./articles/Articles")
const Category = require("./categories/Category");
const { where } = require("sequelize");
const User = require("./users/Users")

// view engine
app.set('view engine', 'ejs');

//session
app.set(session({
    secret: "textoaleatorio", cookie: {maxAge: 30000}
}))

//static
app.use(express.static('public'));


//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

//Database
connection
    .authenticate()
    .then(() => {
        console.log('conexão feita com sucesso');
    }).catch((error) => {
        console.log(error);
    })

    app.use(async (req, res, next) => {
        try {
            const categories = await Category.findAll();
            res.locals.categories = categories;
            next();
        } catch (err) {
            console.log("Erro ao carregar as categorias:", err);
            next(); //continua mesmo de der erro
        }
    })
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", UsersController);

app.get("/session", (req, res) => {
    req.session.treinamento = "Curso de Node.js";
    req.session.ano = 2025;
    req.session.email= "Celso@gmail.com";
    req.session.user = {
        username: "Rayssa",
        email: "Celso@gmail.com",
        id: 10,
    }
})

app.get("/leitura", (res, req) => {
    res.json({
        treinamento:req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user        
    })
})

app.get("/", (req,res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories})
        });
    });
})

app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where : {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: [article], categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            });
    }else{
        res.redirect("/");
    }
    }).catch( err => {
    res.redirect("/");
    })
})


app.listen(5000, () => {
    console.log("o servidor está rodando")
})