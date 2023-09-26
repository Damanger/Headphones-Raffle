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

// Función para manejar la selección de números de boletos
function toggleTicketSelection(event) {
    const ticket = event.target;
    const ticketNumber = parseInt(ticket.textContent);

    // Si el número ya está deshabilitado, no hacemos nada
    if (ticket.disabled) {
        return;
    }

    // Toggle (agregar o eliminar) la selección del número
    if (selectedNumbers.has(ticketNumber)) {
        selectedNumbers.delete(ticketNumber);
    } else {
        selectedNumbers.add(ticketNumber);
    }

    // Agregar o eliminar la clase "selected" para cambiar el color de fondo
    ticket.classList.toggle("selected");

    // Habilitar el botón "Confirmar"
    enableConfirmButton();

}

// Función para habilitar el botón "Confirmar"
function enableConfirmButton() {
    isButtonEnabled = true;
    const confirmButton = document.getElementById("confirm-button");
    confirmButton.style.display = "block";
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

// Llamar a la función para leer el archivo al cargar la página
window.onload = function () {
    readClientFile();
    countdown(); // Iniciar la cuenta regresiva
    generateTicketCalendar(); // Generar el calendario de números
};
