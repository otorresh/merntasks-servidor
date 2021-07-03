const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');

exports.autenticarUsuario = async (req, res) => {

  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // Extraer el email y el password
  const { email, password } = req.body;

  try {
    // Revisar que sea un usuario registrado
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: 'El usuario no existe' });
    }

    // Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: 'Password Incorrecto' });
    }

    // Si todo es correcto crear y firmar el JWT
    const payload = {
      usuario: {
        id: usuario.id
      }
    };

    jwt.sign(payload, process.env.SECRETA, {
      expiresIn: parseInt(process.env.EXPIRATION_TIME) // 1 hora
    }, (err, token) => {
      if (err) throw err;

      // Mensaje de confirmación
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
  }

};

// Obtiene que usuario está autenticado
exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json({ usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Hubo un error' });
  }
}