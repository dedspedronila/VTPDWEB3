var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('cursos/vwLstCursos', {
        title: 'Cursos',
        showNavbar: true,
        activeMenu: 'cursos',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

router.get('/form', function (req, res) {
    res.render('cursos/vwFormCursos', {
        title: 'Formulario de cursos',
        showNavbar: true,
        activeMenu: 'cursos',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

module.exports = router;
