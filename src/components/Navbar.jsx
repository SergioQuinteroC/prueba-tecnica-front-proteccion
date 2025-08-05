import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div>
                    <h1
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        Gestor de Tareas
                    </h1>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
