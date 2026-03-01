import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!validateEmail(formData.email)) {
      return setError("Niepoprawny format adresu email.");
    }

    if (!validatePassword(formData.password)) {
      return setError(
        "Hasło musi mieć min. 8 znaków, zawierać wielką literę, cyfrę i znak specjalny.",
      );
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Hasła nie są takie same.");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
      );

      setSuccess("Rejestracja zakończona sukcesem!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });

      console.log(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Błąd rejestracji.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md bg-white shadow-md p-8 border border-orange-300">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Rejestracja
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 border border-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Imię</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Hasło</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Powtórz hasło
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Rola</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
            >
              <option value="USER">Użytkownik</option>
              <option value="SELLER">Sprzedawca</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 hover:bg-orange-600 transition"
          >
            Zarejestruj się
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Masz już konto?{" "}
          <Link
            to="/login"
            className="text-orange-600 font-semibold hover:underline"
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
