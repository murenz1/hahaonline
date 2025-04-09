import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data for grocery categories
const mainCategories = [
  { id: '1', name: 'Vegetables', icon: 'leaf', color: '#4CAF50', items: '145 items' },
  { id: '2', name: 'Fruits', icon: 'nutrition', color: '#FF9800', items: '89 items' },
  { id: '3', name: 'Meat & Poultry', icon: 'restaurant', color: '#F44336', items: '63 items' },
  { id: '4', name: 'Dairy & Eggs', icon: 'water', color: '#2196F3', items: '72 items' },
  { id: '5', name: 'Bakery', icon: 'pizza', color: '#795548', items: '51 items' },
  { id: '6', name: 'Herbs & Spices', icon: 'flame', color: '#FF5722', items: '34 items' },
  { id: '7', name: 'Organic Foods', icon: 'leaf-outline', color: '#8BC34A', items: '42 items' },
  { id: '8', name: 'Beverages', icon: 'beer', color: '#009688', items: '38 items' },
  { id: '9', name: 'Snacks', icon: 'fast-food', color: '#FF9800', items: '57 items' },
  { id: '10', name: 'Frozen Foods', icon: 'snow', color: '#03A9F4', items: '29 items' },
  { id: '11', name: 'Canned Goods', icon: 'cube', color: '#607D8B', items: '45 items' },
  { id: '12', name: 'Pasta & Rice', icon: 'restaurant-outline', color: '#FFC107', items: '23 items' },
];

export default function CategoriesScreen() {
  const router = useRouter();
  
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => router.push(`/category/${item.id}`)}
    >
      <View 
        style={[
          styles.categoryIconContainer, 
          { backgroundColor: `${item.color}20` } // 20% opacity
        ]}
      >
        <Ionicons name={item.icon} size={28} color={item.color} />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryItems}>{item.items}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Categories</Text>
          <Text style={styles.headerSubtitle}>Find fresh groceries by category</Text>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search categories..."
            style={styles.searchInput}
            placeholderTextColor="#8E8E93"
          />
        </View>
      </View>

      {/* Featured Categories Banner */}
      <View style={styles.featuredContainer}>
        <Text style={styles.featuredTitle}>Featured Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScroll}
        >
          {mainCategories.slice(0, 4).map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={styles.featuredItem}
              onPress={() => router.push(`/category/${category.id}`)}
            >
              <View style={[styles.featuredIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon} size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.featuredName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* All Categories List */}
      <Text style={styles.allCategoriesTitle}>All Categories</Text>
      <FlatList
        data={mainCategories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  headerTitleContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  featuredContainer: {
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  featuredScroll: {
    paddingHorizontal: 16,
  },
  featuredItem: {
    alignItems: 'center',
    marginRight: 24,
    width: 70,
  },
  featuredIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featuredName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  allCategoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryItems: {
    fontSize: 12,
    color: '#8E8E93',
  },
}); 