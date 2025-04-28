const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.post("/examenes/preguntas", (req, res) => {
    try {
        // Leer el archivo de pruebas.json para obtener el último examen creado
        const archivoPruebas = path.join(__dirname, "../public/examenes/pruebas.json");
        const contenidoPruebas = fs.readFileSync(archivoPruebas, "utf-8");
        const examenes = JSON.parse(contenidoPruebas);
        const ultimoExamen = examenes[examenes.length - 1];

        // Obtener el archivo específico de la materia
        const archivoMateria = path.join(__dirname, "../public/examenes", ultimoExamen.archivo);
        const contenidoMateria = fs.readFileSync(archivoMateria, "utf-8");
        const examen = JSON.parse(contenidoMateria);

        // Crear la nueva pregunta
        const nuevaPregunta = {
            pregunta: req.body.pregunta,
            respuestaCorrecta: req.body.respuestaCorrecta,
            respuestaErronea_1: req.body.respuestaErronea_1,
            respuestaErronea_2: req.body.respuestaErronea_2,
            respuestaErronea_3: req.body.respuestaErronea_3
        };

        // Agregar la pregunta al array de preguntas
        if (!examen.preguntas) {
            examen.preguntas = [];
        }
        examen.preguntas.push(nuevaPregunta);

        // Guardar el archivo actualizado
        fs.writeFileSync(archivoMateria, JSON.stringify(examen, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al guardar la pregunta' });
    }
});

module.exports = router;
