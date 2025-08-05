import { useState } from 'react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case 'TODO':
        return 'task-status status-todo';
      case 'IN_PROGRESS':
        return 'task-status status-progress';
      case 'DONE':
        return 'task-status status-done';
      default:
        return 'task-status';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'TODO':
        return 'Por Hacer';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'DONE':
        return 'Completada';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="task-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 className="task-title">
            {task.title}
          </h3>
          <p className="task-description">
            {task.description}
          </p>
          
          <div style={{ marginBottom: '15px' }}>
            <span className={getStatusClass(task.status)}>
              {getStatusText(task.status)}
            </span>
            {task.dueDate && (
              <span style={{
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: '#f8f9fa',
                color: '#6c757d',
                marginLeft: '8px'
              }}>
                Vence: {formatDate(task.dueDate)}
              </span>
            )}
          </div>
          
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            {task.createdBy && (
              <div style={{ marginBottom: '5px' }}>
                <span>Creado por: {task.createdBy.name || task.createdBy.email}</span>
              </div>
            )}
            {task.assignedTo && (
              <div>
                <span>Asignado a: {task.assignedTo.name || task.assignedTo.email}</span>
              </div>
            )}
          </div>
        </div>
        
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowActions(!showActions)}
            style={{
              padding: '4px',
              borderRadius: '4px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <svg style={{ width: '20px', height: '20px', color: '#666' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {showActions && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '8px',
              width: '192px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 10,
              border: '1px solid #ddd'
            }}>
              <div style={{ padding: '4px 0' }}>
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowActions(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#333',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowActions(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#dc3545',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="form-control"
        >
          <option value="TODO">Por Hacer</option>
          <option value="IN_PROGRESS">En Progreso</option>
          <option value="DONE">Completada</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard; 