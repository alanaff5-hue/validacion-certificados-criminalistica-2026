document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('id');

    const cardResultado = document.getElementById('card-resultado');
    const statusMessage = document.getElementById('status-message');
    const loadingState = document.getElementById('loading-state');
    const errorText = document.getElementById('error-text');

    if (!certId) {
        mostrarError("Error: No se proporcionó ningún identificador de certificado.");
        return;
    }

    // Consulta la base de datos local JSON
    fetch('datos.json')
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar la base de datos.");
            return response.json();
        })
        .then(data => {
            // Normalizar ID para la búsqueda
            const registro = data.find(item => item.id.toUpperCase() === certId.toUpperCase());

            if (registro) {
                // Inyectar datos en el DOM
                document.getElementById('cert-id').textContent = registro.id;
                document.getElementById('cert-grado').textContent = registro.grado;
                document.getElementById('cert-nombre').textContent = registro.nombre;
                document.getElementById('cert-mi').textContent = registro.mi;
                document.getElementById('cert-ce').textContent = registro.ce;
                document.getElementById('cert-calidad').textContent = registro.calidad;

                // Renderizar interfaz
                statusMessage.classList.add('hidden');
                cardResultado.classList.remove('hidden');
            } else {
                mostrarError(`El certificado con ID ${certId} no se encuentra registrado o no es válido.`);
            }
        })
        .catch(error => {
            console.error(error);
            mostrarError("Error interno al verificar el certificado. Intente más tarde.");
        });

    function mostrarError(mensaje) {
        loadingState.classList.add('hidden');
        errorText.textContent = mensaje;
        errorText.classList.remove('hidden');
    }
});