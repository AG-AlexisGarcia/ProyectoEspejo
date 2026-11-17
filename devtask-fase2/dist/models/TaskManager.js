export class TaskManager {
    constructor() {
        this.STORAGE_KEY = 'devtask_tareas';
        this.tareas = [];
        this.filtroActual = 'todas';
        const formEl = document.getElementById('form-tarea');
        const inputEl = document.getElementById('input-titulo');
        const selectEl = document.getElementById('select-prioridad');
        const listaEl = document.getElementById('lista-tareas');
        if (!formEl || !inputEl || !selectEl || !listaEl) {
            throw new Error('Error crítico: faltan elementos obligatorios en el DOM.');
        }
        this.form = formEl;
        this.inputTitulo = inputEl;
        this.selectPrioridad = selectEl;
        this.listaTareas = listaEl;
        this.botonesFiltro = document.querySelectorAll('.filtros button');
        this.tareas = this.cargarTareas();
        this.inicializarEventos();
        this.pintarTareas();
    }
    cargarTareas() {
        const datosGuardados = localStorage.getItem(this.STORAGE_KEY);
        return datosGuardados ? JSON.parse(datosGuardados) : [];
    }
    guardarTareas() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tareas));
    }
    inicializarEventos() {
        this.form.addEventListener('submit', (evento) => {
            this.agregarTarea(evento);
        });
        this.botonesFiltro.forEach((boton) => {
            boton.addEventListener('click', () => {
                this.filtroActual = boton.dataset.filtro || 'todas';
                this.pintarTareas();
            });
        });
    }
    agregarTarea(evento) {
        evento.preventDefault();
        const titulo = this.inputTitulo.value.trim();
        if (!titulo)
            return;
        const nuevaTarea = {
            id: Date.now(),
            titulo: titulo,
            prioridad: this.selectPrioridad.value,
            completada: false
        };
        this.tareas.push(nuevaTarea);
        this.guardarTareas();
        this.form.reset();
        this.pintarTareas();
    }
    cambiarEstado(id) {
        this.tareas = this.tareas.map((tarea) => tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea);
        this.guardarTareas();
        this.pintarTareas();
    }
    eliminarTarea(id) {
        this.tareas = this.tareas.filter((tarea) => tarea.id !== id);
        this.guardarTareas();
        this.pintarTareas();
    }
    pintarTareas() {
        this.listaTareas.innerHTML = '';
        const tareasFiltradas = this.tareas.filter((tarea) => {
            if (this.filtroActual === 'pendientes')
                return !tarea.completada;
            if (this.filtroActual === 'completadas')
                return tarea.completada;
            return true;
        });
        tareasFiltradas.forEach((tarea) => {
            const li = document.createElement('li');
            const info = document.createElement('span');
            info.textContent = `[${tarea.prioridad}] ${tarea.titulo}`;
            if (tarea.completada)
                info.classList.add('completada');
            info.style.cursor = 'pointer';
            info.addEventListener('click', () => this.cambiarEstado(tarea.id));
            const btnEliminar = document.createElement('button');
            btnEliminar.type = 'button';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.addEventListener('click', () => this.eliminarTarea(tarea.id));
            li.append(info, btnEliminar);
            this.listaTareas.appendChild(li);
        });
    }
}
