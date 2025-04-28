const btnAgregarOpinion = document.querySelector(".btn-agregar-opinion");
const btnCerrarForm = document.querySelector(".btn-cerrar-form");

btnAgregarOpinion.addEventListener("click", () => {
  const dialog = document.querySelector("dialog");
  dialog.showModal();
});

btnCerrarForm.addEventListener("click", () => {
  const dialog = document.querySelector("dialog");
  dialog.close();
});

fetch("admin/mensajes")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((opinion, index) => {
      // Tratamos de obtener la imagen del usuario desde la API de admin/usuarios
      fetch("admin/usuarios")
        .then((res) => res.json())
        .then((data) => {
          const usuario = data.find((user) => user.email === opinion.email);
          if (usuario && usuario.imagen) {
            contenedorAvatar.innerHTML = `<img src="${usuario.imagen}" alt="${usuario.nombre}">`;
          } else {
            contenedorAvatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
          }
        });

      const opinionElement = document.createElement("div");
      const contenedorAvatar = document.createElement("div");
      const contenedorNombreFecha = document.createElement("div");
      const nombre = document.createElement("h3");
      const fecha = document.createElement("p");
      const contenedorMensaje = document.createElement("div");
      const mensaje = document.createElement("p");

      opinionElement.classList.add("opinion-card");
      contenedorAvatar.classList.add("opinion-avatar");
      contenedorNombreFecha.classList.add("opinion-user");
      contenedorMensaje.classList.add("opinion-content");
      fecha.classList.add("opinion-date");
      nombre.classList.add("opinion-name");
      mensaje.classList.add("opinion-message");

      nombre.textContent = opinion.nombre;
      fecha.textContent = opinion.fecha;
      mensaje.textContent = opinion.mensaje;

      contenedorNombreFecha.appendChild(nombre);
      contenedorNombreFecha.appendChild(fecha);

      opinionElement.appendChild(contenedorAvatar);
      opinionElement.appendChild(contenedorNombreFecha);
      opinionElement.appendChild(contenedorMensaje);

      contenedorMensaje.appendChild(mensaje);
      // Agregar el elemento de opinión al contenedor de opiniones

      const container = document.querySelector(".opiniones-comunidad");
      container.prepend(opinionElement);
    });
  });

let fecha = new Date().toLocaleDateString();
console.log(fecha);
