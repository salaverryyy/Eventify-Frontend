// src/components/ActionButton.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ActionButtonProps {
  onClick: () => void;
  color: string;
  icon: React.ElementType; // Acepta cualquier componente React como ícono
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, color, icon: Icon, label }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center justify-center ${color} rounded-3xl shadow-2xl text-white p-6 cursor-pointer transition-shadow duration-300`}
  >
    <div className="flex flex-col items-center">
      <Icon className="h-12 w-12 mb-2" /> {/* Renderiza el ícono pasado como componente */}
      <span className="mt-2 text-2xl font-bold">{label}</span>
    </div>
  </motion.div>
);

export default ActionButton;

