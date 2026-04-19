import { useForm } from 'react-hook-form';
import type { prioridad } from '../Interfaces/Tarea.interface';

export interface FormData {
  titulo: string;
  prioridad: prioridad;
  descripcion: string;
}

interface TodoFormProps {
  onAdd: (data: FormData) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      titulo: '',
      prioridad: 'media',
      descripcion: ''
    }
  });

  const submit = (data: FormData) => {
    onAdd(data);
    reset();
  };

  return (
    <>
      <h4>Nueva tarea</h4>
      <form onSubmit={handleSubmit(submit)}>
        <input className="customInput" placeholder="Titulo" {...register('titulo', { required: 'El titulo es requerido.' })} />{' '}
        <select {...register('prioridad')}>
          <option value="alta">alta</option>
          <option value="media">media</option>
          <option value="baja">baja</option>
        </select>
        {errors.titulo && <p className="error_agregar">{errors.titulo.message}</p>}
        <br /><br />
        <input className="customInput" placeholder="Descripcion" {...register('descripcion', { required: 'La descripcion es requerida.' })} />
        {errors.descripcion && <p className="error_agregar">{errors.descripcion.message}</p>}
        <br /><br />
        <button className="botonCustom" type="submit">Agregar</button>
      </form>
    </>
  );
}