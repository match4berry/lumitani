import { X, Home, Grid, Star, Info, ShoppingBag, Phone, LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Kategori Produk', path: '/categories' },
    { icon: Star, label: 'Best Seller', path: '/catalog/bestseller' },
    { icon: Info, label: 'Tentang Kami', path: '/about' },
    { icon: Phone, label: 'Kontak', path: '/contact' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Menu</h2>
            <button onClick={onClose} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {isLoggedIn ? (
            <div>
              <p className="text-sm opacity-90">Selamat datang!</p>
              <button
                onClick={() => {
                  navigate('/profile');
                  onClose();
                }}
                className="mt-2 bg-white text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Lihat Profil
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm opacity-90">Belum login?</p>
              <button
                onClick={() => {
                  navigate('/login');
                  onClose();
                }}
                className="mt-2 bg-white text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login Sekarang
              </button>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="py-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}