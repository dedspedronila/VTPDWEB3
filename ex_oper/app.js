const express = require('express');
const routes = require('./routes/route');

const app = express();
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
