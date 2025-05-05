import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Mock product data
const productData = {
  id: '1',
  name: 'Wireless Noise Cancelling Headphones',
  price: 189.99,
  discountPrice: 159.99,
  rating: 4.8,
  reviews: 245,
  description: 'Experience immersive sound with these premium wireless headphones. Features include active noise cancellation, 30-hour battery life, touch controls, and a comfortable over-ear design for all-day wear.',
  images: [
    'https://via.placeholder.com/500x500/9C27B0/FFFFFF?text=Headphones+1',
    'https://via.placeholder.com/500x500/673AB7/FFFFFF?text=Headphones+2',
    'https://via.placeholder.com/500x500/3F51B5/FFFFFF?text=Headphones+3',
  ],
  colors: ['#000000', '#FFFFFF', '#9C27B0'],
  features: [
    'Active Noise Cancellation',
    'Bluetooth 5.0',
    '30-hour Battery Life',
    'Quick Charge (10 min = 5 hours)',
    'Built-in Microphone',
    'Touch Controls',
  ],
  inStock: true,
};

// Update the translations object with more comprehensive translations
const translations = {
  English: {
    // Product Details
    size: "Size",
    regular: "Regular",
    large: "Large",
    quantity: "Quantity",
    total: "Total",
    addToCart: "Add to Cart",
    addedToCart: "Added to cart!",
    viewCart: "View Cart",
    currency: "RWF",
    rating: "Rating",
    description: "Description",
    specifications: "Specifications",
    features: "Features",
    relatedProducts: "Related Products",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    unit: "Unit",
    price: "Price",
    // Units
    kg: "kg",
    bunch: "bunch",
    dozen: "dozen",
    liter: "L",
    pack: "pack",
    each: "each"
  },
  Kinyarwanda: {
    // Product Details
    size: "Ingano",
    regular: "Isanzwe",
    large: "Nini",
    quantity: "Umubare",
    total: "Igiteranyo",
    addToCart: "Shyira mu Gikari",
    addedToCart: "Byongewe muri Igikari!",
    viewCart: "Reba Igikari",
    currency: "RWF",
    rating: "Isuzuma",
    description: "Ibisobanuro",
    specifications: "Ibimenyetso",
    features: "Ibiranga",
    relatedProducts: "Ibindi Bisa",
    inStock: "Birahari",
    outOfStock: "Ntibihari",
    unit: "Urugero",
    price: "Igiciro",
    // Units
    kg: "kg",
    bunch: "ishashi",
    dozen: "duzeni",
    liter: "L",
    pack: "ipaki",
    each: "buri"
  },
  French: {
    // Product Details
    size: "Taille",
    regular: "Normal",
    large: "Grand",
    quantity: "Quantité",
    total: "Total",
    addToCart: "Ajouter au Panier",
    addedToCart: "Ajouté au panier!",
    viewCart: "Voir le Panier",
    currency: "RWF",
    rating: "Évaluation",
    description: "Description",
    specifications: "Spécifications",
    features: "Caractéristiques",
    relatedProducts: "Produits Similaires",
    inStock: "En Stock",
    outOfStock: "Rupture de Stock",
    unit: "Unité",
    price: "Prix",
    // Units
    kg: "kg",
    bunch: "botte",
    dozen: "douzaine",
    liter: "L",
    pack: "paquet",
    each: "pièce"
  }
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id, language } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage] = useState(language || 'English');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('regular');
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getTranslation = (key) => {
    return translations[selectedLanguage]?.[key] || key;
  };

  const handleAddToCart = () => {
    // Add the product to cart with selected options
    const cartItem = {
      ...product,
      quantity,
      size: selectedSize,
      totalPrice: calculateTotalPrice(),
      selectedLanguage
    };
    
    // Show success notification
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const handleQuantityChange = (increment) => {
    setQuantity(Math.max(1, quantity + increment));
  };

  const calculateTotalPrice = () => {
    const basePrice = product.price;
    const sizeMultiplier = selectedSize === 'large' ? 1.5 : 1;
    return basePrice * quantity * sizeMultiplier * (1 - (product.discount || 0) / 100);
  };

  const getUnitTranslation = () => {
    return getTranslation(product.unit.toLowerCase());
  };

  const windowWidth = Dimensions.get('window').width;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.name[selectedLanguage]}</Text>
      </View>
      
      <ScrollView style={styles.container}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }} 
            style={styles.productImage}
            resizeMode="cover"
          />
          {product.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% {getTranslation('off')}</Text>
            </View>
          )}
        </View>
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name[selectedLanguage]}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={styles.ratingText}>
              {product.rating} {getTranslation('rating')}
            </Text>
          </View>
          <Text style={styles.price}>
            {product.price.toLocaleString()} {getTranslation('currency')}/{getUnitTranslation()}
          </Text>
        </View>
          
        {/* Size Selection - Only show for applicable products */}
        {['vegetables', 'fruits'].includes(product.category) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getTranslation('size')}</Text>
            <View style={styles.sizeOptions}>
              <TouchableOpacity 
                style={[
                  styles.sizeOption,
                  selectedSize === 'regular' && styles.selectedSize
                ]}
                onPress={() => setSelectedSize('regular')}
              >
                <Text style={[
                  styles.sizeText,
                  selectedSize === 'regular' && styles.selectedSizeText
                ]}>{getTranslation('regular')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sizeOption,
                  selectedSize === 'large' && styles.selectedSize
                ]}
                onPress={() => setSelectedSize('large')}
              >
                <Text style={[
                  styles.sizeText,
                  selectedSize === 'large' && styles.selectedSizeText
                ]}>{getTranslation('large')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
          
        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getTranslation('quantity')}</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
            >
              <Ionicons name="remove" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
            >
              <Ionicons name="add" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
          
        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>{getTranslation('total')}:</Text>
          <Text style={styles.totalPrice}>
            {calculateTotalPrice().toLocaleString()} {getTranslation('currency')}
          </Text>
        </View>
      </ScrollView>
      
      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
          <Text style={styles.addToCartText}>{getTranslation('addToCart')}</Text>
        </TouchableOpacity>
      </View>

      {/* Added to Cart Notification */}
      {showAddedToCart && (
        <TouchableOpacity 
          style={styles.notificationOverlay}
          activeOpacity={1}
          onPress={() => setShowAddedToCart(false)}
        >
          <TouchableOpacity 
            style={styles.notification}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.notificationText}>{getTranslation('addedToCart')}</Text>
            <TouchableOpacity 
              style={styles.viewCartButton}
              onPress={() => {
                setShowAddedToCart(false);
                router.push('/cart');
              }}
            >
              <Text style={styles.viewCartText}>{getTranslation('viewCart')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedSize: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  sizeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSizeText: {
    color: '#FFFFFF',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 18,
    color: '#666',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
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
  notification: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationText: {
    marginLeft: 8,
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
}); 