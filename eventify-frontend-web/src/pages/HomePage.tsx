// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PhotoIcon } from '@heroicons/react/24/solid';
import BackgroundImage from '../components/BackgroundImage';
import MemoryCard from '../components/MemoryCard';
import ActionButton from '../components/ActionButton';
import ProfileIcon from '../components/ProfileIcon';

interface Memory {
  memoryId: number;
  coverPhoto: string;
  event: {
    eventName: string;
    eventDate: string;
  } | null;
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
  return (
    <BackgroundImage>
      <ProfileIcon onClick={() => navigate('/profile')} />

  <div className="container mx-auto">
    <h1 className="text-6xl font-bold text-center text-gray-800 drop-shadow-lg mb-12 animate-bounce custom-title">
      Tus Recuerdos y Eventos
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <ActionButton
        onClick={() => navigate('/create-event')}
        color="bg-gradient-to-br from-orange-400 to-red-600"
        icon={PlusIcon}
        label="Crea un Nuevo Evento"
      />
      <ActionButton
        onClick={() => navigate('/publications')}
        color="bg-gradient-to-br from-blue-500 to-indigo-700"
        icon={PhotoIcon}
        label="Publicaciones"
      />

      {memories.length > 0 ? (
        memories.map((memory) => <MemoryCard key={memory.memoryId} memory={memory} />)
      ) : (
        <div className="col-span-3 mt-10 text-center text-white text-3xl font-light bg-white/20 p-4 rounded-lg shadow-md">
          No tienes recuerdos o eventos aún. <br />
          ¡Comienza creando uno ahora!
          </div>
                    )}
        </div>
      </div>
    </BackgroundImage>
  );
};

export default HomePage;
