import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { 
    name, 
    phone, 
    address, 
    city,
    subtotal, 
    delivery, 
    tax, 
    finalTotal, 
    deliveryOption, 
    paymentMethod,
    notes 
  } = params;
  
  // Format price in Rwandan Francs
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };
  
  // Generate a random order number
  const orderNumber = "HO" + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  
  // Calculate estimated delivery time
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };
  
  const getEstimatedDeliveryTime = () => {
    const now = new Date();
    const addMinutes = deliveryOption === 'express' ? 30 : 120;
    now.setMinutes(now.getMinutes() + addMinutes);
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };
  
  const getPaymentMethodText = () => {
    switch (paymentMethod) {
      case 'momo':
        return 'Mobile Money';
      case 'card':
        return 'Credit/Debit Card';
      case 'cash':
        return 'Cash on Delivery';
      default:
        return 'Unknown';
    }
  };
  
  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case 'momo':
        return 'phone-portrait-outline';
      case 'card':
        return 'card-outline';
      case 'cash':
        return 'cash-outline';
      default:
        return 'help-circle-outline';
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>Order Confirmation</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={60} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successMessage}>
              Thank you for your order. We've received your order and will begin processing it right away.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Order Number</Text>
              <Text style={styles.orderInfoValue}>{orderNumber}</Text>
            </View>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Order Time</Text>
              <Text style={styles.orderInfoValue}>{getCurrentTime()}</Text>
            </View>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Estimated Delivery</Text>
              <Text style={styles.orderInfoValue}>{getEstimatedDeliveryTime()}</Text>
            </View>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Delivery Option</Text>
              <Text style={styles.orderInfoValue}>
                {deliveryOption === 'express' ? 'Express Delivery' : 'Standard Delivery'}
              </Text>
            </View>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Payment Method</Text>
              <View style={styles.paymentMethodContainer}>
                <Ionicons name={getPaymentMethodIcon()} size={16} color="#333" />
                <Text style={styles.orderInfoValue}>{getPaymentMethodText()}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            
            <View style={styles.deliveryInfoContainer}>
              <View style={styles.deliveryRow}>
                <Ionicons name="person-outline" size={18} color="#666" style={styles.deliveryIcon} />
                <Text style={styles.deliveryText}>{name}</Text>
              </View>
              
              <View style={styles.deliveryRow}>
                <Ionicons name="call-outline" size={18} color="#666" style={styles.deliveryIcon} />
                <Text style={styles.deliveryText}>{phone}</Text>
              </View>
              
              <View style={styles.deliveryRow}>
                <Ionicons name="location-outline" size={18} color="#666" style={styles.deliveryIcon} />
                <Text style={styles.deliveryText}>{address}, {city}</Text>
              </View>
              
              {notes && (
                <View style={styles.deliveryRow}>
                  <Ionicons name="document-text-outline" size={18} color="#666" style={styles.deliveryIcon} />
                  <Text style={styles.deliveryText}>{notes}</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)} RWF</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                {deliveryOption === 'standard' 
                  ? formatPrice(delivery) 
                  : formatPrice(Number(delivery) + 1500)} RWF
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>VAT (18%)</Text>
              <Text style={styles.summaryValue}>{formatPrice(tax)} RWF</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(finalTotal)} RWF</Text>
            </View>
          </View>
          
          <View style={styles.trackingContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }} 
              style={styles.mapPreview}
            />
            <TouchableOpacity style={styles.trackButton}>
              <Ionicons name="navigate" size={18} color="#FFF" />
              <Text style={styles.trackButtonText}>Track Your Order</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
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
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryInfoContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryIcon: {
    marginRight: 12,
  },
  deliveryText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
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
  trackingContainer: {
    marginHorizontal: 16,
    marginBottom: 80,
    alignItems: 'center',
  },
  mapPreview: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  trackButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
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
  continueButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 