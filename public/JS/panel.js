const socket = io();

socket.on("connect", () => {
    console.log("Conectado al servidor");
});

socket.on("usuariosConectados", (usuarios) => {
    document.getElementById("online-users").textContent = usuarios;
});

let currentExamId = null;

document.addEventListener("DOMContentLoaded", () => {
    const createExamForm = document.getElementById("create-exam-form");
    const questionForm = document.getElementById("question-form");

    createExamForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const examName = document.getElementById("exam-name").value;

        try {
            const response = await fetch("/examenes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre: examName }),
            });

            if (response.ok) {
                document.getElementById("exam-form").style.display = "none";
                questionForm.style.display = "block";
                currentExamId = examName;
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al crear el examen");
        }
    });

    document
        .getElementById("add-question-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            const questionData = {
                pregunta: document.getElementById("question-text").value,
                respuestaCorrecta:
                    document.getElementById("correct-answer").value,
                respuestaErronea_1:
                    document.getElementById("wrong-answer1").value,
                respuestaErronea_2:
                    document.getElementById("wrong-answer2").value,
                respuestaErronea_3:
                    document.getElementById("wrong-answer3").value,
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
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error al agregar la pregunta");
            }
        });

    document.getElementById("finish-exam").addEventListener("click", () => {
        questionForm.style.display = "none";
        document.getElementById("exam-form").style.display = "block";
        document.getElementById("questions-preview").innerHTML = "";
        document.getElementById("create-exam-form").reset();
        currentExamId = null;
    });

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

    function cargarPreguntas() {
        fetch("/panel/examenes/preguntas")
            .then((res) => res.json())
            .then((data) => {
                const preguntasContainer = document.querySelector(".preguntas");
                preguntasContainer.innerHTML = "";

                data.forEach((pregunta) => {
                    displayQuestion(pregunta);
                });
            });
    }
});
