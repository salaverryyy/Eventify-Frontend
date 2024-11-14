// ProfilePage.tsx

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ProfilePicture from '../components/ProfilePicture';
import EditProfileModal from '../components/EditProfileModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // Modal de edición de perfil
  const [isEditPhoto, setIsEditPhoto] = useState(false); // Estado para activar edición de foto
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/usuarios/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(response.data);
        fetchProfilePic();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchProfilePic = async () => {
      try {
        const response = await axios.get('http://localhost:8080/media/profile-pic', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProfilePicUrl(response.data || null);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSaveProfileChanges = async (updatedData: typeof userData) => {
    try {
      await axios.put(`http://localhost:8080/usuarios/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserData(updatedData);
      setIsEditProfileOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:8080/usuarios/${userId}/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteProfilePic = async () => {
    try {
      await axios.delete('http://localhost:8080/media/profile-pic', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfilePicUrl(null); // Actualiza la vista después de eliminar la foto
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  return (
    <div className="p-8">
      <button onClick={() => navigate(-1)} className="text-blue-500 text-xl">&#8592; Volver</button>
      <h1 className="text-3xl font-bold mb-4">Perfil de Usuario</h1>

      <ProfilePicture
        profilePicUrl={profilePicUrl}
        isEditPhoto={isEditPhoto}
        onEdit={() => setIsEditPhoto(true)}
        onSave={(newUrl) => {
          setProfilePicUrl(newUrl);
          setIsEditPhoto(false);
        }}
        onDeletePhoto={handleDeleteProfilePic}
        onCancelEdit={() => setIsEditPhoto(false)} // Función para cancelar la edición
      />

      <UserInfo
        userData={userData}
        onEdit={() => setIsEditProfileOpen(true)} // Abrir el modal de edición de perfil
        onDelete={() => setIsDeleteConfirmOpen(true)}
      />

      {isEditProfileOpen && (
        <EditProfileModal
          userData={userData}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleSaveProfileChanges}
        />
      )}

      {isDeleteConfirmOpen && (
        <DeleteConfirmModal
          onConfirm={handleDeleteUser}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;





