// app.js

const http = require("http");
const express = require("express");
const path = require("path");
const fs = require("fs").promises; // Usamos fs.promises para async/await
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const puerto = 3000;

// Routes
const rutaComunidad = require("./routes/comunidad");
const rutaRegister = require("./routes/register");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO
let usuariosConectados = 0;
// // Routes
// app.use("/comunidad", rutaComunidad);
// app.use("/register", rutaRegister);



io.on("connection", (socket) => {
    usuariosConectados++;
    console.log("Usuario conectado. Total:", usuariosConectados);
    io.emit("usuariosConectados", usuariosConectados);

    socket.on("registrarUsuario", (nombreUsuario) => {
        const usuariosPath = path.join(__dirname, "usuarios.json");
        fs.readFile(usuariosPath, "utf8")
            .then(usuariosData => {
                const usuarios = JSON.parse(usuariosData);
                const usuarioEncontrado = usuarios.find((u) => u.nombre === nombreUsuario);

                if (usuarioEncontrado) {
                    socket.nombreUsuario = nombreUsuario;
                    socket.emit("registroExitoso");
                    console.log(`Usuario registrado: ${nombreUsuario}`);
                } else {
                    socket.emit("registroFallido", "Usuario no registrado.");
                    console.log(`Intento fallido: ${nombreUsuario}`);
                    socket.disconnect();
                }
            })
            .catch(() => {
                socket.emit("registroFallido", "No se encontró la base de usuarios.");
            });
    });

    socket.on("nuevoMensaje", (mensaje) => {
        if (!socket.nombreUsuario) {
            console.log("Mensaje rechazado: Usuario no registrado");
            return;
        }
        io.emit("mensajeRecibido", {
            usuario: socket.nombreUsuario,
            mensaje,
        });
    });

    socket.on("disconnect", () => {
        usuariosConectados--;
        console.log("Usuario desconectado. Total:", usuariosConectados);
        io.emit("usuariosConectados", usuariosConectados);
    });
});

// Rutas de páginas
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views/index.html")));
app.get("/panel", (req, res) => res.sendFile(path.join(__dirname, "views/panel-examenes.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "views/register.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "views/login.html")));
app.get("/comunidad", (req, res) => res.sendFile(path.join(__dirname, "views/comunidad.html")));
app.get("/acerca", (req, res) => res.sendFile(path.join(__dirname, "views/acerca.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "views/admin.html")));
app.get("/usuarios", (req, res) => res.sendFile(path.join(__dirname, "views/panel-examenes.html")));
app.get("/crear", (req, res) => res.sendFile(path.join(__dirname, "views/crear-examen.html")));
app.get("/tareas", (req, res) => res.sendFile(path.join(__dirname, "views/pagina.html")));
app.get("/calendario", (req, res) => res.sendFile(path.join(__dirname, "views/calendario.html")));
app.get("/chat", (req, res) => res.sendFile(path.join(__dirname, "views/chat.html")));
app.get("/examenes", (req, res) => res.sendFile(path.join(__dirname, "views/lista-examenes.html")));
// Ruta para obtener los mensajes de la comunidad
app.get('/admin/mensajes', async (req, res) => {
    const archivo = __dirname + "/mensajes.json";
    const contenido = await fs.readFile(archivo, "utf-8");
    const mensajes = JSON.parse(contenido);
    res.json(mensajes);
});
// ✅ Ruta para obtener la lista de exámenes con sus metadatos desde pruebas.json
app.get("/panel/examenesNombre", async (req, res) => {
    const pruebasFilePath = path.join(__dirname, "pruebas.json");

    try {
        if (await fs.access(pruebasFilePath).then(() => true).catch(() => false)) {
            const contenido = await fs.readFile(pruebasFilePath, "utf8");
            const examenes = JSON.parse(contenido);
            return res.json(examenes);
        } else {
            return res.json([]); // Si no existe el archivo, devuelve un array vacío
        }
    } catch (err) {
        console.error("Error al leer pruebas.json:", err);
        return res.status(500).json({ error: "Error interno al leer la lista de exámenes." });
    }
});



// ✅ Ruta para crear un nuevo examen (crear el archivo con los metadatos en pruebas.json y el archivo vacío en /public/examenes)
app.post("/crear-examen", async (req, res) => {
    const { examName, examAuthor, examDescription, tags, etapa, etado } = req.body;
    const examFileName = `${examName}.json`; // Usa el nombre para el archivo del examen
    const examFilePath = path.join(__dirname, "public", "examenes", examFileName);
    const pruebasFilePath = path.join(__dirname, "pruebas.json");

    if (!examName.match(/^[a-zA-Z0-9]+$/)) {
        return res.status(400).json({ error: "El nombre del examen debe contener solo letras y números, sin espacios." });
    }

    // 1. Crear el archivo vacío para las preguntas del examen
    try {
        await fs.writeFile(examFilePath, "[]", "utf8");
        console.log(`Archivo de examen creado: ${examFilePath}`);
    } catch (err) {
        console.error("Error al crear el archivo del examen:", err);
        return res.status(500).json({ error: "Error interno al crear el archivo del examen." });
    }

    // 2. Guardar los metadatos del examen en pruebas.json
    const nuevoExamen = {
        nombre: examName,
        autor: examAuthor,
        descripcion: examDescription,
        asignatura: tags,
        etapa: etapa,
        estado: etado,
        archivo: examFileName // Guardar el nombre del archivo asociado
    };

    try {
        let pruebasData = [];
        if (await fs.access(pruebasFilePath).then(() => true).catch(() => false)) {
            const contenido = await fs.readFile(pruebasFilePath, "utf8");
            pruebasData = JSON.parse(contenido);
        }
        pruebasData.push(nuevoExamen);
        await fs.writeFile(pruebasFilePath, JSON.stringify(pruebasData, null, 2), "utf8");
        console.log(`Metadatos del examen guardados en: ${pruebasFilePath}`);
        res.status(201).json({ mensaje: "Examen y metadatos creados correctamente" });
    } catch (err) {
        console.error("Error al guardar en pruebas.json:", err);
        // Si falla la escritura en pruebas.json, podrías eliminar el archivo del examen si lo deseas
        try {
            await fs.unlink(examFilePath);
            console.log(`Archivo de examen eliminado debido a error en pruebas.json: ${examFilePath}`);
        } catch (deleteErr) {
            console.error("Error al eliminar el archivo del examen:", deleteErr);
        }
        return res.status(500).json({ error: "Error interno al guardar los metadatos del examen." });
    }
});

// Ruta para agregar una pregunta a un examen
app.post("/panel/examenes/preguntas", async (req, res) => {
    const {
        examen,
        pregunta,
        respuestaCorrecta,
        respuestaErronea_1,
        respuestaErronea_2,
        respuestaErronea_3,
    } = req.body;

    const ruta = path.join(__dirname, "public", "examenes", `${examen}.json`);

    try {
        if (await fs.access(ruta).then(() => true).catch(() => false)) {
            const contenido = await fs.readFile(ruta, "utf-8");
            const preguntas = JSON.parse(contenido);
            const preguntaNueva = {
                pregunta,
                respuestaCorrecta,
                respuestaErronea_1,
                respuestaErronea_2,
                respuestaErronea_3,
            };
            preguntas.push(preguntaNueva);
            await fs.writeFile(ruta, JSON.stringify(preguntas, null, 2), "utf-8");
            res.status(201).json({ mensaje: "Pregunta añadida correctamente" });
        } else {
            return res.status(404).json({ error: "Examen no encontrado" });
        }
    } catch (error) {
        console.error("Error al guardar la pregunta:", error);
        res.status(500).json({ error: "Error interno al guardar la pregunta" });
    }
});

app.post('/comunidad', async (req, res) => {
    try {
    const { nombre, mensaje } = req.body;
    const nuevoMensaje = {
        nombre,
        mensaje,
        fecha: new Date().toLocaleDateString(),
    };

    const archivo = path.join(__dirname + "/mensajes.json");
    let mensajes = [];

    if (fs.access(archivo)) {
        if (fs.existsSync(archivo)) {
            const contenido = fs.readFileSync(archivo, "utf-8");
            mensajes = JSON.parse(contenido);
        }
    }
    mensajes.push(nuevoMensaje);
    fs.writeFile(archivo, JSON.stringify(mensajes, null, 2));
    
    // res.send(mensajes);
    } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        res.status(500).json({ error: "Error interno al guardar el mensaje" });
    }
});

// Iniciar servidor
server.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});