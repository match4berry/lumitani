import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Check, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BottomNav } from './BottomNav';
import { useCart } from '../contexts/CartContext';

export function CatalogPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const bestSellerProducts = [
    { name: 'Bayam Organik', icon: '🥬', price: 10000, image: 'https://images.unsplash.com/photo-1741515042603-70545daeb0c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNwaW5hY2glMjBvcmdhbmljJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Kangkung Segar', icon: '🌿', price: 10000, image: 'https://images.unsplash.com/photo-1767334573903-f280cb211993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHdhdGVyJTIwc3BpbmFjaCUyMGthbmdrdW5nfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Tomat Merah', icon: '🍅', price: 18000, image: 'https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHJlZCUyMHRvbWF0b2VzfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Wortel Fresh', icon: '🥕', price: 15000, image: 'https://images.unsplash.com/photo-1741515044901-58696421d24a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNhcnJvdHMlMjBvcmdhbmljfGVufDF8fHx8MTc3Mjk2OTM2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Cabai Rawit', icon: '🌶️', price: 35000, image: 'https://images.unsplash.com/photo-1601876818790-33a0783ec542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjaGlsaSUyMHBlcHBlcnN8ZW58MXx8fHwxNzcyOTM5NjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Sawi Hijau', icon: '🥬', price: 12000, image: 'https://images.unsplash.com/photo-1700150618387-3f46b6d2cf8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyZWVuJTIwdmVnZXRhYmxlcyUyMG11c3RhcmR8ZW58MXx8fHwxNzczMDI0NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Brokoli Segar', icon: '🥦', price: 25000, image: 'https://images.unsplash.com/photo-1757332051618-c7ee2f6f570a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyb2Njb2xpJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyMjI2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Terong Ungu', icon: '🍆', price: 14000, image: 'https://images.unsplash.com/photo-1659261111792-66709e46d53d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjBlZ2dwbGFudCUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzMwMjQ1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  ];

  const allProducts = [
    { name: 'Bayam Organik', icon: '🥬', price: 10000, image: 'https://images.unsplash.com/photo-1741515042603-70545daeb0c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNwaW5hY2glMjBvcmdhbmljJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Sayuran Hijau' },
    { name: 'Kangkung Segar', icon: '🌿', price: 10000, image: 'https://images.unsplash.com/photo-1767334573903-f280cb211993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHdhdGVyJTIwc3BpbmFjaCUyMGthbmdrdW5nfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Sayuran Hijau' },
    { name: 'Tomat Merah', icon: '🍅', price: 18000, image: 'https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHJlZCUyMHRvbWF0b2VzfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Buah-buahan' },
    { name: 'Wortel Fresh', icon: '🥕', price: 15000, image: 'https://images.unsplash.com/photo-1741515044901-58696421d24a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNhcnJvdHMlMjBvcrghbmljfGVufDF8fHx8MTc3Mjk2OTM2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Umbi-umbian' },
    { name: 'Cabai Rawit', icon: '🌶️', price: 35000, image: 'https://images.unsplash.com/photo-1601876818790-33a0783ec542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjaGlsaSUyMHBlcHBlcnN8ZW58MXx8fHwxNzcyOTM5NjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Bumbu Dapur' },
    { name: 'Sawi Hijau', icon: '🥬', price: 12000, image: 'https://images.unsplash.com/photo-1700150618387-3f46b6d2cf8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyZWVuJTIwdmVnZXRhYmxlcyUyMG11c3RhcmR8ZW58MXx8fHwxNzczMDI0NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Sayuran Hijau' },
    { name: 'Brokoli Segar', icon: '🥦', price: 25000, image: 'https://images.unsplash.com/photo-1757332051618-c7ee2f6f570a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyb2Njb2xpJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyMjI2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Sayuran Hijau' },
    { name: 'Terong Ungu', icon: '🍆', price: 14000, image: 'https://images.unsplash.com/photo-1659261111792-66709e46d53d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjBlZ2dwbGFudCUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzMwMjQ1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Buah-buahan' },
    { name: 'Selada Segar', icon: '🥗', price: 8000, image: 'https://images.unsplash.com/photo-1760368104719-3515320cf545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGxldHR1Y2UlMjBzYWxhZHxlbnwxfHx8fDE3NzI5NTc2ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Sayuran Hijau' },
    { name: 'Mentimun Hijau', icon: '🥒', price: 9000, image: 'https://images.unsplash.com/photo-1759147876638-9f4721769152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGN1Y3VtYmVyJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyNDU4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Buah-buahan' },
    { name: 'Paprika Merah', icon: '🫑', price: 28000, image: 'https://images.unsplash.com/photo-1760361571885-b6b2dee1d25a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBiZWxsJTIwcGVwcGVyJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyNDU5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Buah-buahan' },
    { name: 'Jagung Manis', icon: '🌽', price: 13000, image: 'https://images.unsplash.com/photo-1565679867504-657ff4bfdd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHN3ZWV0JTIwY29ybnxlbnwxfHx8fDE3NzMwMjQ1OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Buah-buahan' },
    { name: 'Kentang Organik', icon: '🥔', price: 12000, image: 'https://images.unsplash.com/photo-1744659751904-3b2e5c095323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHBvdGF0byUyMG9yZ2FuaWN8ZW58MXx8fHwxNzczMDI0NTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Umbi-umbian' },
    { name: 'Ubi Jalar', icon: '🍠', price: 11000, image: 'https://images.unsplash.com/photo-1757283961582-ab596b0ca595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VldCUyMHBvdGF0byUyMG9yZ2FuaWN8ZW58MXx8fHwxNzczMDI0NTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Umbi-umbian' },
    { name: 'Bawang Merah', icon: '🧅', price: 32000, image: 'https://images.unsplash.com/photo-1588613000160-2b766dd44779?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBvbmlvbiUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzMwMjQ1OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Bumbu Dapur' },
    { name: 'Jahe Segar', icon: '🫚', price: 20000, image: 'https://images.unsplash.com/photo-1717769071502-e9b5d06c5fc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdpbmdlciUyMHJvb3R8ZW58MXx8fHwxNzczMDI0NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Bumbu Dapur' },
    { name: 'Kunyit Fresh', icon: '🟡', price: 18000, image: 'https://images.unsplash.com/photo-1768729341217-0e11cb959252?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHR1cm1lcmljJTIwcm9vdHxlbnwxfHx8fDE3NzI5NDQ4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Bumbu Dapur' },
    { name: 'Paket Sayur A', icon: '📦', price: 45000, image: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBidW5kbGUlMjBwYWNrYWdlfGVufDF8fHx8MTc3MzAyNDU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Paket Hemat' },
    { name: 'Paket Sayur B', icon: '📦', price: 65000, image: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBidW5kbGUlMjBwYWNrYWdlfGVufDF8fHx8MTc3MzAyNDU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Paket Hemat' },
    { name: 'Paket Bumbu', icon: '📦', price: 55000, image: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBidW5kbGUlMjBwYWNrYWdlfGVufDF8fHx8MTc3MzAyNDU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Paket Hemat' },
  ];

  // Decode URL parameter for category names with special characters
  const decodedType = type ? decodeURIComponent(type) : '';
  
  // Determine products to display based on type
  let products;
  let title;
  
  if (decodedType === 'bestseller') {
    products = bestSellerProducts;
    title = 'Best Seller';
  } else if (decodedType === 'all') {
    products = allProducts;
    title = 'Katalog Produk';
  } else if (decodedType) {
    // Category filter
    products = allProducts.filter(product => product.category === decodedType);
    title = decodedType;
  } else {
    products = allProducts;
    title = 'Katalog Produk';
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product: { name: string; price: number; image: string }) => {
    addToCart(product);
    setAddedProductId(product.name);
    setTimeout(() => setAddedProductId(null), 2000);
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">{title}</h1>
        </div>
      </header>

      {/* Product Grid */}
      <div className="p-4">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 mb-2">Belum ada produk dalam kategori ini</p>
            <button
              onClick={() => navigate('/catalog/all')}
              className="text-green-600 hover:text-green-700 text-sm mt-4"
            >
              ← Lihat Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Product Image - Clickable */}
                <div 
                  className="relative h-40 bg-gray-100 cursor-pointer"
                  onClick={() => handleProductClick(product.name)}
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {type === 'bestseller' && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full">
                      ⭐ Best
                    </div>
                  )}
                  {/* View Detail Overlay on Hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="bg-white text-gray-900 px-3 py-2 rounded-lg flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
                      <Eye className="w-4 h-4" />
                      Lihat Detail
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 
                    className="text-sm text-gray-900 mb-1 cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => handleProductClick(product.name)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-green-600 mb-3" style={{ fontWeight: 600 }}>{formatPrice(product.price)}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* View Detail Button (Mobile) */}
                    <button
                      onClick={() => handleProductClick(product.name)}
                      className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-green-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-xs">Detail</span>
                    </button>
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-green-700 transition-colors"
                    >
                      {addedProductId === product.name ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      <span className="text-xs">Tambah</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <BottomNav />
    </div>
  );
}