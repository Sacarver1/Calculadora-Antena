const alturaPerson = 2;

function mostrarDialogo() {
  var dialogo = document.getElementById("dialogo");
  dialogo.style.display = "block";
}

function ocultarDialogo() {
  var dialogo = document.getElementById("dialogo");
  dialogo.style.display = "none";
}

let simulaciones = [];

function verificarCriterio(pire, frecuencia, altura) {
  let criterio = "";
  let resCriterio = "";

  if (pire <= 10) {
    criterio =
      "Estación base instalada de manera que la parte más baja del sistema irradiante (antena(s)) está a una altura mínima de 2.2 metros por encima del piso de la zona de público en general.";
    if (altura > 2.2) {
      resCriterio +=
        "\n\tNo cumple el criterio de instalacion, altura menor a 2.2m";
    } else {
      resCriterio += "\n\tCumple el criterio de instalacion";
    }
  } else if (pire <= 100) {
    criterio =
      "La parte más baja del sistema irradiante (antena(s)) está a una altura mínima de 2.5 metros por encima del piso de la zona de público en general.\n\
                        \nLa distancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 2 metros para frecuencias menores a 1500 MHz o de 1 metro para frecuencias mayores o iguales a 1500 MHz.\n\
                        \n 	Ninguna otra fuente de radiofrecuencia con PIRE por encima de 10 W se encuentra a una distancia de hasta 10 metros en frecuencias menores a 1500 MHz o 5 metros para frecuencias mayores o iguales a 1500 MHz en la dirección del lóbulo principal(2) y una distancia de hasta 2 metros en otras direcciones para cualquier rango de frecuencia(3).";
    if (altura > 2.5) {
      resCriterio +=
        "\n\tNo cumple el criterio de instalacion, altura menor a 2.5m";
    } else {
      resCriterio += "\n\tCumple el criterio de instalacion";
    }
    if (frecuencia <= 1500) {
      criterio +=
        "\n\tDistancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 2 metros";
    } else
      criterio +=
        "\n\tDistancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de 1 metros";
  } else {
    criterio =
      "La parte más baja radiante del sistema irradiante (antena(s)) está a una altura mínima de Hb metros por encima del piso de la zona de público en general.\n\
                        \nLa distancia mínima a zonas accesibles al público en general en la dirección del lóbulo principal es de D metros.\n\
                        \nNo hay otras fuentes de radiofrecuencia con PIRE por encima de 100 W que se encuentren a una distancia de 5*D metros en la dirección del lóbulo principal y dentro de D metros en otras direcciones(4).";
  }

  return { criterio: criterio, resCriterio: "" }; // Retorna un objeto con el criterio y resCriterio inicializado como null
}

function hertzToMegahertz(hertz) {
  return hertz / 1000000;
}

function requiereSeñalizacion(r, d, a) {
  if (r !== null && d !== null) {
    return a > r;
  }
}

function requiereMedicion(pire, potencia, ganancia, isAm) {
  if (isAm) {
    return true;
  } else if (pire <= 2) {
    return false;
  } else {
    var potenciaRadiacion = potencia * ganancia;
    var potenciaRadiacion_mW = potenciaRadiacion * 1000;

    return potenciaRadiacion_mW >= 100;
  }
}

function limitePoblacional(frecuencia, pire) {
  const f = hertzToMegahertz(frecuencia);
  if (f >= 30 || f < 400) {
    return 0.319 * Math.sqrt(pire);
  } else if (f >= 400 || f < 2000) {
    return 6.38 * Math.sqrt(pire / f);
  } else if (f >= 2000 || f < 300000) {
    return 0.143 * Math.sqrt(pire);
  } else {
    return null;
  }
}

function limiteOcupacional(frecuencia, pire) {
  const f = hertzToMegahertz(frecuencia);
  if (f >= 30 || f < 400) {
    return 0.143 * Math.sqrt(pire);
  } else if (f >= 400 || f < 2000) {
    return 2.92 * Math.sqrt(pire / f);
  } else if (f >= 2000 || f < 300000) {
    return 0.0638 * Math.sqrt(pire);
  } else {
    return null;
  }
}

function calcularDistanciaHorizontal(r, altura) {
  const a = altura - alturaPerson;
  if (a > r) {
    return 0;
  }
  return Math.sqrt(Math.pow(r, 2) - Math.pow(a, 2));
}

function agregarSimulacion(
  nombre,
  tipoServicio,
  altura,
  patronRadiacion,
  potencia,
  ganancia,
  frecuencia
) {
  ocultarDialogo();

  let pire = 10 * Math.log10(potencia * 1000) + ganancia;

  let { criterio, resCriterio } = verificarCriterio(pire, frecuencia, altura); // Usamos destructuring para obtener criterio y resCriterio

  let simulacionActual = {
    nombre: nombre,
    tipoServicio: tipoServicio,
    altura: altura,
    patronRadiacion: patronRadiacion,
    potencia: potencia,
    ganancia: ganancia,
    frecuencia: frecuencia,
    pire: pire,
    criterio: criterio,
    resCriterio: resCriterio, // Agregamos el atributo resCriterio
  };

  simulaciones.push(simulacionActual);

  mostrarSimulacion(simulacionActual);
}

function mostrarSimulacion(simulacion) {
  let isAm = simulacion.tipoServicio === "radiodifusion-am";

  const requiereMedi = requiereMedicion(
    simulacion.pire,
    simulacion.potencia,
    simulacion.ganancia,
    isAm
  );
  const limiteOcu = calcularDistanciaHorizontal(
    limiteOcupacional(simulacion.pire, simulacion.frecuencia),
    simulacion.altura
  );

  const limitePobla = calcularDistanciaHorizontal(
    limitePoblacional(simulacion.pire, simulacion.frecuencia),
    simulacion.altura
  );

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
  patronRadiacionItem.textContent =
    "Patrón de Radiación: " + simulacion.patronRadiacion;

  let potenciaItem = document.createElement("li");
  potenciaItem.textContent = "Potencia (W): " + simulacion.potencia;

  let potenciaDBm = 10 * Math.log10(simulacion.potencia * 1000);
  potenciaItem.textContent +=
    ", Potencia (dBm): " + potenciaDBm.toFixed(2) + " dBm";

  let gananciaItem = document.createElement("li");
  gananciaItem.textContent = "Ganancia (dBi): " + simulacion.ganancia;

  let frecuenciaItem = document.createElement("li");
  frecuenciaItem.textContent = "Frecuencia (Hz): " + simulacion.frecuencia;

  let pireItem = document.createElement("li");
  pireItem.textContent = "PIRE: " + simulacion.pire.toFixed(2) + " dBm";

  const valMedicion = requiereMedi ? "Si" : "No";
  let medicion = document.createElement("li");
  medicion.textContent = "Necesita medición: " + valMedicion;

  const valOcuacional = limiteOcu !== null ? limiteOcu : 0;

  let limOcuacional = document.createElement("li");

  if (valOcuacional === 0) {
    limOcuacional.textContent =
      "No requiere señalización para el limite ocupacional ";
  } else {
    limOcuacional.textContent =
      "Distancia limite ocupacional es de: " +
      valOcuacional.toFixed(2) +
      " metros";
  }

  const valPoblacional = limitePobla !== null ? limitePobla : 0;
  let limPoblacional = document.createElement("li");

  if (valPoblacional === 0) {
    limPoblacional.textContent =
      "No requiere señalizaciín para el limite poblacional";
  } else {
    limPoblacional.textContent =
      "Distancia limite poblacional es de: " +
      valPoblacional.toFixed(2) +
      " metros";
  }

  // Agregar cada atributo a la lista
  infoList.appendChild(tipoServicioItem);
  infoList.appendChild(alturaItem);
  infoList.appendChild(patronRadiacionItem);
  infoList.appendChild(potenciaItem);
  infoList.appendChild(gananciaItem);
  infoList.appendChild(frecuenciaItem);
  infoList.appendChild(pireItem);
  infoList.appendChild(medicion);
  infoList.appendChild(limOcuacional);
  infoList.appendChild(limPoblacional);

  // Agregar la lista al cardBody
  cardBody.appendChild(infoList);

  antenaCard.appendChild(cardHeader);
  antenaCard.appendChild(cardBody);

  cardContainer.appendChild(antenaCard);

  lienzo.appendChild(cardContainer);

  // Crear el contenedor de la imagen
  let imagenContainer = document.createElement("div");
  imagenContainer.classList.add("imagen-container1");

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
  //imagen.style.transform = "translate(150%, -0%)"; // Corregir el centro

  lienzo.appendChild(imagenContainer);

  let criterioContainer = document.createElement("div");
  criterioContainer.classList.add("card-container");

  let criterioCard = document.createElement("div");
  criterioCard.classList.add("card");
  criterioCard.classList.add("criterio-card");

  let criterioHeader = document.createElement("div");
  criterioHeader.classList.add("card-header");
  criterioHeader.textContent = "Criterio de instalación";

  let criterioBody = document.createElement("div");
  criterioBody.classList.add("card-body");

  // Crear un párrafo para mostrar el criterio
  let criterioInfo = document.createElement("ul");

  let criterio = document.createElement("li");
  criterio.textContent = "Criterio: " + simulacion.criterio;
  //pire,fre,al

  let resCriterio = document.createElement("li");
  resCriterio.textContent = "-- " + simulacion.resCriterio + " --";

  criterioInfo.appendChild(criterio);
  criterioInfo.appendChild(resCriterio);

  criterioBody.appendChild(criterioInfo);

  criterioCard.appendChild(criterioHeader);
  criterioCard.appendChild(criterioBody);

  criterioContainer.appendChild(criterioCard);
  lienzo.appendChild(criterioContainer);

  let imagenContainer2 = document.createElement("div");
  imagenContainer2.classList.add("card-container");

  let imagenCard = document.createElement("div");
  imagenCard.classList.add("card");

  let cardHeaderImagenes = document.createElement("div");
  cardHeaderImagenes.classList.add("card-header");
  cardHeaderImagenes.textContent = "Señalizaciones requeridas:";

  let imagenCardBody = document.createElement("div");
  imagenCardBody.classList.add("card-body");

  let containerImg1CardBody = document.createElement("div");
  let containerImg2CardBody = document.createElement("div");
  let imagen1 = document.createElement("img");
  let imagen2 = document.createElement("img");

  containerImg1CardBody.style.marginLeft = "10px";
  imagenCardBody.appendChild(containerImg1CardBody);
  imagenCardBody.appendChild(containerImg2CardBody);

  let señalizacionInfo = false;

  if (zona_ocupacional(simulacion)) {
    imagen1.src = "img/zona_ocupacional.PNG";
    imagen1.alt = "Zona Ocupacional";
    imagen1.classList.add("imagen");
    señalizacionInfo = true;
  }

  if (zona_rebasamiento(simulacion)) {
    imagen2.src = "img/zona_rebasamiento.PNG";
    imagen2.alt = "Zona de Rebasamiento";
    imagen2.classList.add("imagen");
    señalizacionInfo = true;
  }

  if (
    zona_ocupacional(simulacion) === false &&
    zona_rebasamiento(simulacion) === false
  ) {
    let mensaje = document.createElement("p");
    mensaje.textContent = "No se requiere señalización.";
    imagenCardBody.appendChild(mensaje);
    señalizacionInfo = false;
  }

  let cardHeaderImag = document.createElement("div");
  cardHeaderImag.classList.add("card-header");

  cardHeaderImag.textContent = "Ejemplo señalización";

  let imagenCardBody2 = document.createElement("div");
  imagenCardBody2.classList.add("card-body");
  imagenCardBody2.classList.add("contenedor-imagen");

  if (señalizacionInfo) {
    let imagen_Container = document.createElement("div");
    let imagenEjemplo = document.createElement("img");
    imagenEjemplo.src = "img/señalización.PNG";
    imagenEjemplo.alt = "Señalización";

    imagenEjemplo.style.width = "auto";
    imagenEjemplo.style.height = "auto";
    imagenEjemplo.style.marginBottom = "20px";
    imagenCardBody2.appendChild(imagenEjemplo);

    let textoEncimaImagen = document.createElement("div");
    textoEncimaImagen.textContent = valOcuacional.toFixed(2) + "m";
    textoEncimaImagen.classList.add("texto-encima-imagen1");

    let textoEncimaImagen2 = document.createElement("div");
    textoEncimaImagen2.textContent = valPoblacional.toFixed(2) + "m";
    textoEncimaImagen2.classList.add("texto-encima-imagen2");

    imagenCardBody2.appendChild(textoEncimaImagen);
    imagenCardBody2.appendChild(textoEncimaImagen2);
    imagenCardBody2.appendChild(imagen_Container);
    lienzo.appendChild(imagen_Container);
    imagenCard.appendChild(cardHeaderImag);
    imagenCard.appendChild(imagenCardBody2);
  }

  imagen1.style.maxWidth = "300px";
  imagen2.style.maxWidth = "300px";

  imagen1.style.height = "auto";
  imagen2.style.height = "auto";

  containerImg1CardBody.appendChild(imagen1);
  containerImg2CardBody.appendChild(imagen2);

  imagenCard.appendChild(cardHeaderImagenes);
  imagenCard.appendChild(imagenCardBody);

  imagenContainer2.appendChild(imagenCard);
  lienzo.appendChild(imagenContainer2);
}
function zona_ocupacional(simulacion) {
  const limitePobla = limitePoblacional(simulacion.pire, simulacion.frecuencia);

  if (simulacion.altura > limitePobla) {
    return false;
  }
  const dist = calcularDistanciaHorizontal(limitePobla, simulacion.altura);
  return dist > 0;
}

function zona_rebasamiento(simulacion) {
  const limitePobla = limitePoblacional(simulacion.pire, simulacion.frecuencia);

  if (simulacion.altura > limitePobla) {
    return false;
  }
  const dist = calcularDistanciaHorizontal(limitePobla, simulacion.altura);
  return dist > 0;
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

document
  .getElementById("formulario")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let nombre = document.getElementById("nombre").value;
    let tipoServicio = document.getElementById("tipo-servicio").value;
    let altura = document.getElementById("altura").value;
    let patronRadiacion = document.getElementById("patron-radiacion").value;
    let potencia = parseFloat(document.getElementById("potencia").value);
    let ganancia = parseFloat(document.getElementById("ganancia").value);
    let frecuencia = parseFloat(document.getElementById("frecuencia").value);

    agregarSimulacion(
      nombre,
      tipoServicio,
      altura,
      patronRadiacion,
      potencia,
      ganancia,
      frecuencia
    );
  });

document
  .getElementById("nueva-simulacion")
  .addEventListener("click", function () {
    mostrarDialogo();
  });
document
  .getElementById("nueva-simulacion2")
  .addEventListener("click", function () {
    mostrarDialogo();
  });

document
  .getElementById("simulaciones")
  .addEventListener("click", function (event) {
    let simulacionIndex = event.target.dataset.simulacionIndex;
    if (simulacionIndex) {
      let lienzos = document.querySelectorAll(".lienzo");
      lienzos.forEach((lienzo) => (lienzo.style.display = "none"));

      let lienzo = document.querySelector(
        `.lienzo[data-simulacion-index="${simulacionIndex}"]`
      );
      lienzo.style.display = "block";
    }
  });

// Obtener los elementos del DOM
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalText = document.getElementById("modalText");
const closeModalBtn = document.getElementById("closeModalBtn");
const openModalBtn = document.getElementById("openModalBtn");
const closeIcon = document.getElementsByClassName("close")[0];

// Función para abrir el modal con una imagen y texto específicos
function openModal(imageUrl, text) {
  modal.style.display = "block"; // Mostrar el modal
  modalImage.src = imageUrl; // Establecer la imagen
  modalText.innerText = text; // Establecer el texto
}

closeModalBtn.addEventListener("click", function () {
  modal.style.display = "none"; // Ocultar el modal
});

closeIcon.onclick = function () {
  modal.style.display = "none"; // Ocultar el modal al hacer clic en la "X"
};

// Cerrar el modal haciendo clic fuera de él
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  var botonComentarios = document.getElementById("boton-comentarios");
  var modalComentarios = document.getElementById("modal-comentarios");
  var span = modalComentarios.querySelector(".close");
  var formularioComentario = document.getElementById("formulario-comentario");
  var comentarios = []; // Array para almacenar los comentarios

  botonComentarios.onclick = function () {
    modalComentarios.style.display = "block";
  };

  span.onclick = function () {
    modalComentarios.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modalComentarios) {
      modalComentarios.style.display = "none";
    }
  };
});
