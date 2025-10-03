    function validarLogin(event) {
      event.preventDefault(); // evita recargar la página
      
      const usuario = document.getElementById("usuario").value;
      const password = document.getElementById("password").value;

      if (usuario === "admin" && password === "admin") {
        // Redirigir a home.html
        window.location.href = "home.html";
      } else {
        alert("Usuario o contraseña incorrectos.");
      }
    }