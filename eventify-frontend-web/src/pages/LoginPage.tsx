import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import InputField from '../components/InputField';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      console.log('Login successful:', response.data);

      const token = response.data.token;
      localStorage.setItem('token', token);

      // Decodificar el token para extraer el userId
      const decoded: any = jwtDecode(token);
      const userId = decoded.userId;
      if (userId) {
        localStorage.setItem('userId', userId);
        navigate('/homePage');
      } else {
        setError('Error al extraer el User ID del token.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Error al iniciar sesión. Verifica tus credenciales e intenta de nuevo.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField label="Correo Electrónico" type="email" name="email" value={formData.email} onChange={handleChange} />
          <InputField label="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange} />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
