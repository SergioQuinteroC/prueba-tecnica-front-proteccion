import { useState, useEffect } from "react";
import { createTaskService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

const Dashboard = () => {
    const { token } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filters, setFilters] = useState({
        status: "",
        assignedTo: "",
        createdBy: "",
        search: "",
    });

    // Crear el servicio de tareas con el token actual
    const taskService = createTaskService(token);

    useEffect(() => {
        if (token) {
            loadTasks();
        }
    }, [filters, token]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getTasks(filters);
            setTasks(response);
        } catch (error) {
            console.error("Error cargando tareas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            await taskService.createTask(taskData);
            loadTasks();
        } catch (error) {
            console.error("Error creando tarea:", error);
            throw error;
        }
    };

    const handleUpdateTask = async (taskData) => {
        try {
            await taskService.updateTask(editingTask.id, taskData);
            setEditingTask(null);
            loadTasks();
        } catch (error) {
            console.error("Error actualizando tarea:", error);
            throw error;
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (
            window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")
        ) {
            try {
                await taskService.deleteTask(taskId);
                loadTasks();
            } catch (error) {
                console.error("Error eliminando tarea:", error);
            }
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const task = tasks.find((t) => t.id === taskId);
            if (task) {
                await taskService.updateTask(taskId, {
                    ...task,
                    status: newStatus,
                });
                loadTasks();
            }
        } catch (error) {
            console.error("Error actualizando estado:", error);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const handleSaveTask = async (taskData) => {
        if (editingTask) {
            await handleUpdateTask(taskData);
        } else {
            await handleCreateTask(taskData);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            !filters.search ||
            task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            task.description
                .toLowerCase()
                .includes(filters.search.toLowerCase());

        const matchesStatus = !filters.status || task.status === filters.status;
        const matchesAssigned =
            !filters.assignedTo || task.assignedTo?.id === filters.assignedTo;
        const matchesCreatedBy =
            !filters.createdBy || task.createdBy?.id === filters.createdBy;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesAssigned &&
            matchesCreatedBy
        );
    });

    const getStatusCount = (status) => {
        return tasks.filter((task) => task.status === status).length;
    };

    return (
        <div>
            <Navbar />

            <div className="container">
                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px",
                        }}
                    >
                        <h1
                            style={{
                                fontSize: "32px",
                                fontWeight: "bold",
                                color: "#333",
                            }}
                        >
                            Mis Tareas
                        </h1>
                        <button
                            onClick={() => {
                                setEditingTask(null);
                                setShowModal(true);
                            }}
                            className="btn btn-primary"
                        >
                            Nueva Tarea
                        </button>
                    </div>

                    {/* Estadísticas */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{tasks.length}</div>
                            <div className="stat-label">Total</div>
                        </div>
                        <div className="stat-card">
                            <div
                                className="stat-number"
                                style={{ color: "#ffc107" }}
                            >
                                {getStatusCount("TODO")}
                            </div>
                            <div className="stat-label">Por Hacer</div>
                        </div>
                        <div className="stat-card">
                            <div
                                className="stat-number"
                                style={{ color: "#007bff" }}
                            >
                                {getStatusCount("IN_PROGRESS")}
                            </div>
                            <div className="stat-label">En Progreso</div>
                        </div>
                        <div className="stat-card">
                            <div
                                className="stat-number"
                                style={{ color: "#28a745" }}
                            >
                                {getStatusCount("DONE")}
                            </div>
                            <div className="stat-label">Completadas</div>
                        </div>
                    </div>
                </div>

                {/* Lista de tareas */}
                {loading ? (
                    <div className="loading">Cargando tareas...</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: "18px", marginBottom: "16px" }}>
                            No hay tareas que mostrar
                        </div>
                        <button
                            onClick={() => {
                                setEditingTask(null);
                                setShowModal(true);
                            }}
                            style={{
                                color: "#007bff",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "underline",
                            }}
                        >
                            Crear tu primera tarea
                        </button>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                )}
            </div>

            <TaskModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingTask(null);
                }}
                task={editingTask}
                onSave={handleSaveTask}
            />
        </div>
    );
};

export default Dashboard;
