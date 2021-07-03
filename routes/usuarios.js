// Rutas para crear usuarios
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Crea usuario
// api/usuarios
router.post('/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
  ],
  usuarioController.crearUsuario
);

module.exports = router;