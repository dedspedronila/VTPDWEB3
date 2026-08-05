//-- arquivo: app.js

//@ Importa as bibliotecas e arquivos
const express = require("express");
const router = require("./routes/routes");


//@ Configura o servidor
const app = express();
const port = 40000;
app.use(express.json());
app.use(router);


//@ Inicia o servidor
app.listen(port, () => {
    console.log(`App listening at port ${port}`)
    //--$
})
