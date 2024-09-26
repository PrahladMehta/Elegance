<script setup>
import { ref, onMounted, onUnmounted, provide, computed } from 'vue'
import { reactive } from 'vue'
import { Home, ShoppingBag, ShoppingCart, User, UserPlus, Menu, Package } from 'lucide-vue-next'

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const isLoggedIn = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const emailData = reactive({
  email: ""
})

provide('emailData', emailData)

const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem('shoptoken')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  checkLoginStatus()
  window.addEventListener('storage', checkLoginStatus)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('storage', checkLoginStatus)
})
</script>

<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="container">
      <div class="navbar-logo">
        <h1>Elegance</h1>
      </div>
      <div class="navbar-menu" :class="{ 'active': isMenuOpen }">
        <router-link to="/" class="navbar-item"><Home size="18" /> Home</router-link>
        <router-link to="/products" class="navbar-item"><ShoppingBag size="18" /> Products</router-link>
        <router-link to="/cart" class="navbar-item"><ShoppingCart size="18" /> Cart</router-link>
        <router-link to="/orders" class="navbar-item"><Package size="18" /> Orders</router-link>
      </div>
      <div class="navbar-auth" :class="{ 'active': isMenuOpen }">
        <router-link v-if="!isLoggedIn" to="/login" class="navbar-item"><User size="18" /> Login</router-link>
        <router-link v-if="!isLoggedIn" to="/signup" class="navbar-item signup"><UserPlus size="18" /> Sign Up</router-link>
      </div>
      <button class="navbar-toggle" @click="toggleMenu">
        <Menu size="24" />
      </button>
    </div>
  </nav>

  <router-view></router-view>
</template>

<style>
/* Your existing styles here */
</style>