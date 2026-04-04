import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Package, MapPin, FileText, Clock, CreditCard } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrder();
  
  const order = getOrderById(orderId || '');

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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Menunggu Pembayaran': 'bg-orange-100 text-orange-700 border-orange-200',
      'Menunggu Diproses': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Diproses': 'bg-blue-100 text-blue-700 border-blue-200',
      'Dikirim': 'bg-purple-100 text-purple-700 border-purple-200',
      'Selesai': 'bg-green-100 text-green-700 border-green-200',
      'Dibatalkan': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center max-w-md mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Pesanan tidak ditemukan</p>
          <button
            onClick={() => navigate('/my-orders')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Kembali ke Pesanan Saya
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate('/my-orders')} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">Detail Pesanan</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <div className={`rounded-xl p-4 border ${getStatusColor(order.status)}`}>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <div>
              <p className="text-sm" style={{ fontWeight: 600 }}>Status Pesanan</p>
              <p className="text-lg" style={{ fontWeight: 700 }}>{order.status}</p>
            </div>
          </div>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
            <FileText className="w-5 h-5 text-green-600" />
            <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Informasi Pesanan</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID Pesanan</span>
              <span className="text-gray-900 text-right" style={{ fontWeight: 600 }}>{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal Pesanan</span>
              <span className="text-gray-900 text-right">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Terakhir Update</span>
              <span className="text-gray-900 text-right">{formatDate(order.updatedAt)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-gray-600">Metode Pembayaran</span>
              <span className="text-gray-900 text-right" style={{ fontWeight: 600 }}>{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
            <Package className="w-5 h-5 text-green-600" />
            <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Produk</h2>
          </div>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-gray-900 mb-1" style={{ fontWeight: 600 }}>
                    {item.productName}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {formatPrice(item.pricePerUnit)} x {item.quantity}
                  </p>
                  <p className="text-sm text-green-600" style={{ fontWeight: 700 }}>
                    {formatPrice(item.priceAtOrder)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Harga saat pemesanan
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">Subtotal Produk</span>
              <span className="text-gray-900">{formatPrice(order.totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">Biaya Pengiriman</span>
              <span className="text-green-600 text-sm" style={{ fontWeight: 600 }}>Gratis</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-900" style={{ fontWeight: 700 }}>Total Pembayaran</span>
              <span className="text-xl text-green-600" style={{ fontWeight: 700 }}>
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
            <MapPin className="w-5 h-5 text-green-600" />
            <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Alamat Pengiriman</h2>
          </div>

          <div className="text-sm space-y-2">
            <p className="text-gray-900" style={{ fontWeight: 600 }}>{order.shippingAddress.name}</p>
            <p className="text-gray-600">{order.shippingAddress.phone}</p>
            <p className="text-gray-600">{order.shippingAddress.address}</p>
            <p className="text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            {order.shippingAddress.notes && (
              <div className="pt-3 mt-3 border-t border-gray-100">
                <p className="text-gray-500 text-xs mb-1">Catatan:</p>
                <p className="text-gray-600">{order.shippingAddress.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {order.status === 'Menunggu Pembayaran' && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-sm text-orange-900 mb-2" style={{ fontWeight: 600 }}>
              Menunggu Pembayaran
            </p>
            <p className="text-xs text-orange-700">
              Silakan selesaikan pembayaran untuk melanjutkan pesanan. Pesanan akan otomatis dibatalkan jika pembayaran tidak diterima dalam 24 jam.
            </p>
          </div>
        )}

        {order.status === 'Menunggu Diproses' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900 mb-2" style={{ fontWeight: 600 }}>
              Pesanan sedang diproses
            </p>
            <p className="text-xs text-blue-700">
              Admin kami akan segera memproses pesanan Anda. Mohon menunggu konfirmasi lebih lanjut.
            </p>
          </div>
        )}

        {order.status === 'Dikirim' && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-purple-900 mb-2" style={{ fontWeight: 600 }}>
              Pesanan dalam pengiriman
            </p>
            <p className="text-xs text-purple-700">
              Pesanan Anda sedang dalam perjalanan. Harap pastikan ada yang menerima di alamat tujuan.
            </p>
          </div>
        )}

        {order.status === 'Selesai' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-900 mb-2" style={{ fontWeight: 600 }}>
              Pesanan selesai
            </p>
            <p className="text-xs text-green-700">
              Terima kasih telah berbelanja di LumiTani! Jangan lupa pesan lagi untuk kebutuhan sayur organik Anda.
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors"
          style={{ fontWeight: 600 }}
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}