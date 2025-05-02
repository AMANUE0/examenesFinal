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

let usuariosConectados = 0;
io.on("connection", (socket) => {
    usuariosConectados++;
    console.log("Usuario conectado. Total de usuarios conectados:", usuariosConectados);
    io.emit("usuariosConectados", usuariosConectados);

    socket.on("registrarUsuario", (nombreUsuario) => {
        // Leer usuarios.json
        const usuariosPath = path.join(__dirname, 'usuarios.json');
        const usuariosData = fs.readFileSync(usuariosPath, 'utf8');
        const usuarios = JSON.parse(usuariosData);

        // Verificar si el nombre está registrado
        const usuarioEncontrado = usuarios.find(u => u.nombre === nombreUsuario);

        if (usuarioEncontrado) {
            socket.nombreUsuario = nombreUsuario;
            socket.emit("registroExitoso");
            console.log(`Usuario registrado correctamente: ${nombreUsuario}`);
        } else {
            socket.emit("registroFallido", "Usuario no registrado.");
            console.log(`Intento de registro fallido: ${nombreUsuario}`);
            socket.disconnect(); // Opcional: desconectar si no está registrado
        }
    });

    socket.on("nuevoMensaje", (mensaje) => {
        if (!socket.nombreUsuario) {
            console.log("Mensaje rechazado: Usuario no registrado");
            return; // Ignorar si no está registrado
        }
        const mensajeConNombre = {
            usuario: socket.nombreUsuario,
            mensaje: mensaje
        };
        io.emit("mensajeRecibido", mensajeConNombre);
    });

    socket.on("disconnect", () => {
        usuariosConectados--;
        console.log("Usuario desconectado. Total de usuarios conectados:", usuariosConectados);
        io.emit("usuariosConectados", usuariosConectados);
    });
});

// Permitir procesar datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "views/index.html")),
);
app.get("/panel", (req, res) =>
    res.sendFile(path.join(__dirname, "views/panel-examenes.html")),
);
app.get("/register", (req, res) =>
    res.sendFile(path.join(__dirname, "views/register.html")),
);
app.get("/login", (req, res) =>
    res.sendFile(path.join(__dirname, "views/login.html")),
);
app.get("/comunidad", (req, res) =>
    res.sendFile(path.join(__dirname, "views/comunidad.html")),
);
app.get("/acerca", (req, res) =>
    res.sendFile(path.join(__dirname, "views/acerca.html")),
);
app.get("/admin", (req, res) =>
    res.sendFile(path.join(__dirname, "views/admin.html")),
);
app.get("/usuarios", (req, res) =>
    res.sendFile(path.join(__dirname, "views/panel-examenes.html")),
);

app.get("/crear", (req, res) =>
    res.sendFile(path.join(__dirname, "views/crear-examen.html")),
);

app.get("/examenes", (req, res) =>
    res.sendFile(path.join(__dirname, "views/lista-examenes.html")),
);

app.get("/tareas", (req, res) => {
    res.sendFile(path.join(__dirname, "views/pagina.html"));
});

app.get("/calendario", (req, res) => {
    res.sendFile(path.join(__dirname, "views/calendario.html"));
});

app.get("/chat", (req, res) =>
    res.sendFile(path.join(__dirname, "views/chat.html")),
);



const { error } = require("console");

const rutaRegister = require("./routes/register.js");
app.use("/register", rutaRegister);

const rutaComunidad = require("./routes/comunidad.js");
app.use("/comunidad", rutaComunidad);

const rutaExam = require("./routes/crearExamen.js");
app.use("/panel", rutaExam);

const rutaExamenes = require("./routes/examenes.js");
const { Http2ServerRequest } = require("http2");
app.use("/", rutaExamenes);

// ADMIN PANEL MENSAJES

app.get("/admin/mensajes", (req, res) => {
    const archivo = path.join(__dirname, "mensajes.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        const mensajes = JSON.parse(contenido);

        res.json(mensajes);
    } else {
        res.json([]);
    }
});
// Obtener el nombre de los examenes creados
app.get("/panel/examenes", (req, res) => {
    const archivo = path.join(__dirname, "public/examenes/examenes.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        const mensajes = JSON.parse(contenido);
        res.json(mensajes);
    } else {
        res.json([]);
    }
});

app.get("/panel/examenesNombre", (req, res) => {
    const archivo = path.join(__dirname, "public/examenes/pruebas.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        const mensajes = JSON.parse(contenido);
        res.json(mensajes);
    } else {
        res.json([]);
    }
});

app.get("/examenes/:archivo", (req, res) => {
    res.sendFile(path.join(__dirname, "views/examen.html"));
});

app.get("/api/examenes/:archivo", (req, res) => {
    try {
        const archivo = path.join(
            __dirname,
            "public/examenes",
            req.params.archivo + ".json",
        );
        if (!fs.existsSync(archivo)) {
            return res.status(404).json({ error: "Examen no encontrado" });
        }
        const contenido = fs.readFileSync(archivo, "utf-8");
        const examen = JSON.parse(contenido);
        res.json(examen);
    } catch (error) {
        console.error("Error al cargar el examen:", error);
        res.status(500).json({ error: "Error al cargar el examen" });
    }
});
// Obtener las preguntas del examen
app.get("/panel/examenes/preguntas", (req, res) => {
    const archivo = path.join(__dirname, "/public/examenes/examenes.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        const mensajes = JSON.parse(contenido);
        res.json(mensajes);
    } else {
        res.json([]);
    }
});

app.delete("/admin/mensajes", (req, res) => {
    const { index } = req.body; // Obtener el indice del mensaje a eliminar
    const archivo = path.join(__dirname, "mensajes.json");

    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        const mensajes = JSON.parse(contenido);

        if (index >= 0 && index < mensajes.length) {
            mensajes.splice(index, 1);
            fs.writeFileSync(archivo, JSON.stringify(mensajes, null, 2));
            res.json({ mensaje: "Mensaje eliminado con exito." });
        } else {
            res.status(400).json({ error: "Indice invalido." });
        }
    } else {
        res.status(404).json({ error: "Archivo de mensajes no encontrado." });
    }
});

app.get("/admin/usuarios", (req, res) => {
    const archivo = path.join(__dirname, "usuarios.json");
    if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, "utf-8");
        const mensajes = JSON.parse(contenido);

        res.json(mensajes);
    } else {
        res.json([]);
    }
});

// Manejar páginas no encontradas
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "no-page.html"));
});

server.listen(puerto, () => {
    console.log("Escuchando en el puerto " + puerto);
});
