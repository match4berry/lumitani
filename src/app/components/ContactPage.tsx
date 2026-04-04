import { useNavigate } from 'react-router';
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { BottomNav } from './BottomNav';
import logo from 'figma:asset/f889d239b2dddde1243ddadd7a407e3d43b3a8d2.png';

export function ContactPage() {
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: Phone,
      title: 'Telepon',
      value: '+62 812-3456-7890',
      action: 'tel:+6281234567890',
      description: 'Hubungi kami via telepon'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+62 812-3456-7890',
      action: 'https://wa.me/6281234567890',
      description: 'Chat via WhatsApp'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@lumitani.com',
      action: 'mailto:info@lumitani.com',
      description: 'Kirim email kepada kami'
    },
    {
      icon: MapPin,
      title: 'Alamat',
      value: 'Desa Manud Jaya, Kec. Cipatat',
      action: null,
      description: 'Kabupaten Bandung Barat, Jawa Barat'
    }
  ];

  const socialMedia = [
    { icon: Instagram, name: 'Instagram', handle: '@lumitani', link: '#' },
    { icon: Facebook, name: 'Facebook', handle: 'LumiTani Official', link: '#' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">Kontak Kami</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 px-6 py-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <img src={logo} alt="LumiTani" className="h-16" />
          </div>
        </div>
        <h2 className="text-2xl text-white mb-2" style={{ fontWeight: 700 }}>Hubungi Kami</h2>
        <p className="text-green-100 text-sm">Kami siap membantu Anda</p>
      </section>

      {/* Contact Methods */}
      <section className="px-4 -mt-6 mb-6">
        <div className="space-y-3">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>{method.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                    {method.action ? (
                      <a 
                        href={method.action}
                        className="text-sm text-green-600 hover:text-green-700 inline-block"
                      >
                        {method.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-700">{method.value}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Media */}
      <section className="px-4 mb-6">
        <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">📱</span>
          <span>Ikuti Kami</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {socialMedia.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.link}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all text-center"
              >
                <div className="flex justify-center mb-2">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-900 mb-1" style={{ fontWeight: 600 }}>{social.name}</p>
                <p className="text-xs text-gray-600">{social.handle}</p>
              </a>
            );
          })}
        </div>
      </section>

      {/* Operating Hours */}
      <section className="px-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="text-center mb-3">
            <span className="text-4xl">⏰</span>
          </div>
          <h3 className="text-lg text-gray-900 text-center mb-3" style={{ fontWeight: 700 }}>Jam Operasional</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Senin - Jumat</span>
              <span className="text-sm text-gray-900 font-semibold">08:00 - 17:00 WIB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Sabtu</span>
              <span className="text-sm text-gray-900 font-semibold">08:00 - 14:00 WIB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Minggu</span>
              <span className="text-sm text-gray-900 font-semibold">Tutup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="px-4 mb-6">
        <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" />
          <span>Lokasi Kami</span>
        </h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-200 h-48 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Desa Manud Jaya</p>
              <p className="text-xs text-gray-500">Kec. Cipatat, Kab. Bandung Barat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}