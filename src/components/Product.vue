<template>
  <div class="ecommerce-app">
    <div v-if="showToast" class="toast">
      {{ toastMessage }}
    </div>
    <header>
      
      <div class="search-container">
        <Search :size="20" class="search-icon" />
        <input v-model="searchQuery" type="text" placeholder="Search products...">
      </div>
    </header>
    <main>
      <transition-group name="fade" tag="div" class="product-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="product-image-container">
            <img :src="product.image" :alt="product.title" class="product-image">
            <div class="product-overlay">
              <button class="quick-view-btn">Quick View</button>
            </div>
          </div>
          <div class="product-info">
            <h2 class="product-title">{{ product.title }}</h2>
            <p class="product-price">₹ {{ product.price }}</p>
            <button class="add-to-cart-btn" @click="addToCart(product)">
              Add to Cart
              <ShoppingCart :size="18" />
            </button>
          </div>
        </div>
      </transition-group>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, ShoppingCart } from 'lucide-vue-next';
import { getAllProductRoute,addToCartRoute } from '@/Util';

const searchQuery = ref('');
const products = ref([]);

// Add these new refs for toast functionality
const showToast = ref(false);
const toastMessage = ref('');

const fetchProducts = async () => {
  try {

    console.log("ERROR");
    const response = await fetch(getAllProductRoute, {
      headers: {
        'authorization': localStorage.getItem('shoptoken'),
      
      },
      method: 'Get'
    });

    const data = await response.json();
    products.value = data.allproduct;
  } catch (error) {
    console.error('Error fetching products:', error);
    showToastMessage('Error fetching products. Please try again.');
  }
};

const addToCart = async (product) => {
  try {
    product.productid = product._id;
    product.id = undefined;

    const response = await fetch(addToCartRoute, {
      method: 'POST',
      headers: {
        'authorization': localStorage.getItem('shoptoken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });

    const data = await response.json();
    console.log(data);
    showToastMessage('Product added to cart successfully!');
  } catch (e) {
    console.log("ERROR");
    console.log(e);
    showToastMessage('Error adding product to cart. Please try again.');
  }
};

// Add this new function for showing toast messages
const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 1000);
};

onMounted(fetchProducts);

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const lowercaseQuery = searchQuery.value.toLowerCase();
  return products.value.filter(product => 
    product.title.toLowerCase().includes(lowercaseQuery)
  );
});
</script>

<style scoped>
:root {
  --primary-color: #f8f9fa;
  --secondary-color: #e9ecef;
  --accent-color: #495057;
  --text-color: #212529;
  --bg-color: #ffffff;
}

.ecommerce-app {
  font-family: 'Poppins', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
}

header {
  background-color: var(--primary-color);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: var(--accent-color);
}

.search-container {
  display: flex;
  margin:0 auto;
  background-color: var(--secondary-color);
  border-radius: 25px;
  padding: 0.5rem 1rem;
}

.search-icon {
  color: var(--accent-color);
  margin-right: 0.5rem;
}

input[type="text"] {
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 1rem;
  width: 200px;
  transition: all 0.3s ease;
}

input[type="text"]:focus {
  outline: none;
  width: 250px;
}

main {
  padding: 2rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background-color: var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.product-image-container {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1 / 1;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-view-btn {
  background-color: var(--bg-color);
  color: var(--accent-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-view-btn:hover {
  background-color: var(--accent-color);
  color: var(--bg-color);
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
}

.product-price {
  font-weight: 600;
  color: var(--accent-color);
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.add-to-cart-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--accent-color);
  color: var(--bg-color);
  border: none;
  border-radius: 25px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-top: auto;
}

.add-to-cart-btn:hover {
  background-color: #343a40;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Add these new styles for the toast */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4CAF50;
  color: white;
  padding: 16px;
  border-radius: 4px;
  z-index: 1000;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>