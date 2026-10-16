//Creación, edición y cambio de estado de los borradores
//
// Escucha "consultaSeleccionada" (de historial.js) para cargar el borrador de esa
// consulta. Al guardar, actualiza la consulta en localStorage y dispara
// "consultasActualizadas" para que app.js vuelva a dibujar el historial.

// Elementos del formulario del borrador definidos en index.html.
const camposBorrador = document.getElementById("campos-borrador");
const textoBorrador = document.getElementById("texto-borrador");
const estadoBorrador = document.getElementById("estado-borrador");
const mensajeBorrador = document.getElementById("mensaje-borrador");

// Id de la consulta cuyo borrador se está editando (null si no hay ninguna).
let idConsultaBorrador = null;

// Al abrir otra consulta, cargamos su borrador. Si hay cambios sin guardar
// preguntamos antes; si el usuario cancela, historial.js mantiene la consulta actual.
document.addEventListener("consultaSeleccionada", (evento) => {
    if (hayCambiosSinGuardar() && !confirm("El borrador tiene cambios sin guardar. ¿Deseas descartarlos?")) {
        evento.preventDefault();
        return;
    }

    cargarBorrador(evento.detail.id);
});

document.getElementById("btn-guardar-borrador").addEventListener("click", guardarBorrador);

// Al editar, quitamos el error de validación y el mensaje anterior (ya no aplica).
camposBorrador.addEventListener("input", () => {
    textoBorrador.setCustomValidity("");
    mostrarMensajeBorrador();
});

// Llena el formulario con el borrador guardado de la consulta y lo habilita.
function cargarBorrador(id) {
    const guardado = leerBorradorGuardado(id);

    idConsultaBorrador = id;
    textoBorrador.value = guardado.texto;
    estadoBorrador.value = guardado.estado;
    textoBorrador.setCustomValidity("");
    camposBorrador.disabled = false;
    mostrarMensajeBorrador();
}

// Guarda el texto y el estado del borrador dentro de la consulta seleccionada.
function guardarBorrador() {
    if (idConsultaBorrador === null) {
        return;
    }

    // Igual que en el registro: no aceptamos un borrador vacío o solo con espacios.
    textoBorrador.setCustomValidity(
        textoBorrador.value.trim() ? "" : "Escribe la respuesta antes de guardar el borrador."
    );

    if (!textoBorrador.reportValidity()) {
        return;
    }

    // actualizarConsulta (storage.js) devuelve false si la consulta ya no existe
    // y puede lanzar un error si el navegador no permite guardar.
    let guardado = false;

    try {
        guardado = actualizarConsulta(idConsultaBorrador, {
            borrador: textoBorrador.value,
            estado: estadoBorrador.value
        });
    } catch (error) {
        console.error("No se pudo guardar el borrador.", error);
    }

    if (!guardado) {
        mostrarMensajeBorrador("No se pudo guardar el borrador. Inténtalo de nuevo.", "error");
        return;
    }

    mostrarMensajeBorrador(`Borrador guardado. Estado: ${estadoBorrador.value}.`, "exito");

    // app.js escucha este evento y redibuja el historial con el nuevo estado.
    document.dispatchEvent(new CustomEvent("consultasActualizadas"));
}

// Indica si el formulario tiene algo distinto a lo que está guardado.
function hayCambiosSinGuardar() {
    if (idConsultaBorrador === null) {
        return false;
    }

    const guardado = leerBorradorGuardado(idConsultaBorrador);

    return textoBorrador.value !== guardado.texto || estadoBorrador.value !== guardado.estado;
}

// Lee de localStorage el borrador y el estado de una consulta.
function leerBorradorGuardado(id) {
    const consulta = obtenerConsultas().find(consulta => consulta.id === id);

    return {
        texto: consulta?.borrador ?? "",
        estado: consulta?.estado ?? "En revisión"
    };
}

// Muestra un mensaje de éxito o error; sin argumentos lo borra.
function mostrarMensajeBorrador(mensaje = "", tipo = "") {
    mensajeBorrador.textContent = mensaje;
    mensajeBorrador.className = tipo ? `mensaje-borrador mensaje-borrador--${tipo}` : "mensaje-borrador";
}
