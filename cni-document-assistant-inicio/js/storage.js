//Identificador con el que vamos a guardar las consultas en el navegador
const IDENTIFICADOR_CONSULTAS = "consultasCNI";

//Para obtener todas las consultas guardadas
function obtenerConsultas() {
    const datos = localStorage.getItem(IDENTIFICADOR_CONSULTAS);

    return datos ? JSON.parse(datos) : [];
}

//Para guardar una nueva consulta
function guardarConsulta(consulta){
    const consultas = obtenerConsultas();

    consultas.push(consulta);

    localStorage.setItem(
        IDENTIFICADOR_CONSULTAS,
        JSON.stringify(consultas)
    );
}

//Para actualizar información de una consulta existente
function actualizarConsulta(id, cambios) {
    const consultas = obtenerConsultas();

    //Buscamos la posición de la consulta que queremos mofificar
    const indice = consultas.findIndex(
        consulta => consulta.id === id
    );

    //Si no encontramos la consulta, no hacemos cambios
    if (indice === -1){
        return false;
    }

    //Actualizamos los datos sin perder la información anterior
    consultas[indice] = {
        ...consultas[indice],
        ...cambios,
        id: consultas[indice].id
    };

    //Aquí guardamos nuevamente las consultas actualizadas
    localStorage.setItem(
        IDENTIFICADOR_CONSULTAS,
        JSON.stringify(consultas)
    );

    return true;
}