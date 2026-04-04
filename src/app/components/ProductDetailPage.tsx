import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, ShoppingCart, Zap, Package, Users, Calendar, CheckCircle, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../contexts/CartContext';

interface ProductDetails {
  name: string;
  price: number;
  image: string;
  farmer: string;
  stock: number;
  lastHarvest: string;
  description: string;
  unit: string;
}

export function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showAdded, setShowAdded] = useState(false);

  // Product database (in production, this would come from API)
  const productDatabase: Record<string, ProductDetails> = {
    'bayam-organik': {
      name: 'Bayam Organik',
      price: 10000,
      image: 'https://images.unsplash.com/photo-1741515042603-70545daeb0c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNwaW5hY2glMjBvcmdhbmljJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Pak Budi - Desa Manud Jaya',
      stock: 50,
      lastHarvest: '2 hari yang lalu',
      description: 'Bayam organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Kaya akan zat besi dan vitamin A untuk kesehatan keluarga.',
      unit: 'per ikat (250g)',
    },
    'kangkung-segar': {
      name: 'Kangkung Segar',
      price: 10000,
      image: 'https://images.unsplash.com/photo-1767334573903-f280cb211993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHdhdGVyJTIwc3BpbmFjaCUyMGthbmdrdW5nfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Ibu Siti - Desa Manud Jaya',
      stock: 45,
      lastHarvest: '1 hari yang lalu',
      description: 'Kangkung organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Renyah dan segar untuk berbagai masakan.',
      unit: 'per ikat (300g)',
    },
    'tomat-merah': {
      name: 'Tomat Merah',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHJlZCUyMHRvbWF0b2VzfGVufDF8fHx8MTc3MzAyNDU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Pak Ahmad - Desa Manud Jaya',
      stock: 60,
      lastHarvest: '3 hari yang lalu',
      description: 'Tomat merah organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Manis dan segar untuk masakan atau jus.',
      unit: 'per kg',
    },
    'wortel-fresh': {
      name: 'Wortel Fresh',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1741515044901-58696421d24a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNhcnJvdHMlMjBvcmdhbmljfGVufDF8fHx8MTc3Mjk2OTM2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Pak Joko - Desa Manud Jaya',
      stock: 40,
      lastHarvest: '2 hari yang lalu',
      description: 'Wortel organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Kaya vitamin A dan cocok untuk berbagai masakan.',
      unit: 'per kg',
    },
    'cabai-rawit': {
      name: 'Cabai Rawit',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1601876818790-33a0783ec542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjaGlsaSUyMHBlcHBlcnN8ZW58MXx8fHwxNzcyOTM5NjE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Ibu Ani - Desa Manud Jaya',
      stock: 30,
      lastHarvest: '1 hari yang lalu',
      description: 'Cabai rawit organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Pedas dan segar untuk masakan Indonesia.',
      unit: 'per 100g',
    },
    'sawi-hijau': {
      name: 'Sawi Hijau',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1700150618387-3f46b6d2cf8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyZWVuJTIwdmVnZXRhYmxlcyUyMG11c3RhcmR8ZW58MXx8fHwxNzczMDI0NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Pak Budi - Desa Manud Jaya',
      stock: 55,
      lastHarvest: '2 hari yang lalu',
      description: 'Sawi hijau organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Renyah dan segar untuk sup atau tumisan.',
      unit: 'per ikat (400g)',
    },
    'brokoli-segar': {
      name: 'Brokoli Segar',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1757332051618-c7ee2f6f570a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyb2Njb2xpJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyMjI2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Ibu Siti - Desa Manud Jaya',
      stock: 35,
      lastHarvest: '3 hari yang lalu',
      description: 'Brokoli organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Kaya nutrisi dan cocok untuk menu sehat keluarga.',
      unit: 'per bonggol (500g)',
    },
    'terong-ungu': {
      name: 'Terong Ungu',
      price: 14000,
      image: 'https://images.unsplash.com/photo-1659261111792-66709e46d53d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjBlZ2dwbGFudCUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzMwMjQ1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Pak Ahmad - Desa Manud Jaya',
      stock: 42,
      lastHarvest: '2 hari yang lalu',
      description: 'Terong ungu organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Cocok untuk berbagai masakan tradisional.',
      unit: 'per kg',
    },
    'selada-segar': {
      name: 'Selada Segar',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1760368104719-3515320cf545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGxldHR1Y2UlMjBzYWxhZHxlbnwxfHx8fDE3NzI5NTc2ODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Ibu Ani - Desa Manud Jaya',
      stock: 48,
      lastHarvest: '1 hari yang lalu',
      description: 'Selada organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Renyah dan segar untuk salad sehat.',
      unit: 'per ikat (200g)',
    },
    'mentimun-hijau': {
      name: 'Mentimun Hijau',
      price: 9000,
      image: 'https://images.unsplash.com/photo-1759147876638-9f4721769152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGN1Y3VtYmVyJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyNDU4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Pak Joko - Desa Manud Jaya',
      stock: 52,
      lastHarvest: '2 hari yang lalu',
      description: 'Mentimun organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Segar dan renyah untuk lalapan atau salad.',
      unit: 'per kg',
    },
    'paprika-merah': {
      name: 'Paprika Merah',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1760361571885-b6b2dee1d25a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBiZWxsJTIwcGVwcGVyJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MzAyNDU5MHww&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Ibu Siti - Desa Manud Jaya',
      stock: 28,
      lastHarvest: '3 hari yang lalu',
      description: 'Paprika merah organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Manis dan kaya vitamin C.',
      unit: 'per kg',
    },
    'jagung-manis': {
      name: 'Jagung Manis',
      price: 13000,
      image: 'https://images.unsplash.com/photo-1565679867504-657ff4bfdd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHN3ZWV0JTIwY29ybnxlbnwxfHx8fDE3NzMwMjQ1OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      farmer: 'Pak Budi - Desa Manud Jaya',
      stock: 38,
      lastHarvest: '2 hari yang lalu',
      description: 'Jagung manis organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Manis dan segar untuk berbagai olahan.',
      unit: 'per bonggol',
    },
  };

  const product = productId ? productDatabase[productId] : null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
    });

    // Redirect to checkout
    navigate('/checkout');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center max-w-md mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Produk tidak ditemukan</p>
          <button
            onClick={() => navigate('/catalog/all')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      {/* Success Toast */}
      {showAdded && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm" style={{ fontWeight: 600 }}>Ditambahkan ke keranjang!</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">Detail Produk</h1>
        </div>
      </header>

      {/* Product Image */}
      <div className="relative h-80 bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-4">
        {/* Product Name & Price */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h1 className="text-2xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>
            {product.name}
          </h1>
          <p className="text-3xl text-green-600 mb-1" style={{ fontWeight: 700 }}>
            {formatPrice(product.price)}
          </p>
          <p className="text-sm text-gray-500">{product.unit}</p>
        </div>

        {/* Product Info Grid */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Farmer */}
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Petani</p>
                <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                  {product.farmer}
                </p>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Stok Tersedia</p>
                <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                  {product.stock} {product.unit}
                </p>
              </div>
            </div>

            {/* Last Harvest */}
            <div className="flex items-start gap-3 col-span-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Panen Terakhir</p>
                <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                  {product.lastHarvest}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg text-gray-900 mb-3" style={{ fontWeight: 700 }}>
            Deskripsi Produk
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Features / Benefits */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="text-sm text-green-900 mb-3" style={{ fontWeight: 700 }}>
            ✨ Keunggulan Produk
          </h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>100% organik tanpa pestisida kimia</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Dipanen segar langsung dari kebun</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Mendukung petani lokal Desa Manud Jaya</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Harga transparan langsung dari petani</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-white border-2 border-green-600 text-green-600 py-3 rounded-xl hover:bg-green-50 transition-colors"
            style={{ fontWeight: 600 }}
          >
            <ShoppingCart className="w-5 h-5" />
            Keranjang
          </button>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors"
            style={{ fontWeight: 700 }}
          >
            <Zap className="w-5 h-5" />
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}