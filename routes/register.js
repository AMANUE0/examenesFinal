// register.js

const express = require("express");
const fs = require("fs");
const router = express.Router();

router.post("/", (req, res) => {
    const { nombre, contraseña } = req.body;
    const nuevoUsuario = {
        nombre,
        contraseña,
        fecha: new Date().toLocaleDateString(),
    };

    const archivo = "usuarios.json";
    let mensajes = [];

    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        mensajes = JSON.parse(contenido);
    }

    mensajes.push(nuevoUsuario);
    fs.writeFileSync(archivo, JSON.stringify(mensajes, null, 2));
    res.end("<h1>Usuario registrado, muchas gracias</h1>");
});

module.exports = router;
