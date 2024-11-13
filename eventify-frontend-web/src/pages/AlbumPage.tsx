// src/pages/AlbumPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Album {
  id: number;
  memoryName: string;
  description: string;
  memoryCreationDate: string;
  albumLink: string;
  accessCode: string;
  coverPhoto: string;
}

interface User {
  username: string;
  email: string;
}

const AlbumPage: React.FC = () => {
  const { memoryId } = useParams<{ memoryId?: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showInviteSection, setShowInviteSection] = useState(false);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!memoryId) {
        console.error("Memory ID is undefined.");
        return;
      }

      try {
        const isUUID = memoryId.includes('-'); // Verifica si el ID contiene guiones para determinar si es un UUID

        if (isUUID) {
          // Obtener el álbum directamente usando el UUID
          const response = await axios.get(`http://localhost:8080/memories/uuid/${memoryId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setAlbum(response.data); // Guarda el álbum en el estado
        } else {
          // Si es un memoryId numérico, obtener el UUID y redirigir a la URL con el UUID
          const uuidResponse = await axios.get(`http://localhost:8080/memories/${memoryId}/album-uuid`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const albumUUID = uuidResponse.data;

          // Redirigir a la URL con el UUID para mantener consistencia en la URL
          navigate(`/album/${albumUUID}`, { replace: true });
        }
      } catch (error) {
        console.error('Error fetching album UUID or album details:', error);
      }
    };

    fetchAlbum();
  }, [memoryId, navigate]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/usuarios/search?username=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u.username === user.username)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSendInvitations = async () => {
    const usernames = selectedUsers.map((user) => user.username);
    try {
      await axios.post(
        'http://localhost:8080/invitation/sendByQr',
        {
          accessCode: album?.accessCode,
          usernames,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Invitaciones enviadas exitosamente.');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Error al enviar invitaciones.');
    }
  };

  if (!album) return <p>Cargando álbum...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-6">
        <img src={album.coverPhoto} alt="Album Cover" className="w-full h-48 object-cover rounded-lg mb-4" />
        <h1 className="text-3xl font-bold mb-2">{album.memoryName}</h1>
        <p>{album.description}</p>
        <p className="text-gray-500">
          Fecha de creación: {new Date(album.memoryCreationDate).toLocaleDateString()}
        </p>
        <p className="text-blue-600">
          Link del Álbum:{' '}
          <a href={album.albumLink} target="_blank" rel="noopener noreferrer">
            {album.albumLink}
          </a>
        </p>
        <p>
          Código de acceso: <strong>{album.accessCode}</strong>
        </p>
        <button
          onClick={() => setShowInviteSection(!showInviteSection)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Invitar Usuarios
        </button>
        {showInviteSection && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <button onClick={handleSearch} className="bg-gray-200 px-4 py-2 rounded mb-4">
              Buscar
            </button>
            <ul>
              {searchResults.map((user) => (
                <li
                  key={user.username}
                  onClick={() => handleSelectUser(user)}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  {user.username} ({user.email})
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h3 className="font-bold">Usuarios seleccionados:</h3>
              <ul>
                {selectedUsers.map((user) => (
                  <li key={user.username}>{user.username}</li>
                ))}
              </ul>
              <button
                onClick={handleSendInvitations}
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              >
                Enviar Invitaciones
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumPage;
