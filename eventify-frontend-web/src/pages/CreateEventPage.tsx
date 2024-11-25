import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
    location: '', // Guardará la dirección en lugar de latitud y longitud
  });

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAfgFQ4sVj9w6sJ994RaPYon4xwynIsvfM', // Reemplaza con tu clave API
    libraries: ['places'], // Carga la biblioteca de lugares
  });

  // Geocodificación para obtener dirección
  const geocodeLatLng = async (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = { lat, lng };

    try {
      const response = await geocoder.geocode({ location: latLng });
      if (response.results[0]) {
        return response.results[0].formatted_address; // Devuelve la dirección formateada
      } else {
        return 'Dirección no encontrada';
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      return 'Error al obtener la dirección';
    }
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });

      // Obtener la dirección y actualizar el estado
      const address = await geocodeLatLng(lat, lng);
      setFormData((prev) => ({
        ...prev,
        location: address,
      }));
    }
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
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1519125323398-675f0ddb6308)', // Cambia la imagen de fondo si lo deseas
      }}>
      {/* Capa de superposición para dar un efecto de oscuridad */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Contenedor principal */}
      <div className="relative flex flex-col lg:flex-row items-center lg:items-stretch justify-center lg:justify-between gap-8 w-full max-w-6xl p-6 z-10">
        {/* Contenedor del formulario */}
        <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full lg:w-1/2">
          <h2 className="text-3xl font-extrabold text-center text-orange-500 mb-4">
            Crea Tu Evento <span className="animate-bounce">✨</span>
          </h2>
          <p className="text-center text-gray-600 mb-4">
            ¡Hazlo memorable! Agrega todos los detalles importantes para que tus amigos digan <span className="font-bold text-orange-500">WOW</span>.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre del evento */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-800">Nombre del Evento</span>
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="input input-bordered w-full bg-white/80 focus:ring-2 focus:ring-orange-300 shadow-inner text-sm py-2"
                placeholder="Nombre del evento"
                required
              />
            </div>

            {/* Descripción del evento */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-800">Descripción del Evento</span>
              </label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                className="textarea textarea-bordered w-full bg-white/80 focus:ring-2 focus:ring-orange-300 shadow-inner text-sm py-2"
                placeholder="Descripción del evento"
                required
              />
            </div>

            {/* Fecha del evento */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-800">Fecha del Evento</span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="input input-bordered w-full bg-white/80 focus:ring-2 focus:ring-orange-300 shadow-inner text-sm py-2"
                required
              />
            </div>

            {/* Dirección */}
            <input
              type="text"
              name="location"
              value={formData.location}
              className="w-full border p-2 rounded mb-4 text-sm"
              placeholder="Dirección seleccionada"
              readOnly
            />

            {/* Botón para crear evento */}
            <button
              type="submit"
              className="btn bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 rounded-xl w-full hover:shadow-lg transition-transform transform hover:scale-105 mt-4"
            >
              Crear Evento 🎉
            </button>
          </form>
        </div>

        {/* Contenedor del mapa */}
        <div className="relative w-full lg:w-1/2 h-64 lg:h-auto z-10">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={markerPosition || { lat: -12.046374, lng: -77.042793 }} // Centro inicial (Lima)
              zoom={12}
              onClick={handleMapClick}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
