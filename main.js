var block = document.getElementById("block");
var character = document.getElementById("character");
var puntuacion = document.getElementById("puntuacion"); 
var pantallaInicio = document.getElementById("pantallaInicio");
var botonInicio = document.getElementById("botonInicio");
var counter = 0;
var juegoIniciado = false; // Nueva variable para controlar si el juego ha empezado

/* Cargamos los sonidos */
var gritoSalto = new Audio("assets/sounds/scream_jump.wav"); // Sonido de salto
var sonidoFinal = new Audio("assets/sounds/final.wav");  // Sonido cuando se choca el personaje
var soundtrack = new Audio("assets/sounds/soundtrack.wav"); // Música de fondo

/* Configuración de la música de fondo */
soundtrack.loop = true;
soundtrack.volume = 0.5;

/* Función para actualizar la puntuación en el HTML */
function cambiarPuntuacion(valor) {
    puntuacion.innerHTML = valor;
}

/* Función para los saltos del personaje */
function jump() {
    if (!juegoIniciado) return; // No se puede saltar si el juego no ha empezado

    if (!character.classList.contains("jumping")) {
        character.classList.add("jumping");

        // Reproducir el sonido de salto
        gritoSalto.currentTime = 0;
        gritoSalto.play();

        setTimeout(function () {
            character.classList.remove("jumping");
        }, 600);
    }
}

/* Función para iniciar el juego */
function iniciarJuego() {
    if (juegoIniciado) return; // Evita que el juego se inicie varias veces

    juegoIniciado = true; // Ahora el juego ha comenzado
    pantallaInicio.style.display = "none"; // Oculta la pantalla de inicio
    soundtrack.play();
    block.style.animation = "block 3s linear infinite"; // Activa el movimiento del obstáculo
}

/* Colisión */
var checkDead = setInterval(function () {
    if (!juegoIniciado) return; // No verificar colisiones si el juego no ha empezado

    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

    if (blockLeft < 80 && blockLeft > 30 && characterTop >= 170) {
        block.style.animation = "none";
        juegoIniciado = false; // Detener el juego

        soundtrack.pause();
        soundtrack.currentTime = 0;
        sonidoFinal.currentTime = 0;
        sonidoFinal.play().then(() => {
            alert("Game Over. Score: " + Math.floor(counter / 100));
            counter = 0;
            cambiarPuntuacion(0);
        });
    } else {
        counter++;
        cambiarPuntuacion(Math.floor(counter / 100));
    }
}, 10);

/* Detectar clic en el botón de inicio */
botonInicio.addEventListener("click", iniciarJuego);

/* Detectar tecla para iniciar el juego o saltar */
document.body.addEventListener("keydown", (k) => {
    if (k.code === "Space") {
        if (!juegoIniciado) {
            iniciarJuego();
        } else {
            jump();
        }
    }
});
