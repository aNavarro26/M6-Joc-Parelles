// Obj
const instructionsBttnObj = document.getElementById("showInstructionsBttn");
const gameBoardObj = document.getElementById("gameBoard");
const scoreLabelObj = document.getElementById("puntsLbl"); // Puntuació més alta
const jugadorActualLbl = document.getElementById("jugadorActualLbl"); // Nom del jugador actual
const puntsActualsLbl = document.getElementById("puntsActualsLbl"); // Punts de la partida actual
let jugadorLblObj = document.getElementById("jugadorLbl"); // Nom del jugador amb la puntuació més alta

// Var
const colorSaved = sessionStorage.getItem("backgroundColor");
const pairs = 10; // Número de parelles
const cardValues = [];
const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let points = 0;
let flippedCards = [];
let matchedPairs = 0;

// Events
if (instructionsBttnObj) {
    instructionsBttnObj.addEventListener("click", showInstructions);
}

// Canal de comunicació
const broadcastChannel = new BroadcastChannel("gameScoreChannel");

// Inicio el joc al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    // si te valor guarda el nom, si no posa Sense Nom
    const playerName = getCookie("nomJugador") || "Sense Nom";
    jugadorActualLbl.textContent = `NOM: ${playerName}`;
    puntsActualsLbl.textContent = points; // Inicialitza els punts a 0
    displayHighScore(); // Mostra la puntuació més alta
    broadcastChannel.postMessage({ type: "startGame", data: { playerName } }); // Envio el message
    applyBackgroundColor();
    createGameBoard(); // Creo ja el tauler
});


function displayHighScore() {
    // si no hi ha puntuació, indico 0
    const highScore = localStorage.getItem("highScore") || 0;
    const highScorePlayer = localStorage.getItem("highScorePlayer") || "Sense Nom";
    jugadorLblObj.textContent = `JUGADOR: ${highScorePlayer}`;
    scoreLabelObj.textContent = `PUNTS: ${highScore}`;
}

// Actualitzo la puntuació i la envio per canal
function updateScore(scoreChange) {
    points = Math.max(0, points + scoreChange); // No permito que hi hagi punts negatius
    puntsActualsLbl.textContent = points;
    const playerName = getCookie("nomJugador") || "Sense Nom";
    broadcastChannel.postMessage({ type: "updateScore", data: { playerName, points } }); // Envio els punts
}

function endGame() {
    updateHighScore(); // per si s'ha d'actualitzar el highScore
    const playerName = getCookie("nomJugador") || "Sense Nom"; // si no troba la cookie posa "Sense Nom"
    broadcastChannel.postMessage({ type: "endGame", data: { playerName, points } }); // envio
    alert("Partida Terminada! Redireccionant a la página de resultats...");
    window.location.href = "/resultats.html";
}

function updateHighScore() {
    // agafo del localstorage el valor actual
    const highScore = localStorage.getItem("highScore") || 0;

    if (points > highScore) {
        const playerName = getCookie("nomJugador") || "Sense Nom";
        // set del nou highscore i qui usuari ha sigut
        localStorage.setItem("highScore", points);
        localStorage.setItem("highScorePlayer", playerName);
        jugadorLblObj.textContent = `JUGADOR: ${playerName}`;
        scoreLabelObj.textContent = `PUNTS: ${points}`;
    }
}

function applyBackgroundColor() {
    document.body.style.backgroundColor = colorSaved || "white";
}

// Mostrar Instruccions
function showInstructions() {
    window.open("/instruccions.html", "Instrucciones", "width=400,height=400");
}


function getCookie(name) {
    // faig una array de les cookies
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        // si la key coincideix, agafa la cookie. ha de ser "nomJugador"
        if (key === name) {
            return value;
        }
    }
    return null;
}

function createGameBoard() {
    // Limpio el tauler sempre
    gameBoardObj.innerHTML = "";

    // Creo parelles de lletres y les mezclo
    for (let i = 0; i < pairs; i++) {
        cardValues.push(letras[i]);
        cardValues.push(letras[i]);
    }
    // funció anonima amb arrow function
    cardValues.sort(() => Math.random() - 0.5); // Mezclo las cartas

    // Creo las cartas y las poso al tauler
    for (let index = 0; index < cardValues.length; index++) {
        const value = cardValues[index];
        const card = document.createElement("div");
        card.classList.add("card"); // per a que apliqui els meus estils del css
        card.dataset.value = value; // per accedir al atribut value amb dataset
        card.addEventListener("click", cardClick);
        gameBoardObj.appendChild(card);
    }
}

function cardClick(event) {
    // amb event agafa la referencia, agafa tot l'objecte html
    // target per agafar quina carta ha fet click
    const card = event.target;

    // si te la classe disabled o si ja està girada
    if (card.classList.contains("disabled") || flippedCards.includes(card)) return;

    // Girar Carta
    card.textContent = card.dataset.value;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            card1.classList.add("disabled", "paired");
            card2.classList.add("disabled", "paired");
            updateScore(10); // Sumo punts
            matchedPairs++;
            if (matchedPairs === pairs) endGame(); // Verificar fin de partida
        } else {
            updateScore(-3); // Restar punts
            // ChatGPT, per a que tingui uns ms abans de posar ""
            setTimeout(() => {
                card1.textContent = "";
                card2.textContent = "";
            }, 500);
        }
        flippedCards = [];
    }
}
