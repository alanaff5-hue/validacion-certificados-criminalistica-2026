document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('id');

    const cardResultado = document.getElementById('card-resultado');
    const statusMessage = document.getElementById('status-message');
    const loadingState = document.getElementById('loading-state');
    const errorText = document.getElementById('error-text');

    if (!certId) {
        mostrarError("Error: Código de validación ausente en el escaneo.");
        return;
    }

    // Consulta la base de datos estática datos.json
    fetch('datos.json?v=' + new Date().getTime())
        .then(response => {
            if (!response.ok) throw new Error("No se pudo conectar con la base de datos de credenciales.");
            return response.json();
        })
        .then(data => {
            // Normaliza la búsqueda para prevenir errores de mayúsculas/minúsculas
            const registro = data.find(item => item.id.trim().toUpperCase() === certId.trim().toUpperCase());

            if (registro) {
                // Inyección de datos en la tarjeta
                document.getElementById('cert-id').textContent = registro.id;
                document.getElementById('cert-grado').textContent = registro.grado;
                document.getElementById('cert-nombre').textContent = registro.nombre;
                document.getElementById('cert-mi').textContent = registro.mi;
                document.getElementById('cert-ce').textContent = registro.ce;
                document.getElementById('cert-calidad').textContent = registro.calidad;

                // Muestra la tarjeta con los datos
                statusMessage.classList.add('hidden');
                cardResultado.classList.remove('hidden');
            } else {
                mostrarError(`La credencial de control [${certId}] no pertenece a un certificado registrado.`);
            }
        })
        .catch(error => {
            console.error(error);
            mostrarError("Error de comunicación interna al verificar la credencial.");
        });

    function mostrarError(mensaje) {
        loadingState.classList.add('hidden');
        errorText.textContent = mensaje;
        errorText.classList.remove('hidden');
    }
});
