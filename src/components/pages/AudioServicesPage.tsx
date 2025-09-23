import React, { useState } from 'react';
import { Button } from '../platform';

const AudioServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleStripePayment = async (priceId: string, amount: number) => {
    try {
      const response = await fetch(`${window.location.origin}/.netlify/functions/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          amount: amount * 100, // Convert to cents
          successUrl: `${window.location.origin}/audio-services/success`,
          cancelUrl: `${window.location.origin}/audio-services`,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--bg)] via-gray-900 to-black text-[color:var(--text-primary)]">
      {/* Header */}
      <header className="border-b border-[color:var(--border)]/30 bg-[color:var(--surface)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-black font-bold bg-gradient-to-br from-[color:var(--accent)] to-green-400 shadow-lg">
              DE
            </div>
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-[color:var(--accent)] to-green-400 bg-clip-text text-transparent">DJ Elite</h1>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl text-black font-semibold bg-gradient-to-r from-[color:var(--accent)] to-green-400 shadow-lg hover:shadow-xl transition-all">EN</button>
            <button className="px-4 py-2 rounded-xl bg-[color:var(--surface-alt)]/50 text-[color:var(--text-secondary)] backdrop-blur-sm hover:bg-[color:var(--surface-alt)] transition-all">ES</button>
            <Button 
              onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}
              variant="secondary"
              className="px-4 py-2 bg-[color:var(--surface)]/50 backdrop-blur-sm border border-[color:var(--border)]/50"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 bg-[color:var(--accent)]/20 text-[color:var(--accent)] rounded-full text-sm font-semibold backdrop-blur-sm border border-[color:var(--accent)]/30">
            🎵 Professional Audio Services
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 font-display bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
            Elevate Your DJ Track to
            <span className="block bg-gradient-to-r from-[color:var(--accent)] to-green-400 bg-clip-text text-transparent">Professional Standards</span>
          </h1>
          
          <div className="relative rounded-3xl p-10 mb-12 bg-gradient-to-br from-[color:var(--accent)] via-green-400 to-emerald-500 shadow-2xl border border-white/20 overflow-hidden max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="text-3xl font-bold text-black font-display tracking-wide">COMPLETE PACKAGE</div>
              </div>
              <div className="flex items-baseline justify-center gap-3 mb-4">
                <div className="text-7xl font-black text-black font-display">$450</div>
                <div className="text-2xl text-black/70 line-through">$550</div>
              </div>
              <div className="inline-block bg-black/20 text-black font-bold px-6 py-3 rounded-full text-xl mb-4 backdrop-blur-sm">
                💰 Save $100 vs. Individual Services
              </div>
              <p className="text-black font-medium text-xl leading-relaxed">Everything you need to make your track radio-ready and club-perfect</p>
            </div>
          </div>
        </div>

        {/* Service Cards with Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>,
              title: "Professional Mixing",
              price: "$250",
              features: ["Complete balance and EQ optimization", "Professional compression and dynamics", "Spatial effects (reverb, delay, chorus)", "Volume and pan automation", "Up to 3 revisions included"],
              deposit: 125,
              priceId: "price_mixing",
              image: "https://images.unsplash.com/photo-1633933769681-dc8d28bdeb6d"
            },
            {
              icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>,
              title: "Final Mastering",
              price: "$100",
              features: ["Corrective and musical EQ", "Multiband compression", "Volume maximization (industry LUFS)", "Complete spectral analysis", "Multiple format delivery"],
              deposit: 50,
              priceId: "price_mastering",
              image: "https://images.unsplash.com/photo-1525183480399-e8706926adac"
            },
            {
              icon: <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H15V1h-2v1H9V1H7v1H4.5C3.67 2 3 2.67 3 3.5v15c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5zM19 18.5H5V8h14v10.5z"/>,
              title: "Production Consulting",
              price: "$100",
              features: ["Musical arrangement review", "DJ-optimized structure suggestions", "Transition optimization", "Detailed written feedback", "30-minute video consultation"],
              deposit: 50,
              priceId: "price_consulting",
              image: "https://plus.unsplash.com/premium_photo-1682786762320-a933c15e95a2"
            }
          ].map((service, index) => (
            <div key={index} className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-[color:var(--accent)]/50 backdrop-blur-sm">
              {/* Service Image */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {service.title}
                </div>
              </div>
              
              {/* Service Content */}
              <div className="p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-[color:var(--accent)] to-green-400 shadow-lg group-hover:shadow-xl transition-shadow">
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      {service.icon}
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-3 font-display group-hover:text-[color:var(--accent)] transition-colors">{service.title}</h3>
                  <div className="text-4xl font-bold text-[color:var(--accent)] mb-6">{service.price}</div>
                  <ul className="space-y-4 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[color:var(--accent)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[color:var(--accent)] text-sm">✓</span>
                        </div>
                        <span className="text-[color:var(--text-secondary)] leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => {
                        const serviceRoutes = {
                          'price_mixing': '/mixing-service',
                          'price_mastering': '/mastering-service', 
                          'price_consulting': '/consulting-service'
                        };
                        window.location.href = serviceRoutes[service.priceId] || '#';
                      }}
                      className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-[color:var(--accent)] to-green-400 hover:from-green-400 hover:to-[color:var(--accent)] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Learn More & Pay ${service.deposit} Deposit
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => handleStripePayment(service.priceId, service.deposit)}
                      className="w-full py-2 text-sm bg-[color:var(--surface)]/50 backdrop-blur-sm border border-[color:var(--border)]/50 hover:border-[color:var(--accent)]/50"
                    >
                      Quick Pay ${service.deposit} Deposit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Terms Section */}
        <div className="rounded-2xl p-8 mb-20 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl backdrop-blur-sm">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3 font-display">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[color:var(--accent)] to-green-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            Professional Terms & Delivery
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { label: "Payment", value: "50% upfront, 50% completion" },
              { label: "Delivery", value: "5-7 business days" },
              { label: "Revisions", value: "Included in price" },
              { label: "Files Kept", value: "6 months retention" },
              { label: "Guarantee", value: "Satisfaction guaranteed" }
            ].map((term, index) => (
              <div key={index} className="rounded-xl p-6 bg-gradient-to-br from-[color:var(--surface-alt)] to-[color:var(--surface)] border border-[color:var(--border)]/20 hover:border-[color:var(--accent)]/30 transition-colors">
                <div className="text-sm font-semibold mb-2 text-[color:var(--accent)]">{term.label}</div>
                <div className="font-medium">{term.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { icon: <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>, title: "Technical Report", desc: "Detailed mastering analysis included" },
            { icon: <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A4,4 0 0,0 6,17A4,4 0 0,0 10,21A4,4 0 0,0 14,17V7H18V3H12Z"/>, title: "Separate Stems", desc: "Individual tracks if needed for DJ sets" },
            { icon: <path d="M2.81,14.12L5.64,11.29L8.17,10.79C11.39,6.41 17.55,4.22 19.78,4.22C19.78,6.45 17.59,12.61 13.21,15.83L12.71,18.36L9.88,21.19L9.17,17.66C7.76,17.66 7.76,17.66 7.05,16.95C6.34,16.24 6.34,16.24 6.34,14.83L2.81,14.12M5.64,16.95L7.05,18.36L4.39,21.03H2.97V19.61L5.64,16.95M4.22,15.54L5.46,15.71L5.64,16.95L4.39,18.2L2.97,16.78L4.22,15.54M8.56,18.36L9.88,17.19L18.36,8.71L15.29,5.64L6.81,14.12L5.64,15.46L8.56,18.36Z"/>, title: "Distribution Tips", desc: "Platform optimization guidance" },
            { icon: <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>, title: "Future Discount", desc: "20% off your next projects" }
          ].map((item, index) => (
            <div key={index} className="group text-center p-8 rounded-2xl bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 hover:border-[color:var(--accent)]/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto bg-gradient-to-br from-[color:var(--accent)] to-green-400 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
              </div>
              <h4 className="font-bold mb-3 text-[color:var(--accent)] text-lg">{item.title}</h4>
              <p className="text-[color:var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mb-20">
          <div className="space-y-6">
            <Button 
              onClick={() => handleStripePayment('price_complete_package', 225)}
              className="text-2xl px-16 py-6 bg-gradient-to-r from-[color:var(--accent)] to-green-400 hover:from-green-400 hover:to-[color:var(--accent)] transition-all duration-300 shadow-2xl hover:shadow-3xl font-bold"
            >
              💳 Pay $225 Complete Package Deposit
            </Button>
            <Button 
              variant="secondary"
              onClick={() => window.open('mailto:audio@djelite.com?subject=DJ Track Audio Services - Let\'s Start', '_blank')}
              className="text-xl px-12 py-4 bg-[color:var(--surface)]/50 backdrop-blur-sm border border-[color:var(--border)]/50 hover:border-[color:var(--accent)]/50 transition-all duration-300"
            >
              📧 Discuss Project First
            </Button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="rounded-2xl p-10 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl backdrop-blur-sm">
          <h4 className="text-2xl font-bold mb-6 text-[color:var(--accent)] font-display">
            Ready to elevate your DJ track to professional standards?
          </h4>
          <p className="text-[color:var(--text-secondary)] text-lg leading-relaxed">
            With years of experience in electronic music production and mastering, I guarantee radio-ready quality 
            that will make your track stand out in any DJ set. Professional equipment, fast turnaround, and 
            unlimited communication during the entire process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioServicesPage;