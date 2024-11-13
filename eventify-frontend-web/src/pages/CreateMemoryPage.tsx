// src/pages/CreateMemoryPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CreateMemoryPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { eventId } = location.state || {};

    const [formData, setFormData] = useState({
        memoryName: '',
        description: '',
        coverPhoto: null as File | null,
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({
            ...prev,
            coverPhoto: file,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos

        // Crear Memory
        const memoryData = new FormData();
        memoryData.append('memoryName', formData.memoryName);
        memoryData.append('description', formData.description);
        if (formData.coverPhoto) {
            memoryData.append('coverPhoto', formData.coverPhoto);
        }

        try {
            const createMemoryResponse = await axios.post('http://localhost:8080/memories', memoryData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const memoryId = createMemoryResponse.data.id;

            if (eventId && memoryId) {
                await axios.post(`http://localhost:8080/event/${eventId}/memory/${memoryId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            }

            navigate('/homePage');
        } catch (error) {
            console.error('Error creating memory:', error);
            setError('Hubo un error al crear el memory. Por favor, revisa los datos e intenta de nuevo.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Crear Memory</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Nombre del Memory</label>
                        <input
                            type="text"
                            name="memoryName"
                            value={formData.memoryName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Foto de Portada</label>
                        <input
                            type="file"
                            name="coverPhoto"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border rounded"
                            accept="image/*"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Crear Memory
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateMemoryPage;
