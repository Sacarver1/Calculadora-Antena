function mostrarDialogo() {
    var dialogo = document.getElementById("dialogo");
    dialogo.style.display = "block";
}

function ocultarDialogo() {
    var dialogo = document.getElementById("dialogo");
    dialogo.style.display = "none";
}

let simulaciones = [];

document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();
    let nombre = document.getElementById("nombre").value;
    let tipoServicio = document.getElementById("tipo-servicio").value;
    let altura = document.getElementById("altura").value;
    let patronRadiacion = document.getElementById("patron-radiacion").value;
    let potencia = parseFloat(document.getElementById("potencia").value);
    let ganancia = parseFloat(document.getElementById("ganancia").value);
    let frecuencia = parseFloat(document.getElementById("frecuencia").value);

    ocultarDialogo();

    // Calcular el PIRE
    let pire = 10 * Math.log10(potencia) + ganancia;

    let criterio = "";

    // Verificar el criterio de instalación según el valor del PIRE
    if (pire <= 10) {
        criterio = "Estación base instalada de manera que la parte más baja del sistema irradiante (antena(s)) está a una altura mínima de 2.2 metros por encima del piso de la zona de público en general.";
        if(altura>2.2){
            criterio+="\nNo cumple el criterio de instalacion, altura menor a 2.2m";
        }
    
    } else if (pire <= 100) {
        criterio = "La parte más baja del sistema irradiante (antena(s)) está a una altura mínima de 2.5 metros por encima del piso de la zona de público en general.\n\
                    \nLa distancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 2 metros para frecuencias menores a 1500 MHz o de 1 metro para frecuencias mayores o iguales a 1500 MHz.\n\
                    \n 	Ninguna otra fuente de radiofrecuencia con PIRE por encima de 10 W se encuentra a una distancia de hasta 10 metros en frecuencias menores a 1500 MHz o 5 metros para frecuencias mayores o iguales a 1500 MHz en la dirección del lóbulo principal(2) y una distancia de hasta 2 metros en otras direcciones para cualquier rango de frecuencia(3).";
        if(altura>2.5){
            criterio+="\nNo cumple el criterio de instalacion, altura menor a 2.5m";
        }
        if(frecuencia<=1500){
            criterio+="\nDistancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 2 metros";
        }else
            criterio+="\nDistancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 1 metros";

    
    }  
    
    else {
        criterio = "La parte más baja radiante del sistema irradiante (antena(s)) está a una altura mínima de Hb metros por encima del piso de la zona de público en general.\n\
                    \nLa distancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de D metros.\n\
                    \n	No hay otras fuentes de radiofrecuencia con PIRE por encima de 100 W que se encuentren a una distancia de 5*D metros en la dirección del lóbulo principal y dentro de D metros en otras direcciones(4).";
    }

    let simulacionActual = {
        nombre: nombre,
        tipoServicio: tipoServicio,
        altura: altura,
        patronRadiacion: patronRadiacion,
        potencia: potencia,
        ganancia: ganancia,
        frecuencia: frecuencia,
        pire: pire, // Guardar el PIRE en la simulación actual
        criterio: criterio // Guardar el criterio de instalación en la simulación actual
    };

    simulaciones.push(simulacionActual);

    let nombreSimulacion = document.createElement("button");
    nombreSimulacion.textContent = nombre;
    nombreSimulacion.classList.add("nombre-simulacion");
    nombreSimulacion.dataset.simulacionIndex = simulaciones.length;
    document.getElementById("simulaciones").appendChild(nombreSimulacion);

    let lienzo = document.createElement("div");
    lienzo.classList.add("lienzo");
    lienzo.dataset.simulacionIndex = simulaciones.length;
    document.getElementById("lienzo-container").appendChild(lienzo);

    let antena = document.createElement("div");
    antena.classList.add("antena");
    antena.textContent = "Antena: " + nombre + " - " + tipoServicio + " - Altura: " + altura + "m - Patrón de Radiación: " + patronRadiacion;
    lienzo.appendChild(antena);

    let pireElement = document.createElement("p");
    pireElement.textContent = "PIRE: " + pire.toFixed(2) + " dBm"; // Mostrar el PIRE en el lienzo
    lienzo.appendChild(pireElement);

    let criterioElement = document.createElement("p");
    criterioElement.textContent = "Criterio de Evaluación: " + criterio; // Mostrar el criterio de evaluación en el lienzo
    lienzo.appendChild(criterioElement);
});

let simulacionIndex = 1;

document.getElementById("nueva-simulacion").addEventListener("click", function() {
    mostrarDialogo();
});

document.getElementById("simulaciones").addEventListener("click", function(event) {
    let simulacionIndex = event.target.dataset.simulacionIndex;
    if (simulacionIndex) {
        let lienzos = document.querySelectorAll(".lienzo");
        lienzos.forEach(lienzo => lienzo.style.display = "none");

        let lienzo = document.querySelector(`.lienzo[data-simulacion-index="${simulacionIndex}"]`);
        lienzo.style.display = "block";
    }
});
