//-- arquivo: routes/routes.js

//@ Importa as bibliotecas e arquivos
const express = require("express");
const routerApp = express.Router();
const appHello = require("../controller/ctlHello");


//@ Configura as rotas
routerApp.get("/", appHello.hello);
routerApp.get("/helloUserGet/:nome", appHello.helloUserGet);
routerApp.post("/helloUserPost", appHello.helloUserPost);


//@ Exporta a variável com as rotas
module.exports = routerApp;
