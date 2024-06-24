"use client"
// src/components/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [comercios, setComercios] = useState([]);

  useEffect(() => {
    // Check if the admin is logged in
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
      const response = await fetch('http://localhost:4000/api/admin/comercios', {
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

  return (
    
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Admin Dashboard</h1>
      <section>
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{user._id}</td>
                <td className="py-2 px-4 border-b">{user.nombre}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Comercios</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {comercios.map(comercio => (
              <tr key={comercio._id}>
                <td className="py-2 px-4 border-b">{comercio._id}</td>
                <td className="py-2 px-4 border-b">{comercio.nombre}</td>
                <td className="py-2 px-4 border-b">{comercio.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
