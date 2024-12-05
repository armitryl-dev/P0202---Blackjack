// Variables globales
let baraja = []; // Arreglo que contendrá la baraja mezclada
let puntosJugador01 = 0; // Puntos acumulados del Jugador 01
let puntosComputadora = 0; // Puntos acumulados de la Computadora

// Referencias a los botones y elementos en el HTML
const btnPedir = document.querySelector('#btnPedir');
const btnPasar = document.querySelector('#btnPasar');
const btnNuevoJuego = document.querySelector('#btnNuevoJuego');

// Referencias a los elementos HTML donde se mostrarán los puntos
const puntosHTMLJugador01 = document.querySelector('.jugador01 small');
const puntosHTMLComputadora = document.querySelector('.computadora small');

// Referencias a los divs donde se mostrarán las cartas de cada jugador
const divCartasJugador01 = document.querySelector('#jugador01-cartas');
const divCartasComputadora = document.querySelector('#computadoras-cartas');

// Funciones

// Crea una baraja de cartas y la mezcla de forma aleatoria
function crearBarajaAleatoria() {
    // Definición de las cartas de la baraja (con cuatro palos: C (corazones), D (diamantes), P (picas), T (tréboles))
    let cartas = [
        '01C', '02C', '03C', '04C', '05C', '06C', '07C', '08C', '09C', '10C', '10JC', '10QC', '10KC',
        '01D', '02D', '03D', '04D', '05D', '06D', '07D', '08D', '09D', '10D', '10JD', '10QD', '10KD',
        '01P', '02P', '03P', '04P', '05P', '06P', '07P', '08P', '09P', '10P', '10JP', '10QP', '10KP',
        '01T', '02T', '03T', '04T', '05T', '06T', '07T', '08T', '09T', '10T', '10JT', '10QT', '10KT'
    ];

    // Mezcla la baraja de manera aleatoria y la devuelve
    return cartas.sort(() => Math.random() - 0.5);
}

// Pide una carta de la baraja (saca una del final del array)
const pedirCarta = () => {
    if (baraja.length === 0) throw 'No hay cartas en la baraja'; // Error si no hay cartas
    return baraja.pop(); // Remueve y devuelve la última carta de la baraja
}

// Calcula el valor de una carta basándose en el valor numérico
const valorCarta = (carta) => {
    const valor = carta.substring(0, 2); // Extrae los primeros dos caracteres de la carta (el valor)
    // Si no es un número (J, Q, K valen 10, el As puede valer 11 o 1)
    return (isNaN(valor)) ? (valor === '01' ? 11 : 10) : parseInt(valor); 
}

// Actualiza los puntos en pantalla y los acumula
const actualizarPuntos = (jugador, puntos) => {
    if (jugador === 'jugador01') {
        puntosJugador01 += puntos; // Suma puntos al Jugador 01
        puntosHTMLJugador01.innerText = puntosJugador01; // Actualiza el marcador del jugador
    } else {
        puntosComputadora += puntos; // Suma puntos a la computadora
        puntosHTMLComputadora.innerText = puntosComputadora; // Actualiza el marcador de la computadora
    }
}

// Muestra la carta en la pantalla para el jugador correspondiente
const mostrarCarta = (jugador, carta) => {
    const imgCarta = document.createElement('img'); // Crea un elemento <img> para la carta
    imgCarta.src = `assets/cartas/${carta}.png`; // Establece la imagen correspondiente a la carta
    imgCarta.classList.add('carta'); // Añade la clase CSS 'carta'

    // Añade la carta al div correspondiente del jugador o de la computadora
    if (jugador === 'jugador01') {
        divCartasJugador01.append(imgCarta);
    } else {
        divCartasComputadora.append(imgCarta);
    }
}

// Muestra cartas ocultas al inicio del juego con los dorsos hacia arriba
const mostrarCartasOcultas = () => {
    // Limpia las cartas previas
    divCartasJugador01.innerHTML = '';
    divCartasComputadora.innerHTML = '';

    // Crear las cartas con el dorso para ambos jugadores
    const imgJugador01 = document.createElement('img');
    imgJugador01.src = 'assets/cartas/red_back.png'; // Carta oculta (jugador)
    imgJugador01.classList.add('carta');
    divCartasJugador01.append(imgJugador01);

    const imgComputadora = document.createElement('img');
    imgComputadora.src = 'assets/cartas/grey_back.png'; // Carta oculta (computadora)
    imgComputadora.classList.add('carta');
    divCartasComputadora.append(imgComputadora);
}

// Turno de la computadora: sigue pidiendo cartas hasta que supere o iguale los puntos mínimos
const turnoComputadora = (puntosMinimos) => {
    while (puntosComputadora < puntosMinimos && puntosComputadora <= 21) {
        const carta = pedirCarta(); // La computadora pide una carta
        const valor = valorCarta(carta); // Se calcula el valor de la carta
        actualizarPuntos('computadora', valor); // Se actualizan los puntos de la computadora
        mostrarCarta('computadora', carta); // Se muestra la carta
    }

    // Después de un pequeño retraso, se determina el resultado del juego
    setTimeout(() => {
        if (puntosComputadora === puntosMinimos) {
            alert('Empate'); // Empate si los puntos son iguales
        } else if (puntosMinimos > 21) {
            alert('¡Gana la banca!'); // Gana la computadora si el jugador se pasa de 21
        } else if (puntosComputadora > 21 || puntosComputadora < puntosMinimos) {
            alert('¡Gana el jugador!'); // Gana el jugador si la computadora se pasa o tiene menos puntos
        } else {
            alert('¡Gana la banca!'); // Gana la computadora en cualquier otro caso
        }

        // Deshabilita los botones después de terminar el juego
        btnPedir.disabled = true;
        btnPasar.disabled = true;
        btnPedir.classList.add('boton-deshabilitado');
        btnPasar.classList.add('boton-deshabilitado');
    }, 200); // Retraso de 200ms para la visualización
}

// Eventos

// Evento: Pedir Carta
btnPedir.addEventListener('click', () => {
    const carta = pedirCarta(); // El jugador pide una carta
    const valor = valorCarta(carta); // Se calcula el valor de la carta
    actualizarPuntos('jugador01', valor); // Se actualizan los puntos del jugador
    mostrarCarta('jugador01', carta); // Se muestra la carta en pantalla

    // Se habilita el botón "Pasar" al pedir una carta
    btnPasar.disabled = false;
    btnPasar.classList.remove('boton-deshabilitado');

    // Si el jugador excede los 21 puntos, la computadora toma su turno
    if (puntosJugador01 > 21) {
        btnPedir.disabled = true;
        btnPasar.disabled = true;
        btnPedir.classList.add('boton-deshabilitado');
        btnPasar.classList.add('boton-deshabilitado');
        turnoComputadora(puntosJugador01); // La computadora juega
    }
});

// Evento: Pasar Turno
btnPasar.addEventListener('click', () => {
    btnPedir.disabled = true; // Se deshabilitan ambos botones al pasar turno
    btnPasar.disabled = true;
    turnoComputadora(puntosJugador01); // La computadora juega
});

// Evento: Nuevo Juego
btnNuevoJuego.addEventListener('click', () => {
    // Resetea el juego a su estado inicial
    baraja = crearBarajaAleatoria(); // Se crea una nueva baraja mezclada
    puntosJugador01 = 0; // Resetea los puntos del jugador
    puntosComputadora = 0; // Resetea los puntos de la computadora

    // Resetea los puntos en la interfaz de usuario
    puntosHTMLJugador01.innerText = '0';
    puntosHTMLComputadora.innerText = '0';

    // Muestra las cartas ocultas al inicio
    mostrarCartasOcultas();

    // Habilita el botón "Pedir" y deshabilita "Pasar"
    btnPedir.disabled = false;
    btnPasar.disabled = true;
    btnPedir.classList.remove('boton-deshabilitado');
    btnPasar.classList.add('boton-deshabilitado');
});

// Código principal que se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    baraja = crearBarajaAleatoria(); // Crea una baraja ya mezclada al cargar la página
    mostrarCartasOcultas(); // Muestra las cartas ocultas inicialmente

    // Habilita el botón "Pedir" y deshabilita "Pasar"
    btnPedir.disabled = false;
    btnPasar.disabled = true;
    btnPasar.classList.add('boton-deshabilitado'); // Añade la clase de deshabilitado desde el inicio
});
