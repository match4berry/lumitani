import { useState } from 'react';
import { Menu, Search, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import logo from 'figma:asset/f889d239b2dddde1243ddadd7a407e3d43b3a8d2.png';

export function LandingPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLihatProduk = () => {
    navigate('/catalog/all');
  };

  const categories = [
    { name: 'Sayuran Hijau', icon: '🥬', color: 'bg-green-100' },
    { name: 'Buah-buahan', icon: '🍅', color: 'bg-red-100' },
    { name: 'Umbi-umbian', icon: '🥕', color: 'bg-orange-100' },
    { name: 'Bumbu Dapur', icon: '🌿', color: 'bg-emerald-100' },
    { name: 'Paket Hemat', icon: '📦', color: 'bg-yellow-100' }
  ];

  const bestSellerProducts = [
    { 
      name: 'Bayam Organik', 
      icon: '🥬', 
      price: 'Rp 10.000/kg',
      image: 'https://images.unsplash.com/photo-1741515042603-70545daeb0c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNwaW5hY2glMjBvcmdhbmljJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      name: 'Kangkung Segar', 
      icon: '🌿', 
      price: 'Rp 10.000/kg',
      image: 'https://images.unsplash.com/photo-1767334573903-f280cb211993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHdhdGVyJTIwc3BpbmFjaCUyMGthbmdrdW5nfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      name: 'Tomat Merah', 
      icon: '🍅', 
      price: 'Rp 18.000/kg',
      image: 'https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHJlZCUyMHRvbWF0b2VzfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      name: 'Wortel Fresh', 
      icon: '🥕', 
      price: 'Rp 15.000/kg',
      image: 'https://images.unsplash.com/photo-1741515044901-58696421d24a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNhcnJvdHMlMjBvcmdhbmljfGVufDF8fHx8MTc3Mjk2OTM2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      name: 'Cabai Rawit', 
      icon: '🌶️', 
      price: 'Rp 35.000/kg',
      image: 'https://images.unsplash.com/photo-1601876818790-33a0783ec542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjaGlsaSUyMHBlcHBlcnN8ZW58MXx8fHwxNzcyOTM5NjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/catalog/${encodeURIComponent(categoryName)}`);
  };

  const getProductId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const handleProductClick = (productName: string) => {
    const productId = getProductId(productName);
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="flex items-center">
            <img src={logo} alt="LumiTani" className="h-10" />
          </div>
          
          <button className="p-2">
            <Search className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Profile Section */}
      <section className="relative">
        {/* Image of Farmer */}
        <div className="relative">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZhcm1lciUyMHNtaWxpbmclMjBmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0fGVufDF8fHx8MTc3MjYwMjU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Petani Desa Manud Jaya"
            className="w-full h-64 object-cover"
          />
          {/* Decorative sticker */}
          <div className="absolute top-3 left-3 bg-pink-500 text-white px-4 py-2 rounded-full text-sm transform -rotate-12 shadow-lg z-20">
            Segar! 🌱
          </div>
        </div>
      </section>

      {/* Hero Banner - Langsung dari Petani Lokal */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 mt-3 px-4 py-8 text-white relative overflow-hidden">
        <div className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full"></div>
        <div className="absolute bottom-8 left-8 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-1/2 right-12 text-6xl opacity-20 rotate-12">✨</div>
        
        <div className="text-center relative z-10">
          <h3 className="text-3xl mb-2" style={{ fontWeight: 800 }}>Langsung dari Petani Lokal</h3>
          <p className="text-green-100 mb-4">
            100% Organik • Harga Transparan • Segar Setiap Hari
          </p>
          <button 
            onClick={handleLihatProduk}
            className="bg-white text-green-700 px-6 py-2 rounded-full hover:bg-green-50 transition-colors inline-flex items-center gap-2"
          >
            Belanja Sekarang
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bg-white mt-3 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-900">Best Seller</span>
          </h3>
          <button 
            onClick={() => navigate('/catalog/bestseller')}
            className="text-sm text-green-600 flex items-center gap-1 hover:text-green-700 transition-colors"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {bestSellerProducts.map((product, index) => (
            <div 
              key={index}
              onClick={() => handleProductClick(product.name)}
              className="flex-shrink-0 w-36 cursor-pointer"
            >
              <div className="relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md hover:scale-105 transition-all">
                {/* Product Image */}
                <div className="relative h-36 bg-gray-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Best Seller Badge */}
                  <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    ⭐ Best
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-2">
                  <p className="text-sm text-gray-900 mb-1 line-clamp-1 hover:text-green-600 transition-colors">{product.name}</p>
                  <p className="text-xs text-green-600" style={{ fontWeight: 600 }}>{product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white mt-3 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-gray-900">Kategori Produk</span>
            <span className="text-2xl">🌾</span>
          </h3>
          <button 
            onClick={() => navigate('/categories')}
            className="text-sm text-green-600 flex items-center gap-1 hover:text-green-700 transition-colors"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="flex-shrink-0 w-24 text-center"
            >
              <div className={`${category.color} w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer`}>
                {category.icon}
              </div>
              <p className="text-sm text-gray-700 mt-2">{category.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}