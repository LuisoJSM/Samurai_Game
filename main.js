var block = document.getElementById("block");
var character = document.getElementById("character");
var puntuacion = document.getElementById("puntuacion"); 
var counter = 0;

/* Cargar los sonidos */
var gritoSalto = new Audio("assets/sounds/scream_jump.wav"); // Sonido de salto
var sonidoFinal = new Audio("assets/sounds/final.wav");  // Sonido cuando se acaba el juego
var soundtrack = new Audio("assets/sounds/soundtrack.wav"); // Música de fondo

/* Configuración de la música de fondo */
soundtrack.loop = true; // Hace que la música se repita automáticamente
soundtrack.volume = 0.5; // Ajusta el volumen al 50%

/* Función para actualizar la puntuación en el HTML */
function cambiarPuntuacion(valor) {
    puntuacion.innerHTML = valor;
}

/* Función para hacer que el personaje salte y reproducir el sonido */
function jump() {
    if (!character.classList.contains("jumping")) {
        character.classList.add("jumping");

        // Reproducir el sonido de salto
        gritoSalto.currentTime = 0; // Reinicia el sonido si ya está reproduciéndose
        gritoSalto.play();

        setTimeout(function () {
            character.classList.remove("jumping");
        }, 600);
    }
}

/* Función para iniciar la música cuando el juego comienza */
function iniciarJuego() {
    soundtrack.play(); // Inicia la música de fondo
}

/* Verificación de colisión mejorada */
var checkDead = setInterval(function () {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

    if (blockLeft < 80 && blockLeft > 30 && characterTop >= 170) {
        block.style.animation = "none";

        // Detener la música y reproducir el sonido final
        soundtrack.pause();
        soundtrack.currentTime = 0;
        sonidoFinal.currentTime = 0;
        sonidoFinal.play().then(() => {
            alert("Game Over. Score: " + Math.floor(counter / 100));
            counter = 0;
            cambiarPuntuacion(0);
            block.style.animation = "block 3s linear infinite";
        });

    } else {
        counter++;
        cambiarPuntuacion(Math.floor(counter / 100));
    }
}, 10);

/* Detectar tecla para saltar */
document.body.addEventListener("keydown", (k) => {
    if (k.code === "Space") {
        jump();
        if (soundtrack.paused) {
            iniciarJuego(); // Inicia la música si aún no ha comenzado
        }
    }
});
