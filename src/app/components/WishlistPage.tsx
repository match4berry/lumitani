import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Heart, Trash2, ShoppingCart, Plus, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BottomNav } from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface WishlistItem {
  name: string;
  price: number;
  image: string;
  addedAt: string;
}

export function WishlistPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('lumitani_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, [isLoggedIn, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRemoveFromWishlist = (productName: string) => {
    const updatedWishlist = wishlist.filter(item => item.name !== productName);
    setWishlist(updatedWishlist);
    localStorage.setItem('lumitani_wishlist', JSON.stringify(updatedWishlist));
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart(item);
    setAddedProductId(item.name);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const getProductId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const handleProductClick = (productName: string) => {
    const productId = getProductId(productName);
    navigate(`/product/${productId}`);
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
          <h1 className="text-lg text-gray-900">Wishlist Saya</h1>
          {wishlist.length > 0 && (
            <span className="ml-auto bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              {wishlist.length}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Wishlist Kosong</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Belum ada produk yang ditambahkan ke wishlist
            </p>
            <button
              onClick={() => navigate('/catalog/all')}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              Jelajahi Produk
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlist.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex gap-3 p-3">
                  {/* Product Image */}
                  <div
                    className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => handleProductClick(item.name)}
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm text-gray-900 mb-1 cursor-pointer hover:text-green-600 transition-colors"
                      onClick={() => handleProductClick(item.name)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-green-600 mb-2" style={{ fontWeight: 600 }}>
                      {formatPrice(item.price)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-green-600 text-white py-1.5 rounded-lg flex items-center justify-center gap-1 hover:bg-green-700 transition-colors text-xs"
                      >
                        {addedProductId === item.name ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Ditambahkan
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Keranjang
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.name)}
                        className="px-3 border border-red-200 text-red-600 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        {wishlist.length > 0 && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-green-900 mb-1">Tips Wishlist</h4>
                <p className="text-xs text-green-700">
                  Simpan produk favorit Anda di wishlist untuk memudahkan pembelian di lain waktu
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
