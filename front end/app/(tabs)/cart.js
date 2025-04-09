import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data for cart items
const cartItemsData = [
  {
    id: '1',
    name: 'Organic Broccoli',
    price: 2500,
    unit: 'bunch',
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    quantity: 1,
  },
  {
    id: '2',
    name: 'Fresh Avocado',
    price: 1200,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    quantity: 2,
  },
  {
    id: '3',
    name: 'Tomatoes',
    price: 3500,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1566702593104-697cc456a99e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    quantity: 1,
  },
];

const translations = {
  English: {
    cart: "Cart",
    emptyCart: "Your cart is empty",
    startShopping: "Start Shopping",
    total: "Total",
    currency: "RWF",
    proceedToCheckout: "Proceed to Checkout",
    quantity: "Quantity",
    remove: "Remove",
    size: "Size",
    regular: "Regular",
    large: "Large",
    unit: "Unit",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    tax: "Tax",
    grandTotal: "Grand Total",
    itemCount: "items"
  },
  Kinyarwanda: {
    cart: "ibihahwa",
    emptyCart: "ntabihahwa",
    startShopping: "Tangira kugura",
    total: "Igiteranyo",
    currency: "RWF",
    proceedToCheckout: "Komeza kwishyura",
    quantity: "Umubare",
    remove: "Kuraho",
    size: "Ingano",
    regular: "Bisanzwe",
    large: "Kinini",
    unit: "Igipimo",
    subtotal: "Igiteranyo gito",
    deliveryFee: "Amafaranga ya delivery",
    tax: "Umusoro",
    grandTotal: "Igiteranyo cyose",
    itemCount: "ibintu"
  },
  French: {
    cart: "Panier",
    emptyCart: "Votre panier est vide",
    startShopping: "Commencer vos achats",
    total: "Total",
    currency: "RWF",
    proceedToCheckout: "Passer à la caisse",
    quantity: "Quantité",
    remove: "Supprimer",
    size: "Taille",
    regular: "Normal",
    large: "Grand",
    unit: "Unité",
    subtotal: "Sous-total",
    deliveryFee: "Frais de livraison",
    tax: "Taxe",
    grandTotal: "Total général",
    itemCount: "articles"
  }
};

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const getTranslation = (key) => {
    return translations[selectedLanguage]?.[key] || key;
  };

  const calculateItemTotal = (item) => {
    const basePrice = item.price;
    const sizeMultiplier = item.size === 'large' ? 1.5 : 1;
    return basePrice * item.quantity * sizeMultiplier * (1 - (item.discount || 0) / 100);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = 1000; // Fixed delivery fee of 1000 RWF
    const tax = subtotal * 0.18; // 18% VAT
    return subtotal + deliveryFee + tax;
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId, increment) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: Math.max(1, item.quantity + increment)
        };
      }
      return item;
    }));
  };

  const proceedToCheckout = () => {
    router.push('/checkout');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name[selectedLanguage]}</Text>
        {item.size && (
          <Text style={styles.itemSize}>
            {getTranslation('size')}: {getTranslation(item.size)}
          </Text>
        )}
        <Text style={styles.itemPrice}>
          {item.price.toLocaleString()} {getTranslation('currency')}/{item.unit}
        </Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, -1)}
          >
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, 1)}
          >
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          {calculateItemTotal(item).toLocaleString()} {getTranslation('currency')}
        </Text>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{getTranslation('cart')}</Text>
        <Text style={styles.itemCount}>{cartItems.length} {getTranslation('itemCount')}</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyCartText}>{getTranslation('emptyCart')}</Text>
          <TouchableOpacity
            style={styles.startShoppingButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.startShoppingText}>{getTranslation('startShopping')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.cartItemsContainer}>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{getTranslation('subtotal')}</Text>
              <Text style={styles.summaryValue}>
                {calculateSubtotal().toLocaleString()} {getTranslation('currency')}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{getTranslation('deliveryFee')}</Text>
              <Text style={styles.summaryValue}>
                1,000 {getTranslation('currency')}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{getTranslation('tax')} (18%)</Text>
              <Text style={styles.summaryValue}>
                {(calculateSubtotal() * 0.18).toLocaleString()} {getTranslation('currency')}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{getTranslation('grandTotal')}</Text>
              <Text style={styles.totalValue}>
                {calculateTotal().toLocaleString()} {getTranslation('currency')}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
      
      {cartItems.length > 0 && (
        <View style={styles.checkoutContainer}>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={proceedToCheckout}
          >
            <Text style={styles.checkoutButtonText}>
              {getTranslation('proceedToCheckout')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  cartItemsContainer: {
    flex: 1,
    padding: 16,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 24,
  },
  startShoppingButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startShoppingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 12,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  removeButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 