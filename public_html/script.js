// Función para mostrar el diálogo de ingreso de datos de la simulación
function mostrarDialogo() {
    var dialogo = document.getElementById("dialogo");
    dialogo.style.display = "block";
}

// Función para ocultar el diálogo de ingreso de datos de la simulación
function ocultarDialogo() {
    var dialogo = document.getElementById("dialogo");
    dialogo.style.display = "none";
}

// Escuchar el envío del formulario
document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();
    // Obtener datos del formulario
    let nombre = document.getElementById("nombre").value;
    let tipoServicio = document.getElementById("tipo-servicio").value;
    let altura = document.getElementById("altura").value;
    let patronRadiacion = document.getElementById("patron-radiacion").value;

    // Crear el nombre de la simulación en la lista
    let nombreSimulacion = document.createElement("button");
    nombreSimulacion.textContent = nombre;
    nombreSimulacion.classList.add("nombre-simulacion");
    nombreSimulacion.dataset.simulacionIndex = simulacionIndex;
    document.getElementById("simulaciones").appendChild(nombreSimulacion);

    // Mostrar el lienzo de la nueva simulación
    let lienzo = document.createElement("div");
    lienzo.classList.add("lienzo");
    lienzo.dataset.simulacionIndex = simulacionIndex;
    document.getElementById("lienzo-container").appendChild(lienzo);

    // Crear la representación de la antena en el lienzo con los datos capturados
    let antena = document.createElement("div");
    antena.classList.add("antena");
    antena.textContent = "Antena: " + nombre + " - " + tipoServicio + " - Altura: " + altura + "m - Patrón de Radiación: " + patronRadiacion;
    lienzo.appendChild(antena);

    // Agregar la imagen de la antena al lienzo
    let imagenAntena = document.createElement("img");
    imagenAntena.src = "antenna.png"; // Ruta de la imagen de la antena
    imagenAntena.alt = "Antena";
    lienzo.appendChild(imagenAntena);

    // Incrementar el índice de simulación
    simulacionIndex++;

    // Ocultar el diálogo de ingreso de datos
    ocultarDialogo();
});


let simulacionIndex = 1;

document.getElementById("nueva-simulacion").addEventListener("click", function() {
    // Mostrar el diálogo de ingreso de datos al hacer clic en el botón de nueva simulación
    mostrarDialogo();
});

// Event listener para seleccionar una simulación
document.getElementById("simulaciones").addEventListener("click", function(event) {
    let simulacionIndex = event.target.dataset.simulacionIndex;
    if (simulacionIndex) {
        // Ocultar todos los lienzos
        let lienzos = document.querySelectorAll(".lienzo");
        lienzos.forEach(lienzo => lienzo.style.display = "none");

        // Mostrar el lienzo correspondiente a la simulación seleccionada
        let lienzo = document.querySelector(`.lienzo[data-simulacion-index="${simulacionIndex}"]`);
        lienzo.style.display = "block";
    }
});
