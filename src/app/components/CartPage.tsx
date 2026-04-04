import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BottomNav } from './BottomNav';

export function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">Keranjang Belanja</h1>
          {cart.length > 0 && (
            <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              {getTotalItems()} item
            </span>
          )}
        </div>
      </header>

      {/* Empty Cart State */}
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20">
          <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-xl text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>
            Keranjang kamu masih kosong
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Yuk, mulai belanja produk organik segar dari petani lokal!
          </p>
          <button
            onClick={() => navigate('/catalog/all')}
            className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="p-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>
                      {item.name}
                    </h3>
                    <p className="text-green-600 mb-3">
                      {formatPrice(item.price)}/kg
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-gray-900 w-8 text-center" style={{ fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-gray-900" style={{ fontWeight: 700 }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Bottom Summary - Fixed */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 z-30 max-w-md mx-auto">
          <div className="p-4">
            {/* Price Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Item</span>
                <span className="text-gray-900">{getTotalItems()} produk</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-900" style={{ fontWeight: 700 }}>Total Harga</span>
                <span className="text-xl text-green-600" style={{ fontWeight: 700 }}>
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <ShoppingBag className="w-5 h-5" />
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}