import { useNavigate, useLocation } from 'react-router';
import { Home, Grid3x3, Info, User, LogIn, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { getTotalItems } = useCart();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const totalItems = getTotalItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 max-w-md mx-auto">
      <div className="flex items-center justify-around py-2 relative">
        {/* Home */}
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            isActive('/') ? 'text-green-600' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>
        
        {/* Katalog */}
        <button 
          onClick={() => navigate('/catalog/all')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            isActive('/catalog/all') || location.pathname.startsWith('/catalog/') 
              ? 'text-green-600' 
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <Grid3x3 className="w-6 h-6" />
          <span className="text-xs">Katalog</span>
        </button>
        
        {/* Floating Cart Button */}
        <button 
          onClick={() => navigate('/cart')}
          className="absolute -top-6 bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center" style={{ fontWeight: 700 }}>
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </div>
        </button>
        
        {/* Tentang Kami */}
        <button 
          onClick={() => navigate('/about')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            isActive('/about') ? 'text-green-600' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <Info className="w-6 h-6" />
          <span className="text-xs">Tentang</span>
        </button>
        
        {/* Profil / Login */}
        <button 
          onClick={() => navigate(isLoggedIn ? '/profile' : '/login')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            isActive('/profile') || isActive('/login') 
              ? 'text-green-600' 
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          {isLoggedIn ? <User className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          <span className="text-xs">{isLoggedIn ? 'Profil' : 'Login'}</span>
        </button>
      </div>
    </nav>
  );
}