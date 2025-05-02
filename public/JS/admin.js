
  // Cargar exámenes
  fetch('/panel/examenesNombre')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('examenes-container');
      data.forEach((examen, index) => {
        const examenElement = document.createElement('div');
        examenElement.classList.add('examen');
        examenElement.innerHTML = `
          <p><strong>Nombre:</strong> ${examen.nombre}</p>
          <p><strong>Archivo:</strong> ${examen.archivo}</p>
          <button onclick="eliminarExamen(${index})">Eliminar</button>
          <hr>
        `;
        container.appendChild(examenElement);
      });
    });
  
  function eliminarExamen(index) {
    fetch('/panel/examenesNombre', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index }),
    })
      .then(res => res.json())
      .then(() => {
        alert('Examen eliminado!');
        location.reload();
      });
  }
  
  // Cargar mensajes
  fetch('/admin/mensajes')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('messages-container');
      data.forEach((mensaje, index) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
          <p><strong>Nombre:</strong> ${mensaje.nombre}</p>
          <p><strong>Email:</strong> ${mensaje.email}</p>
          <p><strong>Mensaje:</strong> ${mensaje.mensaje}</p>
          <p><strong>Fecha:</strong> ${mensaje.fecha}</p>
          <button onclick="eliminarMensaje(${index})">Eliminar</button>
          <hr>
        `;
        container.appendChild(messageElement);
      });
    });
  
  function eliminarMensaje(index) {
    fetch('/admin/mensajes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index }),
    })
      .then(res => res.json())
      .then(() => {
        alert('Mensaje eliminado!');
        location.reload();
      });
  }
  
  // Cargar usuarios
  fetch('/admin/usuarios')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('users');
      data.forEach((usuario, index) => {
        const userElement = document.createElement('div');
        userElement.classList.add('user');
        userElement.innerHTML = `
          <p><strong>Nombre:</strong> ${usuario.nombre}</p>
          <p><strong>Email:</strong> ${usuario.email}</p>
          <p><strong>Fecha de registro:</strong> ${usuario.fecha}</p>
          <button onclick="eliminarUsuario(${index})">Eliminar</button>
          <hr>
        `;
        container.appendChild(userElement);
      });
    });
  
  function eliminarUsuario(index) {
    fetch('/admin/usuarios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index }),
    })
      .then(res => res.json())
      .then(() => {
        alert('Usuario eliminado!');
        location.reload();
      });
  }
  