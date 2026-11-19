# DevTask — Proyecto Espejo (Fase 1 & Fase 2)

Aplicación web de gestión de tareas (*To-Do List*) con persistencia local (`localStorage`) y filtrado dinámico por estado, desarrollada en dos fases para comparar el enfoque procedimental tradicional en JavaScript frente a una arquitectura orientada a objetos con **TypeScript estricto**.

---

##  Funcionalidades principales

- **Creación de tareas:** Registro de tareas con título obligatorio y nivel de prioridad (`Alta`, `Media`, `Baja`).
- **Gestión de estado:** Marcado y desmarcado de tareas completadas mediante interacción directa en la interfaz.
- **Eliminación:** Borrado individual de tareas con actualización inmediata del estado y del almacenamiento.
- **Filtrado dinámico:** Visualización segmentada entre **Todas**, **Pendientes** y **Completadas**.
- **Persistencia local:** Sincronización automática con `localStorage` bajo la clave `devtask_tareas`.

---

##  Arquitectura y Evolución del Proyecto

El desarrollo se divide en dos carpetas independientes que reflejan el salto técnico entre ambos paradigmas:

###  Fase 1: JavaScript Procedimental (`devtask-fase1/`)
Implementación inicial basada en manipulación directa del DOM, variables globales y funciones sueltas en un único archivo (`app.js`), sin comprobación de tipos en tiempo de desarrollo.

```text
devtask-fase1/
├── index.html
└── app.js
