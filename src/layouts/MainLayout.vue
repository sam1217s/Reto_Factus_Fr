<template>
  <q-layout view="hHh Lpr lFf" :class="{'bg-gradient-light': !darkMode, 'bg-gradient-dark': darkMode}">
    <!-- Partículas de fondo -->
    <div class="background-particles">
      <div class="particle" v-for="n in 20" :key="n" :style="getParticleStyle()"></div>
    </div>

    <!-- Encabezado moderno -->
    <q-header 
      elevated 
      :class="{'modern-header-light': !darkMode, 'modern-header-dark': darkMode}" 
      height-hint="72"
    >
      <q-toolbar class="modern-toolbar q-py-md">
        <q-btn 
          flat 
          dense 
          round 
          icon="menu" 
          @click="toggleDrawer" 
          class="menu-btn q-mr-md" 
          size="md"
        />

        <q-toolbar-title class="row items-center no-wrap">
          <div class="logo-container">
            <img 
              src="/logo.png" 
              alt="Logo" 
              class="modern-logo"
              :class="{'invert-logo': darkMode}"
            >
          </div>
          <div class="brand-text">
            <span class="brand-name">FluxPanel</span>
            <span class="brand-subtitle">Dashboard</span>
          </div>
        </q-toolbar-title>

        <q-space />

        <!-- Barra de búsqueda -->
        <div class="search-container q-mr-lg" v-if="$q.screen.gt.sm">
          <q-input
            v-model="searchQuery"
            placeholder="Buscar..."
            dense
            rounded
            outlined
            class="modern-search"
            :dark="darkMode"
          >
            <template v-slot:prepend>
              <q-icon name="search" :color="darkMode ? 'grey-4' : 'grey-6'" />
            </template>
          </q-input>
        </div>

        <!-- Acciones del header -->
        <div class="header-actions row items-center q-gutter-sm">
          <!-- Modo claro/oscuro -->
          <q-btn 
            flat 
            round 
            dense 
            :icon="darkMode ? 'light_mode' : 'dark_mode'" 
            @click="toggleDarkMode"
            class="action-btn"
            size="md"
          >
            <q-tooltip>{{ darkMode ? 'Modo claro' : 'Modo oscuro' }}</q-tooltip>
          </q-btn>

          <!-- Notificaciones -->
          <q-btn 
            flat 
            round 
            dense 
            icon="notifications_none" 
            class="action-btn"
            size="md"
          >
            <q-badge 
              v-if="notificationsCount > 0" 
              color="red" 
              floating 
              rounded
              class="notification-badge"
            >
              {{ notificationsCount }}
            </q-badge>
            <q-tooltip>Notificaciones</q-tooltip>
          </q-btn>

          <!-- Separador -->
          <q-separator vertical class="separator" />

          <!-- Avatar de usuario -->
          <q-btn flat round dense class="user-avatar-btn">
            <q-avatar size="40px" class="user-avatar">
              <img src="/samuel_gomez.png" alt="perfil" />
              <div class="avatar-status"></div>
            </q-avatar>
            
            <q-menu 
              auto-close 
              :class="{'modern-menu-dark': darkMode, 'modern-menu-light': !darkMode}"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-list class="user-menu" style="min-width: 200px">
                <q-item class="user-info">
                  <q-item-section avatar>
                    <q-avatar size="32px">
                      <img src="/samuel_gomez.png" alt="perfil" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Samuel Gómez</q-item-label>
                    <q-item-label caption>Administrador</q-item-label>
                  </q-item-section>
                </q-item>
                
                <q-separator class="q-my-sm" />
                
                <q-item clickable class="menu-item">
                  <q-item-section avatar>
                    <q-icon name="person_outline" />
                  </q-item-section>
                  <q-item-section>Mi perfil</q-item-section>
                </q-item>
                
                <q-item clickable @click="goToSettings" class="menu-item">
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section>Configuración</q-item-section>
                </q-item>
                
                <q-separator class="q-my-sm" />
                
                <q-item clickable @click="handleLogout" class="menu-item logout-item">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>Cerrar sesión</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Barra lateral moderna -->
    <q-drawer 
      v-model="drawer" 
      show-if-above 
      :width="280" 
      :mini="miniState" 
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :breakpoint="1024" 
      bordered 
      :class="{'modern-drawer-light': !darkMode, 'modern-drawer-dark': darkMode}"
    >
      <div class="drawer-content">
        <!-- Header del drawer -->
        <div class="drawer-header">
          <div class="drawer-brand" v-if="!miniState">
            <q-icon name="dashboard" size="md" :color="darkMode ? 'blue-4' : 'blue-6'" />
            <span class="drawer-title">Panel de Control</span>
          </div>
          <q-icon v-else name="dashboard" size="lg" :color="darkMode ? 'blue-4' : 'blue-6'" />
        </div>

        <q-scroll-area class="drawer-scroll fit">
          <q-list padding class="navigation-list">
            <q-item 
              v-for="nav in dynamicNavItems" 
              :key="nav.to" 
              clickable 
              v-ripple 
              :to="nav.to" 
              exact 
              class="nav-item" 
              active-class="nav-item-active"
            >
              <q-item-section avatar class="nav-icon">
                <q-icon :name="nav.icon" size="sm" />
              </q-item-section>
              
              <q-item-section class="nav-label">
                {{ nav.label }}
              </q-item-section>
              
              <!-- Badge dinámico -->
              <q-item-section avatar v-if="nav.badge !== null && nav.badge !== undefined" class="nav-badge">
                <q-badge 
                  :color="nav.badgeColor" 
                  rounded
                  class="count-badge"
                >
                  {{ nav.badge }}
                </q-badge>
              </q-item-section>
              
              <!-- Indicador de carga -->
              <q-item-section avatar v-else-if="nav.loading" class="nav-loading">
                <q-spinner size="16px" :color="darkMode ? 'blue-4' : 'blue-6'" />
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Sección inferior del drawer -->
          <div class="drawer-footer" v-if="!miniState">
            <div class="status-info">
              <div class="connection-status">
                <q-icon 
                  name="circle" 
                  size="8px" 
                  :color="isOnline ? 'positive' : 'negative'" 
                  class="q-mr-xs" 
                />
                <span>{{ isOnline ? 'En línea' : 'Sin conexión' }}</span>
              </div>
              
              <div class="version-info">
                <span>Versión {{ appVersion }}</span>
              </div>
              
              <div v-if="lastUpdate" class="last-update">
                Actualizado: {{ formatTime(lastUpdate) }}
              </div>
            </div>
          </div>
        </q-scroll-area>
      </div>
    </q-drawer>

    <!-- Contenido principal -->
    <q-page-container>
      <div class="page-wrapper">
        <router-view 
          :class="{'main-content': true}" 
          @data-updated="handleDataUpdate"
        />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuth } from '../store/useAuth'
import { backgetData } from '../services/backClient'

export default {
  name: 'MainLayout',

  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()
    const auth = useAuth()

    const drawer = ref(true)
    const miniState = ref(true)
    const isOnline = ref(navigator.onLine)
    const notificationsCount = ref(3)
    const appVersion = ref('2.1.0')
    const darkMode = ref(false)
    const searchQuery = ref('')
    
    const counts = ref({
      customers: null,
      products: null,
      invoices: null
    })
    
    const loading = ref({
      customers: false,
      products: false,
      invoices: false
    })
    
    const lastUpdate = ref(null)

    // Generar estilos para partículas
    const getParticleStyle = () => {
      return {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 20 + 's',
        animationDuration: (Math.random() * 10 + 15) + 's'
      }
    }

    // Inicialización de tema
    const initializeTheme = () => {
      if (localStorage.getItem('darkMode')) {
        darkMode.value = localStorage.getItem('darkMode') === 'true'
      } else {
        darkMode.value = false
        localStorage.setItem('darkMode', 'false')
      }
      
      $q.dark.set(darkMode.value)
      document.documentElement.setAttribute('data-theme', darkMode.value ? 'dark' : 'light')
    }

    // Toggle modo oscuro
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value
      $q.dark.set(darkMode.value)
      localStorage.setItem('darkMode', darkMode.value)
      
      document.documentElement.setAttribute('data-theme', darkMode.value ? 'dark' : 'light')
      
      $q.notify({
        message: darkMode.value ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado',
        color: darkMode.value ? 'dark' : 'primary',
        position: 'top-right',
        timeout: 1500,
        icon: darkMode.value ? 'dark_mode' : 'light_mode',
        textColor: 'white'
      })
    }

    // Navegación
    const baseNavItems = [
      { to: '/app/home', icon: 'dashboard', label: 'Inicio' },
      { 
        to: '/app/customer', 
        icon: 'groups', 
        label: 'Clientes',
        countKey: 'customers',
        badgeColor: 'blue' 
      },
      { 
        to: '/app/product', 
        icon: 'inventory_2', 
        label: 'Productos',
        countKey: 'products',
        badgeColor: 'green'
      },
      { 
        to: '/app/invoice', 
        icon: 'receipt_long', 
        label: 'Facturas',
        countKey: 'invoices',
        badgeColor: 'orange' 
      },
      { to: '/app/reports', icon: 'analytics', label: 'Reportes' },
      { to: '/app/settings', icon: 'tune', label: 'Configuración' }
    ]

    const dynamicNavItems = computed(() => {
      return baseNavItems.map(item => {
        if (item.countKey) {
          return {
            ...item,
            badge: counts.value[item.countKey],
            loading: loading.value[item.countKey]
          }
        }
        return item
      })
    })

    // Funciones para obtener contadores
    const fetchCustomersCount = async () => {
      try {
        loading.value.customers = true
        console.log('🔄 Obteniendo conteo de clientes...')
        const response = await backgetData('customer')
        const count = Array.isArray(response) ? response.length : 0
        counts.value.customers = count
        console.log(`✅ ${count} clientes encontrados`)
      } catch (error) {
        console.warn('⚠️ Error obteniendo clientes:', error.message)
        counts.value.customers = 0
      } finally {
        loading.value.customers = false
      }
    }

    const fetchProductsCount = async () => {
      try {
        loading.value.products = true
        console.log('🔄 Obteniendo conteo de productos...')
        const response = await backgetData('product')
        const count = Array.isArray(response) ? response.length : 0
        counts.value.products = count
        console.log(`✅ ${count} productos encontrados`)
      } catch (error) {
        console.warn('⚠️ Error obteniendo productos:', error.message)
        counts.value.products = 0
      } finally {
        loading.value.products = false
      }
    }

    const fetchInvoicesCount = async () => {
      try {
        loading.value.invoices = true
        console.log('🔄 Obteniendo conteo de facturas...')
        const response = await backgetData('invoice')
        const count = Array.isArray(response) ? response.length : 0
        counts.value.invoices = count
        console.log(`✅ ${count} facturas encontradas`)
      } catch (error) {
        console.warn('⚠️ Error obteniendo facturas:', error.message)
        counts.value.invoices = 0
      } finally {
        loading.value.invoices = false
      }
    }

    const updateAllCounts = async () => {
      console.log('🔄 Actualizando todos los contadores...')
      
      try {
        await Promise.allSettled([
          fetchCustomersCount(),
          fetchProductsCount(),
          fetchInvoicesCount()
        ])
        
        lastUpdate.value = new Date()
        console.log('✅ Contadores actualizados correctamente')
        
      } catch (error) {
        console.error('❌ Error actualizando contadores:', error)
      }
    }

    const updateSpecificCount = async (type) => {
      console.log(`🔄 Actualizando contador específico: ${type}`)
      
      switch (type) {
        case 'customers':
          await fetchCustomersCount()
          break
        case 'products':
          await fetchProductsCount()
          break
        case 'invoices':
          await fetchInvoicesCount()
          break
      }
      
      lastUpdate.value = new Date()
    }

    const handleDataUpdate = (type) => {
      console.log(`📊 Datos actualizados en: ${type}`)
      updateSpecificCount(type)
    }

    watch(() => route.path, (newPath, oldPath) => {
      if (newPath !== oldPath) {
        console.log(`🧭 Navegando de ${oldPath} a ${newPath}`)
        
        if (newPath.includes('/customer')) {
          updateSpecificCount('customers')
        } else if (newPath.includes('/product')) {
          updateSpecificCount('products')
        } else if (newPath.includes('/invoice')) {
          updateSpecificCount('invoices')
        }
      }
    })

    const formatTime = (date) => {
      if (!date) return ''
      return date.toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    const toggleDrawer = () => {
      drawer.value = !drawer.value
    }

    const handleLogout = async () => {
      try {
        await auth.logout()
        router.push('/')
        $q.notify({
          color: 'positive',
          message: 'Sesión cerrada correctamente',
          position: 'top'
        })
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
        $q.notify({
          color: 'negative',
          message: 'Error al cerrar sesión',
          position: 'top'
        })
      }
    }

    const goToSettings = () => {
      router.push('/app/settings')
    }

    // Inicialización
    onMounted(async () => {
      console.log('🚀 Iniciando MainLayout moderno...')
      
      initializeTheme()
      
      window.addEventListener('online', () => { 
        isOnline.value = true
        updateAllCounts()
      })
      window.addEventListener('offline', () => { isOnline.value = false })
      
      await updateAllCounts()

      setInterval(() => {
        if (isOnline.value) {
          console.log('⏰ Actualización periódica de contadores...')
          updateAllCounts()
        }
      }, 5 * 60 * 1000)

      console.log('✅ MainLayout inicializado con tema:', darkMode.value ? 'oscuro' : 'claro')
    })

    return {
      drawer,
      miniState,
      isOnline,
      notificationsCount,
      appVersion,
      darkMode,
      searchQuery,
      dynamicNavItems,
      counts,
      loading,
      lastUpdate,
      getParticleStyle,
      toggleDrawer,
      toggleDarkMode,
      handleLogout,
      goToSettings,
      handleDataUpdate,
      formatTime,
      updateAllCounts
    }
  }
}
</script>

<style lang="scss" scoped>
/* ===== TRANSICIONES GLOBALES ===== */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== FONDOS PRINCIPALES ===== */
.bg-gradient-light {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.bg-gradient-dark {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

/* ===== PARTÍCULAS DE FONDO ===== */
.background-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(59, 130, 246, 0.4);
  border-radius: 50%;
  animation: particle-float linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
}

/* ===== HEADER MODERNO ===== */
.modern-header-light {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  color: #1e293b !important;
}

.modern-header-dark {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  color: #f8fafc !important;
}

.modern-toolbar {
  min-height: 72px;
  padding: 0 24px;
}

.menu-btn {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.menu-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.05);
}

/* ===== LOGO Y MARCA ===== */
.logo-container {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.modern-logo {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.brand-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
  line-height: 1;
}

/* ===== BÚSQUEDA ===== */
.search-container {
  width: 300px;
}

.modern-search :deep(.q-field__control) {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  height: 40px;
}

.modern-search :deep(.q-field--focused .q-field__control) {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* ===== ACCIONES DEL HEADER ===== */
.header-actions {
  gap: 4px;
}

.action-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.05);
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.separator {
  height: 24px;
  margin: 0 8px;
  opacity: 0.3;
}

/* ===== AVATAR Y MENÚ DE USUARIO ===== */
.user-avatar-btn {
  padding: 2px;
}

.user-avatar {
  border: 2px solid rgba(59, 130, 246, 0.2);
  position: relative;
}

.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
}

.modern-menu-light {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.modern-menu-dark {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  color: #f8fafc;
}

.user-menu {
  padding: 8px;
}

.user-info {
  background: rgba(59, 130, 246, 0.05);
  border-radius: 12px;
  margin-bottom: 8px;
}

.menu-item {
  border-radius: 8px;
  margin: 2px 0;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(59, 130, 246, 0.1);
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* ===== DRAWER MODERNO ===== */
.modern-drawer-light {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.modern-drawer-dark {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fafc;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawer-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.drawer-scroll {
  flex: 1;
}

/* ===== NAVEGACIÓN ===== */
.navigation-list {
  padding: 16px 12px;
}

.nav-item {
  border-radius: 12px;
  margin: 4px 0;
  padding: 12px 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: transparent;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(59, 130, 246, 0.08);
  transform: translateX(4px);
}

.nav-item-active {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #3b82f6 !important;
  transform: translateX(8px);
}

.nav-item-active::before {
  background: #3b82f6;
}

.nav-item-active .nav-icon :deep(.q-icon) {
  color: #3b82f6 !important;
}

.nav-icon {
  min-width: 0;
  padding-right: 16px;
}

.nav-label {
  font-weight: 500;
  font-size: 0.95rem;
}

.count-badge {
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  animation: badge-pulse 2s infinite;
}

@keyframes badge-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* ===== FOOTER DEL DRAWER ===== */
.drawer-footer {
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: auto;
}

.modern-drawer-dark .drawer-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.status-info {
  font-size: 0.8rem;
  opacity: 0.7;
  line-height: 1.4;
}

.connection-status {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.version-info {
  margin-bottom: 4px;
}

.last-update {
  font-size: 0.7rem;
  opacity: 0.6;
}

/* ===== CONTENIDO PRINCIPAL ===== */
.page-wrapper {
  min-height: calc(100vh - 72px);
  position: relative;
  z-index: 1;
}

.main-content {
  padding: 24px;
  background: transparent;
}

/* ===== NOTIFICATION BADGE ===== */
.notification-badge {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-1px);
  }
}

/* ===== EFECTOS ESPECIALES ===== */
.invert-logo {
  filter: brightness(0) invert(1);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .modern-toolbar {
    padding: 0 16px;
  }
  
  .search-container {
    display: none;
  }
  
  .brand-text {
    display: none;
  }
  
  .header-actions {
    gap: 2px;
  }
  
  .action-btn {
    width: 40px;
    height: 40px;
  }
}

/* ===== ANIMACIONES DE ENTRADA ===== */
.nav-item {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ===== SCROLLBAR PERSONALIZADO ===== */
.drawer-scroll :deep(.q-scrollarea__thumb) {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 4px;
  width: 6px;
}

.drawer-scroll :deep(.q-scrollarea__bar) {
  background: transparent;
  width: 8px;
}
</style>