// Configuración del lienzo y contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamaños de la pala y la pelota
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 120;

// Ajustar el tamaño del lienzo
canvas.width = 600;
canvas.height = 400;

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

// Cargar el archivo de audio de fondo
const backgroundSound = new Audio('nohayplata.mp3'); // Ruta al archivo de audio
backgroundSound.loop = true; // Repetir el audio en bucle
let audioStarted = false;

// Cargar la imagen de la pelota
const ballImage = new Image();
ballImage.src = 'pelota.jpg'; // Cambia esto al nombre de tu imagen

// Función para dibujar el juego
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja las palas
    ctx.fillStyle = "black";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

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
        ballSpeedY = -ballSpeedY;
    }

    // Colisiones con las palas
    if (
        ballX - ballSize / 2 <= paddleWidth && 
        ballY >= leftPaddleY && 
        ballY <= leftPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }

    if (
        ballX + ballSize / 2 >= canvas.width - paddleWidth && 
        ballY >= rightPaddleY && 
        ballY <= rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Puntos y reinicio de la pelota
    if (ballX + ballSize / 2 < 0) {
        rightScore++;
        resetBall();
    } else if (ballX - ballSize / 2 > canvas.width) {
        leftScore++;
        resetBall();
    }
}

// Función para reiniciar la pelota
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

// Manejo de eventos de teclado
document.addEventListener("keydown", function(event) {
    // Inicia el audio de fondo en el primer movimiento
    if (!audioStarted) {
        backgroundSound.play();
        audioStarted = true;
    }

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
    leftPaddleY -= paddleSpeed;
});
document.getElementById("leftPaddleDown").addEventListener("click", function() {
    leftPaddleY += paddleSpeed;
});
document.getElementById("rightPaddleUp").addEventListener("click", function() {
    rightPaddleY -= paddleSpeed;
});
document.getElementById("rightPaddleDown").addEventListener("click", function() {
    rightPaddleY += paddleSpeed;
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
