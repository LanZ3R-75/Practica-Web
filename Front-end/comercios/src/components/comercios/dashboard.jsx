// src/components/comercio/ComercioDashboard.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Navbar from "../navBar/navBar";

const ComercioDashboard = () => {
  const router = useRouter();
  const [comercio, setComercio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [emails, setEmails] = useState([]);
  const [editContent, setEditContent] = useState({
    ciudad: '',
    actividad: '',
    titulo: '',
    resumen: ''
  });
  const [newText, setNewText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('comercioToken');
    if (!token) {
      router.push('/comercios/login');
    } else {
      fetchComercio(token);
    }
  }, []);

  const fetchComercio = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/comercios/info', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComercio(data);
        setEditContent({
          ciudad: data.contenido?.ciudad || '',
          actividad: data.contenido?.actividad || '',
          titulo: data.contenido?.titulo || '',
          resumen: data.contenido?.resumen || ''
        });
      } else {
        console.error("Error fetching comercio:", response.statusText);
        setComercio(null);
      }
    } catch (error) {
      console.error("Error fetching comercio:", error);
      setComercio(null);
    }
  };

  const handleDeleteComercio = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este comercio.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteComercio();
      }
    });
  };

  const deleteComercio = async () => {
    const token = localStorage.getItem('comercioToken');
    try {
      const response = await fetch('http://localhost:3000/api/comercios', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        Swal.fire("¡El comercio ha sido eliminado!", {
          icon: "success",
        });
        router.push('/comercios');
      } else {
        console.error("Error deleting comercio:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting comercio:", error);
    }
  };

  const handleDeleteContenido = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este contenido.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteContenido();
      }
    });
  };

  const deleteContenido = async () => {
    const token = localStorage.getItem('comercioToken');
    try {
      const response = await fetch('http://localhost:3000/api/comercios/contenido', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        Swal.fire("¡El contenido ha sido eliminado!", {
          icon: "success",
        });
        fetchComercio(token);  // Refrescar datos del comercio
      } else {
        console.error("Error deleting content:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const handleEditContentChange = (e) => {
    setEditContent({
      ...editContent,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveContent = async () => {
    const token = localStorage.getItem('comercioToken');
    try {
      const response = await fetch('http://localhost:3000/api/comercios/contenido', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editContent),
      });
      if (response.ok) {
        const data = await response.json();
        setComercio((prev) => ({
          ...prev,
          contenido: data.contenido,
        }));
        setIsEditing(false);
      } else {
        console.error("Error updating content:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const handleAddText = async () => {
    const token = localStorage.getItem('comercioToken');
    try {
      const response = await fetch('http://localhost:3000/api/comercios/contenido/texts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newText }),
      });
      if (response.ok) {
        const data = await response.json();
        setComercio(prev => ({
          ...prev,
          contenido: {
            ...prev.contenido,
            text: data.texto
          }
        }));
        setNewText("");
      } else {
        console.error("Error adding text:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding text:", error);
    }
  };

  const handleDeleteText = async (index) => {
    const token = localStorage.getItem('comercioToken');
    try {
      const response = await fetch(`http://localhost:3000/api/comercios/contenido/texts/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComercio(prev => ({
          ...prev,
          contenido: {
            ...prev.contenido,
            text: data.texto
          }
        }));
      } else {
        console.error("Error deleting text:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting text:", error);
    }
  };

  const handleAddFoto = async () => {
    const token = localStorage.getItem('comercioToken');
    try {
      const response = await fetch('http://localhost:3000/api/comercios/contenido/foto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ foto: newFoto }),
      });
      if (response.ok) {
        const data = await response.json();
        setComercio(prev => ({
          ...prev,
          contenido: {
            ...prev.contenido,
            fotos: data.fotos
          }
        }));
        setNewFoto("");
      } else {
        console.error("Error adding foto:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding foto:", error);
    }
  };

  const handleDeleteFoto = async (index) => {
    const token = localStorage.getItem('comercioToken');
    try {
      const response = await fetch(`http://localhost:3000/api/comercios/contenido/foto/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComercio(prev => ({
          ...prev,
          contenido: {
            ...prev.contenido,
            fotos: data.fotos
          }
        }));
      } else {
        console.error("Error deleting foto:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting foto:", error);
    }
  };

  // Función para manejar la consulta de intereses
    const handleConsultarIntereses = async () => {
        const token = localStorage.getItem('comercioToken');
        try {
        const response = await fetch('http://localhost:3000/api/comercios/contenido/intereses', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setEmails(data.emails);
        } else {
            console.error("Error fetching emails:", response.statusText);
        }
        } catch (error) {
        console.error("Error fetching emails:", error);
        }
    };

  const handleCreateContenido = () => {
    router.push('/comercios/crearContenido');
  };

  if (!comercio) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <div
        className="relative h-screen w-full overflow-hidden"
        style={{ backgroundImage: "url('/images/fondo.png')" }}
      >
        <div className="absolute inset-0 bg-cover bg-center backdrop-filter backdrop-blur-md"></div>
        <div className="absolute inset-0 overflow-y-auto px-4 pt-20">
          <div className="container mx-auto px-4 bg-white bg-opacity-90 rounded-lg shadow-lg p-6">

          <h1 className="text-4xl mb-6 text-black text-outline font-bold my-4 ">Comercio Dashboard</h1>
      <section>
        <div className="flex">
            <h2 className="text-2xl text-black font-bold mb-2">Información del Comercio</h2>

            <button
            onClick={handleDeleteComercio}
            className="bg-red-500 text-white px-4 py-2 rounded ml-10"
          >
            Eliminar Comercio
          </button>

        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p><strong>Nombre:</strong> {comercio.nombre}</p>
            <p><strong>Email:</strong> {comercio.email}</p>
            <p><strong>CIF:</strong> {comercio.CIF}</p>
          </div>
          
        </div>
      </section>
      <section className="mt-8 mb-10">
        <h2 className="text-2xl text-black font-bold mb-2">Contenido Asociado</h2>
        {comercio.contenido ? (
          isEditing ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  value={editContent.ciudad}
                  onChange={handleEditContentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Actividad</label>
                <input
                  type="text"
                  name="actividad"
                  value={editContent.actividad}
                  onChange={handleEditContentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={editContent.titulo}
                  onChange={handleEditContentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Resumen</label>
                <textarea
                  name="resumen"
                  value={editContent.resumen}
                  onChange={handleEditContentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button
                onClick={handleSaveContent}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <p><strong>Ciudad:</strong> {comercio.contenido.ciudad}</p>
              <p><strong>Actividad:</strong> {comercio.contenido.actividad}</p>
              <p><strong>Título:</strong> {comercio.contenido.titulo}</p>
              <p><strong>Resumen:</strong> <span className="truncate">{comercio.contenido.resumen}</span></p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-5"
              >
                Editar Contenido
              </button>
              <button
                onClick={handleDeleteContenido}
                className="bg-red-500 text-white px-4 py-2 rounded mt-5 ml-2"
              >
                Borrar Contenido
              </button>
              <div className="flex  mt-5">
                <div className="w-1/2 pr-2">
                  <strong>Textos:</strong>
                  <ul className="list-disc pl-5">
                    {comercio.contenido.text.map((texto, index) => (
                      <li key={index} className="flex justify-between items-center">
                        {texto}
                        <button
                          onClick={() => handleDeleteText(index)}
                          className="ml-2 text-red-500 bg-transparent"
                        >
                          <img src="/images/papelera.png" alt="Eliminar" className="h-4 w-4 " />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      placeholder="Nuevo texto"
                      className="border border-gray-300 p-2 rounded "
                    />
                    <button
                      onClick={handleAddText}
                      className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Añadir Texto
                    </button>
                  </div>
                </div>
                <div className=" ml-10 w-1/2 pl-2">
                  <strong>Fotos:</strong>
                  <ul>
                    {comercio.contenido.fotos.map((foto, index) => (
                      <li key={index}><img src={foto} alt={`Foto ${index + 1}`} /></li>
                    ))}
                  </ul>
                </div>
              </div>
              <section className="mt-8">
                <h2 className="text-2xl text-black font-bold mb-2">Consultar Intereses</h2>
                <div className="mt-4">
                <button
                    onClick={handleConsultarIntereses}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Consultar Intereses
                </button>
                </div>
                <div className="mt-4">
                <strong>Emails:</strong>
                <ul>
                    {emails.map((email, index) => (
                    <li key={index}>{email}</li>
                    ))}
                </ul>
                </div>
            </section>
            </>
          )
        ) : (
          <>
            <p>No hay contenido asociado.</p>
            <button
              onClick={handleCreateContenido}
              className="bg-green-500 text-white px-4 py-2 rounded mt-5"
            >
              Crear Contenido
            </button>
          </>
        )}
      </section>
      
    </div>
    </div>
    </div>
    
    </>
  );
  
}

export default ComercioDashboard;
