const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.post("/examenes", (req, res) => {
    const { nombre } = req.body;

    const archivo = path.join(__dirname, "../preguntas.json");
    let preguntas = [];

    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        preguntas = JSON.parse(contenido);
    }

    preguntas.push(nuevaPregunta);
    fs.writeFileSync(archivo, JSON.stringify(preguntas, null, 2));
    res.redirect("/panel");
});

module.exports = router;
