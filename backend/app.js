const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express(); const port = 40000;
app.listen(port, () => {
    console.log(`App listening at port ${port}`);
})
