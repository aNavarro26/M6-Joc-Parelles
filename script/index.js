// mostrarObj.addEventListener("click", function sin ())

// Objectes
const startGameObj = document.getElementById("startBttn");
const deleteGameObj = document.getElementById("deleteBttn");
const nameInputObj = document.getElementById("nameInput");
const browserInfoObj = document.getElementById("browserInfo");
const urlInfoObj = document.getElementById("urlInfo");
const gameStatus = document.getElementById("gameStatus");
const jugadorLblObj = document.getElementById("jugadorLblObj");
const puntsActualsLbl = document.getElementById("puntsActualsLbl");
const estatPartidaLbl = document.getElementById("estatPartidaLbl");



// Events
startGameObj.addEventListener("click", startGame);
deleteGameObj.addEventListener("click", deleteGame);
deleteGameObj.addEventListener("click", clearGameData);

// Constant del canal de comunicació
const broadcastChannel = new BroadcastChannel("gameScoreChannel");

// Variables i Constants (No son objectes del HTML)
const userAgent = navigator.userAgent;
const urlInfo = location.href;
let gameWindow;

// Insereixo en la lbl el useragent i la url
browserInfoObj.textContent = userAgent;
urlInfoObj.textContent = urlInfo;


broadcastChannel.onmessage = (event) => {
    const { type, data } = event.data;

    if (type === "updateScore") {
        puntsActualsLbl.textContent = `PUNTS: ${data.points}`;
        estatPartidaLbl.textContent = "ESTAT PARTIDA: En joc";
    } else if (type === "endGame") {
        estatPartidaLbl.textContent = "ESTAT PARTIDA: Partida Terminada";
    } else if (type === "startGame") {
        jugadorLblObj.textContent = `NOM: ${data.playerName}`;
        puntsActualsLbl.textContent = "PUNTS: 0";
        estatPartidaLbl.textContent = "ESTAT PARTIDA: En joc";
    }
};


function startGame() {
    // si te valor
    if (nameInputObj.value) {
        // Guardo el nom en una cookie
        saveNameCookie(nameInputObj.value);

        if (gameWindow && !gameWindow.closed) {
            // Si ja hi ha una finestra oberta
            alert("Ya hi ha una partida començada. Tancant la finestra actual.");
            gameWindow.close(); // tanco la finestra actual
        }

        console.log("Començar partida");

        setBackgroundColorByBrowser()

        gameWindow = window.open("joc.html");
    } else {
        alert("Has de posar un nom de jugador");
    }
}

function deleteGame() {
    if (gameWindow) {
        gameWindow.close();
        gameWindow = null;

        estatPartidaLbl.textContent = "ESTAT PARTIDA: No hi ha cap partida en joc";
        puntsActualsLbl.textContent = "PUNTS: 0";
        jugadorLblObj.textContent = "NOM: ";
    } else {
        alert("No hi ha partida per tancar.");
    }
}

function saveNameCookie(nom) {
    const expirationDays = 7;
    const date = new Date();

    // creo la data d'expiració dinamicament agafant el getTime i posant-ho en ms
    // 24: horas en un día.
    // 60: minuts en una hora.
    // 60: segons en un minut.
    // 1000: Número de milisegons en un segundo.
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));

    // La funció "toUTCString()" fa el format del date de manera que el navegador ho agafi bé
    // exemple: Fri, 08 Nov 2024 12:00:00 GMT
    const expiration = "expires=" + date.toUTCString();

    // aquí guardo ja la cookie concatenant les dades
    document.cookie = "nomJugador=" + nom + ";" + expiration + ";path=/"; // el path es per indicar per on es podrà accedir a la cookie
}

function setBackgroundColorByBrowser() {
    let color;
    // Color segons el navegador
    if (navigator.userAgent.includes("Firefox")) {
        color = "lightblue";  // Color per a Firefox
    } else if (navigator.userAgent.includes("Chrome")) {
        color = "orange"; // Color per a Chrome
    } else {
        color = "white"; // Color per defecte
    }

    // Al sessionStorage per a que no es guardi quan s'elimini
    sessionStorage.setItem("backgroundColor", color)
}

function clearGameData() {
    sessionStorage.clear();
    localStorage.removeItem("highScore");
    localStorage.removeItem("highScorePlayer");

    document.getElementById("puntsActualsLbl").textContent = "No hi ha cap partida en joc";

    if (gameWindow) {
        gameWindow.close();
    }
}
