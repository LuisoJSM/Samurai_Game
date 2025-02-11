var block = document.getElementById("block");
// Obtiene el elemento con id "block" y lo almacena en la variable "block"

var character = document.getElementById("character");
// Obtiene el elemento con id "character" y lo almacena en la variable "character"

var counter = 0;
// Variable para contar la puntuación del jugador

function jump() {
    // Función que maneja el salto del personaje
    if (!character.classList.contains("jumping")) {
        // Verifica si el personaje ya está saltando
        character.classList.add("jumping");
        // Si no está saltando, le agrega la clase "jumping"
    }

    setTimeout(function () {
        // Después de 600ms, se elimina la clase "jumping"
        character.classList.remove("jumping");
    }, 600);
}

var checkDead = setInterval(function () {
    // Establece un intervalo para verificar colisiones cada 10ms

    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    // Obtiene la posición superior del personaje en píxeles

    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    // Obtiene la posición izquierda del bloque en píxeles

    if (blockLeft < 80 && blockLeft > 30 && characterTop >= 52) {
        // Verifica si el bloque está en la zona de colisión y si el personaje está demasiado bajo
        block.style.animation = "none";
        // Detiene la animación del bloque
        alert("Game Over. Score: " + Math.floor(counter / 100));
        // Muestra un mensaje de "Game Over" con la puntuación del jugador
        counter = 0;
        // Reinicia el contador
        block.style.animation = "block 3s linear infinite";
        // Restablece la animación del bloque
    } else {
        counter++;
        // Incrementa el contador si el jugador sigue vivo
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter / 100);
        // Actualiza la puntuación en el HTML
    }
}, 10);

document.body.addEventListener("keydown", (k) => {
    // Escucha eventos de teclado en el documento
    console.log(k);
    // Muestra en la consola qué tecla se presionó
    if (k.code === "Space") {
        // Si la tecla presionada es "Espacio"
        jump();
        // Ejecuta la función de salto
    }
});
