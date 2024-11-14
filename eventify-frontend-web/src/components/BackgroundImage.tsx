// src/components/BackgroundImage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface BackgroundImageProps {
  children?: React.ReactNode;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ children }) => {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/unsplash/random-image');
        const unsplashResponse = response.data;
        const parsedImageUrl = JSON.parse(unsplashResponse).urls.regular;
        setBackgroundUrl(parsedImageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchBackgroundImage();
  }, []);

  return (
    <div
      className="min-h-screen p-10 relative"
      style={{
        backgroundImage: `url(${backgroundUrl || ''})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {children}
      {!backgroundUrl && <p>Cargando imagen de fondo...</p>}
    </div>
  );
};

export default BackgroundImage;

