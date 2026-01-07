import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, Calendar, ChefHat, Sparkles, TrendingUp, UtensilsCrossed, Clock, MapPin, Phone, Award, Users, Heart, Zap } from 'lucide-react';
import Header from '../components/Header';
 import Footer from '../components/Footer';



export default function Home() {
  const [stats, setStats] = useState({ dishes: 0, categories: 0, menus: 0, rating: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  const demoSettings = {
    site_name: "Le Gourmet Parisien",
    site_description: "Une expérience culinaire exceptionnelle au cœur de la gastronomie française",
    restaurant_status: "open",
    booking_enabled: true,
    address: "123 Rue de la Gastronomie, 75001 Paris",
    phone: "+33 1 23 45 67 89",
    email: "contact@gourmet-parisien.fr"
  };

  const demoCategories = [
    { id: 1, name: "Entrées", dish_count: 12, icon: "🥗", color: "from-green-500 to-emerald-600" },
    { id: 2, name: "Plats", dish_count: 18, icon: "🍖", color: "from-red-500 to-orange-600" },
    { id: 3, name: "Desserts", dish_count: 10, icon: "🍰", color: "from-pink-500 to-purple-600" },
    { id: 4, name: "Vins", dish_count: 25, icon: "🍷", color: "from-purple-500 to-indigo-600" },
    { id: 5, name: "Cocktails", dish_count: 8, icon: "🍹", color: "from-blue-500 to-cyan-600" },
    { id: 6, name: "Spécialités", dish_count: 6, icon: "⭐", color: "from-yellow-500 to-orange-600" }
  ];

  const demoDishes = [
    {
      id: 1,
      name: "Foie Gras Poêlé",
      description: "Accompagné de figues confites et pain d'épices, une symphonie de saveurs automnales",
      price: 28.50,
      category_name: "Entrées",
      image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&q=80"
    },
    {
      id: 2,
      name: "Bœuf Rossini",
      description: "Filet de bœuf, foie gras poêlé, sauce truffée et légumes de saison",
      price: 45.00,
      category_name: "Plats",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
    },
    {
      id: 3,
      name: "Tarte Tatin Revisitée",
      description: "Pommes caramélisées, glace vanille bourbon et caramel au beurre salé",
      price: 12.00,
      category_name: "Desserts",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80"
    }
  ];

  // Animation des stats au chargement
  useEffect(() => {
    setIsVisible(true);
    
    const animateValue = (target, duration, callback) => {
      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        callback(target * progress);
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    };

    setTimeout(() => {
      animateValue(73, 2000, (val) => setStats(prev => ({ ...prev, dishes: Math.floor(val) })));
      animateValue(6, 1500, (val) => setStats(prev => ({ ...prev, categories: Math.floor(val) })));
      animateValue(4, 1200, (val) => setStats(prev => ({ ...prev, menus: Math.floor(val) })));
      animateValue(4.8, 2000, (val) => setStats(prev => ({ ...prev, rating: parseFloat(val.toFixed(1)) })));
    }, 300);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header settings={demoSettings} />

      {/* Hero Section Ultra Moderne */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-600 via-orange-600 to-pink-600"
      >
        {/* Effet de grille animée */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Particules flottantes optimisées */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animation: `floatParticle ${15 + Math.random() * 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Contenu Hero */}
        <div className={`relative z-10 text-center px-6 max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6 inline-block">
            <UtensilsCrossed className="w-20 h-20 text-white drop-shadow-2xl" />
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            {demoSettings.site_name}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/95 mb-4 max-w-3xl mx-auto font-light drop-shadow-lg">
            {demoSettings.site_description}
          </p>

          <div className="flex items-center justify-center gap-3 text-white/90 mb-10">
            <Clock className="w-5 h-5" />
            <span className="text-lg">Ouvert tous les jours • 12h-14h30 & 19h-22h30</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/categories" 
              className="group px-10 py-4 bg-white text-red-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Découvrir notre carte
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a 
              href="/reservation" 
              className="px-10 py-4 bg-transparent border-3 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 shadow-lg flex items-center gap-3"
            >
              <Calendar className="w-5 h-5" />
              Réserver une table
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/80 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Stats Cards avec effet glassmorphism */}
      <div className="relative -mt-20 px-6 max-w-7xl mx-auto mb-20 z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: ChefHat, value: stats.dishes, label: "Plats au menu", gradient: "from-red-500 to-orange-500" },
            { icon: TrendingUp, value: stats.categories, label: "Catégories", gradient: "from-orange-500 to-yellow-500" },
            { icon: Award, value: stats.menus, label: "Menus", gradient: "from-yellow-500 to-red-500" },
            { icon: Star, value: stats.rating, label: "Note moyenne", gradient: "from-red-500 to-pink-500" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Sparkles className="w-5 h-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="text-4xl font-black text-gray-800 mb-1">
                  {stat.value}
                </div>
                
                <div className="text-gray-600 font-medium text-sm">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Catégories Grid Moderne */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
            Explorez Nos Catégories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Une sélection raffinée de plats élaborés avec passion par notre chef étoilé
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoCategories.map((cat, index) => (
            <a
              href={`/categories?id=${cat.id}`}
              key={cat.id}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              style={{
                transitionDelay: `${index * 50}ms`
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                  {cat.name}
                </h3>
                
                <p className="text-gray-600 font-medium">
                  {cat.dish_count} plat{cat.dish_count > 1 ? 's' : ''}
                </p>

                <ArrowRight className="absolute top-4 right-4 w-5 h-5 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Plats Signature avec design carte moderne */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Nos Créations Signature
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Les coups de cœur de notre chef, préparés avec des ingrédients d'exception
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoDishes.map((dish, index) => (
              <div
                key={dish.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                style={{
                  transitionDelay: `${index * 75}ms`
                }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    NOUVEAU
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold mb-3">
                    {dish.category_name}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                    {dish.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {dish.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      {dish.price.toFixed(2)}€
                    </div>
                    
                    <button className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
                      Commander
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Informations */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="inline-block p-4 bg-red-600/20 rounded-2xl mb-4 group-hover:bg-red-600/30 transition-colors">
                <MapPin className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Notre Adresse</h3>
              <p className="text-gray-400">{demoSettings.address}</p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="inline-block p-4 bg-orange-600/20 rounded-2xl mb-4 group-hover:bg-orange-600/30 transition-colors">
                <Phone className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Téléphone</h3>
              <a href={`tel:${demoSettings.phone}`} className="text-gray-400 hover:text-white transition-colors">
                {demoSettings.phone}
              </a>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="inline-block p-4 bg-yellow-600/20 rounded-2xl mb-4 group-hover:bg-yellow-600/30 transition-colors">
                <Clock className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Horaires</h3>
              <p className="text-gray-400">
                Lun-Dim: 12h-14h30<br/>
                19h-22h30
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Minimaliste */}
      <section className="py-24 px-6 bg-gradient-to-br from-red-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Star className="w-16 h-16 mx-auto text-yellow-300 mb-6" fill="currentColor" />
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Réservez Votre Table
          </h2>
          
          <p className="text-xl text-white/95 mb-10 max-w-2xl mx-auto">
            Vivez une expérience culinaire inoubliable dans notre restaurant étoilé
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/reservation"
              className="group px-10 py-4 bg-white text-red-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Réserver maintenant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="/categories"
              className="px-10 py-4 bg-transparent border-3 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300"
            >
              Découvrir la carte
            </a>
          </div>
        </div>
      </section>

      <Footer settings={demoSettings} />

      <style jsx global>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}