const dates = document.getElementById("dates");
const monthYear = document.getElementById("month-year");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const examDetails = document.getElementById("exam-details");

let date = new Date();

let exams = {};

// Cargar exámenes desde el servidor
async function loadExams() {
  try {
    const response = await fetch('/panel/examenesNombre');
    const examsList = await response.json();
    
    // Asignar fecha actual a cada examen
    examsList.forEach(exam => {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      exams[dateStr] = {
        materia: exam.nombre,
        hora: "Por definir",
        lugar: "Por definir"
      };
    });
    
    renderCalendar();
  } catch (error) {
    console.error('Error cargando exámenes:', error);
  }
}

// Cargar exámenes al iniciar
loadExams();

function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = `${date.toLocaleString("default", {
    month: "long",
  })} ${year}`;

  dates.innerHTML = "";
  examDetails.style.display = "none";

  for (let i = 0; i < firstDay; i++) {
    dates.innerHTML += `<div></div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    const currentDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${i
      .toString()
      .padStart(2, "0")}`;

    const isExam = exams[currentDate];
    const div = document.createElement("div");
    div.textContent = i;

    if (isExam) {
      div.classList.add("exam");
      div.addEventListener("click", () => {
        examDetails.innerHTML = `
            <strong>Examen de ${isExam.materia}</strong><br>
            Hora: ${isExam.hora}<br>
            Lugar: ${isExam.lugar}
          `;
        examDetails.style.display = "block";
      });
    } else {
      div.addEventListener("click", () => {
        examDetails.innerHTML = "No hay examen ese día.";
        examDetails.style.display = "block";
      });
    }

    dates.appendChild(div);
  }
}

prev.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

next.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
