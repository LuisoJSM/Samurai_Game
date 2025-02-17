var block = document.getElementById("block");
var character = document.getElementById("character");
var puntuacion = document.getElementById("puntuacion");
var pantallaInicio = document.getElementById("pantallaInicio");
var botonInicio = document.getElementById("botonInicio");
var counter = 0;
var juegoIniciado = false;

/* 🎵 Sonidos */
var sonidoFinal = new Audio("assets/sounds/final.wav");
var soundtrack = new Audio("assets/sounds/soundtrack.wav");
var insertCoin = new Audio("assets/sounds/insert_coin.mp3");
var jump1 = new Audio("assets/sounds/jump1.wav");
var jump2 = new Audio("assets/sounds/jump2.wav");
var jump3 = new Audio("assets/sounds/jump3.wav");

soundtrack.loop = true;
soundtrack.volume = 0.5;

/* 🏆 Función para actualizar la puntuación */
function cambiarPuntuacion(valor) {
    puntuacion.innerHTML = valor;
}

/* 🎲 Generar sonido aleatorio */
function generarAleatorio(callback) {
    var numero = Math.floor(Math.random() * 3) + 1;
    callback(numero);
}

/* 🔊 Seleccionar sonido de salto */
function resolverSonido(numero) {
    let sonidos = [jump1, jump2, jump3];
    sonidos[numero - 1].currentTime = 0;
    sonidos[numero - 1].play();
}

/* 🦘 Función para hacer saltar al personaje */
function jump() {
    if (!juegoIniciado) return;
    if (!character.classList.contains("jumping")) {
        character.classList.add("jumping");
        generarAleatorio(resolverSonido);
        setTimeout(() => character.classList.remove("jumping"), 700);
    }
}

/* 🚀 Aumentar velocidad del juego */
function aumentarDificultad() {
    let nuevaDuracion = Math.max(1.5, 3 - counter / 1000); // Velocidad mínima de 1.5s
    block.style.animation = `block ${nuevaDuracion}s linear infinite`;
}

/* ⚡ Reiniciar el juego tras perder */
function reiniciarJuego() {
    block.style.animation = "none";
    block.offsetHeight;  // Forzar reflow
    block.style.animation = "block 3s linear infinite";
}

/* 🚧 Generar obstáculos aleatorios */
function cambiarObstaculo() {
    let alturas = ["30px", "50px", "70px"];
    let aleatorio = Math.floor(Math.random() * alturas.length);
    block.style.height = alturas[aleatorio];
}

/* ▶️ Iniciar el juego */
function iniciarJuego() {
    insertCoin.play();
    if (juegoIniciado) return;
    juegoIniciado = true;
    pantallaInicio.style.display = "none";
    soundtrack.play();
    reiniciarJuego();
}

/* 🔥 Comprobar colisión */
var checkDead = setInterval(function () {
    if (!juegoIniciado) return;

    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

    if (blockLeft < 65 && blockLeft > 30 && characterTop >= 170) {
        block.style.animation = "none";
        juegoIniciado = false;
        soundtrack.pause();
        soundtrack.currentTime = 0;
        sonidoFinal.play().then(() => {
            alert("Game Over. Score: " + Math.floor(counter / 100));
            counter = 0;
            cambiarPuntuacion(0);
            reiniciarJuego();
        });
    } else {
        counter++;
        cambiarPuntuacion(Math.floor(counter / 100));
        aumentarDificultad(); // Se ajusta la velocidad del juego
        if (counter % 500 === 0) cambiarObstaculo(); // Cambia obstáculos cada 500 puntos
    }
}, 10);

/* 🎮 Detectar eventos */
botonInicio.addEventListener("click", iniciarJuego);
document.body.addEventListener("keydown", (k) => {
    if (k.code === "Space") {
        if (!juegoIniciado) {
            iniciarJuego();
        } else {
            jump();
        }
    }
});
