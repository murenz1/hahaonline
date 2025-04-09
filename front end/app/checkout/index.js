import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const translations = {
  English: {
    checkout: "Checkout",
    deliveryAddress: "Delivery Address",
    addAddress: "Add Address",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    city: "City",
    notes: "Notes (Optional)",
    addNotes: "Add notes for delivery",
    deliveryOptions: "Delivery Options",
    standardDelivery: "Standard Delivery",
    standardDeliveryDesc: "2-3 business days",
    expressDelivery: "Express Delivery",
    expressDeliveryDesc: "Same day delivery",
    paymentMethod: "Payment Method",
    addPayment: "Add Payment Method",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    tax: "Tax",
    total: "Total",
    currency: "RWF",
    placeOrder: "Place Order",
    orderSuccess: "Order Placed Successfully!",
    orderSuccessDesc: "Your order has been placed successfully. You will receive a confirmation email shortly.",
    continueShopping: "Continue Shopping",
    viewOrder: "View Order"
  },
  Kinyarwanda: {
    checkout: "kwishyura",
    deliveryAddress: "Aderesi yo koherezaho",
    addAddress: "Ongeraho aderesi",
    fullName: "Izina ryuzuye",
    phoneNumber: "Numero ya telefoni",
    city: "Umujyi",
    notes: "singombwa",
    addNotes: "gira icyo urenzaho",
    deliveryOptions: "Uburyo bwo gutanga",
    standardDelivery: "Kohereza bisanzwe",
    standardDeliveryDesc: "Iminsi 2-3 y'akazi",
    expressDelivery: "Kohereza byihuse",
    expressDeliveryDesc: "Kohereza munsi umwe",
    paymentMethod: "Uburyo bwo kwishyura",
    addPayment: "Ongeraho uburyo bwo kwishyura",
    orderSummary: "Incamake y'ibitumizwa",
    subtotal: "Igiteranyo gito",
    deliveryFee: "Amafaranga ya delivery",
    tax: "Umusoro",
    total: "Igiteranyo",
    currency: "RWF",
    placeOrder: "Tuma",
    orderSuccess: "order yakiriwe!",
    orderSuccessDesc: "order yawe yakiriwe neza. Urahabwa ubutumwa bubyemeza.",
    continueShopping: "Komeza kugura",
    viewOrder: "Reba ibyatumwe"
  },
  French: {
    checkout: "Caisse",
    deliveryAddress: "Adresse de livraison",
    addAddress: "Ajouter une adresse",
    fullName: "Nom complet",
    phoneNumber: "Numéro de téléphone",
    city: "Ville",
    notes: "Notes (Optionnel)",
    addNotes: "Ajouter des notes pour la livraison",
    deliveryOptions: "Options de livraison",
    standardDelivery: "Livraison standard",
    standardDeliveryDesc: "2-3 jours ouvrables",
    expressDelivery: "Livraison express",
    expressDeliveryDesc: "Livraison le jour même",
    paymentMethod: "Moyen de paiement",
    addPayment: "Ajouter un moyen de paiement",
    orderSummary: "Résumé de la commande",
    subtotal: "Sous-total",
    deliveryFee: "Frais de livraison",
    tax: "Taxe",
    total: "Total",
    currency: "RWF",
    placeOrder: "Passer la commande",
    orderSuccess: "Commande passée avec succès !",
    orderSuccessDesc: "Votre commande a été passée avec succès. Vous recevrez un e-mail de confirmation sous peu.",
    continueShopping: "Continuer vos achats",
    viewOrder: "Voir la commande"
  }
};

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { subtotal, delivery, tax, total } = params;
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Kigali',
    notes: '',
  });
  
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  // Format price in Rwandan Francs
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.phone.trim() !== '' && 
           formData.address.trim() !== '';
  };
  
  const proceedToPayment = () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }
    
    router.push({
      pathname: '/checkout/payment',
      params: {
        ...params,
        deliveryOption,
        ...formData
      }
    });
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      city: location,
      address: location === 'Other' ? formData.address : `${location}, Rwanda`
    });
    setShowLocationModal(false);
  };
  
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

  const calculateDeliveryFee = () => {
    return deliveryOption === 'express' ? 2000 : 1000;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = calculateDeliveryFee();
    const tax = subtotal * 0.18; // 18% VAT
    return subtotal + deliveryFee + tax;
  };

  const handlePlaceOrder = () => {
    // Here you would typically make an API call to process the order
    setShowOrderSuccess(true);
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getTranslation('checkout')}</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.scrollView}>
          {/* Delivery Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getTranslation('deliveryAddress')}</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{getTranslation('fullName')} *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{getTranslation('phoneNumber')} *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{getTranslation('city')} *</Text>
              <TouchableOpacity 
                style={styles.locationSelector}
                onPress={() => setShowLocationModal(true)}
              >
                <Text style={styles.locationText}>{formData.city}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Delivery Address *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your specific delivery address"
                multiline
                numberOfLines={3}
                value={formData.address}
                onChangeText={(text) => handleInputChange('address', text)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{getTranslation('notes')} (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={getTranslation('addNotes')}
                multiline
                numberOfLines={3}
                value={formData.notes}
                onChangeText={(text) => handleInputChange('notes', text)}
              />
            </View>
          </View>
          
          {/* Delivery Options Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getTranslation('deliveryOptions')}</Text>
            
            <TouchableOpacity 
              style={[
                styles.deliveryOption, 
                deliveryOption === 'standard' && styles.selectedDeliveryOption
              ]}
              onPress={() => setDeliveryOption('standard')}
            >
              <View style={styles.deliveryOptionContent}>
                <View>
                  <Text style={styles.deliveryOptionTitle}>{getTranslation('standardDelivery')}</Text>
                  <Text style={styles.deliveryOptionDescription}>{getTranslation('standardDeliveryDesc')}</Text>
                </View>
                <Text style={styles.deliveryOptionPrice}>{formatPrice(delivery)} {getTranslation('currency')}</Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  deliveryOption === 'standard' && styles.radioOuterSelected
                ]}>
                  {deliveryOption === 'standard' && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.deliveryOption, 
                deliveryOption === 'express' && styles.selectedDeliveryOption
              ]}
              onPress={() => setDeliveryOption('express')}
            >
              <View style={styles.deliveryOptionContent}>
                <View>
                  <Text style={styles.deliveryOptionTitle}>{getTranslation('expressDelivery')}</Text>
                  <Text style={styles.deliveryOptionDescription}>{getTranslation('expressDeliveryDesc')}</Text>
                </View>
                <Text style={styles.deliveryOptionPrice}>{formatPrice(Number(delivery) + 1500)} {getTranslation('currency')}</Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  deliveryOption === 'express' && styles.radioOuterSelected
                ]}>
                  {deliveryOption === 'express' && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Order Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getTranslation('orderSummary')}</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{getTranslation('subtotal')}</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)} {getTranslation('currency')}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{getTranslation('deliveryFee')}</Text>
              <Text style={styles.summaryValue}>
                {deliveryOption === 'standard' 
                  ? formatPrice(delivery) 
                  : formatPrice(Number(delivery) + 1500)} {getTranslation('currency')}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{getTranslation('tax')} (18%)</Text>
              <Text style={styles.summaryValue}>{formatPrice(tax)} {getTranslation('currency')}</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{getTranslation('total')}</Text>
              <Text style={styles.totalValue}>
                {deliveryOption === 'standard' 
                  ? formatPrice(total)
                  : formatPrice(Number(total) + 1500)} {getTranslation('currency')}
              </Text>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.proceedButton, !isFormValid() && styles.disabledButton]}
            onPress={proceedToPayment}
            disabled={!isFormValid()}
          >
            <Text style={styles.proceedButtonText}>{getTranslation('placeOrder')}</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Location Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLocationModal}
          onRequestClose={() => setShowLocationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{getTranslation('checkout')}</Text>
                <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              {/* Map container - In a real app, this would be a MapView component */}
              <View style={styles.mapContainer}>
                <Image 
                  source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=Rwanda&zoom=7&size=600x300&maptype=roadmap&key=YOUR_API_KEY' }} 
                  style={styles.mapImage}
                  resizeMode="cover"
                />
                <View style={styles.mapPin}>
                  <Ionicons name="location" size={30} color="#4CAF50" />
                </View>
              </View>
              
              <ScrollView style={styles.locationsList}>
                {[
                  'Kigali', 
                  'Rubavu', 
                  'Musanze', 
                  'Huye', 
                  'Nyagatare',
                  'Rusizi',
                  'Muhanga',
                  'Other'
                ].map((location, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[
                      styles.locationItem,
                      formData.city === location && styles.selectedLocationItem
                    ]}
                    onPress={() => handleLocationSelect(location)}
                  >
                    <Ionicons 
                      name="location-outline" 
                      size={20} 
                      color={formData.city === location ? "#4CAF50" : "#666"} 
                    />
                    <Text 
                      style={[
                        styles.locationItemText,
                        formData.city === location && styles.selectedLocationItemText
                      ]}
                    >
                      {location}
                    </Text>
                    {formData.city === location && (
                      <Ionicons name="checkmark" size={20} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Order Success Modal */}
        {showOrderSuccess && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
              <Text style={styles.modalTitle}>
                {getTranslation('orderSuccess')}
              </Text>
              <Text style={styles.modalDescription}>
                {getTranslation('orderSuccessDesc')}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.secondaryButton]}
                  onPress={() => {
                    setShowOrderSuccess(false);
                    router.push('/');
                  }}
                >
                  <Text style={styles.secondaryButtonText}>
                    {getTranslation('continueShopping')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={() => {
                    setShowOrderSuccess(false);
                    router.push('/orders');
                  }}
                >
                  <Text style={styles.primaryButtonText}>
                    {getTranslation('viewOrder')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  selectedDeliveryOption: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  deliveryOptionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  deliveryOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
  deliveryOptionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 12,
  },
  radioContainer: {
    marginLeft: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#4CAF50',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
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
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  locationSelector: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
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
  locationsList: {
    maxHeight: 300,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedLocationItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  locationItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedLocationItemText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#CCCCCC',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 