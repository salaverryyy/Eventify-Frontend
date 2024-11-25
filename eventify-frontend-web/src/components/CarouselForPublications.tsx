import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { BackgroundGradient } from "../components/ui/background-gradient";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import axios from "axios";
import { getUserIdFromToken } from "../api"; // Utility to get userId from token

interface Publication {
  id: number;
  description: string;
  mediaUrl: string | null; // URL for the publication photo (presigned URL)
}

const CarouselForPublications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchPublications = async () => {
        console.log(userId)
      try {
        // Fetch publications for the logged-in user
        const response = await axios.get(
          `http://localhost:8080/publication/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const fetchedPublications = response.data;

        // For each publication, fetch the presigned photo URL
        const publicationsWithPhotos = await Promise.all(
          fetchedPublications.map(async (publication: any) => {
            try {
              const photoResponse = await axios.get(
                `http://localhost:8080/publication/${publication.id}/publication`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              return {
                id: publication.id,
                description: publication.description,
                mediaUrl: photoResponse.data,
              };
            } catch (error) {
              console.error(
                `Error fetching photo for publication ${publication.id}:`,
                error
              );
              return {
                id: publication.id,
                description: publication.description,
                mediaUrl: null,
              };
            }
          })
        );

        setPublications(publicationsWithPhotos);
      } catch (error) {
        console.error("Error fetching publications:", error);
      }
    };

    fetchPublications();
  }, [userId]);

  if (publications.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No hay publicaciones aún.
      </p>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full max-w-xs mx-auto mt-8"
    >
      <CarouselContent className="h-[400px]">
        {publications.map((publication) => (
          <CarouselItem key={publication.id} className="pt-1">
            <div className="p-2">
                <BackgroundGradient >
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  {publication.mediaUrl ? (
                    <img
                      src={publication.mediaUrl}
                      alt="Publicación"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-lg mb-4">
                      <p className="text-gray-500">Sin imagen</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-700 text-center">
                    {publication.description}
                  </p>
                </CardContent>
              </Card>
                </BackgroundGradient>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselForPublications;
