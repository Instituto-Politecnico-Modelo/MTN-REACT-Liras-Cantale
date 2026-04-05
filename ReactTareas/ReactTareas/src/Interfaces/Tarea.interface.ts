export type prioridad = "baja" | "media" | "alta";

export interface Tarea{
    id: number;
    titulo: string;
    prioridad: prioridad;
    descripcion: string;
    completada: boolean;
}


