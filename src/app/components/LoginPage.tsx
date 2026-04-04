import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from 'figma:asset/f889d239b2dddde1243ddadd7a407e3d43b3a8d2.png';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if user just registered
  const justRegistered = location.state?.registered;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      alert('Email dan password harus diisi!');
      return;
    }
    
    // Extract name from email (simple approach for demo)
    const name = email.split('@')[0] || 'User';
    
    // Set status login dengan email dan nama
    login(email, name);
    
    // Redirect ke profil
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="p-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Success Message after Registration */}
      {justRegistered && (
        <div className="mx-4 mb-4 bg-green-100 border border-green-300 rounded-xl p-4">
          <p className="text-sm text-green-800 text-center">
            ✓ Akun berhasil dibuat! Silakan login untuk melanjutkan.
          </p>
        </div>
      )}

      {/* Logo Section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <img src={logo} alt="LumiTani" className="h-24 mb-6" />
        <h1 className="text-2xl text-gray-900 mb-2">Masuk ke LumiTani</h1>
        <p className="text-sm text-gray-600 text-center">
          Belanja produk segar langsung dari petani lokal
        </p>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 py-8">
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              Email atau Nomor HP
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email atau nomor HP"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => console.log('Lupa password')}
              className="text-sm text-green-600 hover:text-green-700"
            >
              Lupa password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors shadow-md mt-6"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-green-600 hover:text-green-700"
            >
              Daftar
            </button>
          </p>
        </div>

        {/* Decorative Element */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="text-4xl">🌱</div>
          <div className="text-center">
            <p className="text-xs text-gray-500">100% Organik</p>
            <p className="text-xs text-gray-500">Produk dari Desa Manud Jaya</p>
          </div>
        </div>
      </div>
    </div>
  );
}