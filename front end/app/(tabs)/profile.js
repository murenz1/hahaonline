import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import translations from the main file
const translations = {
  English: {
    profile: "Profile",
    editProfile: "Edit Profile",
    myAccount: "My Account",
    personalInfo: "Personal Information",
    paymentMethods: "Payment Methods",
    deliveryAddress: "Delivery Address",
    notifications: "Notifications",
    orders: "Orders",
    orderHistory: "Order History",
    pendingOrders: "Pending Orders",
    returns: "Returns",
    other: "Other",
    settings: "Settings",
    helpCenter: "Help Center",
    aboutUs: "About Us",
    logOut: "Log Out",
    addresses: "addresses",
    visa: "Visa",
    orders: "orders",
    copyright: "© 2024 Lumion",
    allRightsReserved: "All rights reserved"
  },
  Kinyarwanda: {
    profile: "Umwirondoro",
    editProfile: "Hindura Umwirondoro",
    myAccount: "Konti Yanjye",
    personalInfo: "Amakuru Yanjye",
    paymentMethods: "Uburyo bwo Kwishyura",
    deliveryAddress: "Aho Bigezwa",
    notifications: "Ubutumwa",
    orders: "Ibyo Naguze",
    orderHistory: "Amateka y'Ibyo Naguze",
    pendingOrders: "Ibitegerejwe",
    returns: "Ibisubijwe",
    other: "Ibindi",
    settings: "Igenamiterere",
    helpCenter: "Ubufasha",
    aboutUs: "Abo Turi Bo",
    logOut: "Sohoka",
    addresses: "aho bigezwa",
    visa: "Visa",
    orders: "ibyo waguze",
    copyright: "© 2024 Lumion",
    allRightsReserved: "Uburenganzira bwose burafitwe"
  },
  French: {
    profile: "Profil",
    editProfile: "Modifier le Profil",
    myAccount: "Mon Compte",
    personalInfo: "Informations Personnelles",
    paymentMethods: "Moyens de Paiement",
    deliveryAddress: "Adresse de Livraison",
    notifications: "Notifications",
    orders: "Commandes",
    orderHistory: "Historique des Commandes",
    pendingOrders: "Commandes en Attente",
    returns: "Retours",
    other: "Autre",
    settings: "Paramètres",
    helpCenter: "Centre d'Aide",
    aboutUs: "À Propos de Nous",
    logOut: "Déconnexion",
    addresses: "adresses",
    visa: "Visa",
    orders: "commandes",
    copyright: "© 2024 Lumion",
    allRightsReserved: "Tous droits réservés"
  }
};

const ProfileMenuItem = ({ icon, title, subtitle, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color="#007AFF" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  // Get the selected language from the app's state (you'll need to implement this)
  const selectedLanguage = 'English'; // This should be dynamic based on user's selection

  // Translation helper function
  const getTranslation = (key) => {
    return translations[selectedLanguage][key];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{getTranslation('profile')}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150x150' }} 
            style={styles.profileImage} 
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>johndoe@example.com</Text>
            
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>{getTranslation('editProfile')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getTranslation('myAccount')}</Text>
          
          <ProfileMenuItem 
            icon="person-outline" 
            title={getTranslation('personalInfo')}
            onPress={() => console.log('Personal Information')} 
          />
          
          <ProfileMenuItem 
            icon="card-outline" 
            title={getTranslation('paymentMethods')}
            subtitle={`${getTranslation('visa')} **4832`}
            onPress={() => console.log('Payment Methods')} 
          />
          
          <ProfileMenuItem 
            icon="location-outline" 
            title={getTranslation('deliveryAddress')}
            subtitle={`2 ${getTranslation('addresses')}`}
            onPress={() => console.log('Delivery Address')} 
          />
          
          <ProfileMenuItem 
            icon="notifications-outline" 
            title={getTranslation('notifications')}
            onPress={() => console.log('Notifications')} 
          />
        </View>

        {/* Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getTranslation('orders')}</Text>
          
          <ProfileMenuItem 
            icon="receipt-outline" 
            title={getTranslation('orderHistory')}
            onPress={() => console.log('Order History')} 
          />
          
          <ProfileMenuItem 
            icon="clipboard-outline" 
            title={getTranslation('pendingOrders')}
            subtitle={`2 ${getTranslation('orders')}`}
            onPress={() => console.log('Pending Orders')} 
          />
          
          <ProfileMenuItem 
            icon="refresh-outline" 
            title={getTranslation('returns')}
            onPress={() => console.log('Returns')} 
          />
        </View>

        {/* Other Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getTranslation('other')}</Text>
          
          <ProfileMenuItem 
            icon="settings-outline" 
            title={getTranslation('settings')}
            onPress={() => console.log('Settings')} 
          />
          
          <ProfileMenuItem 
            icon="help-circle-outline" 
            title={getTranslation('helpCenter')}
            onPress={() => console.log('Help Center')} 
          />
          
          <ProfileMenuItem 
            icon="information-circle-outline" 
            title={getTranslation('aboutUs')}
            onPress={() => console.log('About Us')} 
          />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>{getTranslation('logOut')}</Text>
        </TouchableOpacity>

        {/* Copyright Section */}
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>{getTranslation('copyright')}</Text>
          <Text style={styles.copyrightSubtext}>{getTranslation('allRightsReserved')}</Text>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  editProfileButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 40,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
    marginLeft: 8,
  },
  copyrightContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  copyrightText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  copyrightSubtext: {
    fontSize: 12,
    color: '#C7C7CC',
  },
}); 