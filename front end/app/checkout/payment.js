import React, { useState } from 'react';
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
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { subtotal, delivery, tax, total, deliveryOption } = params;
  
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [momoDetails, setMomoDetails] = useState({
    phone: params.phone || '',
  });
  
  // Format price in Rwandan Francs
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };
  
  const handleCardInputChange = (field, value) => {
    setCardDetails({
      ...cardDetails,
      [field]: value
    });
  };
  
  const handleMomoInputChange = (value) => {
    setMomoDetails({
      ...momoDetails,
      phone: value
    });
  };
  
  const isFormValid = () => {
    if (paymentMethod === 'card') {
      return (
        cardDetails.number.length >= 16 &&
        cardDetails.name.trim() !== '' &&
        cardDetails.expiry.length >= 5 &&
        cardDetails.cvv.length >= 3
      );
    }
    if (paymentMethod === 'momo') {
      return momoDetails.phone.length >= 10;
    }
    return true; // For cash on delivery
  };
  
  const handlePayment = () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Details', 'Please fill in all the required fields correctly.');
      return;
    }
    
    // Different messages based on payment method
    let message = '';
    
    if (paymentMethod === 'momo') {
      message = `A payment request has been sent to ${momoDetails.phone}. Please check your phone and enter your PIN to complete the payment.`;
    } else if (paymentMethod === 'card') {
      message = 'Your card payment has been processed successfully!';
    } else { // cash
      message = 'Your order has been placed successfully! Please have the exact amount ready for delivery.';
    }
    
    Alert.alert(
      'Payment Successful',
      message,
      [
        {
          text: 'OK',
          onPress: () => router.push({
            pathname: '/checkout/confirmation',
            params: {
              ...params,
              paymentMethod,
              finalTotal: paymentMethod === 'cash' ? 
                Number(total) + (deliveryOption === 'express' ? 1500 : 0) :
                Number(total) + (deliveryOption === 'express' ? 1500 : 0)
            }
          })
        }
      ]
    );
  };
  
  const renderPaymentMethodContent = () => {
    switch (paymentMethod) {
      case 'momo':
        return (
          <View style={styles.paymentDetailsContainer}>
            <View style={styles.momoLogos}>
              <Image 
                source={{ uri: 'https://www.mtn.co.rw/wp-content/uploads/2020/01/MTN-MoMo-Pay.png' }} 
                style={styles.momoLogo}
                resizeMode="contain"
              />
              <Image 
                source={{ uri: 'https://www.airtel.co.rw/assets/images/Logo.png' }} 
                style={styles.momoLogo}
                resizeMode="contain"
              />
            </View>
            
            <Text style={styles.paymentDetailsText}>
              Enter your Mobile Money number below. We'll send a payment request to your phone.
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mobile Money Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 078xxxxxxx"
                keyboardType="phone-pad"
                value={momoDetails.phone}
                onChangeText={handleMomoInputChange}
              />
            </View>
          </View>
        );
        
      case 'card':
        return (
          <View style={styles.paymentDetailsContainer}>
            <View style={styles.cardLogos}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png' }} 
                style={styles.cardLogo}
                resizeMode="contain"
              />
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png' }} 
                style={styles.cardLogo}
                resizeMode="contain"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="XXXX XXXX XXXX XXXX"
                keyboardType="number-pad"
                value={cardDetails.number}
                onChangeText={(text) => handleCardInputChange('number', text)}
                maxLength={16}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Name on Card"
                value={cardDetails.name}
                onChangeText={(text) => handleCardInputChange('name', text)}
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  value={cardDetails.expiry}
                  onChangeText={(text) => handleCardInputChange('expiry', text)}
                  maxLength={5}
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="XXX"
                  keyboardType="number-pad"
                  value={cardDetails.cvv}
                  onChangeText={(text) => handleCardInputChange('cvv', text)}
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        );
        
      case 'cash':
        return (
          <View style={styles.paymentDetailsContainer}>
            <View style={styles.cashIcon}>
              <Ionicons name="cash-outline" size={48} color="#4CAF50" />
            </View>
            
            <Text style={styles.paymentDetailsText}>
              Pay with cash when your order is delivered. Please have the exact amount ready.
            </Text>
          </View>
        );
        
      default:
        return null;
    }
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
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.scrollView}>
          {/* Payment Methods Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <TouchableOpacity 
              style={[
                styles.paymentMethod, 
                paymentMethod === 'momo' && styles.selectedPaymentMethod
              ]}
              onPress={() => setPaymentMethod('momo')}
            >
              <View style={styles.paymentMethodContent}>
                <Ionicons name="phone-portrait-outline" size={24} color="#333" />
                <Text style={styles.paymentMethodTitle}>Mobile Money</Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  paymentMethod === 'momo' && styles.radioOuterSelected
                ]}>
                  {paymentMethod === 'momo' && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.paymentMethod, 
                paymentMethod === 'card' && styles.selectedPaymentMethod
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <View style={styles.paymentMethodContent}>
                <Ionicons name="card-outline" size={24} color="#333" />
                <Text style={styles.paymentMethodTitle}>Credit/Debit Card</Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  paymentMethod === 'card' && styles.radioOuterSelected
                ]}>
                  {paymentMethod === 'card' && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.paymentMethod, 
                paymentMethod === 'cash' && styles.selectedPaymentMethod
              ]}
              onPress={() => setPaymentMethod('cash')}
            >
              <View style={styles.paymentMethodContent}>
                <Ionicons name="cash-outline" size={24} color="#333" />
                <Text style={styles.paymentMethodTitle}>Cash on Delivery</Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  paymentMethod === 'cash' && styles.radioOuterSelected
                ]}>
                  {paymentMethod === 'cash' && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Payment Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            {renderPaymentMethodContent()}
          </View>
          
          {/* Order Summary Section */}
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
              <Text style={styles.totalValue}>
                {deliveryOption === 'standard' 
                  ? formatPrice(total)
                  : formatPrice(Number(total) + 1500)} RWF
              </Text>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.payButton, !isFormValid() && styles.disabledButton]}
            onPress={handlePayment}
            disabled={!isFormValid()}
          >
            <Text style={styles.payButtonText}>
              {paymentMethod === 'cash' ? 'Place Order' : 'Pay Now'}
            </Text>
            <Text style={styles.payButtonAmount}>
              {deliveryOption === 'standard' 
                ? formatPrice(total)
                : formatPrice(Number(total) + 1500)} RWF
            </Text>
          </TouchableOpacity>
        </View>
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
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
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
  paymentDetailsContainer: {
    paddingTop: 8,
  },
  cardLogos: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardLogo: {
    height: 30,
    width: 60,
    marginRight: 16,
  },
  momoLogos: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  momoLogo: {
    height: 30,
    width: 80,
    marginRight: 16,
  },
  cashIcon: {
    alignItems: 'center',
    marginVertical: 16,
  },
  paymentDetailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  payButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  payButtonAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 