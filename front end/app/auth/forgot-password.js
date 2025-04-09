import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    // In a real app, you would send a password reset email
    setIsSubmitted(true);
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>
            <Text style={styles.logoTextGreen}>Haha</Text>
            <Text style={styles.logoTextBlack}>Online</Text>
          </Text>
          <Text style={styles.titleText}>Forgot Password?</Text>
          <Text style={styles.subText}>
            {isSubmitted 
              ? 'Please check your email for password reset instructions' 
              : 'Enter your email address to reset your password'}
          </Text>
        </View>

        {!isSubmitted ? (
          <>
            {/* Form Fields */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#8E8E93"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Reset Password</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Success Message */}
            <View style={styles.successContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="mail" size={32} color="#4CAF50" />
              </View>
              <Text style={styles.successText}>
                We've sent a password reset link to your email address. Please check your inbox.
              </Text>
              <TouchableOpacity style={styles.returnButton} onPress={handleBackToLogin}>
                <Text style={styles.returnButtonText}>Return to Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Back to Login */}
        {!isSubmitted && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  logoTextGreen: {
    color: '#4CAF50',
  },
  logoTextBlack: {
    color: '#333',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    maxWidth: '80%',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  submitButton: {
    height: 56,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  returnButton: {
    height: 56,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  loginText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
}); 