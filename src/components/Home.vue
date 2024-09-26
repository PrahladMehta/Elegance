<template>
        <div class="home">
       
      
          <main>
            <section class="hero hero-1">
              <div class="hero-content">
                <h1>Welcome to Elegance</h1>
                <p>Discover timeless style and quality</p>
                <a href="#" class="cta-button">Shop Now</a>
              </div>
            </section>
      
            <section class="hero hero-2">
              <div class="hero-content">
                <h2>New Arrivals</h2>
                <p>Explore our latest collection</p>
                <a href="#" class="cta-button">View Collection</a>
              </div>
            </section>
      
        
      
            <section class="discount-section">
              <div class="container">
                <div class="discount-content">
                  <h2>Special Offer</h2>
                  <p>Enjoy 20% off on selected items</p>
                  <div class="countdown" ref="countdown">23:59:59</div>
                  <a href="#" class="cta-button">Shop Discounts</a>
                </div>
              </div>
            </section>
          </main>
      
          <footer class="footer">
            <div class="container">
              <div class="footer-content">
                <div class="footer-section">
                  <h3>About Us</h3>
                  <p>Elegance: Curating sophisticated style for the discerning customer.</p>
                </div>
                <div class="footer-section">
                  <h3>Quick Links</h3>
                  <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Products</a></li>
                    <li><a href="#">Cart</a></li>
                    <li><a href="#">Contact</a></li>
                  </ul>
                </div>
                <div class="footer-section">
                  <h3>Connect</h3>
                  <div class="social-icons">
                    <a href="#"><FacebookIcon size="24" /></a>
                    <a href="#"><InstagramIcon size="24" /></a>
                    <a href="#"><TwitterIcon size="24" /></a>
                  </div>
                </div>
              </div>
              <div class="footer-bottom">
                <p>&copy; 2023 Elegance. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </template>
      
      <script setup>
      import { ref, onMounted, onUnmounted } from 'vue'
      import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-vue-next'
      
      const isMenuOpen = ref(false)
      const isScrolled = ref(false)
      const countdown = ref(null)
      
      const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value
      }
      
      const handleScroll = () => {
        isScrolled.value = window.scrollY > 50
      }
      
      const updateCountdown = () => {
        if (countdown.value) {
          const time = countdown.value.textContent.split(':').map(Number)
          let [hours, minutes, seconds] = time
      
          if (seconds > 0) {
            seconds--
          } else if (minutes > 0) {
            minutes--
            seconds = 59
          } else if (hours > 0) {
            hours--
            minutes = 59
            seconds = 59
          }
      
          countdown.value.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
      }
      
      onMounted(() => {
        window.addEventListener('scroll', handleScroll)
        setInterval(updateCountdown, 1000)
      })
      
      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll)
      })
      </script>
      
      <style>
    
      </style>















