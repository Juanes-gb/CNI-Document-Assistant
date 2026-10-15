//Navegación e integración de las funcionalidades

//Inicializa la aplicación cuando el HTML termina de cargarse
document.addEventListener("DOMContentLoaded", function (){
    console.log("CNI Document Assistant inciado correctamente");

    //Actualizar el historial cuando cambien las consultas
    document.addEventListener("consultasActualizadas", function () {

        if (typeof mostrarConsultas === "function"){
        mostrarConsultas();
        }
    });
    
    //Mostrar las consultas guardadas al abrir la página
    if(typeof mostrarConsultas === "function") {
        mostrarConsultas();
    }
});




