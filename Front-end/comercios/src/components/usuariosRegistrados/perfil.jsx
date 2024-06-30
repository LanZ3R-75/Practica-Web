"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import Navbar from "../navBar/navBar";

const UserProfile = () => {
  // Variables de estado y router
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editContent, setEditContent] = useState({
    ciudad: "",
    intereses: "",
    ofertas: false
  });
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const router = useRouter();

   // Función para obtener los datos del perfil del usuario
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:3000/api/user/perfil', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setEditContent({
          ciudad: userData.ciudad,
          intereses: userData.intereses.join(", "),
          ofertas: userData.ofertas
        });
      } else {
        console.error('Error fetching user:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Maneja los cambios en los campos de edición del perfil
  const handleEditContentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditContent({
      ...editContent,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Función para guardar los cambios del perfil
  const handleSaveContent = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch('http://localhost:3000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ciudad: editContent.ciudad,
          intereses: editContent.intereses.split(",").map(item => item.trim()),
          ofertas: editContent.ofertas
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsEditing(false);
        fetchUserProfile();

      } else {
        console.error("Error updating user:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Maneja los cambios en el campo de edición del email
  const handleEditEmailChange = (e) => {
    setEditEmail(e.target.value);
  };

    // Función para guardar el nuevo email
  const handleSaveEmail = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch('http://localhost:3000/api/user/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: editEmail }),
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsEditingEmail(false);
        fetchUserProfile();
        
      } else {
        console.error("Error updating email:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  // Maneja los cambios en el campo de edición de la contraseña
  const handleEditPasswordChange = (e) => {
    const { name, value } = e.target;
    setEditPassword({
      ...editPassword,
      [name]: value,
    });
  };
  
    // Función para guardar la nueva contraseña
  const handleSavePassword = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch('http://localhost:3000/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editPassword),
      });
      if (response.ok) {
        Swal.fire('¡Contraseña Actualizada!', 'Tu contraseña ha sido actualizada con éxito.', 'success');
        setIsEditingPassword(false);
      } else {
        console.error("Error updating password:", response.statusText);
        Swal.fire('Error', 'Hubo un problema al actualizar tu contraseña.', 'error');
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Swal.fire('Error', 'Hubo un problema al actualizar tu contraseña.', 'error');
    }
  };
  
  // Función para eliminar la cuenta del usuario
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar cuenta',
      cancelButtonText: 'Cancelar'
    });
  
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('http://localhost:3000/api/user/baja', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (response.ok) {
          Swal.fire('¡Eliminada!', 'Tu cuenta ha sido eliminada.', 'success');
          localStorage.removeItem('userToken');
          router.push('/');
        } else {
          Swal.fire('Error', 'Hubo un problema al eliminar tu cuenta.', 'error');
          fetchUserProfile();
        }
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar tu cuenta.', 'error');
        console.error('Error:', error);
      }
    }
  };
  
  if (!user) return <div>Loading...</div>;
  
  return (
    <>
      <Navbar />
      <div
        className="relative h-screen w-full overflow-hidden"
        style={{ backgroundImage: "url('/images/fondo.png')" }}
      >
        <div className="absolute inset-0 bg-cover bg-center backdrop-filter backdrop-blur-md"></div>
        <div className="absolute inset-0 overflow-y-auto px-4 pt-20 mt-20">
          <div className="container mx-auto px-4 bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
            <div className="flex center">
              <h1 className="text-2xl font-bold">Perfil</h1>
              <button
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white px-4 py-2 rounded mb-5 ml-2"
                  >
                    Darse de Baja
                  </button>
            </div>
            
            {isEditing ? (
              <>
                <div className="mb-4 ">
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
                  <label className="block text-gray-700">Intereses</label>
                  <input
                    type="text"
                    name="intereses"
                    value={editContent.intereses}
                    onChange={handleEditContentChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    <input
                      type="checkbox"
                      name="ofertas"
                      checked={editContent.ofertas}
                      onChange={handleEditContentChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Recibir Ofertas</span>
                  </label>
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
                <p><strong>Nombre:</strong> {user.nombre}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Ciudad:</strong> {user.ciudad}</p>
                <p><strong>Intereses:</strong> {user.intereses ? user.intereses.join(', ') : ''}</p>
                <p><strong>Recibir Ofertas:</strong> {user.ofertas ? 'Sí' : 'No'}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-5"
                >
                  Editar Perfil
                </button>
                
              </>
            )}
            {isEditingEmail ? (
              <>
                <div className="mb-4 mt-5">
                  <label className="block text-gray-700">Nuevo Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={handleEditEmailChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <button
                  onClick={handleSaveEmail}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar Email
                </button>
                <button
                  onClick={() => setIsEditingEmail(false)}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <div className="mt-5">
                <h2 className="text-xl font-bold">¿Quieres cambiar el correo?</h2>
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-5"
                >
                  Cambiar Email
                </button>
              </div>
            )}
            {isEditingPassword ? (
              <>
                <div className="mb-4 mt-5">
                  <label className="block text-gray-700">Contraseña Actual</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={editPassword.oldPassword}
                    onChange={handleEditPasswordChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Nueva Contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={editPassword.newPassword}
                    onChange={handleEditPasswordChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <button
                  onClick={handleSavePassword}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar Contraseña
                </button>
                <button
                  onClick={() => setIsEditingPassword(false)}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <div className="mt-5">
                <h2 className="text-xl font-bold">¿Quieres cambiar la contraseña?</h2>
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-5"
                >
                  Cambiar Contraseña
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
  
};

export default UserProfile;
