//Navegación e integración de las funcionalidades

//Inicializa la aplicación cuando el HTML termina de cargarse
document.addEventListener("DOMContentLoaded", function (){
    console.log("CNI Document Assistant inciado correctamente");

    //Actualizar el historial cuando cambien las consultas
    document.addEventListener("consultasActualizadas", function () {

        if (typeof mostrarConsultas === "function"){
        mostrarConsultas();
        }

        actualizarEstadisticas();
    });
    
    //Mostrar las consultas guardadas al abrir la página
    if(typeof mostrarConsultas === "function") {
        mostrarConsultas();
    }

    //Mostrar las estadísticas iniciales
    actualizarEstadisticas();
});

// Actualiza las estadísticas de las consultas guardadas
function actualizarEstadisticas() {

    // Obtenemos las consultas desde localStorage
    const consultas = obtenerConsultas();

    // Contamos todas las consultas
    const total = consultas.length;

    // Contamos las consultas que están en revisión
    const enRevision = consultas.filter(
        consulta => consulta.estado === "En revisión"
    ).length;

    // Contamos las consultas aprobadas
    const aprobadas = consultas.filter(
        consulta => consulta.estado === "Aprobado"
    ).length;

    // Mostramos los resultados en la página
    document.getElementById("total-consultas").textContent = total;

    document.getElementById("consultas-revision").textContent = enRevision;

    document.getElementById("consultas-aprobadas").textContent = aprobadas;
}




