import { useState, useEffect } from 'react';
import { Search, Filter, X, ChefHat, Star, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';



export default function Categories() {
  const [settings, setSettings] = useState({
    site_name: "Le Gourmet Parisien",
    show_prices: "1",
    show_allergens: "1"
  });
  
  const [categories, setCategories] = useState([
    { id_category: 1, name: "Entrées", dish_count: 12 },
    { id_category: 2, name: "Plats", dish_count: 18 },
    { id_category: 3, name: "Desserts", dish_count: 10 },
    { id_category: 4, name: "Boissons", dish_count: 25 },
    { id_category: 5, name: "Poissons", dish_count: 8 },
    { id_category: 6, name: "Viandes", dish_count: 15 }
  ]);

  const [allDishes] = useState([
    {
      id_dish: 1,
      name: "Foie Gras Poêlé",
      description: "Accompagné de figues confites et pain d'épices, une symphonie de saveurs automnales",
      price: 28.50,
      category_name: "Entrées",
      category_id: 1,
      image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&q=80",
      allergens: "Foie gras"
    },
    {
      id_dish: 2,
      name: "Carpaccio de Saint-Jacques",
      description: "Marinées aux agrumes, huile d'olive vierge et caviar d'Aquitaine",
      price: 32.00,
      category_name: "Entrées",
      category_id: 1,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
      allergens: "Crustacés"
    },
    {
      id_dish: 3,
      name: "Bœuf Rossini",
      description: "Filet de bœuf, foie gras poêlé, sauce truffée et légumes de saison",
      price: 45.00,
      category_name: "Plats",
      category_id: 2,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
    },
    {
      id_dish: 4,
      name: "Homard Bleu",
      description: "Cuit à la perfection, beurre blanc aux herbes fraîches",
      price: 58.00,
      category_name: "Plats",
      category_id: 2,
      image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80",
      allergens: "Crustacés"
    },
    {
      id_dish: 5,
      name: "Bar de Ligne",
      description: "Rôti, accompagné de légumes croquants et émulsion citronnée",
      price: 42.00,
      category_name: "Poissons",
      category_id: 5,
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
      allergens: "Poisson"
    },
    {
      id_dish: 6,
      name: "Tarte Tatin Revisitée",
      description: "Pommes caramélisées, glace vanille bourbon et caramel au beurre salé",
      price: 12.00,
      category_name: "Desserts",
      category_id: 3,
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
      allergens: "Gluten, Lactose"
    },
    {
      id_dish: 7,
      name: "Soufflé au Grand Marnier",
      description: "Léger et aérien, servi avec sa crème anglaise",
      price: 14.00,
      category_name: "Desserts",
      category_id: 3,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
      allergens: "Œufs, Lactose"
    },
    {
      id_dish: 8,
      name: "Châteaubriand Sauce Béarnaise",
      description: "Pièce de bœuf tendre, sauce béarnaise maison et pommes grenaille",
      price: 52.00,
      category_name: "Viandes",
      category_id: 6,
      image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dishes, setDishes] = useState(allDishes);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const categoryIcons = {
    'Entrées': '🥗',
    'Plats': '🍖',
    'Desserts': '🍰',
    'Boissons': '🍷',
    'Poissons': '🐟',
    'Viandes': '🥩'
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    filterDishes();
  }, [selectedCategory, searchTerm]);

  const filterDishes = () => {
    let filtered = allDishes;

    if (selectedCategory) {
      filtered = filtered.filter(dish => dish.category_id === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(dish => 
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setDishes(filtered);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleOrder = (dish) => {
    alert(`Commander: ${dish.name} - ${dish.price.toFixed(2)}€\n\nRéservez une table pour profiter de ce plat !`);
  };

  const selectedCat = categories.find(c => c.id_category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header settings={settings} />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-600 via-orange-600 to-pink-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className={`relative z-10 text-center px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-4">
            <ChefHat className="w-16 h-16 text-white mx-auto drop-shadow-2xl" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl">
            Notre Carte
          </h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto">
            Découvrez notre sélection de plats raffinés préparés avec passion
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Barre de recherche et filtres */}
        <div className="mb-12 space-y-6">
          {/* Recherche */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un plat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-full text-lg focus:outline-none focus:border-red-500 transition-all shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filtres catégories */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                !selectedCategory 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
              }`}
            >
              <Filter className="w-4 h-4" />
              Tout voir
            </button>
            {categories.map((category) => (
              <button
                key={category.id_category}
                onClick={() => handleCategoryClick(category.id_category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id_category
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                <span className="text-lg">{categoryIcons[category.name] || '🍴'}</span>
                {category.name}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category.id_category
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                }`}>
                  {category.dish_count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* En-tête section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800">
            {selectedCat 
              ? `${categoryIcons[selectedCat.name] || '🍴'} ${selectedCat.name}` 
              : '🌟 Tous nos plats'}
          </h2>
          <div className="text-gray-600 font-semibold">
            {dishes.length} plat{dishes.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Grille de plats */}
        {dishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.map((dish, index) => (
              <div
                key={dish.id_dish}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 50}ms`,
                  opacity: 0,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="relative h-56 overflow-hidden">
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white text-6xl">
                      🍽️
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {dish.allergens && settings.show_allergens === '1' && (
                    <div className="absolute top-3 right-3 p-2 bg-yellow-400/90 backdrop-blur-sm rounded-full">
                      <AlertCircle className="w-5 h-5 text-yellow-900" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
                      {dish.category_name}
                    </span>
                    {index < 3 && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-semibold">Nouveau</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                    {dish.name}
                  </h3>

                  {dish.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {dish.description}
                    </p>
                  )}

                  {dish.allergens && settings.show_allergens === '1' && (
                    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800 flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" />
                        Allergènes: {dish.allergens}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {settings.show_prices === '1' && (
                      <div className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        {dish.price.toFixed(2)}€
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleOrder(dish)}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Commander
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4 opacity-30">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun plat trouvé</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Essayez une autre recherche' : 'Cette catégorie ne contient pas de plats'}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>

      <Footer settings={settings} />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}