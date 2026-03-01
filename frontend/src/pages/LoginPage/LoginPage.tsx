import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const { login } = useAuth();
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(email);
  };

  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (e: React.SubmitEvent) => {
      e.preventDefault();
      setError(null);
      setInfo(null);

      if (!validateEmail(email)) {
        return setError("Niepoprawny format adresu email.");
      }

      if (!password) {
        return setError("Hasło jest wymagane.");
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email,
            password,
          },
        );

        const { accessToken } = response.data;

        login(accessToken);
        if (rememberMe) {
          localStorage.setItem("token", accessToken);
        } else {
          sessionStorage.setItem("token", accessToken);
        }

        navigate("/");
      } catch (err) {
        setError("Błąd logowania");
        console.log(err);
      }
    },
    [email, password, rememberMe, login, navigate],
  );

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white shadow-md p-8 border border-orange-300">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Logowanie
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 border border-green-400">
            {info}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Hasło</label>
            <input
              type="password"
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-orange-500"
              />
              Zapamiętaj mnie
            </label>

            <Link
              to="/forgot-password"
              className="text-orange-600 hover:underline"
            >
              Zapomniałem hasła
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 hover:bg-orange-600 transition"
          >
            Zaloguj się
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Nie masz konta?{" "}
          <Link
            to="/register"
            className="text-orange-600 font-semibold hover:underline"
          >
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
