import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hook useEffect que se ejecuta al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

   // Función para alternar la apertura del menú
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

   // Función para manejar la navegación
  const handleNavigation = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
    handleNavigation('/usuariosRegistrados');
  };

  return (
    <nav className="navbar px-6 py-4 flex items-center justify-between w-full bg-blue-600 shadow-md fixed top-0 z-50">
      <button onClick={() => handleNavigation('/')} className="text-2xl font-bold bg-transparent flex items-center">
        <img src="/images/logo-Negro.png" alt="inicio" className="h-12 w-12 mr-2" />
        <span className="text-white">Shogyo</span>
      </button>
      <div className="relative">
        <button onClick={toggleMenu} className="focus:outline-none bg-transparent">
          <img src="/images/menu.png" alt="menu" className="h-8 w-8" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-md rounded-md transform transition-transform duration-200 ease-in-out">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigation('/usuariosRegistrados/perfil')}
                  className="block px-4 py-2 w-full text-left hover:bg-blue-100"
                >
                  Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 w-full text-left hover:bg-blue-100"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/usuariosRegistrados')}
                  className="block px-4 py-2 w-full text-left hover:bg-blue-100"
                >
                  Login Usuario
                </button>
                <button
                  onClick={() => handleNavigation('/comercios')}
                  className="block px-4 py-2 w-full text-left hover:bg-blue-100"
                >
                  Login Comercio
                </button>
                <button
                  onClick={() => handleNavigation('/admin')}
                  className="block px-4 py-2 w-full text-left hover:bg-blue-100"
                >
                  Login Admin
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
