"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Navbar from '../navBar/navBar';
import Swal from 'sweetalert2';

const Comercio = ({ id }) => {
  // Variables de estado y router
  const router = useRouter();
  const [comercio, setComercio] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewContent, setReviewContent] = useState({
    comentario: '',
    puntuacion: 0
  });
  const [userToken, setUserToken] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Hook useEffect que se ejecuta al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setUserToken(token);
    if (id) {
      fetchComercio(id);
      fetchReviews(id);
    }
  }, [id]);

  // Función para obtener los datos del comercio
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

  // Función para obtener las reseñas del comercio
  const fetchReviews = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/comercios/contenido/reviews/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
        const token = localStorage.getItem('userToken');
        const userResponse = await fetch('http://localhost:3000/api/user/perfil', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userReview = data.find(review => review.userName === userData.nombre);
          setHasReviewed(!!userReview);
        }
      } else {
        console.error('Error fetching reviews:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

   // Función para manejar los cambios en el formulario de reseña
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewContent({
      ...reviewContent,
      [name]: value
    });
  };

  // Función para manejar el envío del formulario de reseña
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/user/${comercio.paginaID._id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(reviewContent)
      });
      if (response.ok) {
        Swal.fire('¡Gracias!', 'Tu reseña ha sido publicada.', 'success');
        setReviewContent({ comentario: '', puntuacion: 0 });
        fetchReviews(id);
        fetchComercio(id)
      } else {
        const errorText = await response.text();
        console.error('Error posting review:', response.statusText);
        Swal.fire('Error', 'Hubo un problema al publicar tu reseña. ' + errorText, 'error');
      }
    } catch (error) {
      console.error('Error posting review:', error);
      Swal.fire('Error', 'Hubo un problema al publicar tu reseña. ' + error.message, 'error');
    }
  };

  if (!comercio) {
    return <div>Loading...</div>;
  }

   // Función para renderizar estrellas de puntuación
  const renderStars = (scoring, size = "text-base") => {
    const totalStars = 5;
    const fullStars = Math.floor(scoring);
    const halfStar = scoring % 1 >= 0.5;
    const emptyStars = Math.max(totalStars - fullStars - (halfStar ? 1 : 0), 0);

    return (
      <div className={`${size} ml-4`}>
        {Array(fullStars).fill().map((_, i) => (
          <span key={`full-${i}`} className="text-orange-400">★</span>
        ))}
        {halfStar && <span className="text-orange-400">☆</span>}
        {Array(emptyStars).fill().map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-400">★</span>
        ))}
      </div>
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
            <div className="flex items-center ">
              <h1 className="text-3xl font-bold my-8">{comercio.nombre}</h1>
              <div className="flex items-center">{renderStars(comercio.paginaID.scoring, "text-3xl")}
                <span className="ml-2 text-gray-600">({comercio.paginaID.scoring.toFixed(1)})</span>
              </div>
            </div>
            <p className="text-blue-500 text-xl ">{comercio.paginaID.ciudad}</p>
            <p className="text-blue-900 text-xl ">{comercio.direccion}</p>
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
                {userToken && !hasReviewed && (
                  <form onSubmit={handleReviewSubmit} className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Deja tu reseña</h3>
                    <div className="mb-4">
                      <label className="block text-gray-700">Comentario</label>
                      <textarea
                        name="comentario"
                        value={reviewContent.comentario}
                        onChange={handleReviewChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        rows="3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Puntuación</label>
                      <div className="flex">
                        {Array(5).fill().map((_, i) => (
                          <span
                            key={i}
                            className={`cursor-pointer text-2xl ${reviewContent.puntuacion > i ? 'text-orange-400' : 'text-gray-400'}`}
                            onClick={() => setReviewContent({ ...reviewContent, puntuacion: i + 1 })}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Enviar Reseña
                    </button>
                  </form>
                )}
                {userToken && hasReviewed && (
                  <p className="text-red-500 mt-4">Ya has publicado una reseña para este comercio.</p>
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
