import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Signup from '@/components/Signup.vue'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Forgetpassword from '@/components/Forgetpassword.vue'
import Resetpassword from '@/components/Resetpassword.vue'
import Updateforgetpassword from '@/components/Updateforgetpassword.vue'
import Otp from '@/components/Otp.vue'
import Cart from '@/components/Cart.vue'
import Order from '@/components/Order.vue'
import Product from '@/components/Product.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path:'/signup',
      name:'signup',
      component:Signup
    },{
      path:'/login',
      name:'login',
      component:Login
    },{
      path:'/forgetpassword',
      name:'forgetpassword',
      component:Forgetpassword
    },{
      path:'/resetpassword',
      name:'resetpassword',
      component:Resetpassword
    },{
      path:'/updateforgetpassword/:token',
      name:'updateforgetpassword',
      component:Updateforgetpassword
    },{
      path:'/otp',
      name:'otp',
      component:Otp
    },{
      path:'/cart',
      name:'cart',
      component:Cart
    },{
      path:'/orders',
      name:'order',
      component:Order
    },{
      path:'/products',
      name:'product',
      component:Product
    }
  ]
})

export default router
