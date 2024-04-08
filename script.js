firebase.initializeApp({
  apiKey: "AIzaSyAHgjo_JjqDhp9roZoau6nuOCcgZNAD_AE",
  authDomain: "antena-939b6.firebaseapp.com",
  databaseURL: "https://antena-939b6-default-rtdb.firebaseio.com",
  projectId: "antena-939b6",
  storageBucket: "antena-939b6.appspot.com",
  messagingSenderId: "311565551078",
  appId: "1:311565551078:web:57a2ad642f8946b3000227",
  measurementId: "G-LTFBYT3KTS",
});

// Initialize Firebase
var db = firebase.firestore();

db.collection("users")
  .add({
    first: "Ada",
    last: "Lovelace",
    born: 1815,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });

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

function calcularPIRE(potencia, ganancia) {
  return 10 * Math.log10(potencia) + ganancia;
}

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

  return { criterio: criterio, resCriterio: resCriterio }; // Retorna un objeto con el criterio y resCriterio inicializado como null
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

    return potenciaRadiacion_mW <= 100;
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
  return Math.sqrt(Math.pow(r, 2) - Math.pow(a, 2));
}

function mostrarResultado(r, d, a) {
  var resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";

  if (r !== null && d !== null) {
    resultadoDiv.innerHTML = `<p>Distancia mínima a la antena (r): ${r.toFixed(
      2
    )} metros</p>`;
    resultadoDiv.innerHTML += `<p>Distancia horizontal mínima (d): ${d.toFixed(
      2
    )} metros</p>`;
    if (a > r) {
      resultadoDiv.innerHTML += `<p>La distancia vertical (a) es mayor que la distancia mínima a la antena (r). No es necesario calcular la distancia horizontal (d).</p>`;
      mostrarModal(
        "https://www.tesamerica.com/wp-content/uploads/2019/02/aviso-ane-verde-248x300.jpg"
      );
    } else {
      resultadoDiv.innerHTML += `<p>La estación es Normalmente Conforme.</p>`;
      // mostrar otra imagen si se desea
    }
  } else {
    resultadoDiv.innerHTML =
      "<p>Por favor, ingrese valores válidos para la frecuencia, potencia y altura.</p>";
  }
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

  let pire = calcularPIRE(potencia, ganancia);

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
  let isAm = false;
  const requiereMedi = requiereMedicion(
    simulacion.pire,
    simulacion.potencia,
    simulacion.ganancia,
    isAm
  );
  const limiteOcu = limiteOcupacional(simulacion.pire, simulacion.frecuencia);
  const limitePobla = limitePoblacional(simulacion.pire, simulacion.frecuencia);

  const requiereSeñaOcupacional = requiereSeñalizacion(
    limiteOcu,
    calcularDistanciaHorizontal(limiteOcu, simulacion.altura),
    simulacion.altura
  );
  const requiereSeñaPoblacional = requiereSeñalizacion(
    limitePobla,
    calcularDistanciaHorizontal(limitePobla, simulacion.altura),
    simulacion.altura
  );

  console.log(requiereSeñaPoblacional);
  console.log(requiereSeñaOcupacional);

  // Add a new document in collection
  // Add a new document in collection "cities"

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

  let gananciaItem = document.createElement("li");
  gananciaItem.textContent = "Ganancia (dB): " + simulacion.ganancia;

  let frecuenciaItem = document.createElement("li");
  frecuenciaItem.textContent = "Frecuencia (Hz): " + simulacion.frecuencia;

  let pireItem = document.createElement("li");
  pireItem.textContent = "PIRE: " + simulacion.pire.toFixed(2) + " dBm";

  const valMedicion = requiereMedi ? "Si" : "No";
  let medicion = document.createElement("li");
  medicion.textContent = "Necesita medición: " + valMedicion;

  const valOcuacional = limiteOcu !== null ? limiteOcu : 0;
  let limOcuacional = document.createElement("li");
  limOcuacional.textContent =
    "Distancia limite ocupacional es de: " +
    valOcuacional.toFixed(2) +
    " metros";

  const valPoblacional = limitePobla !== null ? limitePobla : 0;
  let limPoblacional = document.createElement("li");
  limPoblacional.textContent =
    "Distancia limite poblacional es de: " +
    valPoblacional.toFixed(2) +
    " metros";

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
  imagen.style.transform = "translate(150%, -0%)"; // Corregir el centro

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
