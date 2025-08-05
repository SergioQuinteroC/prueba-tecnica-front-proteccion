import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const schema = yup
    .object({
        email: yup
            .string()
            .email("Email inválido")
            .required("Email es requerido"),
        password: yup
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres")
            .required("Contraseña es requerida"),
    })
    .required();

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const { login, register: registerUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const testApiConnection = async () => {
        try {
            console.log("Probando conexión con la API...");
            const response = await fetch("http://localhost:8080/auth/test");
            console.log("Respuesta de prueba:", response);
            if (response.ok) {
                const data = await response.json();
                console.log("Datos de prueba:", data);
                alert("API conectada correctamente");
            } else {
                alert("Error conectando con la API");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión con la API");
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        console.log("Datos del formulario:", data);
        try {
            const result = isLogin
                ? await login(data)
                : await registerUser(data);

            console.log("Resultado del login/registro:", result);

            if (result.success) {
                console.log("Login exitoso, redirigiendo al dashboard...");
                navigate("/dashboard");
            } else {
                console.error("Error en login:", result.error);
                setError("root", { message: result.error });
            }
        } catch (error) {
            console.error("Error inesperado:", error);
            setError("root", { message: "Error inesperado" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            className="form-control"
                            placeholder="tu@email.com"
                        />
                        {errors.email && (
                            <div className="error">{errors.email.message}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            {...register("password")}
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <div className="error">
                                {errors.password.message}
                            </div>
                        )}
                    </div>

                    {errors.root && (
                        <div className="error">{errors.root.message}</div>
                    )}

                    <div className="form-group">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: "100%" }}
                        >
                            {loading
                                ? "Cargando..."
                                : isLogin
                                ? "Iniciar Sesión"
                                : "Registrarse"}
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="btn btn-secondary"
                        style={{ width: "100%" }}
                    >
                        {isLogin ? "Crear cuenta" : "Ya tengo cuenta"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
