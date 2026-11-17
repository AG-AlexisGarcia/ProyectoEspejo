const STORAGE_KEY = 'devtask_tareas';

let tareas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let filtroActual = 'todas';

const form = document.getElementById('form-tarea');
const inputTitulo = document.getElementById('input-titulo');
const selectPrioridad = document.getElementById('select-prioridad');
const listaTareas = document.getElementById('lista-tareas');
const botonesFiltro = document.querySelectorAll('.filtros button');

function guardarTareas() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

function agregarTarea(evento) {
    evento.preventDefault();
    const titulo = inputTitulo.value.trim();
    if (!titulo) return;

    const nuevaTarea = {
        id: Date.now(),
        titulo: titulo,
        prioridad: selectPrioridad.value,
        completada: false
    };

    tareas.push(nuevaTarea);
    guardarTareas();
    form.reset();
    pintarTareas();
}

function cambiarEstado(id) {
    tareas = tareas.map(tarea =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    );
    guardarTareas();
    pintarTareas();
}

function eliminarTarea(id) {
    tareas = tareas.filter(tarea => tarea.id !== id);
    guardarTareas();
    pintarTareas();
}

function pintarTareas() {
    listaTareas.innerHTML = '';

    const tareasFiltradas = tareas.filter(tarea => {
        if (filtroActual === 'pendientes') return !tarea.completada;
        if (filtroActual === 'completadas') return tarea.completada;
        return true;
    });

    tareasFiltradas.forEach(tarea => {
        const li = document.createElement('li');

        const info = document.createElement('span');
        info.textContent = `[${tarea.prioridad}] ${tarea.titulo}`;
        if (tarea.completada) info.classList.add('completada');
        info.style.cursor = 'pointer';
        info.addEventListener('click', () => cambiarEstado(tarea.id));

        const btnEliminar = document.createElement('button');
        btnEliminar.type = 'button';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

        li.append(info, btnEliminar);
        listaTareas.appendChild(li);
    });
}

form.addEventListener('submit', agregarTarea);

botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
        filtroActual = boton.dataset.filtro || 'todas';
        pintarTareas();
    });
});

pintarTareas();