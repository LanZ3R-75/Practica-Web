import React from 'react';
import { useRouter } from 'next/navigation';

const ComercioCard = ({ comercio }) => {
  const router = useRouter();

  // Función para renderizar las estrellas de puntuación
  const renderStars = (scoring) => {
    const totalStars = 5;
    const fullStars = Math.floor(scoring);
    const halfStar = scoring % 1 >= 0.5;
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars).fill().map((_, i) => (
          <span key={`full-${i}`} className="text-orange-400">★</span>
        ))}
        {halfStar && <span className="text-orange-400">☆</span>}
        {Array(emptyStars).fill().map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-400">★</span>
        ))}
      </>
    );
  };

  if (!comercio.paginaID) return null; // Si no hay datos de la página, no renderiza nada

  // Maneja el clic en la tarjeta para redirigir a la página de contenidos del comercio
  const handleCardClick = () => {
    router.push(`/usuariosPublicos/contenidos/${comercio._id}`);
  };

  return (
    <div onClick={handleCardClick} className="w-80 h-50 cursor-pointer max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{comercio.nombre}</div>
        <div className="flex items-center mb-2">
          {renderStars(comercio.paginaID.scoring)}
          <span className="ml-2 text-gray-600">({comercio.paginaID.scoring.toFixed(1)})</span>
        </div>
        <p className="text-blue-500 text-base">{comercio.paginaID.ciudad}</p>
        <p className="text-gray-700 text-base">{comercio.paginaID.actividad}</p>
        <p className="text-gray-700 text-base truncate">{comercio.paginaID.resumen}</p>
      </div>
    </div>
  );
};

export default ComercioCard;
