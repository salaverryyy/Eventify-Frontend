// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import InputField from '../components/InputField';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', formData);
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

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:8080/auth/forgot-password', { email: forgotPasswordEmail });
      alert('Revisa tu correo electrónico para restablecer tu contraseña.');
      setShowForgotPasswordModal(false);
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      alert('Hubo un problema al enviar el correo electrónico. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField label="Correo Electrónico" type="email" name="email" value={formData.email} onChange={handleChange} />
          <InputField label="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange} />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
          <span>¿Eres nuev@? <button onClick={() => navigate('/')} className="text-blue-500 hover:underline">Regístrate</button></span>
          <button onClick={() => setShowForgotPasswordModal(true)} className="text-blue-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>

      {/* Modal para recuperar contraseña */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <button onClick={() => setShowForgotPasswordModal(false)} className="absolute top-2 right-2 text-gray-500">
              X
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center">Recuperar Contraseña</h3>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={handleForgotPassword} className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

