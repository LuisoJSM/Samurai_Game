//Variables principales del juego
var character = document.getElementById("character"); // Samurai
var puntuacion = document.getElementById("puntuacion"); // Donde se muestra la puntuación
var pantallaInicio = document.getElementById("pantallaInicio"); // Pantalla inicial del juego
var botonInicio = document.getElementById("botonInicio"); // Botón para iniciar el juego
var game = document.getElementById("game"); // Contenedor principal del juego
var counter = 0; // Puntuación
var juegoIniciado = false; // Para saber si el juego ha comenzado
var pantallaGameOver = document.getElementById("pantallaGameOver");
var botonReiniciar = document.getElementById("botonReiniciar");

/* Sonidos */
var sonidoFinal = new Audio("assets/sounds/final.wav"); // Sonido de colisión
var soundtrack = new Audio("assets/sounds/soundtrack.wav"); // Música de fondo
var insertCoin = new Audio("assets/sounds/insert_coin.mp3"); // Sonido de inicio del juego
var jump1 = new Audio("assets/sounds/jump1.wav"); // Sonido de salto 1
var jump2 = new Audio("assets/sounds/jump2.wav"); // Sonido de salto 2
var jump3 = new Audio("assets/sounds/jump3.wav"); // Sonido de salto 3

soundtrack.loop = true; // repetir música de fondo
soundtrack.volume = 0.5; // Ajustar volumen música de fondo

/* Función para actualizar la puntuación */
function cambiarPuntuacion(valor) {
    puntuacion.innerHTML = valor;
}

/* Función para generar número aleatorio */
function generarAleatorio(callback) {
    var numero = Math.floor(Math.random() * 3) + 1;
    callback(numero);
}

/* Función para elegir uno de los sonidos de salto */
function resolverSonido(numero) {
    if (numero === 1) {
        jump1.currentTime = 0;
        jump1.play();
    } else if (numero === 2) {
        jump2.currentTime = 0;
        jump2.play();
    } else {
        jump3.currentTime = 0;
        jump3.play();
    }
}

/* Función para que el personaje salte */
function jump() {
    if (!juegoIniciado) return;
    if (!character.classList.contains("jumping")) {
        character.classList.add("jumping");
        generarAleatorio(resolverSonido);
        setTimeout(() => character.classList.remove("jumping"), 700);
    }
}

/* Función para aumentar velocidad del juego */
function aumentarDificultad() {
    return Math.max(1.5, 3 - counter / 1000);
}

/* Función generar bloque aleatorio */
function generarBloque() {
    if (!juegoIniciado) return;
    let block = document.createElement("div");
    block.classList.add("block");
    game.appendChild(block);
    let alturas = ["30px", "50px", "70px"];
    let aleatorioAltura = Math.floor(Math.random() * alturas.length);
    block.style.height = alturas[aleatorioAltura];
    let duracion = aumentarDificultad();
    block.style.animation = `block ${duracion}s linear infinite`;
    block.addEventListener("animationiteration", () => {
        block.remove();
    });
    let tiempoSiguiente = Math.random() * 1500 + 500;
    setTimeout(generarBloque, tiempoSiguiente);
}

/* Función para Iniciar el juego */
function iniciarJuego() {
    if (!insertCoin.paused) {
        insertCoin.currentTime = 0;
    }
    insertCoin.play();
    if (juegoIniciado) return;
    juegoIniciado = true;
    pantallaInicio.style.display = "none";
    soundtrack.play();
    counter = 0;
    cambiarPuntuacion(0);
    generarBloque();
    checkDead = setInterval(detectarColision, 10);
}

function reiniciarJuego() {
    juegoIniciado = false;

    // Ocultar pantalla de Game Over
    pantallaGameOver.style.display = "none";

    // Reiniciar la puntuación
    counter = 0;
    cambiarPuntuacion(0);

    // Eliminar todos los bloques
    document.querySelectorAll(".block").forEach(block => block.remove());

    // Restaurar animaciones
    character.style.animation = "";
    document.getElementById("sky").style.animation = "";
    document.getElementById("background").style.animation = "";
    document.getElementById("ground").style.animation = "";

    // **No mostrar pantalla de inicio, sino iniciar directamente**
    pantallaInicio.style.display = "none"; // Asegurar que sigue oculta
    clearInterval(checkDead);
    
    // **Iniciar el juego inmediatamente**
    iniciarJuego();
}

/* Función para detectar colisión */
function detectarColision() {
    if (!juegoIniciado) return;

    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let bloques = document.getElementsByClassName("block");

    for (let block of bloques) {
        let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

        if (blockLeft < 65 && blockLeft > 30 && characterTop >= 170) {
            juegoIniciado = false;
            soundtrack.pause();
            soundtrack.currentTime = 0;

            // **Actualizar la puntuación final antes de mostrar Game Over**
            document.getElementById("puntuacionFinal").innerText = Math.floor(counter / 100);

            // Mostrar pantalla de Game Over
            pantallaGameOver.style.display = "flex";

            // **Parar completamente el juego**
            clearInterval(checkDead);
            document.querySelectorAll(".block").forEach(block => {
                block.style.animation = "none"; // Pausar bloques
            });

            // Pausar el personaje y fondos
            character.style.animation = "none";
            document.getElementById("sky").style.animation = "none";
            document.getElementById("background").style.animation = "none";
            document.getElementById("ground").style.animation = "none";

            return;
        }
    }
    counter++;
    cambiarPuntuacion(Math.floor(counter / 100));
}


var checkDead = setInterval(detectarColision, 10);

botonInicio.addEventListener("click", iniciarJuego);
botonReiniciar.addEventListener("click", () => {
    reiniciarJuego();
    setTimeout(() => iniciarJuego(), 500);
});
document.body.addEventListener("keydown", (k) => {
    if (k.code === "Space") {
        if (!juegoIniciado) {
            iniciarJuego();
        } else {
            jump();
        }
    }
});
