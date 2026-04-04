import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Home, Building2, Check } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { useAuth } from '../contexts/AuthContext';

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
  type: 'home' | 'office';
}

export function AddressesPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    type: 'home' as 'home' | 'office',
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem('lumitani_addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      // Initialize with default address
      const defaultAddresses: Address[] = [
        {
          id: '1',
          label: 'Rumah',
          name: 'User LumiTani',
          phone: '08123456789',
          address: 'Jl. Raya Manud Jaya No. 123',
          city: 'Bekasi',
          postalCode: '17510',
          isPrimary: true,
          type: 'home',
        },
      ];
      setAddresses(defaultAddresses);
      localStorage.setItem('lumitani_addresses', JSON.stringify(defaultAddresses));
    }
  }, [isLoggedIn, navigate]);

  const handleSaveAddress = () => {
    if (!formData.label || !formData.name || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      alert('Mohon lengkapi semua data');
      return;
    }

    if (editingAddress) {
      // Update existing address
      const updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id
          ? { ...addr, ...formData }
          : addr
      );
      setAddresses(updatedAddresses);
      localStorage.setItem('lumitani_addresses', JSON.stringify(updatedAddresses));
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isPrimary: addresses.length === 0,
      };
      const updatedAddresses = [...addresses, newAddress];
      setAddresses(updatedAddresses);
      localStorage.setItem('lumitani_addresses', JSON.stringify(updatedAddresses));
    }

    // Reset form
    setFormData({
      label: '',
      name: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      type: 'home',
    });
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      type: address.type,
    });
    setShowAddForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('Hapus alamat ini?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses(updatedAddresses);
      localStorage.setItem('lumitani_addresses', JSON.stringify(updatedAddresses));
    }
  };

  const handleSetPrimary = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isPrimary: addr.id === id,
    }));
    setAddresses(updatedAddresses);
    localStorage.setItem('lumitani_addresses', JSON.stringify(updatedAddresses));
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
          <h1 className="text-lg text-gray-900">Alamat Pengiriman</h1>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-auto text-green-600 hover:text-green-700 p-2"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h3 className="text-sm text-gray-900 mb-4" style={{ fontWeight: 600 }}>
              {editingAddress ? 'Edit Alamat' : 'Tambah Alamat Baru'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Label Alamat</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Contoh: Rumah, Kantor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFormData({ ...formData, type: 'home' })}
                  className={`flex-1 py-2 rounded-lg border text-sm flex items-center justify-center gap-2 ${
                    formData.type === 'home'
                      ? 'bg-green-50 border-green-600 text-green-600'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Rumah
                </button>
                <button
                  onClick={() => setFormData({ ...formData, type: 'office' })}
                  className={`flex-1 py-2 rounded-lg border text-sm flex items-center justify-center gap-2 ${
                    formData.type === 'office'
                      ? 'bg-green-50 border-green-600 text-green-600'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Kantor
                </button>
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Nama Penerima</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama lengkap penerima"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jalan, nomor rumah, RT/RW, kelurahan"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Kota/Kabupaten</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Bekasi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="17510"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                    setFormData({
                      label: '',
                      name: '',
                      phone: '',
                      address: '',
                      city: '',
                      postalCode: '',
                      type: 'home',
                    });
                  }}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveAddress}
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Address List */}
        {!showAddForm && addresses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Belum Ada Alamat</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Tambahkan alamat pengiriman untuk mempermudah checkout
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Tambah Alamat
            </button>
          </div>
        )}

        {!showAddForm && addresses.length > 0 && (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-xl shadow-sm p-4 ${
                  address.isPrimary ? 'border-2 border-green-600' : 'border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      {address.type === 'home' ? (
                        <Home className="w-4 h-4 text-green-600" />
                      ) : (
                        <Building2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                        {address.label}
                      </h4>
                      {address.isPrimary && (
                        <span className="text-xs text-green-600">Alamat Utama</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-sm text-gray-900">{address.name}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600">{address.address}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.postalCode}
                  </p>
                </div>

                {!address.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(address.id)}
                    className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Jadikan Alamat Utama
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        {!showAddForm && addresses.length > 0 && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-green-900 mb-1">Tips Alamat</h4>
                <p className="text-xs text-green-700">
                  Pastikan alamat lengkap dan benar untuk pengiriman yang lancar
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
