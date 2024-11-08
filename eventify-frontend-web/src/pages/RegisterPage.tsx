import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/signup', formData);
      if (response.status === 200) {
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Hubo un problema al intentar registrar la cuenta. Inténtalo nuevamente.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="w-full max-w-lg p-10 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700">Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Nombre"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
          <InputField
            label="Apellido"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
          />
          <InputField
            label="Nombre de Usuario"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          <InputField
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <InputField
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Registrarse
          </button>
        </form>
        <div className="text-center">
          <p className="text-gray-600">¿Ya tienes una cuenta?</p>
          <button
            onClick={handleLoginRedirect}
            className="mt-3 text-blue-500 hover:underline font-semibold"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
