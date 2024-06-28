"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Navbar from '../navBar/navBar';

const Comercio = ({ id }) => {
  const router = useRouter();
  const [comercio, setComercio] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (id) {
      fetchComercio(id);
      fetchReviews(id);
    }
  }, [id]);

  const fetchComercio = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/comercios/contenido/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComercio(data);
      } else {
        console.error('Error fetching comercio:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comercio:', error);
    }
  };

  const fetchReviews = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/comercios/contenido/reviews/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error('Error fetching reviews:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  if (!comercio) {
    return <div>Loading...</div>;
  }

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

  return (
    <>
      <Navbar />
      <div
        className="relative h-screen w-full overflow-hidden"
        style={{ backgroundImage: "url('/images/fondo.png')" }}
      >
        <div className="absolute inset-0 bg-cover bg-center backdrop-filter backdrop-blur-md"></div>
        <div className="absolute inset-0 overflow-y-auto px-4 pt-20">
          <div className="container mx-auto h-full px-4 bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold my-8">{comercio.nombre}</h1>
            <div className="flex items-center">
              {renderStars(comercio.paginaID.scoring)}
              <span className="ml-2 text-gray-600">({comercio.paginaID.scoring.toFixed(1)})</span>
            </div>
            <p className="text-blue-500 text-xl mt-2">{comercio.paginaID.ciudad}</p>
            <p className="text-gray-700 text-lg mt-2">{comercio.paginaID.actividad}</p>
            <p className="text-gray-700 text-base mt-4 whitespace-pre-line">{comercio.paginaID.resumen}</p>
            <div className="flex mt-8">
              <div className="w-1/2 pr-4">
                <h2 className="text-xl font-semibold mb-4">Textos</h2>
                <ul className="list-disc pl-5">
                  {comercio.paginaID.text.map((texto, index) => (
                    <li key={index} className="mb-2">{texto}</li>
                  ))}
                </ul>
              </div>
              <div className="w-1/2 pl-4">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                {reviews.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {reviews.map((review, index) => (
                      <li key={index} className="mb-2">
                        <strong>{review.userName}</strong>
                        <div className="flex items-center">
                          {renderStars(review.scoring)}
                          <span className="ml-2 text-gray-600">({review.scoring.toFixed(1)})</span>
                        </div>
                        <p>{review.comentario}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Se el primero en comentar</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comercio;
