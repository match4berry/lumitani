import { useNavigate } from 'react-router';
import { ArrowLeft, User, MapPin, Phone, Mail, ShoppingBag, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from './BottomNav';
import logo from 'figma:asset/f889d239b2dddde1243ddadd7a407e3d43b3a8d2.png';
import { useState, useEffect } from 'react';

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout, user, isLoggedIn } = useAuth();
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, addresses: 0 });

  useEffect(() => {
    // Load stats from localStorage
    const orders = JSON.parse(localStorage.getItem('lumitani_orders') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('lumitani_wishlist') || '[]');
    const addresses = JSON.parse(localStorage.getItem('lumitani_addresses') || '[]');
    
    setStats({
      orders: orders.length,
      wishlist: wishlist.length,
      addresses: addresses.length,
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center max-w-md mx-auto px-4 pb-24">
        <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mb-6">
          <User className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-xl text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>
          Silakan Login
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Login untuk mengakses profil dan fitur lainnya
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          Login Sekarang
        </button>
        <BottomNav />
      </div>
    );
  }

  const menuItems = [
    { icon: ShoppingBag, label: 'Pesanan Saya', badge: null, onClick: () => navigate('/my-orders') },
    { icon: Heart, label: 'Wishlist', badge: null, onClick: () => navigate('/wishlist') },
    { icon: MapPin, label: 'Alamat Pengiriman', badge: null, onClick: () => navigate('/addresses') },
    { icon: Settings, label: 'Pengaturan Akun', badge: null, onClick: () => navigate('/settings') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">Profil Saya</h1>
        </div>
      </header>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 px-6 py-8">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-green-600" />
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-white">
            <h2 className="text-xl mb-1">{user?.name || 'User'}</h2>
            <p className="text-sm text-green-100">{user?.email || 'user@email.com'}</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mx-4 -mt-6 bg-white rounded-2xl shadow-md p-4 mb-4">
        <div className="grid grid-cols-3 divide-x divide-gray-200">
          <div className="text-center">
            <p className="text-2xl text-green-600 mb-1">{stats.orders}</p>
            <p className="text-xs text-gray-600">Pesanan</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-green-600 mb-1">{stats.wishlist}</p>
            <p className="text-xs text-gray-600">Wishlist</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-green-600 mb-1">{stats.addresses}</p>
            <p className="text-xs text-gray-600">Alamat</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <item.icon className="w-5 h-5 text-green-600" />
              </div>
              <span className="flex-1 text-left text-gray-900">{item.label}</span>
              {item.badge && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="px-4 mb-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <img src={logo} alt="LumiTani" className="h-12" />
            <div>
              <h4 className="text-sm text-green-900 mb-1">Member LumiTani</h4>
              <p className="text-xs text-green-700">
                Terima kasih telah mendukung petani lokal Desa Manud Jaya! 🌱
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mb-4">
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}