const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.post("/comunidad", (req, res) => {
    const { nombre, mensaje } = req.body;
    const nuevoMensaje = {
        nombre,
        mensaje,
        fecha: new Date().toLocaleDateString(),
    };

    res.send("Nuevo mensaje "+ nuevoMensaje);







    // const { nombre, email, mensaje } = req.body;
    // const nuevoMensaje = {
    //     nombre,
    //     email,
    //     mensaje,
    //     fecha: new Date().toLocaleDateString(),
    // };

    // const archivo = "mensajes.json";
    // let mensajes = [];

    // if (fs.existsSync(archivo)) {
    //     const contenido = fs.readFileSync(archivo, "utf-8");
    //     mensajes = JSON.parse(contenido);
    // }
    // mensajes.push(nuevoMensaje);
    // fs.writeFileSync(archivo, JSON.stringify(mensajes, null, 2));
    // res.redirect("/comunidad");
});

module.exports = router;
