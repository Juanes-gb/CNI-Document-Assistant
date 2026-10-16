//Visualización del historial y detalles de consultas
//
// Expone mostrarConsultas(), que app.js ya llama al cargar la página y con cada
// evento "consultasActualizadas". Al abrir una consulta dispara el evento
// "consultaSeleccionada" (detail: { id }), que escucha borradores.js.

// Contenedores del historial y del detalle definidos en index.html.
const listaConsultas = document.getElementById("lista-consultas");
const detalleConsulta = document.getElementById("detalle-consulta");

// Id de la consulta abierta en el detalle (null si no hay ninguna).
let idConsultaSeleccionada = null;

// Dibuja el historial (la más reciente primero) y refresca el detalle abierto.
function mostrarConsultas() {
    const consultas = obtenerConsultas();

    if (consultas.length === 0) {
        listaConsultas.replaceChildren(crearElemento("p", "", "No hay consultas para mostrar."));
    } else {
        const lista = crearElemento("ul", "lista-consultas");

        // Se guardan en orden de registro; las invertimos para ver primero la más reciente.
        consultas.slice().reverse().forEach(consulta => {
            lista.append(crearItemConsulta(consulta));
        });

        listaConsultas.replaceChildren(lista);
    }

    // Si la consulta abierta sigue existiendo, mostramos sus datos actualizados (p. ej. su nuevo estado).
    const seleccionada = consultas.find(consulta => consulta.id === idConsultaSeleccionada);

    if (seleccionada) {
        mostrarDetalleConsulta(seleccionada);
    } else {
        idConsultaSeleccionada = null;
        detalleConsulta.replaceChildren(crearElemento("p", "", "Selecciona una consulta del historial."));
    }
}

// Abre una consulta del historial. Si borradores.js cancela el evento
// (el usuario no quiere perder cambios sin guardar), la selección no cambia.
function seleccionarConsulta(id) {
    if (id === idConsultaSeleccionada) {
        return;
    }

    const evento = new CustomEvent("consultaSeleccionada", {
        detail: { id },
        cancelable: true
    });

    if (!document.dispatchEvent(evento)) {
        return;
    }

    idConsultaSeleccionada = id;
    mostrarConsultas();

    // Al redibujar la lista se pierde el foco; lo devolvemos a la consulta elegida (uso con teclado).
    listaConsultas.querySelector('[aria-current="true"]').focus();
}

// Crea el elemento de la lista para una consulta. Es un botón para poder usarlo con mouse o teclado.
function crearItemConsulta(consulta) {
    const boton = crearElemento("button", "consulta-item");
    boton.type = "button";

    if (consulta.id === idConsultaSeleccionada) {
        boton.setAttribute("aria-current", "true");
    }

    boton.append(
        crearElemento("span", "consulta-item__asunto", consulta.asunto),
        crearElemento("span", "consulta-item__datos", `${consulta.tipo} · ${formatearFecha(consulta.fecha)}`),
        crearEtiquetaEstado(consulta.estado)
    );

    boton.addEventListener("click", () => seleccionarConsulta(consulta.id));

    return crearElemento("li", "", boton);
}

// Muestra todos los datos de la consulta en la sección de detalle.
function mostrarDetalleConsulta(consulta) {
    const datos = crearElemento("dl", "detalle-datos");

    [
        ["Código", consulta.id],
        ["Asunto", consulta.asunto],
        ["Tipo", crearElemento("span", "etiqueta", consulta.tipo)],
        ["Fecha de recepción", formatearFecha(consulta.fecha)],
        ["Estado", crearEtiquetaEstado(consulta.estado)],
        ["Descripción", consulta.descripcion]
    ].forEach(([titulo, valor]) => {
        datos.append(crearElemento("dt", "", titulo), crearElemento("dd", "", valor));
    });

    detalleConsulta.replaceChildren(datos);
}

// Etiqueta de color según el estado; el color lo define styles.css con el atributo data-estado.
function crearEtiquetaEstado(estado) {
    const etiqueta = crearElemento("span", "etiqueta", estado);
    etiqueta.dataset.estado = estado;

    return etiqueta;
}

// Convierte "2026-10-15" en "15 oct 2026". Con "T00:00" la fecha se lee en hora local
// (sin eso se interpreta en UTC y en Colombia se mostraría el día anterior).
function formatearFecha(fecha) {
    const dia = new Date(`${fecha}T00:00`);

    if (isNaN(dia)) {
        return fecha;
    }

    return dia.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
}

// Crea un elemento HTML. El contenido se agrega como texto (no como HTML),
// así lo que escribe el usuario nunca se interpreta como código.
function crearElemento(etiqueta, clase, contenido) {
    const elemento = document.createElement(etiqueta);

    if (clase) {
        elemento.className = clase;
    }

    if (contenido != null) {
        elemento.append(contenido);
    }

    return elemento;
}
