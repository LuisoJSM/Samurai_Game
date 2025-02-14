var block = document.getElementById("block");
var character = document.getElementById("character");
var counter = 0;

/* Función para hacer que el personaje salte */
function jump() {
    if (!character.classList.contains("jumping")) {
        character.classList.add("jumping");
    }

    setTimeout(function () {
        character.classList.remove("jumping");
    }, 600);
}

/* Verificación de colisión mejorada */
var checkDead = setInterval(function () {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

    // Ajustamos la detección para que el personaje solo choque si está realmente en el suelo
    if (blockLeft < 80 && blockLeft > 30 && characterTop >= 170) {
        block.style.animation = "none";
        alert("Game Over. Score: " + Math.floor(counter / 100));
        counter = 0;
        block.style.animation = "block 3s linear infinite";
    } else {
        counter++;
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter / 100);
    }
}, 10);

/* Detectar tecla para saltar */
document.body.addEventListener("keydown", (k) => {
    if (k.code === "Space") {
        jump();
    }
});
