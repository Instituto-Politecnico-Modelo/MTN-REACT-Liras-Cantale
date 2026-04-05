    import {Tarea, prioridad} from '../../ReactTareas/ReactTareas/src/Interfaces/Tarea.interface.ts';
let tareas:Tarea[] = [];

function crearTarea(id: number,titulo: string, prioridad: prioridad, descripcion: string) :Tarea {
    return {
        id: id,
        titulo: titulo,
        prioridad: prioridad ,
        descripcion: descripcion,
        completada: false
    };
}

function mostrarTarea(tarea : Tarea) :void{
    const info = [
        `Título: ${tarea.titulo}`,
        `Prioridad: ${tarea.prioridad}`,
        `Descripción: ${tarea.descripcion}`,
        `Completada: ${tarea.completada}`
    ];
}

function agregarTarea(id: number, titulo: string, prioridad: prioridad, descripcion: string) :void {
    tareas = [...tareas, crearTarea(id, titulo, prioridad, descripcion)];
}

function buscarTarea(id: number) :Tarea | undefined {
    return tareas.find(t => t.id === id);
}

function completarTarea(id: number) :void {
    const tarea = buscarTarea(id);
    tarea && (tarea.completada = true);
}

function eliminarTarea(id:number) :void {
    const nuevas = [];
    for (let t of tareas) {
        if (t.id !== id) {
            nuevas.push(t);
        }
    }
    tareas = nuevas;
}

function copiarTarea(id: number) :void {
    const original = buscarTarea(id);

    if (original) {
        const copia = crearTarea(id,
            original.titulo + " copia",
            original.prioridad,
            original.descripcion
        );

        copia.completada = original.completada;
        tareas.push(copia);
    }
}

function filtrarTareas(estado: boolean): Tarea[] {
    const resultado = [];

    for (let tarea of tareas) {
        if (tarea.completada === estado) {
            resultado.push(tarea);
        }
    }

    return resultado;
}

function filtrarTareasPorPrioridad(prioridad: prioridad) :Tarea[]{
    const resultado = [];

    for (let tarea of tareas) {
        if (tarea.prioridad === prioridad) {
            resultado.push(tarea);
        }
    }

    return resultado;
}

function contarPorPrioridad() :{ alta: number; media: number; baja: number } {
    const conteo = { alta: 0, media: 0, baja: 0 };

    for (let tarea of tareas) {
        if (conteo[tarea.prioridad] !== undefined) {
            conteo[tarea.prioridad]++;
        }
    }

    return conteo;
}

function ordenarTareasPorPrioridad() :Tarea[] {
    const orden = { alta: 1, media: 2, baja: 3 };
    const copia = [...tareas];

    copia.sort((a, b) => orden[a.prioridad] - orden[b.prioridad]);

    return copia;
}

function buscarTareas(termino: string) :Tarea[] {
    const texto = termino.toLowerCase();
    const resultados = [];

    for (let tarea of tareas) {
        const titulo = tarea.titulo.toLowerCase();
        const descripcion = tarea.descripcion ? tarea.descripcion.toLowerCase() : "";

        if (titulo.includes(texto) || descripcion.includes(texto)) {
            resultados.push(tarea);
        }
    }

    return resultados;
}

function validarTarea(tarea: Tarea): { esValida: boolean; errores: string[] } {
    const errores = [];

    if (typeof tarea.titulo !== "string" || tarea.titulo.trim() === "") {
        errores.push("El título es requerido y debe ser texto.");
    }

    const prioridadesValidas = ["alta", "media", "baja"];

    if (!prioridadesValidas.includes(tarea.prioridad)) {
        errores.push("La prioridad debe ser 'alta', 'media' o 'baja'.");
    }

    return {
        esValida: errores.length === 0,
        errores: errores
    };
}