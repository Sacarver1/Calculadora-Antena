function mostrarDialogo() {
    var dialogo = document.getElementById("dialogo");
    dialogo.style.display = "block";
}

function ocultarDialogo() {
    var dialogo = document.getElementById("dialogo");
    dialogo.style.display = "none";
}

let simulaciones = [];

function calcularPIRE(potencia, ganancia) {
    return 10 * Math.log10(potencia) + ganancia;
}



function verificarCriterio(pire, frecuencia,altura) {
        if (pire <= 10) {
            criterio = "Estación base instalada de manera que la parte más baja del sistema irradiante (antena(s)) está a una altura mínima de 2.2 metros por encima del piso de la zona de público en general.";
            if(altura>2.2){
                criterio+="\n\tNo cumple el criterio de instalacion, altura menor a 2.2m";
            }
        
        } else if (pire <= 100) {
            criterio = "La parte más baja del sistema irradiante (antena(s)) está a una altura mínima de 2.5 metros por encima del piso de la zona de público en general.\n\
                        \nLa distancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 2 metros para frecuencias menores a 1500 MHz o de 1 metro para frecuencias mayores o iguales a 1500 MHz.\n\
                        \n 	Ninguna otra fuente de radiofrecuencia con PIRE por encima de 10 W se encuentra a una distancia de hasta 10 metros en frecuencias menores a 1500 MHz o 5 metros para frecuencias mayores o iguales a 1500 MHz en la dirección del lóbulo principal(2) y una distancia de hasta 2 metros en otras direcciones para cualquier rango de frecuencia(3).";
            if(altura>2.5){
                criterio+="\n\tNo cumple el criterio de instalacion, altura menor a 2.5m";
            }
            if(frecuencia<=1500){
                criterio+="\n\tDistancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 2 metros";
            }else
                criterio+="\n\tDistancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 1 metros";
  
        }
        else {
            criterio = "La parte más baja radiante del sistema irradiante (antena(s)) está a una altura mínima de Hb metros por encima del piso de la zona de público en general.\n\
                        \nLa distancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de D metros.\n\
                        \nNo hay otras fuentes de radiofrecuencia con PIRE por encima de 100 W que se encuentren a una distancia de 5*D metros en la dirección del lóbulo principal y dentro de D metros en otras direcciones(4).";
        }

     return criterio;
}

function agregarSimulacion(nombre, tipoServicio, altura, patronRadiacion, potencia, ganancia, frecuencia) {
    ocultarDialogo();

    let pire = calcularPIRE(potencia, ganancia);

    let criterio = verificarCriterio(pire, frecuencia,altura);


    let simulacionActual = {
        nombre: nombre,
        tipoServicio: tipoServicio,
        altura: altura,
        patronRadiacion: patronRadiacion,
        potencia: potencia,
        ganancia: ganancia,
        frecuencia: frecuencia,
        pire: pire,
        criterio: criterio
    };

    simulaciones.push(simulacionActual);

    mostrarSimulacion(simulacionActual);
}

function mostrarSimulacion(simulacion) {
    let nombreSimulacion = document.createElement("button");
    nombreSimulacion.textContent = simulacion.nombre;
    nombreSimulacion.classList.add("nombre-simulacion");
    nombreSimulacion.dataset.simulacionIndex = simulaciones.length;
    document.getElementById("simulaciones").appendChild(nombreSimulacion);

    let lienzo = document.createElement("div");
    lienzo.classList.add("lienzo");
    lienzo.dataset.simulacionIndex = simulaciones.length;
    document.getElementById("lienzo-container").appendChild(lienzo);

    let cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    let antenaCard = document.createElement("div");
    antenaCard.classList.add("card");

    let cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");
    cardHeader.textContent = simulacion.nombre;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Crear una lista para cada atributo de la antena
    let infoList = document.createElement("ul");

    // Agregar elementos <li> para cada atributo, excepto el nombre
    let tipoServicioItem = document.createElement("li");
    tipoServicioItem.textContent = "Tipo de Servicio: " + simulacion.tipoServicio;

    let alturaItem = document.createElement("li");
    alturaItem.textContent = "Altura: " + simulacion.altura + "m";

    let patronRadiacionItem = document.createElement("li");
    patronRadiacionItem.textContent = "Patrón de Radiación: " + simulacion.patronRadiacion;

    let potenciaItem = document.createElement("li");
    potenciaItem.textContent = "Potencia (W): " + simulacion.potencia;

    let gananciaItem = document.createElement("li");
    gananciaItem.textContent = "Ganancia (dB): " + simulacion.ganancia;

    let frecuenciaItem = document.createElement("li");
    frecuenciaItem.textContent = "Frecuencia (Hz): " + simulacion.frecuencia;

    let pireItem = document.createElement("li");
    pireItem.textContent = "PIRE: " + simulacion.pire.toFixed(2) + " dBm";

    // Agregar cada atributo a la lista
    infoList.appendChild(tipoServicioItem);
    infoList.appendChild(alturaItem);
    infoList.appendChild(patronRadiacionItem);
    infoList.appendChild(potenciaItem);
    infoList.appendChild(gananciaItem);
    infoList.appendChild(frecuenciaItem);
    infoList.appendChild(pireItem);

    // Agregar la lista al cardBody
    cardBody.appendChild(infoList);

    antenaCard.appendChild(cardHeader);
    antenaCard.appendChild(cardBody);

    cardContainer.appendChild(antenaCard);

    lienzo.appendChild(cardContainer);

    // Crear el contenedor de la imagen
    let imagenContainer = document.createElement("div");
    imagenContainer.classList.add("imagen-container");

    // Crear la imagen
    let imagen = document.createElement("img");
    imagen.src = obtenerImagen(simulacion.patronRadiacion);
    imagen.alt = "Patrón de Radiación";

    imagen.style.width = "300px"; // Cambiar el tamaño según lo necesites
    imagen.style.height = "auto";
    imagenContainer.appendChild(imagen);

    // Modificar la posición de la imagen a absolute
    imagen.style.right = "0%"; // Posicionar a la derecha
    imagen.style.top = "0%"; // Centrar verticalmente
    imagen.style.transform = "translate(250%, 0%)"; // Corregir el centro

    lienzo.appendChild(imagenContainer);
}


function obtenerImagen(patronRadiacion) {

    if (patronRadiacion === "direccional") {
        return "img/antena_direccional.png";
    } else if (patronRadiacion === "sectorial") {
        return "img/antena_sectorial.png";
    } else if (patronRadiacion === "no-direccional") {
        return "img/antena_nodir.png";
    } else {
        return "img/antenna.png";
    }

}

document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();
    let nombre = document.getElementById("nombre").value;
    let tipoServicio = document.getElementById("tipo-servicio").value;
    let altura = document.getElementById("altura").value;
    let patronRadiacion = document.getElementById("patron-radiacion").value;
    let potencia = parseFloat(document.getElementById("potencia").value);
    let ganancia = parseFloat(document.getElementById("ganancia").value);
    let frecuencia = parseFloat(document.getElementById("frecuencia").value);

    agregarSimulacion(nombre, tipoServicio, altura, patronRadiacion, potencia, ganancia, frecuencia);
});

document.getElementById("nueva-simulacion").addEventListener("click", function () {
    mostrarDialogo();
});
document.getElementById("nueva-simulacion2").addEventListener("click", function () {
    mostrarDialogo();
});

document.getElementById("simulaciones").addEventListener("click", function (event) {
    let simulacionIndex = event.target.dataset.simulacionIndex;
    if (simulacionIndex) {
        let lienzos = document.querySelectorAll(".lienzo");
        lienzos.forEach(lienzo => lienzo.style.display = "none");

        let lienzo = document.querySelector(`.lienzo[data-simulacion-index="${simulacionIndex}"]`);
        lienzo.style.display = "block";
    }
});
