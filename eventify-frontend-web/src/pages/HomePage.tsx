import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Event {
  eventId: number;
  eventName: string;
  eventDate: string;
}

interface Memory {
  memoryId: number;
  coverPhoto: string;
  event: Event | null;
}

const HomePage: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/memories/user/${localStorage.getItem('userId')}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMemories(response.data);
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    };

    fetchMemories();
  }, []);

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleMemoryClick = (memoryId: number) => {
    navigate(`/album/${memoryId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tus Eventos y Recuerdos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Botón para crear un nuevo evento */}
        <div
          onClick={handleCreateEvent}
          className="border rounded-lg overflow-hidden shadow-md bg-blue-500 flex items-center justify-center cursor-pointer"
          style={{ minHeight: '250px' }} // Ajusta la altura según sea necesario
        >
          <span className="text-white text-4xl">+</span>
        </div>

        {/* Cuadros de eventos y recuerdos */}
        {memories.length > 0 ? (
          memories.map((memory) => (
            <div
              key={memory.memoryId}
              onClick={() => handleMemoryClick(memory.memoryId)}
              className="border rounded-lg overflow-hidden shadow-md cursor-pointer"
            >
              <img src={memory.coverPhoto} alt="Cover" className="w-full h-48 object-cover" />
              <div className="p-4">
                {memory.event ? (
                  <>
                    <h2 className="text-xl font-bold">{memory.event.eventName}</h2>
                    <p>Fecha del Evento: {new Date(memory.event.eventDate).toLocaleDateString()}</p>
                  </>
                ) : (
                  <p>Sin evento asociado</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3">No tienes recuerdos o eventos aún.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
