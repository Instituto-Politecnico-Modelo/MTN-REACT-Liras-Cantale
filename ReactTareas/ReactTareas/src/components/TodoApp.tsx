import { useState, useEffect } from 'react';
import type { Tarea, prioridad } from '../Interfaces/Tarea.interface';
import TodoForm from './TodoForm';
import type { FormData } from './TodoForm';
import TodoFilters from './TodoFilters';
import TodoList from './TodoList';
import './styles.css';

let proximoId = 4;

function crearTarea(id: number, titulo: string, p: prioridad, descripcion: string): Tarea {
  return { id, titulo, prioridad: p, descripcion, completada: false };
}

function buscarTarea(tareas: Tarea[], id: number): Tarea | undefined {
  return tareas.find(t => t.id === id);
}

function completarTarea(tareas: Tarea[], id: number): Tarea[] {
  const tarea = buscarTarea(tareas, id);
  tarea && (tarea.completada = true);
  return [...tareas];
}

function eliminarTarea(tareas: Tarea[], id: number): Tarea[] {
  const nuevas: Tarea[] = [];
  for (const t of tareas) {
    if (t.id !== id) nuevas.push(t);
  }
  return nuevas;
}

function copiarTarea(tareas: Tarea[], id: number): Tarea[] {
  const original = buscarTarea(tareas, id);
  if (original) {
    const copia = crearTarea(proximoId++, original.titulo + ' copia', original.prioridad, original.descripcion);
    copia.completada = original.completada;
    tareas.push(copia);
  }
  return [...tareas];
}

function filtrarTareas(tareas: Tarea[], estado: boolean): Tarea[] {
  const resultado: Tarea[] = [];
  for (const tarea of tareas) {
    if (tarea.completada === estado) resultado.push(tarea);
  }
  return resultado;
}

function filtrarTareasPorPrioridad(tareas: Tarea[], p: prioridad): Tarea[] {
  const resultado: Tarea[] = [];
  for (const tarea of tareas) {
    if (tarea.prioridad === p) resultado.push(tarea);
  }
  return resultado;
}

function contarPorPrioridad(tareas: Tarea[]): { alta: number; media: number; baja: number } {
  const conteo = { alta: 0, media: 0, baja: 0 };
  for (const tarea of tareas) {
    if (conteo[tarea.prioridad] !== undefined) conteo[tarea.prioridad]++;
  }
  return conteo;
}

function ordenarTareasPorPrioridad(tareas: Tarea[]): Tarea[] {
  const orden: Record<prioridad, number> = { alta: 1, media: 2, baja: 3 };
  const copia = [...tareas];
  copia.sort((a, b) => orden[a.prioridad] - orden[b.prioridad]);
  return copia;
}

function buscarTareas(tareas: Tarea[], termino: string): Tarea[] {
  const texto = termino.toLowerCase();
  const resultados: Tarea[] = [];
  for (const tarea of tareas) {
    const titulo = tarea.titulo.toLowerCase();
    const descripcion = tarea.descripcion ? tarea.descripcion.toLowerCase() : '';
    if (titulo.includes(texto) || descripcion.includes(texto)) resultados.push(tarea);
  }
  return resultados;
}

export default function TodoApp() {
  const [tareas, setTareas] = useState<Tarea[]>(() => {
    const tareasGuardadas = localStorage.getItem('tareas');
    if (tareasGuardadas) {
      try {
        return JSON.parse(tareasGuardadas);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [termino, setTermino] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'completadas' | 'pendientes'>('todas');
  const [filtroPrioridad, setFiltroPrioridad] = useState<prioridad | 'todas'>('todas');
  const [ordenado, setOrdenado] = useState(false);

  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [tareas]);

  const agregar = (data: FormData) => {
    const tarea = crearTarea(proximoId, data.titulo, data.prioridad, data.descripcion);
    proximoId++;
    setTareas(prev => [...prev, tarea]);
  };

  const completar = (id: number) => setTareas(prev => completarTarea(prev, id));
  const eliminar = (id: number) => setTareas(prev => eliminarTarea(prev, id));
  const copiar = (id: number) => setTareas(prev => copiarTarea(prev, id));

  let lista = [...tareas];
  if (termino) lista = buscarTareas(lista, termino);
  if (filtroEstado === 'completadas') lista = filtrarTareas(lista, true);
  if (filtroEstado === 'pendientes') lista = filtrarTareas(lista, false);
  if (filtroPrioridad !== 'todas') lista = filtrarTareasPorPrioridad(lista, filtroPrioridad);
  if (ordenado) lista = ordenarTareasPorPrioridad(lista);

  const conteo = contarPorPrioridad(tareas);

  return (
    <div className="todo-app">
      <h2>To-do list</h2>
      <p className="contadores">
        alta: {conteo.alta} | media: {conteo.media} | baja: {conteo.baja} | total: {tareas.length}
      </p>

      <hr />

      <TodoForm onAdd={agregar} />

      <hr />

      <TodoFilters
        termino={termino}
        onTerminoChange={setTermino}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        filtroPrioridad={filtroPrioridad}
        onFiltroPrioridadChange={setFiltroPrioridad}
        ordenado={ordenado}
        onToggleOrdenado={() => setOrdenado(o => !o)}
      />

      <hr />

      <TodoList tareas={lista} onComplete={completar} onDelete={eliminar} onCopy={copiar} />
    </div>
  );
}