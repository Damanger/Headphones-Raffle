// Función para calcular y mostrar la cuenta regresiva
function countdown() {
    const targetDate = new Date("2023-12-01T00:00:00");
    const currentDate = new Date();
    const timeDifference = targetDate - currentDate;

    if (timeDifference <= 0) {
        document.getElementById("countdown-timer").innerHTML = "<span>00</span>:<span>00</span>:<span>00</span>:<span>00</span>:<span>00</span>";
        return;
    }

    const secondsInMilliSeconds = 1000;
    const minutesInMilliSeconds = secondsInMilliSeconds * 60;
    const hoursInMilliSeconds = minutesInMilliSeconds * 60;
    const daysInMilliSeconds = hoursInMilliSeconds * 24;
    const monthsInMilliSeconds = daysInMilliSeconds * 30.4375; // Aproximadamente 30.44 días por mes promedio

    const months = Math.floor(timeDifference / monthsInMilliSeconds);
    const days = Math.floor((timeDifference % monthsInMilliSeconds) / daysInMilliSeconds);
    const hours = Math.floor((timeDifference % daysInMilliSeconds) / hoursInMilliSeconds);
    const minutes = Math.floor((timeDifference % hoursInMilliSeconds) / minutesInMilliSeconds);
    const seconds = Math.floor((timeDifference % minutesInMilliSeconds) / secondsInMilliSeconds);

    const countdownContainer = document.getElementById("countdown-timer");
    countdownContainer.innerHTML = `
        <div class="countdown-part">
            <div>Meses:</div>
            <span>${months.toString().padStart(2, '0')}</span>
        </div>
        <div class="countdown-part">
            <div>Días:</div>
            <span>${days.toString().padStart(2, '0')}</span>
        </div>
        <div class="countdown-part">
            <div>Horas:</div>
            <span>${hours.toString().padStart(2, '0')}</span>
        </div>
        <div class="countdown-part">
            <div>Minutos:</div>
            <span>${minutes.toString().padStart(2, '0')}</span>
        </div>
        <div class="countdown-part">
            <div>Segundos:</div>
            <span>${seconds.toString().padStart(2, '0')}</span>
        </div>
    `;

    // Actualizar la cuenta regresiva cada segundo
    setTimeout(countdown, 1000);
}

// Variables para rastrear los números seleccionados
const selectedNumbers = new Set();

// Función para generar la lista de números de boletos como un calendario
function generateTicketCalendar() {
    const ticketList = document.getElementById("ticket-numbers");
    for (let i = 1; i <= 200; i++) {
        const listItem = document.createElement("li");
        listItem.textContent = i;
        listItem.addEventListener("click", toggleTicketSelection);
        ticketList.appendChild(listItem);
    }
}

function toggleTicketSelection(event) {
    const ticket = event.target;
    const ticketNumber = parseInt(ticket.textContent);

    // Desseleccionar cualquier número previamente seleccionado
    const selectedTicketNumbers = document.querySelectorAll(".selected");
    for (const selectedTicket of selectedTicketNumbers) {
        selectedTicket.classList.remove("selected");
    }
    selectedNumbers.clear(); // Borrar cualquier número previamente seleccionado

    // Seleccionar el número actual
    selectedNumbers.add(ticketNumber);
    ticket.classList.add("selected");

    // Actualizar el contenido del número de boleto seleccionado y el mensaje
    const selectedTicketNumber = document.getElementById("selected-ticket-number");
    const ticketOwnerName = document.getElementById("ticket-owner-name");

    if (clientData[ticketNumber]) {
        selectedTicketNumber.textContent = ticketNumber;
        ticketOwnerName.textContent = " comprado por: " + clientData[ticketNumber];
    } else {
        selectedTicketNumber.textContent = ticketNumber;
        ticketOwnerName.textContent = " está disponible";
    }
}

// Función para leer el contenido del archivo clientes.txt
function readClientFile() {
    // Crear una instancia de FileReader
    const reader = new FileReader();

    // Configurar una función de devolución de llamada cuando se complete la lectura del archivo
    reader.onload = function(event) {
        // El contenido del archivo está en event.target.result
        const fileContent = event.target.result;

        // Extraer números y nombres del contenido del archivo
        extractNumbersAndNames(fileContent);

        // Marcar los números en el calendario
        markNumbersInCalendar(Object.keys(clientData).map(Number));
    };

    // Leer el contenido del archivo clientes.txt
    fetch('clientes.txt')
        .then(response => response.text())
        .then(data => reader.readAsText(new Blob([data])));
}


// Declara un objeto para almacenar números y nombres
const clientData = {};

// Función para extraer números y nombres del contenido del archivo
function extractNumbersAndNames(fileContent) {
    // Utilizar una expresión regular para encontrar números y nombres en el contenido del archivo
    const regex = /(\d+)\s+([^\n]+)/g;
    const matches = fileContent.matchAll(regex);

    // Iterar sobre las coincidencias y almacenarlas en el objeto clientData
    for (const match of matches) {
        const number = parseInt(match[1]);
        const name = match[2].trim();
        clientData[number] = name;
    }
}

// Función para marcar números en el calendario como azules y mostrar nombres como tooltips
function markNumbersInCalendar(numbers) {
    const ticketList = document.getElementById("ticket-numbers");
    const ticketItems = ticketList.getElementsByTagName("li");

    // Iterar sobre los números en el calendario
    for (const ticketItem of ticketItems) {
        const ticketNumber = parseInt(ticketItem.textContent);

        // Comprobar si el número está en la lista de números del archivo
        if (numbers.includes(ticketNumber)) {
            // Marcar el número como azul
            ticketItem.style.backgroundColor = "#76a57f"; // Color de fondo verde pastel
            ticketItem.style.color = "#fff";
            ticketItem.disabled = true; // Deshabilitar el número

            // Agregar un tooltip con el nombre al hacer hover sobre el número
            ticketItem.setAttribute("title", clientData[ticketNumber]);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Obtiene el elemento <span> que contiene la palabra "Blue"
    const blueSpan = document.querySelector(".blue-span");

    // Variable para rastrear el estado de color actual
    let isBlue = false;

    // Función para cambiar el color de blueSpan
    function toggleColor() {
        if (isBlue) {
            blueSpan.style.color = "white";
        } else {
            blueSpan.style.color = "#5981c6";
        }
            isBlue = !isBlue;
    }

    // Llama a la función toggleColor cada 3 segundos
    setInterval(toggleColor, 3000);
});  

// Llamar a la función para leer el archivo al cargar la página
window.onload = function () {
    readClientFile();
    countdown(); // Iniciar la cuenta regresiva
    generateTicketCalendar(); // Generar el calendario de números
};
