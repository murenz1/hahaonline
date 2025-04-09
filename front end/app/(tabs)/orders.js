import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for orders
const ordersData = [
  {
    id: 'ORD-12345',
    date: 'Jul 15, 2023',
    totalAmount: 189.97,
    status: 'Delivered',
    items: [
      { id: '1', name: 'Wireless Headphones', image: 'https://via.placeholder.com/300x300/9C27B0/FFFFFF?text=Headphones' },
      { id: '2', name: 'Smart Watch', image: 'https://via.placeholder.com/300x300/3F51B5/FFFFFF?text=Smart+Watch' },
    ],
  },
  {
    id: 'ORD-12346',
    date: 'Jul 10, 2023',
    totalAmount: 79.99,
    status: 'Processing',
    items: [
      { id: '3', name: 'Bluetooth Speaker', image: 'https://via.placeholder.com/300x300/FF9800/FFFFFF?text=Speaker' },
    ],
  },
  {
    id: 'ORD-12347',
    date: 'Jul 5, 2023',
    totalAmount: 499.99,
    status: 'Shipped',
    items: [
      { id: '4', name: 'Smartphone', image: 'https://via.placeholder.com/300x300/009688/FFFFFF?text=Smartphone' },
    ],
  },
  {
    id: 'ORD-12348',
    date: 'Jun 28, 2023',
    totalAmount: 145.98,
    status: 'Delivered',
    items: [
      { id: '5', name: 'Fitness Tracker', image: 'https://via.placeholder.com/300x300/E91E63/FFFFFF?text=Tracker' },
      { id: '6', name: 'Wireless Earbuds', image: 'https://via.placeholder.com/300x300/673AB7/FFFFFF?text=Earbuds' },
    ],
  },
];

// Status colors and icons
const statusConfig = {
  'Delivered': { color: '#4CAF50', icon: 'checkmark-circle' },
  'Processing': { color: '#FFC107', icon: 'time' },
  'Shipped': { color: '#2196F3', icon: 'rocket' },
  'Cancelled': { color: '#F44336', icon: 'close-circle' },
};

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredOrders = activeTab === 'all' 
    ? ordersData 
    : ordersData.filter(order => order.status.toLowerCase() === activeTab);

  const renderOrder = ({ item }) => {
    const { color, icon } = statusConfig[item.status] || { color: '#8E8E93', icon: 'help-circle' };
    
    return (
      <TouchableOpacity style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
          
          <View style={[styles.statusContainer, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon} size={14} color={color} style={styles.statusIcon} />
            <Text style={[styles.statusText, { color }]}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsLabel}>Items:</Text>
          <View style={styles.orderItems}>
            {item.items.map(product => (
              <View key={product.id} style={styles.orderItem}>
                <Image source={{ uri: product.image }} style={styles.itemImage} />
                <Text style={styles.itemName} numberOfLines={1}>{product.name}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.orderFooter}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'processing' && styles.activeTab]} 
          onPress={() => setActiveTab('processing')}
        >
          <Text style={[styles.tabText, activeTab === 'processing' && styles.activeTabText]}>Processing</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'shipped' && styles.activeTab]} 
          onPress={() => setActiveTab('shipped')}
        >
          <Text style={[styles.tabText, activeTab === 'shipped' && styles.activeTabText]}>Shipped</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'delivered' && styles.activeTab]} 
          onPress={() => setActiveTab('delivered')}
        >
          <Text style={[styles.tabText, activeTab === 'delivered' && styles.activeTabText]}>Delivered</Text>
        </TouchableOpacity>
      </View>
      
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#C7C7CC" />
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  orderItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
  },
  itemName: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
    marginBottom: 12,
  },
  totalText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
}); 