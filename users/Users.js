const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users', {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

User.sync({force: false}); // Cria a tabela se não existir, sem apagar os dados existentes
//User.sync({force: true}); limpa a tabela já existente
module.exports = User;