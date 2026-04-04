import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, User, Phone, Home, MessageSquare, ShoppingBag, CreditCard, Wallet, Banknote } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useOrder, ShippingAddress, OrderItem } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { createOrder } = useOrder();
  const { user, isLoggedIn } = useAuth();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'Transfer Bank' | 'E-Wallet' | 'COD' | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress | 'paymentMethod', string>>>({});

  // Redirect to login if not authenticated
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center max-w-md mx-auto px-4">
        <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mb-6">
          <User className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-xl text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>
          Login Diperlukan
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Silakan login terlebih dahulu untuk melanjutkan checkout
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          Login Sekarang
        </button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress | 'paymentMethod', string>> = {};

    if (!shippingAddress.name.trim()) {
      newErrors.name = 'Nama penerima wajib diisi';
    }
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9]{10,13}$/.test(shippingAddress.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Nomor telepon tidak valid (10-13 digit)';
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = 'Alamat lengkap wajib diisi';
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'Kota wajib diisi';
    }
    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode = 'Kode pos wajib diisi';
    } else if (!/^[0-9]{5}$/.test(shippingAddress.postalCode)) {
      newErrors.postalCode = 'Kode pos harus 5 digit';
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Metode pembayaran wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderNow = () => {
    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      alert('Keranjang belanja kosong!');
      return;
    }

    setIsProcessing(true);

    // Convert cart items to order items with price snapshot
    const orderItems: OrderItem[] = cart.map((item) => ({
      productName: item.name,
      quantity: item.quantity,
      priceAtOrder: item.price * item.quantity,
      pricePerUnit: item.price,
      image: item.image,
    }));

    // Create order with snapshot data
    const order = createOrder(
      orderItems,
      shippingAddress,
      getTotalPrice(),
      user.email,
      paymentMethod
    );

    // Clear cart after successful order
    clearCart();

    // Navigate to success page
    setTimeout(() => {
      setIsProcessing(false);
      navigate(`/order-success/${order.id}`);
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center max-w-md mx-auto px-4">
        <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-xl text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>
          Keranjang Kosong
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Silakan tambahkan produk ke keranjang terlebih dahulu
        </p>
        <button
          onClick={() => navigate('/catalog/all')}
          className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          Mulai Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate('/cart')} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">Checkout</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-gray-900 mb-3" style={{ fontWeight: 700 }}>
            Ringkasan Pesanan
          </h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                  <p className="text-sm text-green-600" style={{ fontWeight: 600 }}>
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-gray-900" style={{ fontWeight: 700 }}>Total</span>
            <span className="text-xl text-green-600" style={{ fontWeight: 700 }}>
              {formatPrice(getTotalPrice())}
            </span>
          </div>
        </div>

        {/* Shipping Address Form */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-gray-900 mb-4 flex items-center gap-2" style={{ fontWeight: 700 }}>
            <MapPin className="w-5 h-5 text-green-600" />
            Alamat Pengiriman
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Nama Penerima
              </label>
              <input
                type="text"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                placeholder="Masukkan nama penerima"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-400" />
                Alamat Lengkap
              </label>
              <textarea
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* City and Postal Code */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Kota</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  placeholder="Jakarta"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Kode Pos</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  placeholder="12345"
                  maxLength={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                Catatan (Opsional)
              </label>
              <textarea
                value={shippingAddress.notes}
                onChange={(e) => setShippingAddress({ ...shippingAddress, notes: e.target.value })}
                placeholder="Contoh: Harap hubungi sebelum mengirim"
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-gray-900 mb-4 flex items-center gap-2" style={{ fontWeight: 700 }}>
            <CreditCard className="w-5 h-5 text-green-600" />
            Metode Pembayaran
          </h2>

          <div className="space-y-4">
            {/* Transfer Bank */}
            <div className="flex items-center">
              <input
                type="radio"
                value="Transfer Bank"
                checked={paymentMethod === 'Transfer Bank'}
                onChange={() => setPaymentMethod('Transfer Bank')}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-gray-400" />
                Transfer Bank
              </label>
            </div>

            {/* E-Wallet */}
            <div className="flex items-center">
              <input
                type="radio"
                value="E-Wallet"
                checked={paymentMethod === 'E-Wallet'}
                onChange={() => setPaymentMethod('E-Wallet')}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-gray-400" />
                E-Wallet
              </label>
            </div>

            {/* COD */}
            <div className="flex items-center">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                COD (Bayar di Tempat)
              </label>
            </div>
          </div>

          {errors.paymentMethod && <p className="text-xs text-red-500 mt-1">{errors.paymentMethod}</p>}
        </div>

        {/* Order Now Button */}
        <button
          onClick={handleOrderNow}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl text-white flex items-center justify-center gap-2 transition-colors ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          style={{ fontWeight: 600 }}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Memproses...
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Order Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}