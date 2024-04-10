export * from "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
export * from "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario-comentario");
  const btnEnviar = document.getElementById("btnEnviar");

  btnEnviar.addEventListener("click", function (event) {
    event.preventDefault(); // Detiene el comportamiento predeterminado del botón (enviar el formulario)
    addComment(); // Llama a la función addComment
  });
});

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

const commentsRef = db.collection("comments");

function addComment() {
  const name = document.getElementById("name-input").value;
  const comment = document.getElementById("texto-comentario").value;

  // Añade el comentario a Firestore
  commentsRef
    .add({
      name: name,
      comment: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log("Comentario agregado correctamente");
      document.getElementById("name-input").value = "";
      document.getElementById("texto-comentario").value = "";
    })
    .catch((error) => {
      console.error("Error al agregar comentario: ", error);
    });
}

// Escucha los cambios en la colección de comentarios
commentsRef.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
  const commentsList = document.getElementById("comments-list");
  commentsList.innerHTML = "";
  snapshot.forEach((doc) => {
    const commentData = doc.data();
    if (commentData.timestamp) {
      // Verifica si timestamp no es null
      const commentElement = document.createElement("div");
      const timestamp = commentData.timestamp.toDate(); // Convierte el timestamp a un objeto de fecha
      commentElement.innerHTML = `
            <strong>${commentData.name}</strong>: ${commentData.comment}<br>
            <small>${timestamp.toLocaleString()}</small>
        `;
      commentsList.appendChild(commentElement);
    }
  });
});
