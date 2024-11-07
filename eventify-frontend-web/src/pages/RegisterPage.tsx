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
        // Redirigir a la página de inicio de sesión después del registro exitoso
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Hubo un problema al intentar registrar la cuenta. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
