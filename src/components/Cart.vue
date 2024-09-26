<script setup>
import { ref, computed, onMounted } from 'vue'
import { Minus, Plus, Trash2, Loader, X, CheckCircle, XCircle } from 'lucide-vue-next'
import { addToCartRoute, removeFromCartRoute, getAllCartRoute, deleteFromCartRoute } from '@/Util'
import { placeOrderRoute, sentMailOrderPlaceRoute } from '@/Util';
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';
import env from 'dotenv';

const cart = ref([])
const router = useRouter();
const isCheckoutOpen = ref(false)
const checkoutAddress = ref('')
const stripe = ref(null);
const cardElement = ref(null);
const toast = ref({ show: false, message: '', type: '' })

const subtotal = computed(() => {
  return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

const shipping = 40
const tax = computed(() => subtotal.value * 0.1)
const grandTotal = computed(() => subtotal.value + shipping + tax.value)

const setStripe = async () => {
  try {
    console.log("SETSTRIPE");
    const stripeInstance = await loadStripe('pk_test_51Q2c5tRuCWdZsEGhpmVJtkM6TH8cl8vegyxWuW2vFWG04YzCB6IrrGcliOyywXAZylROBF3GyjdeXZfgrSnJqaZk007lZWRPGu');
    stripe.value = stripeInstance;
    console.log(stripeInstance);
    const elements = stripeInstance.elements();
    const card = elements.create('card');
    card.mount('#card-element');

    cardElement.value = card;

    console.log(card);
  } catch (e) {
    console.log("ERROR");
    console.log(e);
  }
}

const getCart = async () => {
  try {
    if (!localStorage.getItem('shoptoken')) {
      router.push('/signup');
      return;
    }

    // console.log(localStorage.getItem('shoptoken'));
    
    const response = await fetch(getAllCartRoute, {
      method:'GET',
        headers:{
          authorization:localStorage.getItem('shoptoken'),
        
        },
    })

    const data = await response.json()
    console.log(data);
    cart.value = data.cart.map(item => ({
      ...item,
      loading: { increase: false, decrease: false, remove: false }
    }))
  
  } catch (e) {
    console.log("ERROR")
    console.log(e)
  }
}

const removeQuantity = async (item) => {
  try {
    item.loading.decrease = true
    const response = await fetch(removeFromCartRoute, {
      method: 'POST',
      headers: {
        'authorization': localStorage.getItem('shoptoken'),
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ productid: item._id })
    })

    const data = await response.json()
    console.log(data)
    await getCart()
  } catch (error) {
    console.error("Error removing quantity:", error)
  } finally {
    item.loading.decrease = false
  }
}

const addQuantity = async (item) => {
  try {
    item.loading.increase = true
    const response = await fetch(addToCartRoute, {
      method: 'POST',
      headers: {
        'authorization': localStorage.getItem('shoptoken'),
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ productid: item._id })
    })

    const data = await response.json()
    console.log(data)
    await getCart()
  } catch (error) {
    console.error("Error adding quantity:", error)
  } finally {
    item.loading.increase = false
  }
}

const removeItem = async (item) => {
  try {
    item.loading.remove = true
    const response = await fetch(deleteFromCartRoute, {
      method: 'POST',
      headers: {
        'authorization': localStorage.getItem('shoptoken'),
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ productid: item._id })
    })

    const data = await response.json()
    console.log(data)
    getCart()
  } catch (error) {
    console.error("Error removing item:", error)
  } finally {
    item.loading.remove = false
  }
}

const handleCheckout = () => {
  setStripe();
  isCheckoutOpen.value = true;
}

const showToast = (message, type) => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const paymentVerification = async (clientSecret, customer_name) => {
  try {
    const result = await stripe.value.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement.value,
        billing_details: {
          name: customer_name
        }
      }
    });

      showToast('Payment successful!', 'success')
      await sentMailOrderPlace()
      await getCart()
      isCheckoutOpen.value = false
    
  } catch (e) {
    console.log("ERROR");
    console.log(e);
    showToast('An unexpected error occurred. Please try again.', 'error')
  }
}

const handlePayment = async () => {
  if (checkoutAddress.value.length < 4) {
    showToast('Please enter a valid address.', 'error')
    return
  }

  try {
    const send = { address: checkoutAddress.value, amount: grandTotal.value };
    const response = await fetch(placeOrderRoute, {
      method: 'POST',
      headers: {
        authorization: localStorage.getItem('shoptoken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(send)
    });

    const data = await response.json();

    
    
    if (data.success) {
      await paymentVerification(data.clientSecret, 'Customer Name'); // Replace with actual customer name
    } else {
      showToast('Failed to place order. Please try again.', 'error');
    }
  } catch (e) {
    console.log("ERROR");
    console.log(e);
    showToast('An unexpected error occurred. Please try again.', 'error')
  }
}

const sentMailOrderPlace = async () => {
  try {
    const response = await fetch(sentMailOrderPlaceRoute, {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('shoptoken')
      }
    });

    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.log("ERROR");
    console.log(e);
  }
}

const closeModal = () => {
  isCheckoutOpen.value = false
}

onMounted(getCart)
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <h1>Your Cart</h1>
      <div v-if="cart.length === 0" class="empty-cart">
        <p>Your cart is empty.</p>
        <router-link to="/products" class="cta-button">Continue Shopping</router-link>
      </div>
      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cart" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" alt="image-product">
            </div>
            <div class="item-details">
              <h3>{{ item.title }}</h3>
              <p class="item-price">₹ {{ item.price }}</p>
              <div class="item-quantity">
                <button @click="removeQuantity(item)" :disabled="item.quantity <= 1 || item.loading.decrease" class="quantity-btn">
                  <Minus v-if="!item.loading.decrease" />
                  <Loader v-else class="animate-spin" />
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="addQuantity(item)" :disabled="item.loading.increase" class="quantity-btn">
                  <Plus v-if="!item.loading.increase" />
                  <Loader v-else class="animate-spin" />
                </button>
              </div>
            </div>
            <div class="item-actions">
              <div class="item-total">₹ {{ (item.price * item.quantity).toFixed(2) }}</div>
              <button @click="removeItem(item)" class="remove-btn" :disabled="item.loading.remove">
                <Trash2 v-if="!item.loading.remove" />
                <Loader v-else class="animate-spin" />
              </button>
            </div>
          </div>
        </div>
        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-content">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₹ {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>₹ {{ shipping.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Tax</span>
              <span>₹ {{ tax.toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>₹ {{ grandTotal.toFixed(2) }}</span>
            </div>
          </div>
          <button class="cta-button checkout-btn" @click="handleCheckout">Proceed to Checkout</button>
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <div v-if="isCheckoutOpen" class="modal-overlay">
      <div class="modal">
        <button @click="closeModal" class="close-btn">
          <X />
        </button>
        <h2>Checkout</h2>
        <div class="modal-content">
          <div class="form-group">
            <label for="checkoutAddress">Delivery Address</label>
            <input type="text" id="checkoutAddress" v-model="checkoutAddress" placeholder="Enter your address">
          </div>

          <div id="card-element"></div>
          <p id="card-errors" role="alert"></p>

          <div class="order-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₹ {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>₹ {{ shipping.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Tax</span>
              <span>₹ {{ tax.toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>Grand Total</span>
              <span>₹ {{ grandTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <button @click="handlePayment" class="cta-button pay-btn">Pay Now</button>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="fade">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <div class="toast-icon">
          <CheckCircle v-if="toast.type === 'success'" />
          <XCircle v-else />
        </div>
        <div class="toast-message">{{ toast.message }}</div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Existing styles remain unchanged */

.cart-page {
  padding: 4rem 0;
  background-color: var(--bg-color);
  min-height: 100vh;
  color: var(--text-color);
  font-family: 'Raleway', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

#card-element {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  color: var(--text-color);
  background-color: var(--primary-color);
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: var(--accent-color);
  margin-bottom: 2rem;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
  background-color: var(--card-bg-color);
  border-radius: 8px;
}

.empty-cart p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.cart-content {
  display: flex;
  gap: 2rem;
}

.cart-items {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.cart-item {
  background-color: var(--card-bg-color);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.item-image {
  width: 100%;  
  height: 300px;
  overflow: hidden;
  background-color: var(--secondary-color);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  padding: 1rem;
}

.item-details h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.item-price {
  color: var(--text-color);
  font-weight: normal;
  margin-bottom: 1rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--primary-color);
  border-radius: 4px;
  padding: 0.5rem;
}

.quantity-btn {
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background-color: var(--accent-color);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-weight: bold;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--primary-color);
}

.item-total {
  font-weight: bold;
  color: var(--accent-color);
}

.remove-btn {
  background-color: transparent;
  color: #e74c3c;
  border: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover:not(:disabled) {
  background-color: #e74c3c;
  color: var(--text-color);
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-summary {
  flex: 1;
  background-color: var(--card-bg-color);
  border-radius: 8px;
  align-self: flex-start;
  position: sticky;
  top: 2rem;
}

.cart-summary h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  padding: 1.5rem;
  color: var(--accent-color);
  background-color: var(--primary-color);
  margin: 0;
}

.summary-content {
  padding: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.total {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--secondary-color);
  color: var(--accent-color);
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: var(--accent-color);
  color: var(--primary-color);
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: center;
}

.cta-button:hover {
  background-color: #2980b9;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .cart-content {
    flex-direction: column;
  }

  .cart-summary {
    width: 100%;
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-items {
    grid-template-columns: 1fr;
  }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: var(--card-bg-color);
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color);
}

.modal h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.modal-content {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--secondary-color);
  border-radius: 4px;
  background-color: var(--primary-color);
  color: var(--text-color);
}

.order-summary {
  background-color: var(--primary-color);
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
}

.order-summary h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--accent-color);
}

.pay-btn {
  width: 100%;
  margin-top: 1rem;
}

/* Toast styles */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: #ffffff;
  font-weight: bold;
  z-index: 1001;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toast.success {
  background-color: #4caf50;
}

.toast.error {
  background-color: #f44336;
}

.toast-icon {
  margin-right: 0.5rem;
}

.toast-message {
  font-size: 1rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>