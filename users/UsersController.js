const express = require ("express");
const router = express.Router();
const User = require("./Users");
const bcrypt = require('bcryptjs') //criptografa a senha


//lista usuários
router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    })
});

//página de criação de usuários
router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});


//rota para criação de usuários
router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then( user => {
        if(user == undefined){

            var salt = bcrypt.genSaltSync(10);//criptografia da senha
            var hash = bcrypt.hashSync(password, salt); //criptografia da senha

            User.create({
                email: email,
                password: hash
            }).then (() => {
                res.redirect("/");
            }).catch((err) => {
                res.send("Erro no cadastro");
            });

        }else{
            res.redirect("/admin/users/create")
        }
    })

  


})
module.exports = router;