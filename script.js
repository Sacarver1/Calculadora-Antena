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

function verificarCriterioAltura(pire, altura) {
    let criterio = "";
    if (pire <= 10) {
        criterio = "Estación base instalada de manera que la parte más baja del sistema irradiante (antena(s)) está a una altura mínima de 2.2 metros por encima del piso de la zona de público en general.";
        if (altura > 2.2) {
            criterio += "\nNo cumple el criterio de instalacion, altura menor a 2.2m";
        }
    } else if (pire <= 100) {
        criterio = "La parte más baja del sistema irradiante (antena(s)) está a una altura mínima de 2.5 metros por encima del piso de la zona de público en general.";
        if (altura > 2.5) {
            criterio += "\nNo cumple el criterio de instalacion, altura menor a 2.5m";
        }
    }
    return criterio;
}

function verificarCriterioFrecuencia(pire, frecuencia) {
    let criterio = "";
    if (pire <= 100) {
        if (frecuencia <= 1500) {
            criterio += "\nDistancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 2 metros";
        } else {
            criterio += "\nDistancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 1 metros";
        }
    }
    return criterio;
}

function agregarSimulacion(nombre, tipoServicio, altura, patronRadiacion, potencia, ganancia, frecuencia) {
    ocultarDialogo();

    let pire = calcularPIRE(potencia, ganancia);

    let criterioAltura = verificarCriterioAltura(pire, altura);
    let criterioFrecuencia = verificarCriterioFrecuencia(pire, frecuencia);

    let criterio = criterioAltura + criterioFrecuencia;

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

    let antena = document.createElement("div");
    antena.classList.add("antena");
    antena.textContent = "Antena: " + simulacion.nombre + " - " + simulacion.tipoServicio + " - Altura: " + simulacion.altura + "m - Patrón de Radiación: " + simulacion.patronRadiacion;
    lienzo.appendChild(antena);

    let pireElement = document.createElement("p");
    pireElement.textContent = "PIRE: " + simulacion.pire.toFixed(2) + " dBm";
    lienzo.appendChild(pireElement);

    let criterioElement = document.createElement("p");
    criterioElement.textContent = "Criterio de Evaluación: " + simulacion.criterio;
    lienzo.appendChild(criterioElement);
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

document.getElementById("simulaciones").addEventListener("click", function (event) {
    let simulacionIndex = event.target.dataset.simulacionIndex;
    if (simulacionIndex) {
        let lienzos = document.querySelectorAll(".lienzo");
        lienzos.forEach(lienzo => lienzo.style.display = "none");

        let lienzo = document.querySelector(`.lienzo[data-simulacion-index="${simulacionIndex}"]`);
        lienzo.style.display = "block";
    }
});
