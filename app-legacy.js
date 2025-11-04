// =====================================================
// MÓDULO DE CALCULADORA
// =====================================================

// Variables principales de la calculadora
let buffer = '0';
let memoria = 0;
let ultimoOperador = null;
const historial = [];
const MAX_HISTORY_ITEMS = 5;

// Maneja la entrada numérica
function handleNumber(numStr) {
    if (buffer === '0') {
        buffer = numStr;
    } else {
        buffer += numStr;
    }
    updateScreen();
}

// Maneja los símbolos y operadores
function handleSymbol(symbol) {
    switch (symbol) {
        case 'C':
            buffer = '0';
            memoria = 0;
            ultimoOperador = null;
            break;

        case '=':
            if (ultimoOperador === null) return;
            flushOperationAndLog(parseInt(buffer));
            ultimoOperador = null;
            buffer = memoria.toString();
            memoria = 0;
            break;

        case '+':
        case '-':
        case '*':
        case '/':
            handleMath(symbol);
            break;

        case 'sin':
        case 'cos':
        case 'tan':
            if (buffer === '0') return;
            const valor = parseFloat(buffer);
            let resultadoCientifico;

            if (symbol === 'sin') resultadoCientifico = Math.sin(valor);
            else if (symbol === 'cos') resultadoCientifico = Math.cos(valor);
            else if (symbol === 'tan') resultadoCientifico = Math.tan(valor);

            buffer = resultadoCientifico.toString();
            logHistory(`${symbol}(${valor}) = ${resultadoCientifico}`);
            break;
    }
    updateScreen();
}

// Ejecuta la operación matemática principal
function handleMath(symbol) {
    if (buffer === '0' && memoria === 0) return;

    const intBuffer = parseInt(buffer);
    if (memoria === 0) {
        memoria = intBuffer;
    } else {
        flushOperationAndLog(intBuffer);
    }
    ultimoOperador = symbol;
    buffer = '0';
}

// Realiza la operación y guarda en el historial
function flushOperationAndLog(intBuffer) {
    const operacionPrevia = ultimoOperador;
    const memoriaPrevia = memoria;

    if (ultimoOperador === '+') memoria += intBuffer;
    else if (ultimoOperador === '-') memoria -= intBuffer;
    else if (ultimoOperador === '*') memoria *= intBuffer;
    else if (ultimoOperador === '/') memoria /= intBuffer;

    const logEntry = `${memoriaPrevia} ${operacionPrevia} ${intBuffer} = ${memoria}`;
    logHistory(logEntry);
}

// Guarda los registros en el historial
function logHistory(logEntry) {
    historial.push(logEntry);
    if (historial.length > MAX_HISTORY_ITEMS) historial.shift();
    console.log(historial);
}

// Actualiza la pantalla del display
function updateScreen() {
    const displayElement = document.getElementById('display');
    if (displayElement) displayElement.innerText = buffer;
}

// Inicializa los eventos de la calculadora
function initCalculadora() {
    const calculatorButtons = document.querySelector('.buttons');
    if (calculatorButtons) {
        calculatorButtons.addEventListener('click', (event) => {
            buttonClick(event.target.innerText);
        });
    }
}

// Maneja el clic de los botones
function buttonClick(value) {
    if (isNaN(parseInt(value))) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
}

// =====================================================
// MÓDULO DE LISTA DE TAREAS (TO-DO LIST)
// =====================================================

const todoList = [];

// Agrega una nueva tarea a la lista
function agregarTarea() {
    const inputElement = document.getElementById('todo-input');
    const textoTarea = inputElement.value.trim();

    if (textoTarea === '') {
        alert('Error: La tarea no puede estar vacía.');
        return;
    }

    const duplicado = todoList.some((tarea) => tarea.texto === textoTarea);
    if (duplicado) {
        alert('Error: Tarea duplicada.');
        return;
    }

    const nuevaTarea = {
        id: Date.now(),
        texto: textoTarea,
        completada: false,
    };

    todoList.push(nuevaTarea);
    inputElement.value = '';
    dibujarListaTareas();
}

// Dibuja todas las tareas en la interfaz
function dibujarListaTareas() {
    const listaHtml = document.getElementById('todo-list');
    if (!listaHtml) return;

    listaHtml.innerHTML = '';

    todoList.forEach((tarea) => {
        const elementoLista = document.createElement('li');
        elementoLista.innerText = tarea.texto;

        if (tarea.completada) {
            elementoLista.style.textDecoration = 'line-through';
        }

        // Evento para marcar una tarea como completada
        elementoLista.addEventListener('click', () => {
            tarea.completada = !tarea.completada;
            dibujarListaTareas();
        });

        listaHtml.appendChild(elementoLista);
    });
}

// Inicializa los eventos del módulo To-Do
function initTodoList() {
    const botonAgregar = document.getElementById('add-task-btn');
    if (botonAgregar) {
        botonAgregar.addEventListener('click', agregarTarea);
    }
    dibujarListaTareas();
}

// =====================================================
// INICIALIZACIÓN GENERAL
// =====================================================
initCalculadora();
initTodoList();
