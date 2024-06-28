import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsOpen(false);
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
            <button
              onClick={() => handleNavigation('/usuarios')}
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
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
