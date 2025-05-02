// app.js

const http = require("http");
const express = require("express");
const path = require("path");
const fs = require("fs");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const puerto = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Conexión Socket.IO
let usuariosConectados = 0;
io.on("connection", (socket) => {
    usuariosConectados++;
    console.log("Usuario conectado. Total:", usuariosConectados);
    io.emit("usuariosConectados", usuariosConectados);

    socket.on("registrarUsuario", (nombreUsuario) => {
        const usuariosPath = path.join(__dirname, 'usuarios.json');
        const usuariosData = fs.readFileSync(usuariosPath, 'utf8');
        const usuarios = JSON.parse(usuariosData);
        const usuarioEncontrado = usuarios.find(u => u.nombre === nombreUsuario);

        if (usuarioEncontrado) {
            socket.nombreUsuario = nombreUsuario;
            socket.emit("registroExitoso");
            console.log(`Usuario registrado: ${nombreUsuario}`);
        } else {
            socket.emit("registroFallido", "Usuario no registrado.");
            console.log(`Intento fallido: ${nombreUsuario}`);
            socket.disconnect();
        }
    });

    socket.on("nuevoMensaje", (mensaje) => {
        if (!socket.nombreUsuario) {
            console.log("Mensaje rechazado: Usuario no registrado");
            return;
        }
        io.emit("mensajeRecibido", {
            usuario: socket.nombreUsuario,
            mensaje
        });
    });

    socket.on("disconnect", () => {
        usuariosConectados--;
        console.log("Usuario desconectado. Total:", usuariosConectados);
        io.emit("usuariosConectados", usuariosConectados);
    });
});

// Vistas principales
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
app.get("/examenes/:archivo", (req, res) => res.sendFile(path.join(__dirname, "views/examen.html")));

// Rutas API
app.get("/examenes", (req, res) => {
    res.sendFile(path.join(__dirname, "views/lista-examenes.html"));
});


app.get("/examenes/", (req, res) => {
    const archivo = path.join(__dirname, "public/examenes/pruebas.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        res.json(JSON.parse(contenido));
    } else {
        res.status(404).json({ error: "Archivo de exámenes no encontrado" });
    }
});



app.get("/examenes/json/:archivo", (req, res) => {
    const archivo = path.join(__dirname, "public/examenes", `${req.params.archivo}.json`);
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        res.json(JSON.parse(contenido));
    } else {
        res.status(404).json({ error: "Examen no encontrado" });
    }
});

app.get("/panel/examenes", (req, res) => {
    const archivo = path.join(__dirname, "public/examenes/examenes.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        res.json(JSON.parse(contenido));
    } else {
        res.json([]);
    }
});

app.get("/panel/examenesNombre", (req, res) => {
    const archivo = path.join(__dirname, "public/examenes/pruebas.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        res.json(JSON.parse(contenido));
    } else {
        res.json([]);
    }
});

app.get("/panel/examenes/preguntas", (req, res) => {
    const archivo = path.join(__dirname, "public/examenes/examenes.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        res.json(JSON.parse(contenido));
    } else {
        res.json([]);
    }
});

app.get("/admin/mensajes", (req, res) => {
    const archivo = path.join(__dirname, "mensajes.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        res.json(JSON.parse(contenido));
    } else {
        res.json([]);
    }
});

app.delete("/admin/mensajes", (req, res) => {
    const { index } = req.body;
    const archivo = path.join(__dirname, "mensajes.json");
    if (fs.existsSync(archivo)) {
        const mensajes = JSON.parse(fs.readFileSync(archivo, "utf-8"));
        if (index >= 0 && index < mensajes.length) {
            mensajes.splice(index, 1);
            fs.writeFileSync(archivo, JSON.stringify(mensajes, null, 2));
            res.json({ mensaje: "Mensaje eliminado con éxito." });
        } else {
            res.status(400).json({ error: "Índice inválido." });
        }
    } else {
        res.status(404).json({ error: "Archivo no encontrado." });
    }
});

app.get("/admin/usuarios", (req, res) => {
    const archivo = path.join(__dirname, "usuarios.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        res.json(JSON.parse(contenido));
    } else {
        res.json([]);
    }
});

// Importar rutas externas
const rutaRegister = require("./routes/register.js");
const rutaComunidad = require("./routes/comunidad.js");
const rutaExam = require("./routes/crearExamen.js");
const rutaExamenes = require("./routes/examenes.js");

app.use("/register", rutaRegister);
app.use("/comunidad", rutaComunidad);
app.use("/panel", rutaExam);
app.use("/", rutaExamenes);

// Página 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "no-page.html"));
});

// Iniciar servidor
server.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});
