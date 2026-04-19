import type { prioridad } from '../Interfaces/Tarea.interface';

interface TodoFiltersProps {
    termino: string;
    onTerminoChange: (value: string) => void;
    filtroEstado: 'todas' | 'completadas' | 'pendientes';
    onFiltroEstadoChange: (value: 'todas' | 'completadas' | 'pendientes') => void;
    filtroPrioridad: prioridad | 'todas';
    onFiltroPrioridadChange: (value: prioridad | 'todas') => void;
    ordenado: boolean;
    onToggleOrdenado: () => void;
}

export default function TodoFilters({
    termino,
    onTerminoChange,
    filtroEstado,
    onFiltroEstadoChange,
    filtroPrioridad,
    onFiltroPrioridadChange,
    ordenado,
    onToggleOrdenado
}: TodoFiltersProps) {
    return (
    <>
        <h4>Filtros</h4>
        <input className="customInputSearch" placeholder="Buscar..." value={termino} onChange={e => onTerminoChange(e.target.value)} />{' '}
        <select value={filtroEstado} onChange={e => onFiltroEstadoChange(e.target.value as 'todas' | 'completadas' | 'pendientes')}>
        <option value="todas">todas</option>
        <option value="pendientes">pendientes</option>
        <option value="completadas">completadas</option>
        </select>{' '}
        <select value={filtroPrioridad} onChange={e => onFiltroPrioridadChange(e.target.value as prioridad | 'todas')}>
        <option value="todas">toda prioridad</option>
        <option value="alta">alta</option>
        <option value="media">media</option>
        <option value="baja">baja</option>
        </select>{' '}
        <button className="botonCustom" onClick={onToggleOrdenado}>
        {ordenado ? 'Orden original' : 'Ordenar por prioridad'}
        </button>
    </>
    );
}