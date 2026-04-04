import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import logo from 'figma:asset/f889d239b2dddde1243ddadd7a407e3d43b3a8d2.png';

export function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!fullName || !email || !password) {
      alert('Semua field harus diisi!');
      return;
    }
    
    // Simpan data registrasi (untuk demo, simpan ke localStorage)
    const userData = {
      name: fullName,
      email: email,
      password: password, // In production, don't store plain password
    };
    
    localStorage.setItem('lumitani_registered_user', JSON.stringify(userData));
    
    // Tampilkan pesan sukses
    setShowSuccess(true);
    
    // Setelah 2 detik, arahkan ke halaman login
    setTimeout(() => {
      navigate('/login', { state: { registered: true } });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col max-w-md mx-auto">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center shadow-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">Pendaftaran Berhasil!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Akun Anda telah dibuat. Silakan login untuk melanjutkan.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Logo Section */}
      <div className="flex flex-col items-center pt-4 pb-6 px-4">
        <img src={logo} alt="LumiTani" className="h-20 mb-4" />
        <h1 className="text-2xl text-gray-900 mb-2">Daftar di LumiTani</h1>
        <p className="text-sm text-gray-600 text-center">
          Bergabung dan mulai belanja produk segar dari petani lokal
        </p>
      </div>

      {/* Register Form */}
      <div className="flex-1 px-6 py-4">
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label htmlFor="fullName" className="block text-sm text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
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
            <p className="text-xs text-gray-500 mt-1">
              Minimal 8 karakter
            </p>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors shadow-md mt-6"
          >
            Daftar
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-green-600 hover:text-green-700"
            >
              Login
            </button>
          </p>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🌱</div>
            <div className="flex-1">
              <h4 className="text-sm text-green-900 mb-1">Keuntungan Bergabung</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>✓ Produk segar langsung dari petani</li>
                <li>✓ Harga terjangkau tanpa perantara</li>
                <li>✓ Dukung ekonomi lokal Desa Manud Jaya</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}