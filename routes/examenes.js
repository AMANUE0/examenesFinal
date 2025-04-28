const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();

router.post("/examenes", async (req, res) => {
  try {
    const { nombre } = req.body;

    const examDir = path.join(__dirname, "../public/examenes");

    // Create examenes directory if it doesn't exist
    if (!fs.existsSync(examDir)) {
      fs.mkdirSync(examDir, { recursive: true });
    }

    const nuevoExamen = {
      nombre,
      preguntas: [],
    };

    // Crear nombre del archivo basado en la materia
    const nombreArchivo = nombre.toLowerCase().replace(/\s+/g, "_") + ".json";
    const archivo = path.join(__dirname, "../public/examenes", nombreArchivo);

    // Guardar el nuevo archivo JSON
    fs.writeFileSync(archivo, JSON.stringify(nuevoExamen, null, 2));

    // También agregamos referencia en pruebas.json
    const archivoPruebas = path.join(
      __dirname,
      "../public/examenes/pruebas.json",
    );
    let examenes = [];

    if (fs.existsSync(archivoPruebas)) {
      const contenido = fs.readFileSync(archivoPruebas, "utf-8");
      try {
        examenes = JSON.parse(contenido);
      } catch (e) {
        examenes = [];
      }
    } else {
      // Create pruebas.json if it doesn't exist
      fs.writeFileSync(archivoPruebas, "[]");
    }

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
