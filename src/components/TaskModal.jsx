import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createUserService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const schema = yup.object({
  title: yup.string().required('El título es requerido'),
  description: yup.string().required('La descripción es requerida'),
  dueDate: yup.date().nullable(),
  assignedToId: yup.string().nullable(),
  createdById: yup.string().required('El creador es requerido'),
  status: yup.string().required('El estado es requerido'),
}).required();

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Crear el servicio de usuarios con el token actual
  const userService = createUserService(token);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (isOpen && token) {
      loadUsers();
      if (task) {
        setValue('title', task.title);
        setValue('description', task.description);
        setValue('dueDate', task.dueDate ? task.dueDate.split('T')[0] : '');
        setValue('assignedToId', task.assignedTo?.id || '');
        setValue('createdById', task.createdById || user?.id || '');
        setValue('status', task.status);
      } else {
        reset();
        setValue('status', 'TODO');
        setValue('createdById', user?.id || '');
      }
    }
  }, [isOpen, task, setValue, reset, token, user]);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error guardando tarea:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Título</label>
            <input
              {...register('title')}
              type="text"
              className="form-control"
              placeholder="Título de la tarea"
            />
            {errors.title && (
              <div className="error">{errors.title.message}</div>
            )}
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              {...register('description')}
              rows="3"
              className="form-control"
              placeholder="Descripción de la tarea"
            />
            {errors.description && (
              <div className="error">{errors.description.message}</div>
            )}
          </div>

          <div className="form-group">
            <label>Fecha de Vencimiento</label>
            <input
              {...register('dueDate')}
              type="date"
              className="form-control"
            />
            {errors.dueDate && (
              <div className="error">{errors.dueDate.message}</div>
            )}
          </div>

          <div className="form-group">
            <label>Creado por</label>
            <select
              {...register('createdById')}
              className="form-control"
            >
              <option value="">Seleccionar creador</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
            {errors.createdById && (
              <div className="error">{errors.createdById.message}</div>
            )}
          </div>

          <div className="form-group">
            <label>Asignar a</label>
            <select
              {...register('assignedToId')}
              className="form-control"
            >
              <option value="">Sin asignar</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
            {errors.assignedToId && (
              <div className="error">{errors.assignedToId.message}</div>
            )}
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select
              {...register('status')}
              className="form-control"
            >
              <option value="TODO">Por Hacer</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="DONE">Completada</option>
            </select>
            {errors.status && (
              <div className="error">{errors.status.message}</div>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal; 