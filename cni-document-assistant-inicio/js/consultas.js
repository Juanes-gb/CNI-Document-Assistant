// Guardamos referencias a los elementos del formulario para poder leerlos y responder a sus eventos.
const formularioConsulta = document.getElementById("form-consulta");
const mensajeRegistro = document.getElementById("mensaje-registro");
const asuntoInput = document.getElementById("asunto-consulta");
const descripcionInput = document.getElementById("descripcion-consulta");

// Si el usuario corrige un campo, quitamos el error personalizado anterior.
asuntoInput.addEventListener("input", () => asuntoInput.setCustomValidity(""));
descripcionInput.addEventListener("input", () =>
    descripcionInput.setCustomValidity("")
);

// Este código se ejecuta cuando el usuario intenta registrar una consulta.
formularioConsulta.addEventListener("submit", (evento) => {
    // Evita que el navegador recargue la página al enviar el formulario.
    evento.preventDefault();

    const tipoInput = document.getElementById("tipo-consulta");

    // Quitamos espacios al inicio y al final para evitar guardar texto vacío o accidental.
    const asunto = asuntoInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    // Además de "required", comprobamos que asunto y descripción no sean solo espacios.
    asuntoInput.setCustomValidity(asunto ? "" : "Escribe un asunto para la consulta.");
    descripcionInput.setCustomValidity(
        descripcion ? "" : "Escribe la descripción de la consulta."
    );

    // Muestra las validaciones del formulario y detiene el registro si algo está incompleto.
    if (!formularioConsulta.reportValidity()) {
        return;
    }

    // Ajustamos la fecha a la zona horaria local para guardar el día correcto.
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());

    // Formato de consulta que se usa en todas las áreas.
    const consulta = {
        id: `CONS-${crearIdentificador()}`,
        tipo: tipoInput.value,
        asunto,
        descripcion,
        fecha: ahora.toISOString().slice(0, 10),
        borrador: "",
        estado: "En revisión"
    };

    // guardarConsulta está definida en storage.js y conserva las consultas en localStorage.
    try {
        guardarConsulta(consulta);
    } catch (error) {
        // Si el navegador no permite guardar, informamos el problema en vez de mostrar éxito.
        console.error("No se pudo guardar la consulta.", error);
        mostrarMensajeRegistro(
            "No se pudo guardar la consulta en este navegador. Verifica el almacenamiento e inténtalo de nuevo.",
            "error"
        );
        return;
    }

    // Al guardar correctamente, limpiamos el formulario y confirmamos el registro.
    formularioConsulta.reset();
    mostrarMensajeRegistro(
        `Consulta ${consulta.id} registrada correctamente.`,
        "exito"
    );
});

// Crea un ID único; usa crypto.randomUUID y ofrece una alternativa para navegadores antiguos.
function crearIdentificador() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Actualiza el mensaje accesible que ve el usuario después de registrar o ante un error.
function mostrarMensajeRegistro(mensaje, tipo) {
    mensajeRegistro.textContent = mensaje;
    mensajeRegistro.className = `mensaje-registro mensaje-registro--${tipo}`;
}