import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Usaremos Heroicons para la flecha

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/event', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const eventId = response.data.eventId;
      navigate('/create-memory', { state: { eventId } });
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Hubo un problema al crear el evento. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: 'url(https://unsplash.com/photos/DItYlc26zVI)',
      }}>
      
      {/* Capa de superposición para dar un efecto de oscuridad */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Botón de regreso */}
      <button
        onClick={() => navigate('/homePage')}
        className="absolute top-4 left-4 p-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full shadow-lg hover:shadow-2xl z-10"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>

      <div className="relative bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-2xl z-10 border-t-8 border-orange-400">
        <h2 className="text-4xl font-extrabold text-center text-orange-500 mb-6">
          Crea Tu Evento <span className="animate-bounce">✨</span>
        </h2>
        <p className="text-center text-gray-600 mb-4">
          ¡Hazlo memorable! Agrega todos los detalles importantes para que tus amigos digan <span className="font-bold text-orange-500">WOW</span>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-800">Nombre del Evento</span>
            </label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="input input-bordered w-full bg-white/80 focus:ring-4 focus:ring-orange-300 shadow-inner"
              placeholder="Introduce el nombre del evento"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-800">Descripción del Evento</span>
            </label>
            <textarea
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleChange}
              className="textarea textarea-bordered w-full bg-white/80 focus:ring-4 focus:ring-orange-300 shadow-inner"
              placeholder="Describe el evento"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-800">Fecha del Evento</span>
            </label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="input input-bordered w-full bg-white/80 focus:ring-4 focus:ring-orange-300 shadow-inner"
              required
            />
          </div>
          <button
            type="submit"
            className="btn bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl w-full hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Crear Evento 🎉
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
