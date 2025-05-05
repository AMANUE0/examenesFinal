const socket = io();
let currentExamId = null;

// Mostrar cuántos usuarios están conectados
socket.on("connect", () => {
    console.log("Conectado al servidor");
});

socket.on("usuariosConectados", (usuarios) => {
    document.getElementById("online-users").textContent = usuarios;
});

document.addEventListener("DOMContentLoaded", () => {
    const createExamForm = document.getElementById("create-exam-form");
    const questionForm = document.getElementById("question-form");

    // Mostrar exámenes existentes
    fetch("/panel/examenesNombre")
        .then((res) => res.json())
        .then((examenes) => {
            const lista = document.getElementById("lista-examenes");
            if (!lista) return;
            examenes.forEach((examen) => {
                const li = document.createElement("li");
                li.textContent = examen.nombre;
                lista.appendChild(li);
            });
        });

    // Crear un nuevo examen
    createExamForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const examName = document.getElementById("exam-name").value;
        const examAuthor = document.getElementById("exam-author").value;
        const examDescription = document.getElementById("exam-description").value;
        const tags = document.getElementById("select-option-asignatura").value;
        const etapa = document.getElementById("select-option-etapa").value;
        const etado = document.getElementById("select-option-estado").value;

        try {
            const response = await fetch("/crear-examen", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ examName, examAuthor, examDescription, tags, etapa, etado }),
            });

            if (response.ok) {
                document.getElementById("exam-form").style.display = "none";
                questionForm.style.display = "block";
                currentExamId = examName;
            } else {
                const result = await response.json();
                alert(result.error || "Error al crear el examen");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al crear el examen");
        }
    });

    // Agregar preguntas al examen actual
    document
        .getElementById("add-question-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            if (!currentExamId) {
                alert("No hay un examen activo.");
                return;
            }

            const questionData = {
                examen: currentExamId,
                pregunta: document.getElementById("question-text").value,
                respuestaCorrecta: document.getElementById("correct-answer").value,
                respuestaErronea_1: document.getElementById("wrong-answer1").value,
                respuestaErronea_2: document.getElementById("wrong-answer2").value,
                respuestaErronea_3: document.getElementById("wrong-answer3").value,
            };

            try {
                const response = await fetch("/panel/examenes/preguntas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(questionData),
                });

                if (response.ok) {
                    displayQuestion(questionData);
                    document.getElementById("add-question-form").reset();
                } else {
                    const result = await response.json();
                    alert(result.error || "Error al guardar la pregunta.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error al agregar la pregunta");
            }
        });

    // Terminar creación de examen
    document.getElementById("finish-exam").addEventListener("click", () => {
        questionForm.style.display = "none";
        document.getElementById("exam-form").style.display = "block";
        document.getElementById("questions-preview").innerHTML = "";
        document.getElementById("create-exam-form").reset();
        currentExamId = null;
    });

    // Mostrar pregunta en la interfaz
    function displayQuestion(question) {
        const container = document.getElementById("questions-preview");
        const questionCard = document.createElement("div");
        questionCard.className = "question-card";
        questionCard.innerHTML = `
            <div class="question-text">${question.pregunta}</div>
            <div class="correct-answer">✓ ${question.respuestaCorrecta}</div>
            <div class="wrong-answer">✗ ${question.respuestaErronea_1}</div>
            <div class="wrong-answer">✗ ${question.respuestaErronea_2}</div>
            <div class="wrong-answer">✗ ${question.respuestaErronea_3}</div>
        `;
        container.appendChild(questionCard);
    }
});


