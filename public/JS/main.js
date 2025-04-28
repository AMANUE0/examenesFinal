
// Funcion para el header de todas las paginas web
let menuButton = document.querySelector(".menu");
let navBar = document.querySelector(".nav-content");

menuButton.addEventListener("click", () => {
    navBar.classList.toggle("hidden-menu");
});
//-----------------------------------------------------------


// Funcion para el modo oscuro / claro
let btnTheme = document.querySelector(".btn-theme");

// Comprobar si hay un tema guardado en LocalStorage
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    btnTheme.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

btnTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Guardar la preferencia en LocalStorage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        btnTheme.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        localStorage.setItem("theme", "light");
        btnTheme.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Select all elements we want to animate
    const animatedElements = document.querySelectorAll(
      ".section, .introduction-page, .team-h3, .integrante, .sections-1, .sections-2",
    )
  
    // Create the observer options
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: "0px", // No margin
      threshold: 0.1, // Trigger when at least 10% of the element is visible
    }
  
    // Create the observer
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        // If the element is entering the viewport
        if (entry.isIntersecting) {
          // Add the visible class to trigger the animation
          entry.target.classList.add("fade-in-element")
  
          // Unobserve the element so the animation only happens once
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)
  
    // Start observing each element
    animatedElements.forEach((element) => {
      // Add the initial hidden class
      element.classList.add("hidden-element")
  
      // Start observing the element
      observer.observe(element)
    })
  })
  
  const socket = io();

socket.on("usuariosConectados", (usuariosConectados) => {
    const usuariosConectadosElement = document.getElementById("users-online");
    if (usuariosConectadosElement) {
        usuariosConectadosElement.innerText = `${usuariosConectados}`;
    }
});
