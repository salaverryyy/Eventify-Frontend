// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/CreateEventPage';
import CreateMemoryPage from './pages/CreateMemoryPage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/create-memory" element={<CreateMemoryPage />} />
        </Routes>
    );
};

export default App;
