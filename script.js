
const pantalla = document.getElementById("pantalla");
let resultadoMostrado = false;

// Agrega números u operadores a la pantalla

function agregar(valor) {

    // Si hay un resultado o un error en pantalla
    if (resultadoMostrado || pantalla.value === "Error") {

        // Si ingresamos un número o decimal,
        // comenzamos una operación nueva
        if (!isNaN(valor) || valor === ".") {
            pantalla.value = "";
        }

        resultadoMostrado = false;
    }

    pantalla.value += valor;
}


// Limpia toda la pantalla
function limpiar() {
    pantalla.value = "";
    resultadoMostrado = false;
}

// Borra el último carácter
function borrar() {
    pantalla.value = pantalla.value.slice(0, -1);
}

// Realiza el cálculo

function calcular() {
    try {
        let expresion = pantalla.value;

        // Convierte porcentajes
        expresion = expresion.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        // Elimina ceros iniciales innecesarios
        expresion = expresion.replace(
            /\b0+(\d+)/g,
            "$1"
        );

        // Comprueba los caracteres permitidos
        if (!/^[0-9+\-*/().\s]+$/.test(expresion)) {
            throw new Error("Expresión inválida");
        }

        let resultado = Function(
            '"use strict"; return (' + expresion + ')'
        )();

        if (!Number.isFinite(resultado)) {
            throw new Error("Resultado inválido");
        }

        pantalla.value = resultado;
        pantalla.value = resultado;
        resultadoMostrado = true;

    } catch (error) {
    pantalla.value = "Error";
    resultadoMostrado = false;
    }   
}


document.addEventListener("keydown", function(event) {

    const tecla = event.key;

    // Números y operadores
    if ("0123456789+-*/%".includes(tecla)) {
        agregar(tecla);
    }

    // Punto o coma decimal
    else if (tecla === "." || tecla === ",") {
        agregar(".");
    }

    // Calcular resultado
    else if (tecla === "Enter") {
        event.preventDefault();
        calcular();
    }

    // Borrar último carácter
    else if (tecla === "Backspace") {
        borrar();
    }

    // Limpiar pantalla
    else if (tecla === "Escape") {
        limpiar();
    }

});


// Relaciona las teclas físicas con los botones visuales
const mapaTeclas = {
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷",
    "%": "%",
    ".": ".",
    ",": ".",
    "Enter": "=",
    "Backspace": "⌫",
    "Escape": "C"
};

// Busca el botón correspondiente
function obtenerBoton(tecla) {

    const valor = mapaTeclas[tecla];

    if (!valor) return null;

    const botones = document.querySelectorAll(".botones button");

    return [...botones].find(
        boton => boton.textContent.trim() === valor
    );
}

// Al presionar una tecla
document.addEventListener("keydown", function(event) {

    const boton = obtenerBoton(event.key);

    if (boton) {
        boton.classList.add("presionado");
    }

});

// Al soltar una tecla
document.addEventListener("keyup", function(event) {

    const boton = obtenerBoton(event.key);

    if (boton) {
        boton.classList.remove("presionado");
    }

});

// Si se pierde el foco de la ventana,
// liberamos todos los botones
window.addEventListener("blur", function() {

    document.querySelectorAll(".presionado").forEach(boton => {
        boton.classList.remove("presionado");
    });

});
