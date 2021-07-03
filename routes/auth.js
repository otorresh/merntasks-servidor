// Rutas para autenticar usuarios
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Iniciar sesión
// api/auth
router.post('/',
  authController.autenticarUsuario
);

// Obtiene el usuario autenticado
router.get('/',
  auth,
  authController.usuarioAutenticado
);

module.exports = router;