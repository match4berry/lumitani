import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from './BottomNav';

export function AllCategoriesPage() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Sayuran Hijau', icon: '🥬', color: 'bg-green-100', description: '15 Produk' },
    { name: 'Buah-buahan', icon: '🍅', color: 'bg-red-100', description: '12 Produk' },
    { name: 'Umbi-umbian', icon: '🥕', color: 'bg-orange-100', description: '8 Produk' },
    { name: 'Bumbu Dapur', icon: '🌿', color: 'bg-emerald-100', description: '10 Produk' },
    { name: 'Paket Hemat', icon: '📦', color: 'bg-yellow-100', description: '6 Paket' },
    { name: 'Sayuran Buah', icon: '🫑', color: 'bg-purple-100', description: '9 Produk' },
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/catalog/${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">Semua Kategori</h1>
        </div>
      </header>

      {/* Category Grid */}
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">
          Pilih kategori untuk melihat produk yang tersedia
        </p>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 hover:scale-105 active:scale-95"
            >
              {/* Category Icon */}
              <div className={`${category.color} h-32 flex items-center justify-center text-6xl`}>
                {category.icon}
              </div>
              
              {/* Category Info */}
              <div className="p-3 text-center">
                <h3 className="text-sm text-gray-900 mb-1">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <h4 className="text-sm text-green-900 mb-1">Produk Organik 100%</h4>
              <p className="text-xs text-green-700">
                Semua produk berasal langsung dari petani lokal Desa Manud Jaya dengan kualitas terjamin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}