import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Categories with their translations
const categories = {
  1: {
    English: "Vegetables",
    Kinyarwanda: "Imboga",
    French: "Légumes"
  },
  2: {
    English: "Fruits",
    Kinyarwanda: "Imbuto",
    French: "Fruits"
  },
  3: {
    English: "Grains & Cereals",
    Kinyarwanda: "Ibinyampeke",
    French: "Céréales"
  },
  4: {
    English: "Dairy Products",
    Kinyarwanda: "Amata n'Ibiyakomokaho",
    French: "Produits Laitiers"
  },
  5: {
    English: "Meat & Fish",
    Kinyarwanda: "Inyama n'Amafi",
    French: "Viande et Poisson"
  },
  6: {
    English: "Spices & Seasonings",
    Kinyarwanda: "Ibirungo",
    French: "Épices et Assaisonnements"
  },
  7: {
    English: "Local Produce",
    Kinyarwanda: "Ibikorerwa mu Rwanda",
    French: "Produits Locaux"
  },
  8: {
    English: "Organic Foods",
    Kinyarwanda: "Ibiryo Siyanatire",
    French: "Aliments Biologiques"
  }
};

// Sample products with categories
const products = [
  {
    id: 'v1',
    name: {
      English: "Fresh Tomatoes",
      Kinyarwanda: "Inyanya Gitangira",
      French: "Tomates Fraîches"
    },
    price: 1200,
    image: "https://images.unsplash.com/photo-1566702593104-697cc456a99e",
    categoryId: 1,
    rating: 4.5,
    discount: 10,
    unit: "kg"
  },
  {
    id: 'v2',
    name: {
      English: "Green Peppers",
      Kinyarwanda: "Puwavuro Gitangira",
      French: "Poivrons Verts"
    },
    price: 1500,
    image: "https://images.unsplash.com/photo-1509377244-b9820f59c9e6",
    categoryId: 1,
    rating: 4.3,
    unit: "kg"
  },
  {
    id: 'v3',
    name: {
      English: "Fresh Carrots",
      Kinyarwanda: "Karoti Gitangira",
      French: "Carottes Fraîches"
    },
    price: 1800,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
    categoryId: 1,
    rating: 4.6,
    discount: 5,
    unit: "kg"
  },

  // Category 2: Fruits
  {
    id: 'f1',
    name: {
      English: "Sweet Pineapple",
      Kinyarwanda: "Inanasi Kiryohereye",
      French: "Ananas Doux"
    },
    price: 2000,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba",
    categoryId: 2,
    rating: 4.8,
    discount: 15,
    unit: "each"
  },
  {
    id: 'f2',
    name: {
      English: "Fresh Passion Fruit",
      Kinyarwanda: "Marakuja Gitangira",
      French: "Fruit de la Passion Frais"
    },
    price: 2500,
    image: "https://images.unsplash.com/photo-1604790262497-70e34d1e2927",
    categoryId: 2,
    rating: 4.7,
    unit: "kg"
  },
  {
    id: 'f3',
    name: {
      English: "Ripe Mango",
      Kinyarwanda: "Imyembe Yeze",
      French: "Mangue Mûre"
    },
    price: 1500,
    image: "https://images.unsplash.com/photo-1605027690505-4b0d9fe23d8a",
    categoryId: 2,
    rating: 4.9,
    discount: 10,
    unit: "kg"
  },

  // Category 3: Grains & Cereals
  {
    id: 'g1',
    name: {
      English: "Premium Rice",
      Kinyarwanda: "Umuceri Mwiza",
      French: "Riz Premium"
    },
    price: 1500,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
    categoryId: 3,
    rating: 4.6,
    unit: "kg"
  },
  {
    id: 'g2',
    name: {
      English: "Maize Flour",
      Kinyarwanda: "Ifu y'Ibigori",
      French: "Farine de Maïs"
    },
    price: 1200,
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133481",
    categoryId: 3,
    rating: 4.4,
    discount: 8,
    unit: "kg"
  },
  {
    id: 'g3',
    name: {
      English: "Wheat Flour",
      Kinyarwanda: "Ifu y'Ingano",
      French: "Farine de Blé"
    },
    price: 1300,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b",
    categoryId: 3,
    rating: 4.5,
    unit: "kg"
  },

  // Category 4: Dairy Products
  {
    id: 'd1',
    name: {
      English: "Fresh Milk",
      Kinyarwanda: "Amata Mashi",
      French: "Lait Frais"
    },
    price: 1000,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b",
    categoryId: 4,
    rating: 4.8,
    unit: "L"
  },
  {
    id: 'd2',
    name: {
      English: "Natural Yogurt",
      Kinyarwanda: "Yaourt Kamere",
      French: "Yaourt Nature"
    },
    price: 800,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    categoryId: 4,
    rating: 4.7,
    discount: 12,
    unit: "L"
  },
  {
    id: 'd3',
    name: {
      English: "Local Cheese",
      Kinyarwanda: "Fromage yo mu Rwanda",
      French: "Fromage Local"
    },
    price: 3500,
    image: "https://images.unsplash.com/photo-1566454825481-4e48f80c1c7a",
    categoryId: 4,
    rating: 4.6,
    unit: "kg"
  },

  // Category 5: Meat & Fish
  {
    id: 'm1',
    name: {
      English: "Fresh Fish",
      Kinyarwanda: "Amafi Mashi",
      French: "Poisson Frais"
    },
    price: 4000,
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62",
    categoryId: 5,
    rating: 4.7,
    unit: "kg"
  },
  {
    id: 'm2',
    name: {
      English: "Chicken",
      Kinyarwanda: "Inkoko",
      French: "Poulet"
    },
    price: 3500,
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781",
    categoryId: 5,
    rating: 4.8,
    discount: 15,
    unit: "kg"
  },
  {
    id: 'm3',
    name: {
      English: "Beef",
      Kinyarwanda: "Inyama y'Inka",
      French: "Boeuf"
    },
    price: 5000,
    image: "https://images.unsplash.com/photo-1603048297172-c83f6436ef99",
    categoryId: 5,
    rating: 4.9,
    unit: "kg"
  },

  // Category 6: Spices & Seasonings
  {
    id: 's1',
    name: {
      English: "Mixed Spices",
      Kinyarwanda: "Ibirungo Bivanze",
      French: "Épices Mélangées"
    },
    price: 1500,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d",
    categoryId: 6,
    rating: 4.5,
    unit: "pack"
  },
  {
    id: 's2',
    name: {
      English: "Black Pepper",
      Kinyarwanda: "Ipilipili y'Umukara",
      French: "Poivre Noir"
    },
    price: 2000,
    image: "https://images.unsplash.com/photo-1599690925058-90e1a0b56154",
    categoryId: 6,
    rating: 4.6,
    discount: 10,
    unit: "pack"
  },
  {
    id: 's3',
    name: {
      English: "Ginger",
      Kinyarwanda: "Tangawizi",
      French: "Gingembre"
    },
    price: 1200,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
    categoryId: 6,
    rating: 4.4,
    unit: "kg"
  },

  // Category 7: Local Produce
  {
    id: 'l1',
    name: {
      English: "Sweet Potatoes",
      Kinyarwanda: "Ibijumba",
      French: "Patates Douces"
    },
    price: 1000,
    image: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19",
    categoryId: 7,
    rating: 4.7,
    unit: "kg"
  },
  {
    id: 'l2',
    name: {
      English: "Cassava",
      Kinyarwanda: "Imyumbati",
      French: "Manioc"
    },
    price: 1200,
    image: "https://images.unsplash.com/photo-1598512199776-e0aa7f76f389",
    categoryId: 7,
    rating: 4.5,
    discount: 8,
    unit: "kg"
  },
  {
    id: 'l3',
    name: {
      English: "Green Bananas",
      Kinyarwanda: "Ibitoki Bibisi",
      French: "Bananes Vertes"
    },
    price: 1800,
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224",
    categoryId: 7,
    rating: 4.8,
    unit: "bunch"
  },

  // Category 8: Organic Foods
  {
    id: 'o1',
    name: {
      English: "Organic Spinach",
      Kinyarwanda: "Dodo Siyanatire",
      French: "Épinards Biologiques"
    },
    price: 2000,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
    categoryId: 8,
    rating: 4.8,
    discount: 5,
    unit: "bunch"
  },
  {
    id: 'o2',
    name: {
      English: "Organic Eggs",
      Kinyarwanda: "Amagi Siyanatire",
      French: "Oeufs Biologiques"
    },
    price: 3000,
    image: "https://images.unsplash.com/photo-1569288052389-dac9b01c9c05",
    categoryId: 8,
    rating: 4.9,
    unit: "dozen"
  },
  {
    id: 'o3',
    name: {
      English: "Organic Honey",
      Kinyarwanda: "Ubuki Siyanatire",
      French: "Miel Biologique"
    },
    price: 5000,
    image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae",
    categoryId: 8,
    rating: 4.7,
    unit: "bottle"
  }
];

export default function CategoryScreen() {
  const router = useRouter();
  const { id, language } = useLocalSearchParams();
  const categoryId = parseInt(id);

  // Filter products by category
  const categoryProducts = products.filter(product => product.categoryId === categoryId);

  const getCategoryName = () => {
    return categories[categoryId]?.[language] || categories[categoryId]?.English;
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}?product=${encodeURIComponent(JSON.stringify(item))}&language=${language}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      {item.discount > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% Off</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name[language] || item.name.English}
        </Text>
        <Text style={styles.productPrice}>
          {item.price.toLocaleString()} RWF/{item.unit}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFB800" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getCategoryName()}</Text>
      </View>

      {/* Products Grid */}
      <FlatList
        data={categoryProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found in this category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  productsContainer: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 