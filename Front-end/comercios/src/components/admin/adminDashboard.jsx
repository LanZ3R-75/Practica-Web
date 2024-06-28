"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navBar/navBar";

const AdminDashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [comercios, setComercios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
    } else {
      fetchUsers();
      fetchComercios();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchComercios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/comercios', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setComercios(data);
    } catch (error) {
      console.error('Error fetching comercios:', error);
    }
  };

  const handleRegisterComercio = () => {
    router.push('/admin/registrarComercio');
  };

  const deleteComercio = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/comercios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        setComercios(comercios.filter(comercio => comercio._id !== id));
      } else {
        console.error('Failed to delete comercio');
      }
    } catch (error) {
      console.error('Error deleting comercio:', error);
    }
  };

  const deleteUsuario = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== id));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const editComercio = (id) => {
    router.push(`/admin/editarComercio/${id}`);
  };

  const editUser = (id) => {
    router.push(`/admin/editarUsuarios/${id}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSearch = (e) => {
    setUserSearchTerm(e.target.value);
  };

  const filteredComercios = comercios.filter(comercio =>
    comercio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comercio.CIF.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/fondo.png')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center backdrop-filter backdrop-blur-md overflow-y-auto">
          <div className="container mx-auto px-4 mt-20 bg-transparent rounded p-6">
            <h1 className="text-4xl text-orange-500 font-bold my-4">Admin Dashboard</h1>
            <section>
              <h2 className="text-xl text-green-400 font-semibold mb-2">Users</h2>
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre o email"
                  value={userSearchTerm}
                  onChange={handleUserSearch}
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="overflow-y-auto max-h-60 sticky-header shadow-table">
                <table className="min-w-full bg-white">
                  <thead className="">
                    <tr className="text-gray-100">
                      <th className="py-2 px-4 border-b">ID</th>
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Email</th>
                      <th className="py-2 px-4 border-b">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td className="py-2 px-4 border-b">{user._id}</td>
                        <td className="py-2 px-4 border-b">{user.nombre}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex justify-center items-center space-x-2">
                            <button onClick={() => deleteUsuario(user._id)} className="no-outline bg-transparent">
                              <img src="/images/papelera.png" alt="Delete" className="h-6 w-6" />
                            </button>
                            <button onClick={() => editUser(user._id)} className="no-outline bg-transparent">
                              <img src="/images/editar.png" alt="Edit" className="h-6 w-6" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="mt-8">
              <h2 className="text-xl text-green-400 font-semibold mb-2">Comercios</h2>
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre o CIF"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="border border-gray-300 p-2 rounded"
                />
                <button
                  onClick={handleRegisterComercio}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Registrar Nuevo Comercio
                </button>
              </div>
              <div className="overflow-y-auto max-h-60 sticky-header shadow-table mb-10">
                <table className="min-w-full bg-white">
                  <thead >
                    <tr className="text-gray-100">
                      <th className="py-2 px-4 border-b">ID</th>
                      <th className="py-2 px-4 border-b">Nombre</th>
                      <th className="py-2 px-4 border-b">Email</th>
                      <th className="py-2 px-4 border-b">CIF</th>
                      <th className="py-2 px-4 border-b">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComercios.map(comercio => (
                      <tr key={comercio._id}>
                        <td className="py-2 px-4 border-b">{comercio._id}</td>
                        <td className="py-2 px-4 border-b">{comercio.nombre}</td>
                        <td className="py-2 px-4 border-b">{comercio.email}</td>
                        <td className="py-2 px-4 border-b">{comercio.CIF}</td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex justify-center items-center space-x-2">
                            <button onClick={() => deleteComercio(comercio._id)} className="no-outline bg-transparent">
                              <img src="/images/papelera.png" alt="Delete" className="h-6 w-6" />
                            </button>
                            <button onClick={() => editComercio(comercio._id)} className="no-outline bg-transparent">
                              <img src="/images/editar.png" alt="Edit" className="h-6 w-6" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default AdminDashboard;
