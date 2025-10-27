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
      searchResults: "Search Results",
      
      // Homepage specific
      yourPremierMarketplace: "Your Premium",
      marketplace: "Marketplace",
      discoverMillions: "Discover millions of products from trusted sellers worldwide. Shop with confidence and get the best deals.",
      startShopping: "Start Shopping",
      sellOnPlatform: "Sell on Platform",
      freeShipping: "Free Shipping",
      onOrdersOver: "On orders over $50",
      securePayment: "Secure Payment",
      secureCheckout: "100% secure checkout",
      support247: "24/7 Support",
      alwaysHereToHelp: "Always here to help",
      bestPrices: "Best Prices",
      competitiveRates: "Competitive rates",
      shopByCategory: "Shop by Category",
      exploreWideRange: "Explore our wide range of product categories",
      handpickedProducts: "Handpicked products just for you",
      viewAllProducts: "View All Products",
      topStores: "Top Stores",
      discoverAmazingStores: "Discover amazing stores",
      trustedByMillions: "Trusted by Millions",
      joinGrowingCommunity: "Join our growing community of satisfied customers and sellers",
      happyCustomers: "Happy Customers",
      activeSellers: "Active Sellers",
      productsSold: "Products Sold",
      averageRating: "Average Rating",
      
      // Header specific
      searchForProducts: "Search for products, brands and more...",
      hello: "Hello,",
      signIn: "Sign In",
      myProfile: "My Profile",
      sellerDashboard: "Seller Dashboard",
      settings: "Settings",
      signOut: "Sign Out",
      freeShippingOnOrders: "Free shipping on orders over $50",
      customerSupport: "24/7 Customer Support",
      helpSupport: "Help & Support",
      allCategories: "All Categories",
      becomeSeller: "Become a Seller",
      customerLogin: "Customer Login",
      sellerLogin: "Seller Login",
      
      // Product cards
      by: "by",
      new: "NEW",
      hot: "HOT",
      addToCart: "Add to Cart"
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
      searchResults: "Résultats de Recherche",
      
      // Homepage specific
      yourPremierMarketplace: "Votre Marché",
      marketplace: "de Qualité Premium",
      discoverMillions: "Découvrez des millions de produits de vendeurs de confiance du monde entier. Achetez en toute confiance et obtenez les meilleures offres.",
      startShopping: "Commencer à Acheter",
      sellOnPlatform: "Vendre sur la Plateforme",
      freeShipping: "Livraison Gratuite",
      onOrdersOver: "Sur les commandes de plus de 50$",
      securePayment: "Paiement Sécurisé",
      secureCheckout: "Commande 100% sécurisée",
      support247: "Support 24/7",
      alwaysHereToHelp: "Toujours là pour vous aider",
      bestPrices: "Meilleurs Prix",
      competitiveRates: "Tarifs compétitifs",
      shopByCategory: "Acheter par Catégorie",
      exploreWideRange: "Explorez notre large gamme de catégories de produits",
      handpickedProducts: "Produits soigneusement sélectionnés rien que pour vous",
      viewAllProducts: "Voir Tous les Produits",
      topStores: "Meilleures Boutiques",
      discoverAmazingStores: "Découvrez des boutiques incroyables",
      trustedByMillions: "Fait Confiance par des Millions",
      joinGrowingCommunity: "Rejoignez notre communauté grandissante de clients et vendeurs satisfaits",
      happyCustomers: "Clients Heureux",
      activeSellers: "Vendeurs Actifs",
      productsSold: "Produits Vendus",
      averageRating: "Note Moyenne",
      
      // Header specific
      searchForProducts: "Rechercher des produits, marques et plus...",
      hello: "Bonjour,",
      signIn: "Se Connecter",
      myProfile: "Mon Profil",
      sellerDashboard: "Tableau de Bord Vendeur",
      settings: "Paramètres",
      signOut: "Se Déconnecter",
      freeShippingOnOrders: "Livraison gratuite sur les commandes de plus de 50$",
      customerSupport: "Support Client 24/7",
      helpSupport: "Aide & Support",
      allCategories: "Toutes les Catégories",
      becomeSeller: "Devenir Vendeur",
      customerLogin: "Connexion Client",
      sellerLogin: "Connexion Vendeur",
      
      // Product cards
      by: "par",
      new: "NOUVEAU",
      hot: "TENDANCE",
      addToCart: "Ajouter au Panier"
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
      searchResults: "Soek Resultate",
      
      // Homepage specific
      yourPremierMarketplace: "Jou Premium",
      marketplace: "Mark",
      discoverMillions: "Ontdek miljoene produkte van vertroude verkopers wêreldwyd. Koop met vertroue en kry die beste aanbiedings.",
      startShopping: "Begin Koop",
      sellOnPlatform: "Verkoop op Platform",
      freeShipping: "Gratis Versending",
      onOrdersOver: "Op bestellings oor $50",
      securePayment: "Veilige Betaling",
      secureCheckout: "100% veilige afhandeling",
      support247: "24/7 Ondersteuning",
      alwaysHereToHelp: "Altyd hier om te help",
      bestPrices: "Beste Pryse",
      competitiveRates: "Mededingende tariewe",
      shopByCategory: "Koop volgens Kategorie",
      exploreWideRange: "Verken ons wye reeks produk kategorieë",
      handpickedProducts: "Handgeplukte produkte net vir jou",
      viewAllProducts: "Bekyk Alle Produkte",
      topStores: "Top Winkels",
      discoverAmazingStores: "Ontdek wonderlike winkels",
      trustedByMillions: "Vertrou deur Miljoene",
      joinGrowingCommunity: "Sluit aan by ons groeiende gemeenskap van tevrede kliënte en verkopers",
      happyCustomers: "Gelukkige Kliënte",
      activeSellers: "Aktiewe Verkopers",
      productsSold: "Produkte Verkoop",
      averageRating: "Gemiddelde Gradering",
      
      // Header specific
      searchForProducts: "Soek vir produkte, handelsmerke en meer...",
      hello: "Hallo,",
      signIn: "Teken In",
      myProfile: "My Profiel",
      sellerDashboard: "Verkoper Dashboard",
      settings: "Instellings",
      signOut: "Teken Uit",
      freeShippingOnOrders: "Gratis versending op bestellings oor $50",
      customerSupport: "24/7 Kliënt Ondersteuning",
      helpSupport: "Hulp & Ondersteuning",
      allCategories: "Alle Kategorieë",
      becomeSeller: "Word 'n Verkoper",
      customerLogin: "Kliënt Aanmelding",
      sellerLogin: "Verkoper Aanmelding",
      
      // Product cards
      by: "deur",
      new: "NUUT",
      hot: "GEWILD",
      addToCart: "Voeg by Mandjie"
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
      searchResults: "Matokeo ya Utafutaji",
      
      // Homepage specific
      yourPremierMarketplace: "Soko Lako la Premium",
      marketplace: "",
      discoverMillions: "Gundua mamilioni ya bidhaa kutoka kwa wachuuzi wa kuegemea duniani kote. Nunua kwa ujasiri na upate makubaliano bora.",
      startShopping: "Anza Kununua",
      sellOnPlatform: "Uza kwenye Jukwaa",
      freeShipping: "Usafiri wa Bure",
      onOrdersOver: "Kwa maagizo zaidi ya $50",
      securePayment: "Malipo Salama",
      secureCheckout: "Malipo 100% salama",
      support247: "Msaada 24/7",
      alwaysHereToHelp: "Siku zote hapa kusaidia",
      bestPrices: "Bei Bora",
      competitiveRates: "Viashiria vya ushindani",
      shopByCategory: "Nunua kwa Kategoria",
      exploreWideRange: "Chunguza aina zetu pana za bidhaa",
      handpickedProducts: "Bidhaa zilizochaguliwa kwa mikono tu kwako",
      viewAllProducts: "Ona Bidhaa Zote",
      topStores: "Maduka Bora",
      discoverAmazingStores: "Gundua maduka ya ajabu",
      trustedByMillions: "Inaaminika na Mamilioni",
      joinGrowingCommunity: "Jiunge na jamii yetu inayokua ya wateja na wachuuzi walioridhika",
      happyCustomers: "Wateja Wafuraha",
      activeSellers: "Wachuuzi Waliojitolea",
      productsSold: "Bidhaa Zilizouzwa",
      averageRating: "Kiwango cha Wastani",
      
      // Header specific
      searchForProducts: "Tafuta bidhaa, chapa na zaidi...",
      hello: "Hujambo,",
      signIn: "Ingia",
      myProfile: "Wasifu Wangu",
      sellerDashboard: "Dashibodi ya Mchuuzi",
      settings: "Mipangilio",
      signOut: "Ondoka",
      freeShippingOnOrders: "Usafiri wa bure kwa maagizo zaidi ya $50",
      customerSupport: "Msaada wa Wateja 24/7",
      helpSupport: "Msaada & Usaidizi",
      allCategories: "Kategoria Zote",
      becomeSeller: "Kuwa Mchuuzi",
      customerLogin: "Ingia la Mteja",
      sellerLogin: "Ingia la Mchuuzi",
      
      // Product cards
      by: "na",
      new: "MPYA",
      hot: "HOT",
      addToCart: "Ongeza Kikarpuni"
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
      searchResults: "Imiphumela Yokusesha",
      
      // Homepage specific
      yourPremierMarketplace: "Imakethe Yakho Ephremiyamu",
      marketplace: "",
      discoverMillions: "Thola izigidi zemikhiqizo ezivela kubathengisi abathembekile emhlabeni wonke. Thenga ngokuzethemba futhi uthole izivumelwano ezinhle kakhulu.",
      startShopping: "Qala Ukuthenga",
      sellOnPlatform: "Thengisa ku-Platform",
      freeShipping: "Ukuthumela Kwamahhala",
      onOrdersOver: "Kuma-oda angaphezu kuka-$50",
      securePayment: "Ukukhokha Okuphephile",
      secureCheckout: "I-checkout ephephile ngo-100%",
      support247: "Ukusekelwa 24/7",
      alwaysHereToHelp: "Njalo lapha ukusiza",
      bestPrices: "Amanani Amahle Kakhulu",
      competitiveRates: "Amanani ancintisanayo",
      shopByCategory: "Thenga nge-Sigaba",
      exploreWideRange: "Hlola uhla lwethu olubanzi lwezinto ezikhiqizwayo",
      handpickedProducts: "Imikhiqizo ekhethiwe ngezandla kuphela kuwe",
      viewAllProducts: "Bona Yonke Imikhiqizo",
      topStores: "Izitolo Eziphezulu",
      discoverAmazingStores: "Thola izitolo ezimangalisayo",
      trustedByMillions: "Kuthenjwa ngabantu abayizigidi",
      joinGrowingCommunity: "Joyina umphakathi wethu okhulayo wamakhasimende nabathengisi abanelisekile",
      happyCustomers: "Amakhasimende Ajabule",
      activeSellers: "Abathengisi Abasebenzayo",
      productsSold: "Imikhiqizo Ethengisiwe",
      averageRating: "Isilinganiso Esijwayelekile",
      
      // Header specific
      searchForProducts: "Sesha imikhiqizo, amabrandi nokunye...",
      hello: "Sawubona,",
      signIn: "Ngena",
      myProfile: "Iphrofayela Yami",
      sellerDashboard: "I-Dashboard Yomthengisi",
      settings: "Izilungiselelo",
      signOut: "Phuma",
      freeShippingOnOrders: "Ukuthumela kwamahhala kuma-oda angaphezu kuka-$50",
      customerSupport: "Ukusekelwa Kwamakhasimende 24/7",
      helpSupport: "Usizo & Ukusekelwa",
      allCategories: "Zonke Izigaba",
      becomeSeller: "Yiba Umthengisi",
      customerLogin: "Ukungena Kwekhasimende",
      sellerLogin: "Ukungena Komthengisi",
      
      // Product cards
      by: "ngu",
      new: "ENTSHA",
      hot: "HOT",
      addToCart: "Engeza Esitsheni"
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
      searchResults: "Awọn Abajade Wiwa",
      
      // Homepage specific
      yourPremierMarketplace: "Oja Premium Rẹ",
      marketplace: "",
      discoverMillions: "Ṣe awari awọn miliọnu awọn oja lati awọn olutaja ti a gbekele ni agbaye. Ra pẹlu igbekele ki o gba awọn adehun ti o dara julọ.",
      startShopping: "Bẹrẹ Ra",
      sellOnPlatform: "Ta lori Jukwaa",
      freeShipping: "Ifiweranṣẹ Owo",
      onOrdersOver: "Lori awọn ibere ti o tobi ju $50",
      securePayment: "Isanwo Ailewu",
      secureCheckout: "100% ailewu checkout",
      support247: "Atilẹyin 24/7",
      alwaysHereToHelp: "Nigbagbogbo nibi lati ran yọ",
      bestPrices: "Awọn Owo Ti O Dara Julọ",
      competitiveRates: "Awọn iwọn ti o ṣe idije",
      shopByCategory: "Ra nipasẹ Ẹka",
      exploreWideRange: "Ṣe awari awọn ẹka oja wa ti o tobi",
      handpickedProducts: "Awọn oja ti a yan ni ọwọ nikan fun ọ",
      viewAllProducts: "Wo Gbogbo Awọn Oja",
      topStores: "Awọn Ile Itaja Ti O Ga Julọ",
      discoverAmazingStores: "Ṣe awari awọn ile itaja iyalẹnu",
      trustedByMillions: "A gbekele nipasẹ Miliọnu",
      joinGrowingCommunity: "Darapọ mọ awujọ wa ti n dagba ti awọn onibara ati awọn olutaja ti o yọ",
      happyCustomers: "Awọn Onibara Ti O Dun",
      activeSellers: "Awọn Olutaja Ti Nṣiṣẹ",
      productsSold: "Awọn Oja Ti A Ta",
      averageRating: "Iwọn Iwọn",
      
      // Header specific
      searchForProducts: "Wa awọn oja, awọn ami ati diẹ sii...",
      hello: "Bawo ni,",
      signIn: "Wọle",
      myProfile: "Profaili Mi",
      sellerDashboard: "Dashboard Olutaja",
      settings: "Awọn Eto",
      signOut: "Jade",
      freeShippingOnOrders: "Ifiweranṣẹ owo lori awọn ibere ti o tobi ju $50",
      customerSupport: "Atilẹyin Onibara 24/7",
      helpSupport: "Iranlọwọ & Atilẹyin",
      allCategories: "Gbogbo Awọn Ẹka",
      becomeSeller: "Di Olutaja",
      customerLogin: "Wiwọle Onibara",
      sellerLogin: "Wiwọle Olutaja",
      
      // Product cards
      by: "nipasẹ",
      new: "TUNTUN",
      hot: "HOT",
      addToCart: "Fi Kun Apoti"
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