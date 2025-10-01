import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      categories: "Categories",
      stores: "Stores",
      cart: "Cart",
      profile: "Profile",
      search: "Search products...",
      language: "Language",
      
      // Hero Section
      heroTitle: "Welcome to WENZE TII NDAKU",
      heroSubtitle: "Your premier multi-vendor marketplace connecting you with the best local and international vendors across Africa and beyond.",
      shopNow: "Shop Now",
      exploreStores: "Explore Stores",
      
      // Categories
      featuredCategories: "Featured Categories",
      cosmetics: "Cosmetics",
      tech: "Tech Products",
      clothes: "Clothes",
      toys: "Toys",
      food: "Food",
      beverages: "Beverages",
      paraPharmacy: "Para-Pharmacy",
      
      // Products
      featuredProducts: "Featured Products",
      promotedStores: "Promoted Stores",
      newArrivals: "New Arrivals",
      bestSellers: "Best Sellers",
      addToCart: "Add to Cart",
      addToWishlist: "Add to Wishlist",
      
      // Footer
      about: "About",
      contact: "Contact",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      faqs: "FAQs",
      helpCenter: "Help Center",
      shippingInfo: "Shipping Info",
      returns: "Returns",
      cookiePolicy: "Cookie Policy",
      
      // Common
      viewAll: "View All",
      loading: "Loading...",
      error: "An error occurred",
      price: "Price",
      rating: "Rating",
      sortBy: "Sort by",
      filter: "Filter",
      searchResults: "Search Results"
    }
  },
  fr: {
    translation: {
      // Navigation
      home: "Accueil",
      categories: "Catégories",
      stores: "Boutiques",
      cart: "Panier",
      profile: "Profil",
      search: "Rechercher des produits...",
      language: "Langue",
      
      // Hero Section
      heroTitle: "Bienvenue sur WENZE TII NDAKU",
      heroSubtitle: "Votre marché multivendeur de premier plan vous connectant aux meilleurs vendeurs locaux et internationaux",
      shopNow: "Acheter Maintenant",
      exploreStores: "Explorer les Boutiques",
      
      // Categories
      featuredCategories: "Catégories en Vedette",
      cosmetics: "Cosmétiques",
      tech: "Produits Tech",
      clothes: "Vêtements",
      toys: "Jouets",
      food: "Nourriture",
      beverages: "Boissons",
      paraPharmacy: "Para-Pharmacie",
      
      // Products
      featuredProducts: "Produits en Vedette",
      promotedStores: "Boutiques Promues",
      newArrivals: "Nouveautés",
      bestSellers: "Meilleures Ventes",
      addToCart: "Ajouter au Panier",
      addToWishlist: "Ajouter aux Favoris",
      
      // Footer
      about: "À Propos",
      contact: "Contact",
      privacyPolicy: "Politique de Confidentialité",
      termsOfService: "Conditions d'Utilisation",
      faqs: "FAQ",
      helpCenter: "Centre d'Aide",
      shippingInfo: "Informations de Livraison",
      returns: "Retours",
      cookiePolicy: "Politique des Cookies",
      
      // Common
      viewAll: "Voir Tout",
      loading: "Chargement...",
      error: "Une erreur s'est produite",
      price: "Prix",
      rating: "Note",
      sortBy: "Trier par",
      filter: "Filtrer",
      searchResults: "Résultats de Recherche"
    }
  },
  af: {
    translation: {
      // Navigation
      home: "Tuis",
      categories: "Kategorieë",
      stores: "Winkels",
      cart: "Mandjie",
      profile: "Profiel",
      search: "Soek produkte...",
      language: "Taal",
      
      // Hero Section
      heroTitle: "Welkom by WENZE TII NDAKU",
      heroSubtitle: "Jou voorste multi-verkoper mark wat jou verbind met die beste plaaslike en internasionale verkopers",
      shopNow: "Koop Nou",
      exploreStores: "Verken Winkels",
      
      // Categories
      featuredCategories: "Uitgestalde Kategorieë",
      cosmetics: "Skoonheidsmiddels",
      tech: "Tegnologie Produkte",
      clothes: "Klere",
      toys: "Speelgoed",
      food: "Kos",
      beverages: "Drankies",
      paraPharmacy: "Para-Apteek",
      
      // Products
      featuredProducts: "Uitgestalde Produkte",
      promotedStores: "Bevoordeelde Winkels",
      newArrivals: "Nuwe Aankomste",
      bestSellers: "Beste Verkopers",
      addToCart: "Voeg by Mandjie",
      addToWishlist: "Voeg by Verlangslys",
      
      // Footer
      about: "Oor Ons",
      contact: "Kontak",
      privacyPolicy: "Privaatheid Beleid",
      termsOfService: "Diensbepalings",
      faqs: "Gereelde Vrae",
      helpCenter: "Hulp Sentrum",
      shippingInfo: "Gestuur Inligting",
      returns: "Terugkeer",
      cookiePolicy: "Koekie Beleid",
      
      // Common
      viewAll: "Bekyk Alles",
      loading: "Laai...",
      error: "Fout het voorgekom",
      price: "Prys",
      rating: "Gradering",
      sortBy: "Sorteer volgens",
      filter: "Filter",
      searchResults: "Soek Resultate"
    }
  },
  sw: {
    translation: {
      // Navigation
      home: "Nyumbani",
      categories: "Makundi",
      stores: "Maduka",
      cart: "Kikapu",
      profile: "Wasifu",
      search: "Tafuta bidhaa...",
      language: "Lugha",
      
      // Hero Section
      heroTitle: "Karibu WENZE TII NDAKU",
      heroSubtitle: "Soko lako kuu la wachuuzi wengi linalokuunganisha na wachuuzi bora wa mitaa na kimataifa",
      shopNow: "Nunua Sasa",
      exploreStores: "Chunguza Maduka",
      
      // Categories
      featuredCategories: "Makundi Maalum",
      cosmetics: "Vipodozi",
      tech: "Bidhaa za Teknolojia",
      clothes: "Nguo",
      toys: "Vichezeo",
      food: "Chakula",
      beverages: "Vinywaji",
      paraPharmacy: "Para-Famasi",
      
      // Products
      featuredProducts: "Bidhaa Maalum",
      promotedStores: "Maduka Yanayotangazwa",
      newArrivals: "Bidhaa Mpya",
      bestSellers: "Zinazouzwa Zaidi",
      addToCart: "Ongeza Kikarpuni",
      addToWishlist: "Ongeza Orodha ya Matakwa",
      
      // Footer
      about: "Kuhusu",
      contact: "Mawasiliano",
      privacyPolicy: "Sera ya Faragha",
      termsOfService: "Masharti ya Huduma",
      faqs: "Maswali Yanayoulizwa Mara Kwa Mara",
      helpCenter: "Kituo cha Usaidizi",
      shippingInfo: "Taarifa za Usafiri",
      returns: "Marejeo",
      cookiePolicy: "Sera ya Vidakuzi",
      
      // Common
      viewAll: "Ona Zote",
      loading: "Inapakia...",
      error: "Hitilafu imetokea",
      price: "Bei",
      rating: "Kiwango",
      sortBy: "Panga kwa",
      filter: "Chuja",
      searchResults: "Matokeo ya Utafutaji"
    }
  },
  zu: {
    translation: {
      // Navigation
      home: "Ekhaya",
      categories: "Izigaba",
      stores: "Izitolo",
      cart: "Isitsha",
      profile: "Iphrofayela",
      search: "Sesha imikhiqizo...",
      language: "Ulimi",
      
      // Hero Section
      heroTitle: "Siyakwamukela ku-WENZE TII NDAKU",
      heroSubtitle: "Imakethe yakho ephambili yamadlana amaningi ekuxhumanisa nabathengisi abahle bendawo nabezwelonke",
      shopNow: "Thenga Manje",
      exploreStores: "Hlola Izitolo",
      
      // Categories
      featuredCategories: "Izigaba Ezivelele",
      cosmetics: "Amakosmetiki",
      tech: "Imikhiqizo Yobuchwepheshe",
      clothes: "Izimpahla",
      toys: "Amathoyizi",
      food: "Ukudla",
      beverages: "Iziphuzo",
      paraPharmacy: "I-Para-Pharmacy",
      
      // Products
      featuredProducts: "Imikhiqizo Evelele",
      promotedStores: "Izitolo Ezithuthukisiwe",
      newArrivals: "Okusha Okufike",
      bestSellers: "Okuthengiswa Kakhulu",
      addToCart: "Engeza Esitsheni",
      addToWishlist: "Engeza Ohlwini Lwezifiso",
      
      // Footer
      about: "Mayelana",
      contact: "Xhumana",
      privacyPolicy: "Inqubomgomo Yobumfihlo",
      termsOfService: "Imigomo Yesevisi",
      faqs: "Imibuzo Ejwayelekile",
      helpCenter: "Isikhungo Sosizo",
      shippingInfo: "Ulwazi Lokuthumela",
      returns: "Ukubuyisa",
      cookiePolicy: "Inqubomgomo Yamakhukhi",
      
      // Common
      viewAll: "Bona Konke",
      loading: "Iyalayisha...",
      error: "Kukhona iphutha",
      price: "Intengo",
      rating: "Isilinganiso",
      sortBy: "Hlunga ngokuka",
      filter: "Hlungi",
      searchResults: "Imiphumela Yokusesha"
    }
  },
  yo: {
    translation: {
      // Navigation
      home: "Ile",
      categories: "Awon Eka",
      stores: "Awon Ile Itaja",
      cart: "Apoti",
      profile: "Profaili",
      search: "Wa awon oja...",
      language: "Ede",
      
      // Hero Section
      heroTitle: "Kaabo si WENZE TII NDAKU",
      heroSubtitle: "Oja pataki rẹ ti awọn olutaja pupọ ti o so ọ pọ pẹlu awọn olutaja to dara julọ ti agbegbe ati ti kariaye",
      shopNow: "Ra Bayi",
      exploreStores: "Ṣe Awari Awọn Ile Itaja",
      
      // Categories
      featuredCategories: "Awọn Eka Pataki",
      cosmetics: "Awọn Ohun Ikunra",
      tech: "Awọn Oja Imọ-ẹrọ",
      clothes: "Awọn Aṣọ",
      toys: "Awọn Ohun Isere",
      food: "Ounje",
      beverages: "Awọn Ohun Mimu",
      paraPharmacy: "Para-Oogun",
      
      // Products
      featuredProducts: "Awọn Oja Pataki",
      promotedStores: "Awọn Ile Itaja Ti a Gbelaruge",
      newArrivals: "Awọn Titun",
      bestSellers: "Awọn Ti o Ta Julọ",
      addToCart: "Fi Kun Apoti",
      addToWishlist: "Fi Kun Atokọ Ifẹ",
      
      // Footer
      about: "Nipa",
      contact: "Olubasọrọ",
      privacyPolicy: "Ilana Aṣiri",
      termsOfService: "Awọn Ofin Iṣẹ",
      faqs: "Awọn Ibeere Loorekoore",
      helpCenter: "Ile Iṣẹ Irànlọwọ",
      shippingInfo: "Alaye Ifiweranṣẹ",
      returns: "Awọn Ipadabọ",
      cookiePolicy: "Ilana Awọn Kuki",
      
      // Common
      viewAll: "Wo Gbogbo",
      loading: "N gbejade...",
      error: "Aṣiṣe kan waye",
      price: "Owo",
      rating: "Iwọn",
      sortBy: "To pẹlu",
      filter: "Ṣe Ayẹwo",
      searchResults: "Awọn Abajade Wiwa"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en',
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;