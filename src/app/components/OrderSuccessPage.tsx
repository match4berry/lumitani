import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { CheckCircle, Package, Home, FileText, CreditCard, AlertCircle } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';

export function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrder();
  const [order, setOrder] = useState(useOrder().getOrderById(orderId || ''));

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
      
      if (!foundOrder) {
        setTimeout(() => navigate('/'), 3000);
      }
    }
  }, [orderId, getOrderById, navigate]);

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center max-w-md mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Pesanan tidak ditemukan</p>
          <p className="text-sm text-gray-500">Mengalihkan ke halaman utama...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 max-w-md mx-auto px-4">
      {/* Success Icon */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>
          Pesanan Berhasil!
        </h1>
        <p className="text-gray-600 text-center">
          Terima kasih telah berbelanja di LumiTani
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <FileText className="w-5 h-5 text-green-600" />
          <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Detail Pesanan</h2>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">ID Pesanan</span>
            <span className="text-gray-900" style={{ fontWeight: 600 }}>{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tanggal Pesanan</span>
            <span className="text-gray-900">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs" style={{ fontWeight: 600 }}>
              {order.status}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-900" style={{ fontWeight: 700 }}>Total Pembayaran</span>
            <span className="text-lg text-green-600" style={{ fontWeight: 700 }}>
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <CreditCard className="w-5 h-5 text-green-600" />
          <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Metode Pembayaran</h2>
        </div>

        <div className="text-sm">
          <p className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>{order.paymentMethod}</p>
        </div>
      </div>

      {/* Payment Instructions - Show only if payment is required */}
      {order.status === 'Menunggu Pembayaran' && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-orange-900 mb-2" style={{ fontWeight: 600 }}>
                Menunggu Pembayaran
              </p>
              <p className="text-xs text-orange-700 mb-3">
                Silakan lakukan pembayaran untuk melanjutkan pesanan Anda.
              </p>
            </div>
          </div>

          {order.paymentMethod === 'Transfer Bank' && (
            <div className="bg-white rounded-lg p-3 text-xs space-y-2">
              <p className="text-gray-900" style={{ fontWeight: 600 }}>Instruksi Transfer Bank:</p>
              <div className="space-y-1">
                <p className="text-gray-700">Bank BCA</p>
                <p className="text-gray-700">No. Rekening: <span style={{ fontWeight: 600 }}>1234567890</span></p>
                <p className="text-gray-700">a.n. LumiTani</p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-700">Total Transfer:</p>
                <p className="text-green-600 text-base" style={{ fontWeight: 700 }}>
                  {formatPrice(order.totalPrice)}
                </p>
              </div>
              <p className="text-gray-600 italic">
                Konfirmasi pembayaran akan diproses dalam 1x24 jam
              </p>
            </div>
          )}

          {order.paymentMethod === 'E-Wallet' && (
            <div className="bg-white rounded-lg p-3 text-xs space-y-2">
              <p className="text-gray-900" style={{ fontWeight: 600 }}>Instruksi E-Wallet:</p>
              <div className="space-y-1">
                <p className="text-gray-700">Scan QR Code atau transfer ke:</p>
                <p className="text-gray-700">GoPay / OVO / Dana:</p>
                <p className="text-gray-700">No. HP: <span style={{ fontWeight: 600 }}>0812-3456-7890</span></p>
                <p className="text-gray-700">a.n. LumiTani</p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-700">Total Transfer:</p>
                <p className="text-green-600 text-base" style={{ fontWeight: 700 }}>
                  {formatPrice(order.totalPrice)}
                </p>
              </div>
              <p className="text-gray-600 italic">
                Konfirmasi pembayaran akan diproses dalam 1x24 jam
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info Box for COD */}
      {order.status === 'Menunggu Diproses' && order.paymentMethod === 'COD' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-900 mb-2" style={{ fontWeight: 600 }}>
            Pesanan Anda sedang diproses
          </p>
          <p className="text-xs text-blue-700">
            Pembayaran akan dilakukan saat barang diterima (COD). Admin kami akan segera memproses pesanan Anda.
          </p>
        </div>
      )}

      {/* Shipping Address Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <Package className="w-5 h-5 text-green-600" />
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
            <div className="pt-2 border-t border-gray-100">
              <p className="text-gray-500 text-xs">Catatan:</p>
              <p className="text-gray-600">{order.shippingAddress.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h2 className="text-gray-900 mb-4" style={{ fontWeight: 700 }}>Produk yang Dipesan</h2>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex-1">
                <p className="text-sm text-gray-900 mb-1">{item.productName}</p>
                <p className="text-xs text-gray-600">
                  {formatPrice(item.pricePerUnit)} x {item.quantity}
                </p>
              </div>
              <p className="text-sm text-green-600" style={{ fontWeight: 600 }}>
                {formatPrice(item.priceAtOrder)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/my-orders')}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          style={{ fontWeight: 600 }}
        >
          <FileText className="w-5 h-5" />
          Lihat Pesanan Saya
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          style={{ fontWeight: 600 }}
        >
          <Home className="w-5 h-5" />
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}