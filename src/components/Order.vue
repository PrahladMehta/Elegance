<template>
  <div class="order-page">
    <div class="container">
      <h1>Your Orders</h1>
      <div v-if="orders.length === 0" class="empty-orders">
        <p>You haven't placed any orders yet.</p>
       <router-link to="/products"><a href="#" class="cta-button">Start Shopping</a></router-link> 
      </div>
      <div v-else class="order-list">
        <div v-for="order in orders" :key="order.id" class="order-item">
          <div class="order-header">
            <h2>Order #{{ order.id }}</h2>
            <span :class="['order-status', `status-${order.status.toLowerCase()}`]">
              {{ order.status }}
            </span>
          </div>
          <div class="order-details">
            <div class="order-image">
              <img :src="order.image" :alt="order.title" />
            </div>
            <div class="order-info">
              <h3>{{ order.title }}</h3>
           
              <div class="order-address">
                <h4>Shipping Address:   <span >{{ order.address }}</span> </h4>
                <p class="order-price">Quantity: <span>{{ order.quantity }}</span></p>
                <p class="order-price">Price :  <span> ₹ {{ order.price }}</span></p>
                <p class="order-price">Total :  <span> ₹ {{ order.total }}</span></p>

             
              </div>

             
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'

import { getOrderRoute } from '@/Util';

import { useRouter } from 'vue-router';

const orders = ref([])

const router=useRouter();
const getOrder=async()=>{

  try{

    if(!localStorage.getItem('shoptoken')){
      router.push('/signup');
      return;
    }

    const response=await fetch(getOrderRoute,{
        method:'GET',
        headers:{
          authorization:localStorage.getItem('shoptoken'),
        
        },


    });

    const data=await response.json();

    orders.value=data.orders;


  }catch(e){

    console.log("ERROR");
    console.log(e);
  }

}

onMounted(getOrder);
</script>

<style scoped>


.order-page {
  padding: 2rem 0;
  background-color: var(--bg-color);
  min-height: 100vh;
  color: var(--text-color);
  font-family: 'Raleway', sans-serif;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: var(--accent-color);
  margin-bottom: 1.5rem;
  text-align: center;
}

.empty-orders {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--card-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-orders p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.order-list {
  display: grid;
  gap: 1rem;
}

.order-list span{
  color:white;

}

.order-item {
  background-color: var(--card-bg-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.order-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  color: var(--accent-color);
  margin: 0;
}

.order-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.status-shipped {
  background-color: #2ecc71;
  color: var(--primary-color);
}


.status-processing {
  background-color: #f39c12;
  color: var(--primary-color);
}

.status-delivered {
  background-color: #3498db;
  color: var(--primary-color);
}

.order-details {
  display: flex;
  padding: 1rem;
}

.order-image {
  flex: 0 0 120px;
  margin-right: 1rem;
}

.order-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.order-info {
  flex: 1;
}

.order-info h3 {
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: var(--accent-color);
}

.order-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 0.75rem;
  text-align:left;
}

.order-address h4 {
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
  color: var(--accent-color);
  
}

.order-address p {
  font-size: 0.9rem;
  line-height: 1.4;
}

.cta-button {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: var(--accent-color);
  color: var(--text-color);
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #2980b9;
}

@media (max-width: 600px) {
  .order-details {
    flex-direction: column;
  }

  .order-image {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .order-header {
    flex-direction: column; 
    align-items: flex-start;
  }

  .order-header h2 {
    margin-bottom: 0.5rem;
  }

  .order-status {
    align-self: flex-start;
  }
}
</style>