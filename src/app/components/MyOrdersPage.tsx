import { useNavigate } from 'react-router';
import { ArrowLeft, Package, ChevronRight } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from './BottomNav';

export function MyOrdersPage() {
  const navigate = useNavigate();
  const { getOrdersByUserId } = useOrder();
  const { user, isLoggedIn } = useAuth();

  const orders = user ? getOrdersByUserId(user.email) : [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Menunggu Pembayaran': 'bg-orange-100 text-orange-700',
      'Menunggu Diproses': 'bg-yellow-100 text-yellow-700',
      'Diproses': 'bg-blue-100 text-blue-700',
      'Dikirim': 'bg-purple-100 text-purple-700',
      'Selesai': 'bg-green-100 text-green-700',
      'Dibatalkan': 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center max-w-md mx-auto px-4 pb-24">
        <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mb-6">
          <Package className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-xl text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>
          Silakan Login
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Login untuk melihat riwayat pesanan Anda
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          Login Sekarang
        </button>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate('/profile')} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">Pesanan Saya</h1>
        </div>
      </header>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20">
          <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mb-6">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-xl text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>
            Belum ada pesanan
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
        <div className="p-4 space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/order-detail/${order.id}`)}
              className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                    {order.id}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}
                  style={{ fontWeight: 600 }}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Items Preview */}
              <div className="mb-3 pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 mb-2">
                  {order.items.length} produk
                </p>
                <div className="flex gap-2 overflow-x-auto">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="text-xs text-gray-700 bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap">
                      {item.productName}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-xs text-gray-500 px-3 py-1">
                      +{order.items.length - 3} lainnya
                    </div>
                  )}
                </div>
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Belanja</p>
                  <p className="text-green-600" style={{ fontWeight: 700 }}>
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}