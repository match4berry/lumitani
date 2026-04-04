import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Phone, Save, Check } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { useAuth } from '../contexts/AuthContext';

export function SettingsPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [isLoggedIn, user, navigate]);

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert('Nama dan email wajib diisi');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Format email tidak valid');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      // Update user data in context
      updateUser({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      // Save to localStorage
      const savedUsers = localStorage.getItem('lumitani_users');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const updatedUsers = users.map((u: any) =>
          u.email === user?.email
            ? { ...u, name: formData.name, email: formData.email, phone: formData.phone }
            : u
        );
        localStorage.setItem('lumitani_users', JSON.stringify(updatedUsers));
      }

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate('/profile')} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">Pengaturan Akun</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {/* Success Message */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm text-green-900" style={{ fontWeight: 600 }}>
                Perubahan Tersimpan
              </h4>
              <p className="text-xs text-green-700">Data profil berhasil diperbarui</p>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-sm text-gray-900 mb-4" style={{ fontWeight: 600 }}>
            Informasi Pribadi
          </h3>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-xs text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@contoh.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email digunakan untuk login dan komunikasi
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-xs text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nomor telepon untuk konfirmasi pesanan
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-3 rounded-xl text-white flex items-center justify-center gap-2 transition-colors ${
            isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Simpan Perubahan
            </>
          )}
        </button>

        {/* Info Card */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔒</div>
            <div>
              <h4 className="text-sm text-blue-900 mb-1">Keamanan Data</h4>
              <p className="text-xs text-blue-700">
                Data pribadi Anda aman dan tidak akan dibagikan kepada pihak ketiga
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => navigate('/profile')}
            className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            Ubah Password
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Privasi & Keamanan
          </button>
        </div>

        {/* Danger Zone */}
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
          <div className="px-4 py-3 bg-red-50 border-b border-red-200">
            <h4 className="text-sm text-red-900" style={{ fontWeight: 600 }}>
              Zona Berbahaya
            </h4>
          </div>
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menonaktifkan akun? Tindakan ini tidak dapat dibatalkan.')) {
                alert('Fitur ini akan segera tersedia');
              }
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Nonaktifkan Akun
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
