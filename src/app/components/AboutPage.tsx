import { useNavigate } from 'react-router';
import { ArrowLeft, Leaf, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BottomNav } from './BottomNav';
import logo from 'figma:asset/f889d239b2dddde1243ddadd7a407e3d43b3a8d2.png';

export function AboutPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Leaf,
      title: '100% Organik',
      description: 'Produk langsung dari petani lokal Desa Manud Jaya tanpa pestisida kimia'
    },
    {
      icon: ShieldCheck,
      title: 'Transparan & Terkelola',
      description: 'Sistem transaksi berbasis teknologi yang aman dan terpercaya'
    },
    {
      icon: TrendingUp,
      title: 'Harga Adil',
      description: 'Tanpa perantara berlebih, petani dapat harga layak, konsumen hemat'
    },
    {
      icon: Users,
      title: 'Akses Pasar Luas',
      description: 'Menghubungkan petani dengan konsumen dan pelaku usaha perkotaan'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">Tentang Kami</h1>
        </div>
      </header>

      {/* Hero Section with Logo */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 px-6 py-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <img src={logo} alt="LumiTani" className="h-16" />
          </div>
        </div>
        <h2 className="text-2xl text-white mb-2" style={{ fontWeight: 700 }}>Tentang LumiTani</h2>
        <p className="text-green-100 text-sm">Platform Marketplace Pertanian Organik</p>
      </section>

      {/* Main Description Card */}
      <section className="px-4 -mt-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <p className="text-gray-700 text-center leading-relaxed">
            LumiTani adalah platform web yang dirancang untuk <span className="text-green-700 font-semibold">meningkatkan kesejahteraan petani Desa Manud Jaya</span> dengan memperluas akses pasar ke konsumen dan pelaku usaha perkotaan melalui sistem transaksi yang <span className="text-green-700 font-semibold">terkelola, transparan dan berbasis teknologi</span>.
          </p>
        </div>
      </section>

      {/* Farmer Image */}
      <section className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-xl overflow-hidden shadow-md">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZhcm1lciUyMHNtaWxpbmclMjBmcmVzaCUyMHZlZ2V0YWJsZXMlMjBoYXJ2ZXN0fGVufDF8fHx8MTc3MjYwMjU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Petani Desa Manud Jaya"
              className="w-full h-40 object-cover"
            />
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-md">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1768113802440-cb8b176a591c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMHZlZ2V0YWJsZXMlMjBmaWVsZCUyMGZyZXNofGVufDF8fHx8MTc3MzAzNDU2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Lahan Pertanian Organik"
              className="w-full h-40 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 mb-6">
        <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span>Keunggulan LumiTani</span>
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>{feature.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission Card */}
      <section className="px-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="text-center mb-3">
            <span className="text-4xl">🌱</span>
          </div>
          <h3 className="text-lg text-gray-900 text-center mb-2" style={{ fontWeight: 700 }}>Misi Kami</h3>
          <p className="text-sm text-gray-700 text-center leading-relaxed">
            Membangun ekosistem pertanian yang berkelanjutan dengan menghubungkan langsung petani lokal dengan konsumen perkotaan, menciptakan nilai tambah bagi semua pihak.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-lg text-gray-900 mb-2">Mulai Belanja Sekarang!</h3>
          <p className="text-sm text-gray-600 mb-4">Dukung petani lokal dengan berbelanja produk organik segar</p>
          <button 
            onClick={() => navigate('/catalog/all')}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors"
          >
            Lihat Katalog Produk
          </button>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
