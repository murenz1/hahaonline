import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image,
  SafeAreaView,
  Platform,
  FlatList,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import productsApi from '../../lib/productsApi';

const API_BASE_URL = 'http://localhost:3000'; // Update this with your actual API URL

export default function HomeScreen() {
  // Router and UI state
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  const notificationTimeout = useRef(null);
  
  // Search state
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showNoResults, setShowNoResults] = useState(false);
  
  // Location state
  const [locationPermission, setLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Kigali, Rwanda');
  const [locationError, setLocationError] = useState(null);
  const [locationDetails, setLocationDetails] = useState({
    street: '',
    district: '',
    city: 'Kigali',
    country: 'Rwanda',
    coordinates: null
  });
  
  // UI Modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  
  // Product state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [localFruits, setLocalFruits] = useState([]);
  const [previousOrder, setPreviousOrder] = useState({});
  
  // Notifications
  const [notifications, setNotifications] = useState([
    { 
      id: '1', 
      title: 'Welcome!', 
      message: 'Welcome to HahaOnline. Enjoy fresh groceries delivered to your door.', 
      read: false 
    },
    { 
      id: '2', 
      title: 'Special Offer', 
      message: '25% off on all vegetables today!', 
      read: false 
    },
    { 
      id: '3', 
      title: 'Order Update', 
      message: 'Your recent order has been delivered.', 
      read: true 
    },
  ]);

  // Add translations for key terms
  const translations = {
  English: {
    // Navigation & Headers
    cart: "Cart",
    checkout: "Checkout",
    profile: "Profile",
    categories: "Categories",
    search: "Search fresh groceries...",
    
    // Product Related
    featuredProducts: "Featured Products",
    specialOffers: "Special Offers",
    localFruits: "Local Fruits",
    seeAll: "See All",
    price: "Price",
    rating: "Rating",
    per: "per",
    off: "OFF",
    size: "Size",
    regular: "Regular",
    large: "Large",
    quantity: "Quantity",
    total: "Total",
    unit: "Unit",

    // Units
    kg: "kg",
    bunch: "bunch",
    dozen: "dozen",
    liter: "L",
    pack: "pack",
    each: "each",

    // Product Names
    freshTomatoes: "Fresh Tomatoes",
    greenPeppers: "Green Peppers",
    freshCarrots: "Fresh Carrots",
    sweetPineapple: "Sweet Pineapple",
    freshPassionFruit: "Fresh Passion Fruit",
    ripeMango: "Ripe Mango",
    premiumRice: "Premium Rice",
    maizeFlour: "Maize Flour",
    freshMilk: "Fresh Milk",
    naturalYogurt: "Natural Yogurt",
    freshFish: "Fresh Fish",
    chicken: "Chicken",
    mixedSpices: "Mixed Spices",
    blackPepper: "Black Pepper",
    sweetPotatoes: "Sweet Potatoes",
    cassava: "Cassava",
    organicSpinach: "Organic Spinach",
    organicEggs: "Organic Eggs",

    // Categories
    vegetables: "Vegetables",
    fruits: "Fruits",
    grainsAndCereals: "Grains & Cereals",
    dairyProducts: "Dairy Products",
    meatAndFish: "Meat & Fish",
    spicesAndSeasonings: "Spices & Seasonings",
    localProduce: "Local Produce",
    organicFoods: "Organic Foods",

    // Cart & Checkout
    addToCart: "Add to Cart",
    addedToCart: "Added to cart!",
    viewCart: "View Cart",
    emptyCart: "Your cart is empty",
    startShopping: "Start Shopping",
    proceedToCheckout: "Proceed to Checkout",
    remove: "Remove",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    tax: "Tax",
    grandTotal: "Grand Total",

    // Location
    currentLocation: "Current location",
    locating: "Locating...",
    selectDeliveryLocation: "Select Delivery Location",
    useCurrentLocation: "Use my current location",
    popularLocationsKigali: "Popular Locations in Kigali",

    // Error Messages
    noProducts: "No products found",
    trySearching: "Try searching with different keywords",
    similarProducts: "Similar Products you might like",
    fillRequired: "Please fill in all required fields"
  },
  
  Kinyarwanda: {
    // Navigation & Headers
    cart: "ibihahwa",
    checkout: "kwishyura",
    profile: "Umwirondoro",
    categories: "Ibyiciro",
    search: "Shakisha ibyokurya bishya...",
    
    // Product Related
    featuredProducts: "Ibicuruzwa byagaragajwe",
    specialOffers: "Udushya",
    localFruits: "Imbuto",
    seeAll: "Reba byose",
    price: "Igiciro",
    rating: "amanota",
    per: "ku",
    off: "promosion",
    size: "Ingano",
    regular: "Bisanzwe",
    large: "Kinini",
    quantity: "Umubare",
    total: "Igiteranyo",
    unit: "Igipimo",

    // Units
    kg: "kg",
    bunch: "ipaki",
    dozen: "dazeni",
    liter: "litiro",
    pack: "ipaki",
    each: "buri kimwe",

    // Product Names
    freshTomatoes: "Inyanya zimeze neza",
    greenPeppers: "Urusenda rw'amababi",
    freshCarrots: "Karoti zimeze neza",
    sweetPineapple: "Inanasi zishya",
    freshPassionFruit: "amatunda mashya",
    ripeMango: "imyembe yeze",
    premiumRice: "Umuceri",
    maizeFlour: "Ifu y'ibigori",
    freshMilk: "Amata mashya",
    naturalYogurt: "Yahurute y'umubiri",
    freshFish: "Ifi ishya",
    chicken: "Inkoko",
    mixedSpices: "ibirungo bivanze",
    blackPepper: "Urusenda rutuku",
    sweetPotatoes: "Ibijumba",
    cassava: "Imyumbati",
    organicSpinach: "Isupinashi isukuye",
    organicEggs: "Amagi sukura",

    // Categories
    vegetables: "Imboga",
    fruits: "Imbuto",
    grainsAndCereals: "Ibinyamisogwe n'ibigori",
    dairyProducts: "Ibikomoka mu amata",
    meatAndFish: "Inyama n'ifi",
    spicesAndSeasonings: "insenda n'ibirungo",
    localProduce: "Ibikomoka mu gihugu",
    organicFoods: "Ibiribwa bisukuye",

    // Cart & Checkout
    addToCart: "Ongeraho mu bihahwa",
    addedToCart: "Byongewe mu bihahwa!",
    viewCart: "Reba ibihahwa",
    emptyCart: "ntabihahwa",
    startShopping: "Tangira kugura",
    proceedToCheckout: "Komeza kwishyura",
    remove: "Kuraho",
    subtotal: "Igiteranyo gito",
    deliveryFee: "Amafaranga ya delivery",
    tax: "Umusoro",
    grandTotal: "Igiteranyo cyose",

    // Location
    currentLocation: "aho uri",
    locating: "Gushaka aho uri...",
    selectDeliveryLocation: "Hitamo aho bijyanwa",
    useCurrentLocation: "Koresha aho ndi",
    popularLocationsKigali: "ahakunzwe muri Kigali",

    // Error Messages
    noProducts: "Ntabicuruzwa byabonetse",
    trySearching: "Gerageza gushakisha n'amagambo atandukanye",
    similarProducts: "Ibindi bicuruzwa ushobora gukunda",
    fillRequired: "Nyamuneka uzuzre ibisabwa byose"
  },

  French: {
    // Navigation & Headers
    cart: "Panier",
    checkout: "Caisse",
    profile: "Profil",
    categories: "Catégories",
    search: "Rechercher des produits frais...",
    
    // Product Related
    featuredProducts: "Produits en vedette",
    specialOffers: "Offres spéciales",
    localFruits: "Fruits locaux",
    seeAll: "Voir tout",
    price: "Prix",
    rating: "Évaluation",
    per: "par",
    off: "Réduction",
    size: "Taille",
    regular: "Normal",
    large: "Grand",
    quantity: "Quantité",
    total: "Total",
    unit: "Unité",

    // Units
    kg: "kg",
    bunch: "bouquet",
    dozen: "douzaine",
    liter: "litre",
    pack: "paquet",
    each: "pièce",

    // Product Names
    freshTomatoes: "Tomates fraîches",
    greenPeppers: "Poivrons verts",
    freshCarrots: "Carottes fraîches",
    sweetPineapple: "Ananas doux",
    freshPassionFruit: "Fruit de la passion frais",
    ripeMango: "Mangue mûre",
    premiumRice: "Riz premium",
    maizeFlour: "Farine de maïs",
    freshMilk: "Lait frais",
    naturalYogurt: "Yaourt nature",
    freshFish: "Poisson frais",
    chicken: "Poulet",
    mixedSpices: "Épices mélangées",
    blackPepper: "Poivre noir",
    sweetPotatoes: "Patates douces",
    cassava: "Manioc",
    organicSpinach: "Épinards bio",
    organicEggs: "Œufs bio",

    // Categories
    vegetables: "Légumes",
    fruits: "Fruits",
    grainsAndCereals: "Céréales et grains",
    dairyProducts: "Produits laitiers",
    meatAndFish: "Viande et poisson",
    spicesAndSeasonings: "Épices et assaisonnements",
    localProduce: "Produits locaux",
    organicFoods: "Aliments biologiques",

    // Cart & Checkout
    addToCart: "Ajouter au panier",
    addedToCart: "Ajouté au panier !",
    viewCart: "Voir le panier",
    emptyCart: "Votre panier est vide",
    startShopping: "Commencer vos achats",
    proceedToCheckout: "Passer à la caisse",
    remove: "Supprimer",
    subtotal: "Sous-total",
    deliveryFee: "Frais de livraison",
    tax: "Taxe",
    grandTotal: "Total général",

    // Location
    currentLocation: "Localisation actuelle",
    locating: "Localisation en cours...",
    selectDeliveryLocation: "Sélectionnez le lieu de livraison",
    useCurrentLocation: "Utiliser ma position actuelle",
    popularLocationsKigali: "Lieux populaires à Kigali",

    // Error Messages
    noProducts: "Aucun produit trouvé",
    trySearching: "Essayez avec d'autres mots-clés",
    similarProducts: "Produits similaires qui pourraient vous plaire",
    fillRequired: "Veuillez remplir tous les champs obligatoires"
  }
};

// Static data for featured products
const featuredProductsData = [
    {
      id: '1',
      name: 'Sweet Pineapple',
      price: 3.99,
      unit: 'piece',
      image: 'https://example.com/pineapple.jpg',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Fresh Carrots',
      price: 1.99,
      unit: 'kg',
      image: 'https://example.com/carrots.jpg',
      rating: 4.6
  },
  {
    id: '2',
    name: 'Fresh Carrots',
    price: 1.99,
    unit: 'kg',
    image: 'https://example.com/carrots.jpg',
    rating: 4.6
  }
];

  // Initialize state with featured products
  const [moreProducts, setMoreProducts] = useState(featuredProductsData);

  // Additional products will be fetched from the backend
  useEffect(() => {
    const fetchMoreProducts = async () => {
      try {
        const response = await axios.get('/api/products/featured');
        setMoreProducts([...featuredProductsData, ...response.data]);
      } catch (error) {
        console.error('Error fetching more products:', error);
      }
    };
    
    fetchMoreProducts();
  }, []);

  // Function to fetch data
  const fetchData = async () => {
    try {
      // Fetch products
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const allProducts = await response.json();
      
      // Filter featured products for special offers
      const featured = allProducts.filter(p => p.featured);
      setSpecialOffers(featured);
      
      // Set remaining products
      setProducts(allProducts.filter(p => !p.featured));
      
      // Fetch categories
      const catResponse = await fetch(`${API_BASE_URL}/api/categories`);
      const categoriesData = await catResponse.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    }
  };
  
  // Call fetchData when component mounts
  useEffect(() => {
    fetchData();
  }, []);
  
  // Featured products data for promotions
  const promotionalData = [
    {
      id: '1',
      title: 'Weekend Special',
      description: 'Get 20% off on all vegetables',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
      color: '#4CAF50'
    },
    {
      id: '2',
      title: 'Flash Sale',
      description: 'Buy 1 Get 1 Free on Fruits',
      image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e',
      color: '#FF9800'
    },
    {
      id: '3',
      title: 'New User Offer',
      description: '30% off on your first order',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
      color: '#2196F3'
    }
  ];

  // Initialize state for refreshing and deals
  const [refreshing, setRefreshing] = useState(false);
  const [deals, setDeals] = useState([]);

  // Handle refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageModal(false);
  };

  // Handle product press
  const handleProductPress = (product) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id }
    });
  };

  useEffect(() => {
    // Simulate fetching the user's current location
    setTimeout(() => {
      setLocationPermission(true);
    }, 1000);
  }, []);

  useEffect(() => {
    // Auto-slide deals
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % deals.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Product card component
  const ProductCard = ({ product }) => {
    const translatedProduct = {
      ...product,
      name: translations[language]?.[product.name] || product.name,
      translatedPrice: `${product.price.toLocaleString()} ${translations[language]?.currency || 'RWF'}`,
      translatedDiscount: product.discount ? 
        `${translations[language]?.['Off'] || 'Off'} ${product.discount}%` : null
    };

    const handlePress = () => {
      router.push(`/product/${product.id}?product=${encodeURIComponent(JSON.stringify(translatedProduct))}`);
    };

    return (
      <TouchableOpacity style={styles.productCard} onPress={handlePress}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        {product.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{translatedProduct.translatedDiscount}</Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {translatedProduct.name}
          </Text>
          <Text style={styles.productPrice}>{translatedProduct.translatedPrice}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      setSearchResults(null);
      setShowNoResults(false);
      return;
    }

    const query = searchText.toLowerCase();
    const allProducts = [...featuredProducts, ...specialOffers, ...localFruits];
    
    const results = allProducts.filter(product => 
      product.name.toLowerCase().includes(query)
    );

    if (results.length > 0) {
      setSearchResults(results);
      setShowNoResults(false);
    } else {
      setSearchResults([]);
      setShowNoResults(true);
    }
  };

  // Get translations based on selected language
  const getTranslation = (key) => {
    return translations[selectedLanguage][key];
  };

  // Update the CategoryCard component to handle navigation
  const CategoryCard = ({ category, language }) => {
    const router = useRouter();
    
    return (
      <TouchableOpacity 
        style={styles.categoryCard}
        onPress={() => router.push(`/category/${category.id}?language=${language}`)}
      >
        <View style={styles.categoryIcon}>
          <Ionicons name={category.icon} size={24} color="#4CAF50" />
        </View>
        <Text style={styles.categoryName} numberOfLines={2}>
          {category.name[language] || category.name.English}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cart notification - Moved to top */}
      {showCartNotification && (
        <TouchableOpacity 
          style={styles.notificationOverlay} 
          activeOpacity={1}
          onPress={() => setShowCartNotification(false)}
        >
          <TouchableOpacity 
            style={styles.cartNotification}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.cartNotificationText}>
              {translations[selectedLanguage].addedToCart}
            </Text>
            <TouchableOpacity 
              style={styles.viewCartButton}
              onPress={() => {
                setShowCartNotification(false);
                router.push('/cart');
              }}
            >
              <Text style={styles.viewCartText}>
                {translations[selectedLanguage].viewCart}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              <Text style={styles.logoTextGreen}>Haha</Text>
              <Text style={styles.logoTextBlack}>Online</Text>
            </Text>
          </View>
          
          <View style={styles.headerRightContent}>
            <TouchableOpacity 
              style={styles.languageButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={styles.languageText}>
                {selectedLanguage === 'English' ? 'Eng' : 
                 selectedLanguage === 'Kinyarwanda' ? 'Kin' : 'Fr'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#333" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.notificationButton} 
              onPress={() => setShowNotificationsModal(true)}
            >
              <Ionicons name="notifications-outline" size={24} color="#333" />
              {getUnreadNotificationCount() > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{getUnreadNotificationCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationIconContainer}>
            <Ionicons name="location-outline" size={20} color="#fff" />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>{currentLocation}</Text>
            <Text style={styles.locationSubtitle}>
              {locationPermission 
                ? "Current location" 
                : "Locating..."}
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={getTranslation('search')}
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="arrow-forward" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {/* Deals Slider */}
        <View style={styles.dealsContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / Dimensions.get('window').width);
              setCurrentSlide(newIndex);
            }}
          >
            {deals.map((deal, index) => (
              <View key={deal.id} style={styles.dealSlide}>
                <Image source={{ uri: deal.image }} style={styles.dealImage} />
                <View style={[styles.dealContent, { backgroundColor: deal.color }]}>
                  <Text style={styles.dealTitle}>{deal.title}</Text>
                  <Text style={styles.dealDescription}>{deal.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {deals.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentSlide === index && styles.paginationDotActive
                ]}
              />
            ))}
            </View>
            </View>

        {/* Search Results */}
        {searchResults && (
          <View style={styles.searchResultsContainer}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>
                {getTranslation('searchResults')} "{searchText}"
              </Text>
              <TouchableOpacity onPress={() => setSearchResults(null)}>
                <Text style={styles.clearSearchText}>{getTranslation('clear')}</Text>
              </TouchableOpacity>
          </View>

            {showNoResults ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={48} color="#CCC" />
                <Text style={styles.noResultsText}>{getTranslation('noProducts')}</Text>
                <Text style={styles.noResultsSubtext}>{getTranslation('trySearching')}</Text>
                
                {/* Similar Products Suggestions */}
                <View style={styles.similarProductsContainer}>
                  <Text style={styles.similarProductsTitle}>{getTranslation('similarProducts')}</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.productsContainer}
                  >
                    {featuredProductsData.slice(0, 5).map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        language={selectedLanguage} 
                      />
                    ))}
                  </ScrollView>
        </View>
              </View>
            ) : (
              <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                  <ProductCard 
                    product={item} 
                    language={selectedLanguage} 
                  />
                )}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.searchResultsColumns}
                scrollEnabled={false}
              />
            )}
          </View>
        )}

        {!searchResults && (
          <>
        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{getTranslation('categories')}</Text>
          <TouchableOpacity onPress={() => router.push('/categories')}>
            <Ionicons name="chevron-forward" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              language={selectedLanguage} 
            />
          ))}
        </ScrollView>

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{getTranslation('featuredProducts')}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>{getTranslation('seeAll')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
        >
          {featuredProductsData.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              language={selectedLanguage} 
            />
          ))}
        </ScrollView>

        {/* Special Offers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{getTranslation('specialOffers')}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>{getTranslation('seeAll')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
        >
          {specialOffers.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              language={selectedLanguage} 
            />
          ))}
        </ScrollView>

            {/* Local Fruits */}
        <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{getTranslation('localFruits')}</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>{getTranslation('seeAll')}</Text>
              </TouchableOpacity>
        </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsContainer}
            >
              {localFruits.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  language={selectedLanguage} 
                />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>

      {/* Location Selector Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLocationModal}
        onRequestClose={closeLocationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getTranslation('selectDeliveryLocation')}</Text>
              <TouchableOpacity onPress={closeLocationModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {locationError ? (
              <View style={styles.locationError}>
                <Text style={styles.locationErrorText}>{locationError}</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={getDetailedLocation}
                >
                  <Text style={styles.retryButtonText}>{getTranslation('retry')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.mapContainer}>
                  {locationDetails.coordinates && (
                    <Image 
                      source={{ 
                        uri: `https://maps.googleapis.com/maps/api/staticmap?center=${locationDetails.coordinates.latitude},${locationDetails.coordinates.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${locationDetails.coordinates.latitude},${locationDetails.coordinates.longitude}&key=YOUR_API_KEY` 
                      }} 
                      style={styles.mapImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.mapPin}>
                    <Ionicons name="location" size={30} color="#4CAF50" />
                  </View>
                </View>
                
                <View style={styles.locationDetails}>
                  <Text style={styles.locationDetailText}>
                    {locationDetails.street && `${locationDetails.street}, `}
                    {locationDetails.district && `${locationDetails.district}, `}
                    {locationDetails.city}
                  </Text>
                  <Text style={styles.locationSubDetail}>{locationDetails.country}</Text>
              </View>
              </>
            )}
            
            <TouchableOpacity 
              style={styles.locationOption}
              onPress={getDetailedLocation}
            >
              <Ionicons name="locate" size={24} color="#4CAF50" />
              <Text style={styles.locationOptionText}>{getTranslation('useCurrentLocation')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Selector Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.languageModalContent}>
            <TouchableOpacity 
              style={[
                styles.languageOption,
                selectedLanguage === 'English' && styles.selectedLanguageOption
              ]}
              onPress={() => {
                setSelectedLanguage('English');
                setShowLanguageModal(false);
              }}
            >
              <Text style={styles.languageOptionText}>English</Text>
              {selectedLanguage === 'English' && (
                <Ionicons name="checkmark" size={18} color="#4CAF50" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.languageOption,
                selectedLanguage === 'Kinyarwanda' && styles.selectedLanguageOption
              ]}
              onPress={() => {
                setSelectedLanguage('Kinyarwanda');
                setShowLanguageModal(false);
              }}
            >
              <Text style={styles.languageOptionText}>Ikinyarwanda</Text>
              {selectedLanguage === 'Kinyarwanda' && (
                <Ionicons name="checkmark" size={18} color="#4CAF50" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.languageOption,
                selectedLanguage === 'French' && styles.selectedLanguageOption
              ]}
              onPress={() => {
                setSelectedLanguage('French');
                setShowLanguageModal(false);
              }}
            >
              <Text style={styles.languageOptionText}>Français</Text>
              {selectedLanguage === 'French' && (
                <Ionicons name="checkmark" size={18} color="#4CAF50" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotificationsModal}
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationsModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getTranslation('notifications')}</Text>
              <TouchableOpacity onPress={() => setShowNotificationsModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.notificationsList}>
              {notifications.length === 0 ? (
                <View style={styles.emptyNotifications}>
                  <Ionicons name="notifications-off-outline" size={48} color="#CCC" />
                  <Text style={styles.emptyNotificationsText}>{getTranslation('noNotifications')}</Text>
                </View>
              ) : (
                notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      !notification.read && styles.unreadNotification
                    ]}
                    onPress={() => handleNotificationPress(notification)}
                  >
                    <View style={styles.notificationIcon}>
                      <Ionicons 
                        name="notifications" 
                        size={24} 
                        color={notification.read ? "#CCC" : "#4CAF50"} 
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                    </View>
                    {!notification.read && (
                      <View style={styles.unreadDot} />
                    )}
                  </TouchableOpacity>
                ))
              )}
      </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoTextGreen: {
    color: '#4CAF50',
  },
  logoTextBlack: {
    color: '#333',
  },
  headerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  languageText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  locationSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
  },
  promotionContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 160,
    marginBottom: 24,
    position: 'relative',
  },
  promotionImage: {
    width: '100%',
    height: '100%',
  },
  promotionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    padding: 16,
  },
  promotionDots: {
    marginRight: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333',
    marginBottom: 4,
  },
  promotionContent: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  promotionOffer: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  promotionSubtitle: {
    fontSize: 14,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  productCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
    position: 'relative',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  orderItems: {
    flexDirection: 'row',
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  moreItemsContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartNotification: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartNotificationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  viewCartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  viewCartText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mapContainer: {
    height: 200,
    marginVertical: 15,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -30,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  locationOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  locationError: {
    padding: 20,
    alignItems: 'center',
  },
  locationErrorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  locationDetails: {
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginVertical: 12,
  },
  locationDetailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  locationSubDetail: {
    fontSize: 14,
    color: '#666',
  },
  languageModalContent: {
    position: 'absolute',
    top: 60,
    right: 70,
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  selectedLanguageOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationsModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  notificationsList: {
    maxHeight: 400,
  },
  emptyNotifications: {
    alignItems: 'center',
    padding: 40,
  },
  emptyNotificationsText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadNotification: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  searchResultsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearSearchText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  searchResultsColumns: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    marginVertical: 12,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  notificationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 50 : 25,
  },
  dealsContainer: {
    height: 200,
    marginVertical: 16,
    position: 'relative',
  },
  dealSlide: {
    width: Dimensions.get('window').width - 32,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  dealImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  dealContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  dealTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  dealDescription: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
  },
  similarProductsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  similarProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  }
});