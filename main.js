//Variables principales del juego
var character = document.getElementById("character"); // Samurai
var puntuacion = document.getElementById("puntuacion"); // Donde se muestra la puntuación
var pantallaInicio = document.getElementById("pantallaInicio"); // Pantalla inicial del juego
var botonInicio = document.getElementById("botonInicio"); // Botón para iniciar el juego
var game = document.getElementById("game"); // Contenedor principal del juego
var counter = 0; // Ppuntuación
var juegoIniciado = false; // Para saber si el juego ha comenzado

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
    } else if (numero===2) {
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
        generarAleatorio(resolverSonido); // Genero sonido aleatorio
        setTimeout(() => character.classList.remove("jumping"), 700); // Quita la animación del salto después de 700ms
    }
}

/* Función para aumentar velocidad del juego */
function aumentarDificultad() {
    return Math.max(1.5, 3 - counter / 1000); //Reduzo la duración dde la animación del bloque
}

/* Función generar bloque aleatorio */
function generarBloque() {
    if (!juegoIniciado) return;

    let block = document.createElement("div");
    block.classList.add("block");
    game.appendChild(block);

    // Aquí se genera la altura aleatoria
    let alturas = ["30px", "50px", "70px"];
    let aleatorioAltura = Math.floor(Math.random() * alturas.length);
    block.style.height = alturas[aleatorioAltura];

    // Animo el bloque con velocidad creciente
    let duracion = aumentarDificultad();
    block.style.animation = `block ${duracion}s linear infinite`;

    // Eliminar bloque cuando salga de pantalla
    block.addEventListener("animationiteration", () => {
        block.remove();
    });

    // Volver a generar otro bloque con un intervalo aleatorio
    let tiempoSiguiente = Math.random() * 1500 + 500;
    setTimeout(generarBloque, tiempoSiguiente);
}

/* Función para Iniciar el juego */
function iniciarJuego() {
    insertCoin.play();
    if (juegoIniciado) return;
    juegoIniciado = true;
    pantallaInicio.style.display = "none";
    soundtrack.play();
    counter = 0;
    cambiarPuntuacion(0);

    // Inicio la generación de bloques
    generarBloque();
}



/* Reiniciar juego después de colisionar */
function reiniciarJuego() {
    juegoIniciado = false;
    
    //Detener la música
    soundtrack.pause();
    soundtrack.currentTime = 0;

    //Eliminar todos los bloques
    document.querySelectorAll(".block").forEach(block => block.remove());

    //Reiniciar la puntuación
    counter = 0;
    cambiarPuntuacion(0);

    //Volver a mostrar la pantalla de inicio
    pantallaInicio.style.display = "flex";
}



/* Comprobar colisión */
var checkDead = setInterval(function () {
    if (!juegoIniciado) return;

    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let bloques = document.getElementsByClassName("block");

    for (let block of bloques) {
        let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

        if (blockLeft < 65 && blockLeft > 30 && characterTop >= 170) {
            juegoIniciado = false;
            soundtrack.pause();
            soundtrack.currentTime = 0;
            sonidoFinal.play().then(() => {
                alert("Game Over. Score: " + Math.floor(counter / 100));
                reiniciarJuego();
            });
            return;
        }
    }

    counter++;
    cambiarPuntuacion(Math.floor(counter / 100));
}, 10);

/* Detectar espacio */
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
