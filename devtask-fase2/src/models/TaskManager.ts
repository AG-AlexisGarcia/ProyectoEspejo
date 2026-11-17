import { Tarea, Prioridad } from '../interfaces/tarea-interface.js';

export class TaskManager {
    private readonly STORAGE_KEY: string = 'devtask_tareas';
    private tareas: Tarea[] = [];
    private filtroActual: string = 'todas';

    private form: HTMLFormElement;
    private inputTitulo: HTMLInputElement;
    private selectPrioridad: HTMLSelectElement;
    private listaTareas: HTMLUListElement;
    private botonesFiltro: NodeListOf<HTMLButtonElement>;

    constructor() {
        const formEl = document.getElementById('form-tarea');
        const inputEl = document.getElementById('input-titulo');
        const selectEl = document.getElementById('select-prioridad');
        const listaEl = document.getElementById('lista-tareas');

        if (!formEl || !inputEl || !selectEl || !listaEl) {
            throw new Error('Error crítico: faltan elementos obligatorios en el DOM.');
        }

        this.form = formEl as HTMLFormElement;
        this.inputTitulo = inputEl as HTMLInputElement;
        this.selectPrioridad = selectEl as HTMLSelectElement;
        this.listaTareas = listaEl as HTMLUListElement;
        this.botonesFiltro = document.querySelectorAll('.filtros button');

        this.tareas = this.cargarTareas();
        this.inicializarEventos();
        this.pintarTareas();
    }

    private cargarTareas(): Tarea[] {
        const datosGuardados = localStorage.getItem(this.STORAGE_KEY);
        return datosGuardados ? (JSON.parse(datosGuardados) as Tarea[]) : [];
    }

    private guardarTareas(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tareas));
    }

    private inicializarEventos(): void {
        this.form.addEventListener('submit', (evento: SubmitEvent) => {
            this.agregarTarea(evento);
        });

        this.botonesFiltro.forEach((boton: HTMLButtonElement) => {
            boton.addEventListener('click', () => {
                this.filtroActual = boton.dataset.filtro || 'todas';
                this.pintarTareas();
            });
        });
    }

    public agregarTarea(evento: Event): void {
        evento.preventDefault();
        const titulo = this.inputTitulo.value.trim();
        if (!titulo) return;

        const nuevaTarea: Tarea = {
            id: Date.now(),
            titulo: titulo,
            prioridad: this.selectPrioridad.value as Prioridad,
            completada: false
        };

        this.tareas.push(nuevaTarea);
        this.guardarTareas();
        this.form.reset();
        this.pintarTareas();
    }

    public cambiarEstado(id: number): void {
        this.tareas = this.tareas.map((tarea: Tarea) =>
            tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
        );
        this.guardarTareas();
        this.pintarTareas();
    }

    public eliminarTarea(id: number): void {
        this.tareas = this.tareas.filter((tarea: Tarea) => tarea.id !== id);
        this.guardarTareas();
        this.pintarTareas();
    }

    public pintarTareas(): void {
        this.listaTareas.innerHTML = '';

        const tareasFiltradas: Tarea[] = this.tareas.filter((tarea: Tarea) => {
            if (this.filtroActual === 'pendientes') return !tarea.completada;
            if (this.filtroActual === 'completadas') return tarea.completada;
            return true;
        });

        tareasFiltradas.forEach((tarea: Tarea) => {
            const li = document.createElement('li');

            const info = document.createElement('span');
            info.textContent = `[${tarea.prioridad}] ${tarea.titulo}`;
            if (tarea.completada) info.classList.add('completada');
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