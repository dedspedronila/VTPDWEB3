const express = require("express");
const routerApp = express.Router();

const appLogin = require("../apps/login/controller/ctlLogin");

// middleware that is specific to this router
routerApp.use((req, res, next) => {
    next();
});
routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
});
//Rotas de Alunos
//Rotas de Cursos
// Rota Login
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

module.exports = routerApp;
