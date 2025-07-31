import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../views/login.vue'
import Home from '../views/Home.vue'
import Invoice from '../views/Invoice.vue'
import Product from '../views/Product.vue'
import Customer from '../views/Customer.vue'
import Reports from '../views/Reports.vue'      
import Settings from '../views/Settings.vue'    

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/app',
    component: MainLayout,
    children: [
      { path: 'home', name: 'Home', component: Home },
      { path: 'invoice', name: 'Invoice', component: Invoice },
      { path: 'customer', name: 'Customer', component: Customer },
      { path: 'product', name: 'Product', component: Product },
      { path: 'reports', name: 'Reports', component: Reports },     
      { path: 'settings', name: 'Settings', component: Settings }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
