import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Tarea, prioridad } from '../Interfaces/Tarea.interface';
import './styles.css';

interface FormData {
  titulo: string;
  prioridad: prioridad;
  descripcion: string;
}

let proximoId = 4;

function crearTarea(id: number, titulo: string, p: prioridad, descripcion: string): Tarea {
  return { id, titulo, prioridad: p, descripcion, completada: false };
}

function validarTarea(tarea: Tarea): { esValida: boolean; errores: string[] } {
  const errores: string[] = [];
  if (typeof tarea.titulo !== 'string' || tarea.titulo.trim() === '')
    errores.push('El título es requerido y debe ser texto.');
  if (!['alta', 'media', 'baja'].includes(tarea.prioridad))
    errores.push("La prioridad debe ser 'alta', 'media' o 'baja'.");
  return { esValida: errores.length === 0, errores };
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      titulo: '',
      prioridad: 'media',
      descripcion: ''
    }
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
    reset();
  };

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

      <h4>Nueva tarea</h4>
      <form onSubmit={handleSubmit(agregar)}>
        <input className="customInput" placeholder="Título" {...register('titulo', { required: 'El título es requerido.' })} />{' '}
        <select {...register('prioridad')}>
          <option value="alta">alta</option>
          <option value="media">media</option>
          <option value="baja">baja</option>
        </select>
        {errors.titulo && <p className="error_agregar">{errors.titulo.message}</p>}
        <br /><br />
        <input className="customInput" placeholder="Descripción" {...register('descripcion', { required: 'La descripción es requerida.' })} />
        {errors.descripcion && <p className="error_agregar">{errors.descripcion.message}</p>}
        <br /><br />
        <button className="botonCustom" type="submit">Agregar</button>
      </form>

      <hr />

      <h4>Filtros</h4>
      <input className="customInputSearch" placeholder="Buscar..." value={termino} onChange={e => setTermino(e.target.value)} />{' '}
      <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value as typeof filtroEstado)}>
        <option value="todas">todas</option>
        <option value="pendientes">pendientes</option>
        <option value="completadas">completadas</option>
      </select>{' '}
      <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value as typeof filtroPrioridad)}>
        <option value="todas">toda prioridad</option>
        <option value="alta">alta</option>
        <option value="media">media</option>
        <option value="baja">baja</option>
      </select>{' '}
      <button className="botonCustom" onClick={() => setOrdenado(o => !o)}>
        {ordenado ? 'Orden original' : 'Ordenar por prioridad'}
      </button>

      <hr />

      <h4>Tareas ({lista.length})</h4>
      {lista.length === 0 && <p className="pNo_tareas">No hay tareas.</p>}
      {lista.map(t => (
        <div key={t.id} className={`keyClass ${t.completada ? 'key_completado' : ''}`}>
          <span className={t.completada ? 'text_completado' : ''}>
            <strong>{t.titulo}</strong> [{t.prioridad}]
            {t.descripcion && <span className="descripcion"> — {t.descripcion}</span>}
          </span>
          <br />
          <button className="botonCustomCompletar" onClick={() => setTareas(completarTarea(tareas, t.id))} disabled={t.completada}>
            {t.completada ? 'Completada' : 'Completar'}
          </button>{' '}
          <button className="botonCustomEliminar" onClick={() => setTareas(eliminarTarea(tareas, t.id))}>Eliminar</button>{' '}
          <button className="botonCustomCopiar" onClick={() => setTareas(copiarTarea(tareas, t.id))}>Copiar</button>
        </div>
      ))}
    </div>
  );
}