import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon, FolderIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Event {
  eventId: number;
  eventName: string;
}

interface Image {
  id: string;
  url: string;
  description: string;
}

interface Friend {
  userId: number;
  username: string;
}

const PublicationsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch events, images, and friends
    const fetchEvents = async () => {
      const { data } = await axios.get('http://localhost:8080/api/user-events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(data);
    };

    const fetchImages = async () => {
      const { data } = await axios.get('http://localhost:8080/api/user-images', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setImages(data);
    };

    const fetchFriends = async () => {
      const { data } = await axios.get('http://localhost:8080/api/user-friends', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFriends(data);
    };

    fetchEvents();
    fetchImages();
    fetchFriends();
  }, []);

  const filteredImages = images.filter((image) =>
    image.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(friendSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex gap-5">
      {/* Botón de regreso */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-5 left-5 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>

      {/* Columna Izquierda: Eventos */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Eventos</h2>
        {events.map((event) => (
          <div key={event.eventId} className="flex items-center gap-3 mb-3">
            <FolderIcon className="h-6 w-6 text-blue-500" />
            <span className="text-gray-700 font-medium">{event.eventName}</span>
          </div>
        ))}
      </div>

      {/* Columna Central: Feed de Imágenes */}
      <div className="w-1/2 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar en publicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-gray-200 rounded-lg overflow-hidden shadow-md">
              <img src={image.url} alt={image.description} className="w-full h-48 object-cover" />
              <div className="p-3">
                <p className="text-gray-800 font-medium">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Columna Derecha: Amigos */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Amigos</h2>
        <div className="flex items-center gap-2 mb-4">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar amigos..."
            value={friendSearchTerm}
            onChange={(e) => setFriendSearchTerm(e.target.value)}
            className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="space-y-2">
          {filteredFriends.map((friend) => (
            <div key={friend.userId} className="flex items-center gap-3">
              <UserIcon className="h-6 w-6 text-green-500" />
              <span className="text-gray-700 font-medium">{friend.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicationsPage;

