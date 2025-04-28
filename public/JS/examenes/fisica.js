fetch("/examenes/fisica.json")
    .then((res) => res.json())
    .then((data) => {
        const preguntas = data.preguntas;
        const examenContenedor = document.querySelector(".examen");
        const preguntaNumeroSpan = document.getElementById("pregunta-numero");
        const totalPreguntasSpan = document.getElementById("total-preguntas");
        const porcentajeCompletadoSpan = document.getElementById(
            "porcentaje-completado",
        );

        totalPreguntasSpan.textContent = preguntas.length;

        preguntas.forEach((pregunta, index) => {
            const preguntaElement = document.createElement("div");
            preguntaElement.classList.add("pregunta");
            preguntaElement.innerHTML = `
                <p class="pregunta-texto">${pregunta.pregunta}</p>
                <div class="opciones">
                    <label>
                        <input type="radio" name="pregunta-${index}" value="${pregunta.respuestaCorrecta}">
                        ${pregunta.respuestaCorrecta}
                    </label>
                    <label>
                        <input type="radio" name="pregunta-${index}" value="${pregunta.respuestaErronea_1}">
                        ${pregunta.respuestaErronea_1}
                    </label>
                    <label>
                        <input type="radio" name="pregunta-${index}" value="${pregunta.respuestaErronea_2}">
                        ${pregunta.respuestaErronea_2}
                    </label>
                    <label>
                        <input type="radio" name="pregunta-${index}" value="${pregunta.respuestaErronea_3}">
                        ${pregunta.respuestaErronea_3}
                    </label>
                </div>
            `;
            examenContenedor.appendChild(preguntaElement);
        });

        // Aquí puedes añadir la lógica para mostrar solo la primera pregunta
        // y manejar los botones "Anterior" y "Siguiente" para la navegación.
        // También la lógica para calcular el porcentaje completado.
    });
