// Configuración del lienzo y contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamaños de la pala y la pelota
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 120; // Tamaño de la pelota

// Ajustar el tamaño del lienzo
canvas.width = 600; // Ancho del lienzo
canvas.height = 400; // Alto del lienzo

// Posiciones iniciales
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

// Velocidad de la pala y la pelota
const paddleSpeed = 20;
let ballSpeedX = 4;
let ballSpeedY = 4;

// Puntuación
let leftScore = 0;
let rightScore = 0;

// Cargar el archivo de audio con ruta absoluta
const backgroundSound = new Audio('C:/Users/nprieto/Escritorio/nohayplata.mp3'); // Ruta de la canción
backgroundSound.loop = true; // Configurar para reproducir en bucle
backgroundSound.play(); // Iniciar el audio

// Cargar la imagen de la pelota con ruta absoluta
const ballImage = new Image();
ballImage.src = 'C:/Users/nprieto/Escritorio/pelota.jpg';

// Función para dibujar el juego
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibuja las palas
    ctx.fillStyle = "black";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight); // Pala izquierda
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight); // Pala derecha

    // Dibuja la pelota
    ctx.drawImage(ballImage, ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);

    // Dibuja la puntuación
    ctx.font = "20px Arial";
    ctx.fillText(`Izquierda: ${leftScore}`, 20, 30);
    ctx.fillText(`Derecha: ${rightScore}`, canvas.width - 120, 30);
}

// Función para actualizar la posición de la pelota
function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Colisiones con las paredes
    if (ballY + ballSize / 2 >= canvas.height || ballY - ballSize / 2 <= 0) {
        ballSpeedY = -ballSpeedY; // Rebote vertical
    }

    // Colisiones con las palas
    if (
        ballX - ballSize / 2 <= paddleWidth && 
        ballY >= leftPaddleY && 
        ballY <= leftPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX; // Rebote en la pala izquierda
    }

    if (
        ballX + ballSize / 2 >= canvas.width - paddleWidth && 
        ballY >= rightPaddleY && 
        ballY <= rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX; // Rebote en la pala derecha
    }

    // Puntos y reinicio de la pelota
    if (ballX + ballSize / 2 < 0) {
        rightScore++; // Puntuación derecha
        resetBall();
    } else if (ballX - ballSize / 2 > canvas.width) {
        leftScore++; // Puntuación izquierda
        resetBall();
    }
}

// Función para reiniciar la pelota
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Cambiar la dirección
}

// Manejo de eventos de teclado
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        rightPaddleY -= paddleSpeed;
    } else if (event.key === "ArrowDown") {
        rightPaddleY += paddleSpeed;
    }

    // Limitar el movimiento de la pala derecha
    rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));
});

// Lógica de control táctil
document.getElementById("leftPaddleUp").addEventListener("click", function() {
    leftPaddleY -= paddleSpeed; // Mueve la pala izquierda hacia arriba
});

document.getElementById("leftPaddleDown").addEventListener("click", function() {
    leftPaddleY += paddleSpeed; // Mueve la pala izquierda hacia abajo
});

document.getElementById("rightPaddleUp").addEventListener("click", function() {
    rightPaddleY -= paddleSpeed; // Mueve la pala derecha hacia arriba
});

document.getElementById("rightPaddleDown").addEventListener("click", function() {
    rightPaddleY += paddleSpeed; // Mueve la pala derecha hacia abajo
});

// Mantener las palas dentro del campo
leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddleY));
rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));

// Función principal
function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

// Iniciar el juego cuando la imagen se carga
ballImage.onload = () => {
    gameLoop();
};
