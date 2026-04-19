import type { Tarea } from '../Interfaces/Tarea.interface';
import TodoItem from './TodoItem.tsx';

interface TodoListProps {
    tareas: Tarea[];
    onComplete: (id: number) => void;
    onDelete: (id: number) => void;
    onCopy: (id: number) => void;
}

export default function TodoList({ tareas, onComplete, onDelete, onCopy }: TodoListProps) {
    return (
        <>
            <h4>Tareas ({tareas.length})</h4>
            {tareas.length === 0 && <p className="pNo_tareas">No hay tareas.</p>}
            {tareas.map(tarea => (
                <TodoItem
                    key={tarea.id}
                    tarea={tarea}
                    onComplete={onComplete}
                    onDelete={onDelete}
                    onCopy={onCopy}
                />
            ))}
        </>
    );
}