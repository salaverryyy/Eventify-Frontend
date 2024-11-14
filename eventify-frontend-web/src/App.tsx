// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/CreateEventPage';
import CreateMemoryPage from './pages/CreateMemoryPage';

import AlbumPage from './pages/AlbumPage';
import ConfirmPage from './pages/ConfirmPage';
import ProfilePage from './pages/ProfilePage';
import PublicationsPage from './pages/PublicationsPage'; // Importa PublicationsPage


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/create-memory" element={<CreateMemoryPage />} />
            <Route path="/album/:memoryId" element={<AlbumPage />} />
            <Route path="/confirm/:invitationUUID" element={<ConfirmPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/publications" element={<PublicationsPage />} /> {/* Nueva ruta para PublicationsPage */}
        </Routes>
    );
};

export default App;


