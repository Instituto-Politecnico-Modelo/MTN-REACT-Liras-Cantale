import type { Tarea } from '../Interfaces/Tarea.interface';

interface TodoItemProps {
    tarea: Tarea;
    onComplete: (id: number) => void;
    onDelete: (id: number) => void;
    onCopy: (id: number) => void;
}

export default function TodoItem({ tarea, onComplete, onDelete, onCopy }: TodoItemProps) {
    return (
    <div className={`keyClass ${tarea.completada ? 'key_completado' : ''}`}>
        <span className={tarea.completada ? 'text_completado' : ''}>
        <strong>{tarea.titulo}</strong> [{tarea.prioridad}]
        {tarea.descripcion && <span className="descripcion"> - {tarea.descripcion}</span>}
        </span>
        <br />
        <button className="botonCustomCompletar" onClick={() => onComplete(tarea.id)} disabled={tarea.completada}>
        {tarea.completada ? 'Completada' : 'Completar'}
        </button>{' '}
        <button className="botonCustomEliminar" onClick={() => onDelete(tarea.id)}>Eliminar</button>{' '}
        <button className="botonCustomCopiar" onClick={() => onCopy(tarea.id)}>Copiar</button>
    </div>
    );
}
