// Configuración del lienzo y contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamaños de la pala y la pelota
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 100; // Tamaño de la pelota

// Ajustar el tamaño del lienzo
canvas.width = 600; // Ancho fijo del lienzo
canvas.height = 400; // Alto fijo del lienzo

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

// Cargar el archivo de audio
const reboundSound = new Audio('nohayplata2.mp3'); // Sonido de rebote
reboundSound.loop = true; // Hacer que el sonido se reproduzca en bucle

// Cargar la imagen de la pelota
const ballImage = new Image();
ballImage.src = 'pelota2.jpg'; // Cambia esto al nombre de tu imagen

// Función para dibujar el juego
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibuja las palas
    ctx.fillStyle = "black";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight); // Pala izquierda
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight); // Pala derecha

    // Dibuja la pelota como un círculo
    ctx.save();
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2); // Cambia a arc para crear un círculo
    ctx.clip(); // Recorta el canvas al área del círculo
    ctx.drawImage(ballImage, ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize); // Dibuja la imagen
    ctx.restore();

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
    } else if (event.key === "a") {
        leftPaddleY -= paddleSpeed;
    } else if (event.key === "z") {
        leftPaddleY += paddleSpeed;
    }

    // Limitar el movimiento de las palas
    rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));
    leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddleY));
    
    // Reproducir el sonido cuando se presiona cualquier tecla
    if (reboundSound.paused) {
        reboundSound.play(); // Reproducir el sonido solo si está en pausa
    }
});

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
