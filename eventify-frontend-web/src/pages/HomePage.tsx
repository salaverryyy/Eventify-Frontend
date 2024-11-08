import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/memories/user/${localStorage.getItem('userId')}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMemories(response.data);
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    };

    fetchMemories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tus Eventos y Recuerdos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {memories.length > 0 ? (
          memories.map((memory) => (
            <div key={memory.memoryId} className="border rounded-lg overflow-hidden shadow-md">
              <img src={memory.coverPhoto} alt="Cover" className="w-full h-48 object-cover" />
              <div className="p-4">
                {memory.event ? (
                  <>
                    <h2 className="text-xl font-bold">{memory.event.eventName}</h2>
                    <p>Fecha del Evento: {memory.event.eventDate}</p>
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
