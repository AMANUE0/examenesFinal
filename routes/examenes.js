const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
router.post("/examenes", async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      return res.status(400).json({ error: "Nombre de examen inválido" });
    }

    const examDir = path.join(__dirname, "../public/examenes");

    if (!fs.existsSync(examDir)) {
      fs.mkdirSync(examDir, { recursive: true });
    }

    const nombreArchivo = nombre.toLowerCase().replace(/\s+/g, "_") + ".json";
    const archivo = path.join(examDir, nombreArchivo);

    const nuevoExamen = {
      nombre,
      preguntas: [],
    };

    const archivoPruebas = path.join(examDir, "pruebas.json");
    let examenes = [];

    if (fs.existsSync(archivoPruebas)) {
      const contenido = fs.readFileSync(archivoPruebas, "utf-8");
      try {
        examenes = JSON.parse(contenido);
      } catch (e) {
        examenes = [];
      }
    } else {
      fs.writeFileSync(archivoPruebas, "[]");
    }

    const yaExiste = examenes.some(
      (examen) => examen.nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (yaExiste) {
      return res.status(400).json({ error: "El examen ya existe" });
    }

    fs.writeFileSync(archivo, JSON.stringify(nuevoExamen, null, 2));

    examenes.push({
      nombre,
      archivo: nombreArchivo,
    });

    fs.writeFileSync(archivoPruebas, JSON.stringify(examenes, null, 2));
    res.status(200).json({ message: "Examen creado exitosamente" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al crear el examen" });
  }
});


module.exports = router;
