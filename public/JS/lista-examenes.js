let aciertos = 0;
let totalPreguntas = 0;
let respuestasElegidas = 0;

document.addEventListener("DOMContentLoaded", () => {
    cargarExamenes();

    const volverBtn = document.querySelector(".volver-btn");
    volverBtn.addEventListener("click", () => {
        document.querySelector(".examenes").classList.remove("active");
        document.querySelector(".examenes").classList.add("desactived");

        document.querySelector(".container").classList.remove("desactived");
        document.querySelector(".container").classList.add("active");

        volverBtn.classList.add("desactived");

        // Resetear todo
        aciertos = 0;
        totalPreguntas = 0;
        respuestasElegidas = 0;
    });
});

function renderExamen(examen) {
    const containerExams = document.querySelector(".examenes");
    const container = document.querySelector(".container");
    const examTitle = document.querySelector(".exam-title");
    const volverBtn = document.querySelector(".volver-btn");

    examTitle.innerHTML = "Examen de " + examen;

    container.classList.remove("active");
    container.classList.add("desactived");

    containerExams.classList.remove("desactived");
    containerExams.classList.add("active");

    volverBtn.classList.remove("desactived");

    fetch(`/examenes/${examen}.json`)
        .then((res) => res.json())
        .then((data) => {
            const preguntas = data.preguntas;
            const examenContenedor = document.querySelector(".examenes");

            examenContenedor.innerHTML = `<h1 class="exam-title">Examen de ${examen}</h1>`;

            aciertos = 0;
            totalPreguntas = preguntas.length;
            respuestasElegidas = 0;

            preguntas.forEach((pregunta, index) => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("tarjeta-pregunta");

                const preguntah2 = document.createElement("h2");
                preguntah2.textContent = `${index + 1}. ${pregunta.pregunta}`;
                tarjeta.appendChild(preguntah2);

                const opciones = [
                    { texto: pregunta.respuestaCorrecta, correcta: true },
                    { texto: pregunta.respuestaErronea_1, correcta: false },
                    { texto: pregunta.respuestaErronea_2, correcta: false },
                    { texto: pregunta.respuestaErronea_3, correcta: false },
                ];

                opciones.sort(() => Math.random() - 0.5);

                opciones.forEach((opcion) => {
                    const boton = document.createElement("button");
                    boton.textContent = opcion.texto;
                    boton.classList.add("opcion");

                    boton.addEventListener("click", () => {
                        if (boton.classList.contains("respondido")) return;

                        respuestasElegidas++;
                        boton.classList.add("respondido");

                        if (opcion.correcta) {
                            boton.style.backgroundColor = "green";
                            boton.style.color = "white";
                            aciertos++;
                        } else {
                            boton.style.backgroundColor = "red";
                            boton.style.color = "white";

                            const botones = tarjeta.querySelectorAll(".opcion");
                            botones.forEach((btn) => {
                                if (
                                    btn.textContent ===
                                    pregunta.respuestaCorrecta
                                ) {
                                    btn.style.backgroundColor = "green";
                                    btn.style.color = "white";
                                }
                            });
                        }

                        // Desactivar todos los botones de esa pregunta
                        tarjeta.querySelectorAll(".opcion").forEach((btn) => {
                            btn.disabled = true;
                        });

                        // Si ya respondió todo, mostrar resultado
                        if (respuestasElegidas === totalPreguntas) {
                            mostrarResultado();
                        }
                    });

                    tarjeta.appendChild(boton);
                });

                examenContenedor.appendChild(tarjeta);
            });
        });
}

function mostrarResultado() {
    const examenContenedor = document.querySelector(".examenes");

    const resultado = document.createElement("div");
    resultado.classList.add("resultado");
    resultado.innerHTML = `
        <h2 class="result-h2">Resultado final</h2>
        <p class="aciertos">Aciertos: ${aciertos} / ${totalPreguntas}</p>
    `;

    examenContenedor.appendChild(resultado);

    if (aciertos === totalPreguntas) {
        lanzarConfeti();
    }
}

function lanzarConfeti() {
    // Versión simple para que veas que funciona
    alert("¡Felicidades! ¡100%! 🎉");

    // Puedes implementar algo más bonito usando canvas-confetti:
    // https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js
}

async function cargarExamenes() {
    try {
        const response = await fetch("/panel/examenesNombre");
        const examenes = await response.json();
        const contenedor = document.getElementById("examenes-lista");

        contenedor.innerHTML = ""; // Limpiar si ya hay exámenes

        examenes.forEach((examen) => {
            const card = document.createElement("div");
            card.className = "examen-card";
            card.innerHTML = `
                <div class="examen-titulo">${examen.nombre}</div>
                <div class="examen-info">Archivo: ${examen.archivo}</div>
            `;
            card.style.cursor = "pointer";
            card.addEventListener("click", () => {
                const nombreExamen =
                    card.querySelector(".examen-titulo").textContent;
                renderExamen(nombreExamen);
            });
            contenedor.prepend(card);
        });
    } catch (error) {
        console.error("Error al cargar los exámenes:", error);
    }
}


const socket = io();