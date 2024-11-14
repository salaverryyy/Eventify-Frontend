// src/components/MemoryCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface Memory {
  memoryId: number;
  coverPhoto: string;
  event: {
    eventName: string;
    eventDate: string;
  } | null;
}

const MemoryCard: React.FC<{ memory: Memory }> = ({ memory }) => (
  <motion.div
    key={memory.memoryId}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative border rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300"
  >
    <img
      src={memory.coverPhoto}
      alt="Cover"
      className="w-full h-64 object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
    />
    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 backdrop-blur-md">
      {memory.event ? (
        <>
          <h2 className="text-2xl font-extrabold text-white">{memory.event.eventName}</h2>
          <p className="text-sm text-white mt-1">Fecha del Evento: {memory.event.eventDate}</p>
        </>
      ) : (
        <p className="text-center text-white">Sin evento asociado</p>
      )}
    </div>
  </motion.div>
);

export default MemoryCard;
