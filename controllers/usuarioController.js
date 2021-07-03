const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');

exports.crearUsuario = async (req, res) => {

  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // Extraer email y password
  const { email, password } = req.body;

  try {
    // Revisar que el usuario reguistrado sea unico
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Crea el nuevo usuario
    usuario = new Usuario(req.body);

    // Hashear el password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    // Guardar usuario
    await usuario.save();

    // Crear y firmar el JWT
    const payload = {
      usuario: {
        id: usuario.id
      }
    };

    jwt.sign(payload, process.env.SECRETA, {
      expiresIn: 3600 // 1 hora
    }, (err, token) => {
      if (err) throw err;

      // Mensaje de confirmación
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: 'Hubo un error' });
  }
};