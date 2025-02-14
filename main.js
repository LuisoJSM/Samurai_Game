var block = document.getElementById("block");
var character = document.getElementById("character");
var puntuacion = document.getElementById("puntuacion");
var pantallaInicio = document.getElementById("pantallaInicio");
var botonInicio = document.getElementById("botonInicio");
var counter = 0;
var juegoIniciado = false; // Variable para controlar si el juego ha empezado

/* Cargamos los sonidos */
var sonidoFinal = new Audio("assets/sounds/final.wav");  // Sonido cuando se choca el personaje
var soundtrack = new Audio("assets/sounds/soundtrack.wav"); // Música de fondo
var insertCoin = new Audio("assets/sounds/insert_coin.mp3"); // Sonido insertar moneda
var jump1 = new Audio("assets/sounds/jump1.wav"); // Sonido salto 1
var jump2 = new Audio("assets/sounds/jump2.wav"); // Sonido salto 2
var jump3 = new Audio("assets/sounds/jump3.wav"); // Sonido salto 3

/* Configuración de la música de fondo */
soundtrack.loop = true;
soundtrack.volume = 0.5;

/* Función para actualizar la puntuación en el HTML */
function cambiarPuntuacion(valor) {
    puntuacion.innerHTML = valor;
}

/* Función para generar un número aleatorio y alternar los sonidos de los saltos */
function generarAleatorio(callback) {
    var numero = Math.floor(Math.random() * 3) + 1; // Genera un número entre 1 y 3
    callback(numero);
}

/* Función callback que le paso a generarAleatorio */
function resolverSonido(numero) {
    if (numero === 1) {
        jump1.currentTime = 0;
        jump1.play();
    } else if (numero === 2) {
        jump2.currentTime = 0;
        jump2.play();
    } else if (numero === 3) {
        jump3.currentTime = 0;
        jump3.play();
    }
}

/* Función para los saltos del personaje */
function jump() {
    if (!juegoIniciado) return; // No se puede saltar si el juego no ha empezado

    if (!character.classList.contains("jumping")) {
        character.classList.add("jumping");

        generarAleatorio(resolverSonido); // Genera sonidos aleatorios

        setTimeout(function () {
            character.classList.remove("jumping");
        }, 600);
    }
}

/* Función para iniciar el juego */
function iniciarJuego() {
    insertCoin.play();
    if (juegoIniciado) return; // Evita que el juego se inicie varias veces

    juegoIniciado = true; // Ahora el juego ha comenzado
    pantallaInicio.style.display = "none"; // Oculta la pantalla de inicio
    soundtrack.play();
    block.style.animation = "block 3s linear infinite"; // Activa el movimiento del obstáculo
}

/* Colisión */
// Se crea un intervalo que ejecutará la función cada 10 milisegundos (controla colisiones y la puntuación).
var checkDead = setInterval(function () {
    // Si el juego no ha comenzado (`juegoIniciado` es `false`), no hace nada y se detiene aquí.
    if (!juegoIniciado) return;

    // Obtiene la posición vertical (top) actual del personaje en píxeles.
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));

    // Obtiene la posición horizontal (left) actual del obstáculo en píxeles.
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

    // Verifica si el personaje ha chocado con el obstáculo.
    // Esto ocurre cuando:
    // - El bloque está entre `30px` y `65px` de `left` (zona de colisión horizontal).
    // - El personaje está a una altura mayor o igual a `170px` (zona de colisión vertical, es decir, no está saltando lo suficiente).
    if (blockLeft < 65 && blockLeft > 30 && characterTop >= 170) {
        // Detiene la animación del obstáculo para que se quede quieto cuando el jugador pierde.
        block.style.animation = "none";

        // Cambia `juegoIniciado` a `false`, deteniendo la detección de colisiones y la puntuación.
        juegoIniciado = false;

        // Detiene la música de fondo y la reinicia para que cuando se vuelva a jugar empiece desde el inicio.
        soundtrack.pause();
        soundtrack.currentTime = 0;

        // Reinicia el sonido final y lo reproduce.
        sonidoFinal.currentTime = 0;
        sonidoFinal.play().then(() => {
            // Muestra una alerta con el mensaje de "Game Over" y la puntuación actual del jugador.
            alert("Game Over. Score: " + Math.floor(counter / 100));

            // Reinicia el contador de puntuación a 0.
            counter = 0;

            // Actualiza la puntuación en la pantalla, mostrándola como 0.
            cambiarPuntuacion(0);
        });
    } else {
        // Si el jugador no ha chocado con el obstáculo, incrementa la puntuación.
        counter++;

        // Convierte la puntuación en un número redondeado y la actualiza en la pantalla.
        cambiarPuntuacion(Math.floor(counter / 100));
    }
}, 10); // Esta función se ejecuta cada 10ms para detectar colisiones y actualizar la puntuación.

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
