<template>
  <div class="modern-home-container" :class="{ 'container-dark': $q.dark.isActive }">
    <!-- Partículas de fondo -->
    <div class="background-particles">
      <div class="particle" v-for="n in 20" :key="n" :style="getParticleStyle()"></div>
    </div>

    <!-- Header Principal -->
    <div class="modern-hero-section">
      <div class="hero-content">
        <div class="welcome-section">
          <div class="welcome-badge">
            <q-icon name="wb_sunny" />
            <span>{{ getGreeting() }}</span>
          </div>
          <h1 class="hero-title">
            Flux<span class="highlight-gradient">Panel</span>
          </h1>
          <p class="hero-subtitle">Sistema integral de facturación electrónica</p>
          
          <div class="hero-stats">
            <div class="stat-item">
              <q-icon name="today" />
              <span>{{ getCurrentDate() }}</span>
            </div>
            <div class="stat-divider">•</div>
            <div class="stat-item">
              <q-icon name="access_time" />
              <span>{{ getCurrentTime() }}</span>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="floating-dashboard">
            <div class="dashboard-card">
              <div class="card-header">
                <q-icon name="dashboard" />
                <span>Panel de Control</span>
              </div>
              <div class="card-metrics">
                <div class="metric">
                  <span class="metric-value">{{ metrics.totalInvoices }}</span>
                  <span class="metric-label">Facturas</span>
                </div>
                <div class="metric">
                  <span class="metric-value">{{ metrics.totalCustomers }}</span>
                  <span class="metric-label">Clientes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Descripción del Proyecto -->
    <div class="modern-description-section">
      <div class="description-card">
        <div class="description-header">
          <div class="project-icon">
            <q-icon name="receipt_long" />
          </div>
          <div class="description-text">
            <h2>¿Qué es FluxPanel?</h2>
            <p>Plataforma de facturación electrónica integrada con Factus</p>
          </div>
        </div>
        
        <div class="description-content">
          <div class="description-main">
            <p class="main-text">
              <strong>FluxPanel</strong> es una solución completa de facturación electrónica diseñada para simplificar 
              y automatizar los procesos de facturación de tu empresa. Mediante la integración directa con 
              <strong>Factus</strong>, garantizamos el cumplimiento total con la normatividad DIAN y la 
              generación de documentos electrónicos válidos.
            </p>
            
            <p class="secondary-text">
              Nuestro sistema te permite gestionar de manera eficiente toda la cadena de facturación: desde el 
              registro de clientes y productos hasta la emisión, envío y seguimiento de facturas electrónicas, 
              todo desde una interfaz moderna e intuitiva.
            </p>
          </div>
          
          <div class="integration-badge">
            <div class="badge-content">
              <div class="badge-icon">
                <q-icon name="verified" />
              </div>
              <div class="badge-info">
                <div class="badge-title">Integración Certificada</div>
                <div class="badge-subtitle">Factus API Oficial</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Características Principales -->
    <div class="modern-features-section">
      <div class="section-header">
        <q-icon name="star" class="section-icon" />
        <h2 class="section-title">Características Principales</h2>
        <p class="section-subtitle">Descubre todas las funcionalidades que FluxPanel tiene para ofrecerte</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index" :class="feature.class">
          <div class="feature-background">
            <div class="feature-icon" :class="feature.iconClass">
              <q-icon :name="feature.icon" />
            </div>
            
            <div class="feature-content">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
              
              <div class="feature-benefits">
                <div class="benefit-item" v-for="benefit in feature.benefits" :key="benefit">
                  <q-icon name="check_circle" size="xs" />
                  <span>{{ benefit }}</span>
                </div>
              </div>
            </div>
            
            <div class="feature-action">
              <q-btn 
                :label="feature.actionLabel" 
                :to="feature.route" 
                flat 
                class="feature-btn"
                :icon="feature.actionIcon"
              />
            </div>
          </div>
          
          <div class="feature-glow"></div>
        </div>
      </div>
    </div>

    <!-- Integración Factus */
    <div class="modern-integration-section">
      <div class="integration-card">
        <div class="integration-header">
          <div class="factus-logo">
            <q-icon name="verified_user" />
          </div>
          <div class="integration-info">
            <h2>Integración con Factus</h2>
            <p>Proveedor autorizado por la DIAN</p>
          </div>
          <div class="connection-status">
            <q-chip 
              :color="authStatus.authenticated ? 'positive' : 'negative'" 
              :icon="authStatus.authenticated ? 'check_circle' : 'error'"
              text-color="white"
              class="status-chip"
            >
              {{ authStatus.authenticated ? 'Conectado' : 'Desconectado' }}
            </q-chip>
          </div>
        </div>
        
        <div class="integration-content">
          <div class="integration-benefits">
            <h3>Beneficios de la Integración</h3>
            
            <div class="benefits-grid">
              <div class="benefit-card" v-for="benefit in integrationBenefits" :key="benefit.title">
                <div class="benefit-icon" :class="benefit.colorClass">
                  <q-icon :name="benefit.icon" />
                </div>
                <div class="benefit-content">
                  <h4>{{ benefit.title }}</h4>
                  <p>{{ benefit.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="integration-status">
            <h3>Estado Actual</h3>
            
            <div class="status-details">
              <div class="status-item">
                <div class="status-label">Estado de Conexión:</div>
                <div class="status-value" :class="{ 'connected': authStatus.authenticated, 'disconnected': !authStatus.authenticated }">
                  {{ authStatus.message }}
                </div>
              </div>
              
              <div class="status-item">
                <div class="status-label">Última sincronización:</div>
                <div class="status-value">{{ getLastSync() }}</div>
              </div>
              
              <div class="status-item">
                <div class="status-label">Facturas procesadas hoy:</div>
                <div class="status-value">{{ todayInvoices }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Proceso de Trabajo -->
    <div class="modern-workflow-section">
      <div class="section-header">
        <q-icon name="timeline" class="section-icon" />
        <h2 class="section-title">Flujo de Trabajo</h2>
        <p class="section-subtitle">Sigue estos pasos para maximizar el potencial de FluxPanel</p>
      </div>
      
      <div class="workflow-container">
        <div class="workflow-line"></div>
        
        <div class="workflow-steps">
          <div class="workflow-step" v-for="(step, index) in workflowSteps" :key="index">
            <div class="step-indicator">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-pulse"></div>
            </div>
            
            <div class="step-content">
              <div class="step-icon" :class="step.iconClass">
                <q-icon :name="step.icon" />
              </div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones Rápidas -->
    <div class="modern-quick-actions-section">
      <div class="section-header">
        <q-icon name="bolt" class="section-icon" />
        <h2 class="section-title">Acciones Rápidas</h2>
        <p class="section-subtitle">Accede rápidamente a las funciones principales del sistema</p>
      </div>
      
      <div class="quick-actions-grid">
        <div 
          v-for="action in quickActions" 
          :key="action.path"
          class="quick-action-card"
          @click="redirect(action.path)"
          :class="action.class"
        >
          <div class="action-background">
            <div class="action-icon-wrapper">
              <div class="action-icon" :class="action.iconClass">
                <q-icon :name="action.icon" />
              </div>
            </div>
            
            <div class="action-content">
              <h3>{{ action.label }}</h3>
              <p>{{ action.description }}</p>
            </div>
            
            <div class="action-arrow">
              <q-icon name="arrow_forward" />
            </div>
          </div>
          
          <div class="action-glow"></div>
        </div>
      </div>
    </div>

    <!-- Footer Informativo -->
    <div class="modern-footer-section">
      <div class="footer-content">
        <div class="footer-grid">
          <div class="footer-section">
            <div class="footer-icon">
              <q-icon name="info" />
            </div>
            <div class="footer-info">
              <h4>FluxPanel v2.1.0</h4>
              <p>Sistema de facturación electrónica integrado con Factus</p>
            </div>
          </div>
          
          <div class="footer-section">
            <div class="footer-icon">
              <q-icon name="support" />
            </div>
            <div class="footer-info">
              <h4>Soporte</h4>
              <p>¿Necesitas ayuda? Consulta nuestra documentación o contacta al equipo de soporte.</p>
            </div>
          </div>
          
          <div class="footer-section">
            <div class="footer-icon">
              <q-icon name="verified" />
            </div>
            <div class="footer-info">
              <h4>Cumplimiento</h4>
              <p>Cumple con la Resolución 000042 de 2020 de la DIAN para facturación electrónica.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// Variables reactivas
const currentTime = ref('')
const todayInvoices = ref(0)
const authStatus = ref({
  authenticated: false,
  message: 'Verificando conexión...'
})

// Métricas simuladas
const metrics = ref({
  totalInvoices: 0,
  totalCustomers: 0
})

// Características del sistema
const features = [
  {
    title: 'Gestión de Clientes',
    description: 'Administra toda la información de tus clientes con validación automática para Factus.',
    icon: 'groups',
    iconClass: 'customers-icon',
    class: 'customers-feature',
    actionLabel: 'Gestionar',
    actionIcon: 'arrow_forward',
    route: '/app/customer',
    benefits: [
      'Registro de personas naturales y jurídicas',
      'Validación de campos obligatorios',
      'Gestión de información de contacto'
    ]
  },
  {
    title: 'Catálogo de Productos',
    description: 'Mantén un inventario organizado con toda la información requerida por la DIAN.',
    icon: 'inventory_2',
    iconClass: 'products-icon',
    class: 'products-feature',
    actionLabel: 'Ver Productos',
    actionIcon: 'arrow_forward',
    route: '/app/product',
    benefits: [
      'Códigos de referencia y estándares',
      'Configuración de IVA y tributos',
      'Validación automática para Factus'
    ]
  },
  {
    title: 'Facturación Electrónica',
    description: 'Genera facturas válidas ante la DIAN con un proceso guiado paso a paso.',
    icon: 'receipt_long',
    iconClass: 'invoices-icon',
    class: 'invoices-feature',
    actionLabel: 'Facturar',
    actionIcon: 'arrow_forward',
    route: '/app/invoice',
    benefits: [
      'Proceso guiado de creación',
      'Envío automático a Factus',
      'Descarga de PDF y envío por email'
    ]
  },
  {
    title: 'Reportes y Análisis',
    description: 'Obtén insights valiosos sobre tu negocio con reportes detallados.',
    icon: 'analytics',
    iconClass: 'reports-icon',
    class: 'reports-feature',
    actionLabel: 'Ver Reportes',
    actionIcon: 'arrow_forward',
    route: '/app/reports',
    benefits: [
      'Dashboard con métricas clave',
      'Reportes de ventas por período',
      'Análisis de clientes y productos'
    ]
  }
]

// Beneficios de integración
const integrationBenefits = [
  {
    title: 'Cumplimiento DIAN',
    description: 'Facturas válidas y conformes con la normatividad colombiana',
    icon: 'security',
    colorClass: 'benefit-security'
  },
  {
    title: 'Sincronización Automática',
    description: 'Envío inmediato de facturas a la DIAN',
    icon: 'cloud_sync',
    colorClass: 'benefit-sync'
  },
  {
    title: 'Código QR DIAN',
    description: 'Generación automática de códigos QR para verificación',
    icon: 'qr_code',
    colorClass: 'benefit-qr'
  },
  {
    title: 'Descarga de PDF',
    description: 'Facturas en formato PDF listas para imprimir',
    icon: 'file_download',
    colorClass: 'benefit-download'
  }
]

// Flujo de trabajo
const workflowSteps = [
  {
    title: 'Registro de Clientes',
    description: 'Registra la información completa de tus clientes con validación automática de campos requeridos por Factus.',
    icon: 'person_add',
    iconClass: 'step-customers'
  },
  {
    title: 'Configuración de Productos',
    description: 'Configura tu catálogo con códigos de referencia, precios, IVA y toda la información tributaria necesaria.',
    icon: 'add_box',
    iconClass: 'step-products'
  },
  {
    title: 'Generación de Facturas',
    description: 'Crea facturas con nuestro proceso guiado, selecciona productos y clientes, y envía automáticamente a Factus.',
    icon: 'receipt_long',
    iconClass: 'step-invoices'
  },
  {
    title: 'Análisis y Reportes',
    description: 'Consulta reportes detallados, métricas de ventas y obtén insights valiosos para tu negocio.',
    icon: 'analytics',
    iconClass: 'step-reports'
  }
]

// Acciones rápidas
const quickActions = [
  {
    label: 'Nueva Factura',
    description: 'Crear factura electrónica',
    path: '/app/invoice',
    icon: 'description',
    iconClass: 'invoice-action',
    class: 'invoice-card'
  },
  {
    label: 'Gestionar Clientes',
    description: 'Ver y editar clientes',
    path: '/app/customer',
    icon: 'people',
    iconClass: 'customer-action',
    class: 'customer-card'
  },
  {
    label: 'Productos',
    description: 'Administrar inventario',
    path: '/app/product',
    icon: 'inventory_2',
    iconClass: 'product-action',
    class: 'product-card'
  },
  {
    label: 'Reportes',
    description: 'Análisis y estadísticas',
    path: '/app/reports',
    icon: 'analytics',
    iconClass: 'report-action',
    class: 'report-card'
  }
]

// Funciones para efectos visuales
const getParticleStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 20 + 's',
    animationDuration: (Math.random() * 10 + 15) + 's'
  }
}

// Métodos
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

const getCurrentDate = () => {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCurrentTime = () => {
  return currentTime.value
}

const getLastSync = () => {
  const now = new Date()
  return now.toLocaleDateString('es-CO') + ' ' + now.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const checkAuthStatus = () => {
  try {
    const authData = JSON.parse(localStorage.getItem("Auth") || '{}')
    const hasToken = !!authData.token
    
    authStatus.value = {
      authenticated: hasToken,
      message: hasToken 
        ? '✅ Conectado con Factus - Sistema listo'
        : '⚠️ No autenticado - Requiere conexión con Factus'
    }
    
    // Simular facturas procesadas hoy y métricas
    todayInvoices.value = hasToken ? Math.floor(Math.random() * 15) + 1 : 0
    metrics.value = {
      totalInvoices: hasToken ? Math.floor(Math.random() * 100) + 50 : 0,
      totalCustomers: hasToken ? Math.floor(Math.random() * 50) + 25 : 0
    }
    
    return hasToken
  } catch (error) {
    authStatus.value = {
      authenticated: false,
      message: '❌ Error verificando autenticación'
    }
    return false
  }
}

const redirect = (path) => {
  router.push(path)
}

// Lifecycle
onMounted(() => {
  // Actualizar tiempo cada segundo
  updateTime()
  setInterval(updateTime, 1000)
  
  // Verificar estado de autenticación
  checkAuthStatus()
  
  console.log('🚀 FluxPanel iniciado correctamente')
})
</script>

<style scoped>
/* ===== TRANSICIONES GLOBALES ===== */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== CONTENEDOR PRINCIPAL ===== */
.modern-home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.container-dark {
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

/* ===== HERO SECTION ===== */
.modern-hero-section {
  padding: 80px 32px;
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 300;
  margin: 0;
  line-height: 1.1;
  color: #1e293b;
}

.container-dark .hero-title {
  color: #f8fafc;
}

.highlight-gradient {
  background: linear-gradient(135deg, #f97316, #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  margin: 16px 0 32px 0;
  line-height: 1.6;
}

.container-dark .hero-subtitle {
  color: #94a3b8;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #64748b;
  font-weight: 500;
}

.container-dark .hero-stats {
  color: #94a3b8;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-divider {
  opacity: 0.5;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-dashboard {
  perspective: 1000px;
}

.dashboard-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: rotateY(-15deg) rotateX(5deg);
  animation: float 6s ease-in-out infinite;
}

.container-dark .dashboard-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

@keyframes float {
  0%, 100% {
    transform: rotateY(-15deg) rotateX(5deg) translateY(0px);
  }
  50% {
    transform: rotateY(-15deg) rotateX(5deg) translateY(-10px);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #3b82f6;
  font-weight: 600;
}

.container-dark .card-header {
  color: #60a5fa;
}

.card-metrics {
  display: flex;
  gap: 24px;
}

.metric {
  text-align: center;
}

.metric-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.container-dark .metric-value {
  color: #f8fafc;
}

.metric-label {
  font-size: 0.875rem;
  color: #64748b;
}

.container-dark .metric-label {
  color: #94a3b8;
}

/* ===== SECCIONES MODERNAS ===== */
.modern-description-section,
.modern-features-section,
.modern-integration-section,
.modern-workflow-section,
.modern-quick-actions-section,
.modern-footer-section {
  padding: 60px 32px;
  position: relative;
  z-index: 1;
}

.description-card,
.integration-card {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.container-dark .description-card,
.container-dark .integration-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* ===== HEADERS DE SECCIÓN ===== */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-icon {
  color: #f97316;
  font-size: 3rem;
  margin-bottom: 16px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.container-dark .section-title {
  color: #f8fafc;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.container-dark .section-subtitle {
  color: #94a3b8;
}

/* ===== DESCRIPCIÓN ===== */
.description-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.project-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
}

.description-text h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.container-dark .description-text h2 {
  color: #f8fafc;
}

.description-text p {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
}

.container-dark .description-text p {
  color: #94a3b8;
}

.description-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  align-items: start;
}

.main-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #374151;
  margin-bottom: 20px;
}

.container-dark .main-text {
  color: #d1d5db;
}

.secondary-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #6b7280;
  margin: 0;
}

.container-dark .secondary-text {
  color: #9ca3af;
}

.integration-badge {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 16px;
  padding: 24px;
  color: white;
}

.badge-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.badge-icon {
  font-size: 2rem;
}

.badge-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.badge-subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* ===== CARACTERÍSTICAS ===== */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.container-dark .feature-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
}

.feature-background {
  position: relative;
  z-index: 2;
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin-bottom: 24px;
}

.customers-icon { background: linear-gradient(135deg, #a855f7, #7c3aed); }
.products-icon { background: linear-gradient(135deg, #f97316, #ea580c); }
.invoices-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.reports-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }

.feature-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.container-dark .feature-content h3 {
  color: #f8fafc;
}

.feature-content p {
  font-size: 1rem;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 20px;
}

.container-dark .feature-content p {
  color: #94a3b8;
}

.feature-benefits {
  margin-bottom: 24px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: #6b7280;
}

.container-dark .benefit-item {
  color: #9ca3af;
}

.benefit-item q-icon {
  color: #22c55e;
}

.feature-action {
  margin-top: auto;
}

.feature-btn {
  color: #3b82f6;
  font-weight: 600;
}

.feature-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover .feature-glow {
  opacity: 1;
}

/* ===== INTEGRACIÓN ===== */
.integration-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}

.factus-logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
}

.integration-info {
  flex: 1;
}

.integration-info h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.container-dark .integration-info h2 {
  color: #f8fafc;
}

.integration-info p {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
}

.container-dark .integration-info p {
  color: #94a3b8;
}

.status-chip {
  font-size: 0.875rem;
  padding: 8px 16px;
  border-radius: 12px;
}

.integration-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.integration-benefits h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}

.container-dark .integration-benefits h3 {
  color: #f8fafc;
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.benefit-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.container-dark .benefit-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.benefit-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.benefit-security { background: linear-gradient(135deg, #22c55e, #16a34a); }
.benefit-sync { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.benefit-qr { background: linear-gradient(135deg, #f97316, #ea580c); }
.benefit-download { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.benefit-content h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.container-dark .benefit-content h4 {
  color: #f8fafc;
}

.benefit-content p {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.container-dark .benefit-content p {
  color: #94a3b8;
}

.integration-status h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
}

.container-dark .integration-status h3 {
  color: #f8fafc;
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.container-dark .status-item {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.status-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.container-dark .status-label {
  color: #9ca3af;
}

.status-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.container-dark .status-value {
  color: #f8fafc;
}

.status-value.connected {
  color: #16a34a;
}

.status-value.disconnected {
  color: #dc2626;
}

/* ===== WORKFLOW ===== */
.workflow-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.workflow-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #f97316, #ea580c);
  transform: translateY(-50%);
  z-index: 1;
}

.workflow-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  position: relative;
  z-index: 2;
}

.workflow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.step-indicator {
  position: relative;
  margin-bottom: 24px;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  position: relative;
  z-index: 2;
}

.step-pulse {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(249, 115, 22, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.step-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.container-dark .step-content {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto 16px auto;
}

.step-customers { background: linear-gradient(135deg, #a855f7, #7c3aed); }
.step-products { background: linear-gradient(135deg, #f97316, #ea580c); }
.step-invoices { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.step-reports { background: linear-gradient(135deg, #22c55e, #16a34a); }

.step-content h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.container-dark .step-content h3 {
  color: #f8fafc;
}

.step-content p {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #64748b;
  margin: 0;
}

.container-dark .step-content p {
  color: #94a3b8;
}

/* ===== ACCIONES RÁPIDAS ===== */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.quick-action-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.container-dark .quick-action-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.quick-action-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
}

.action-background {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 2;
}

.action-icon-wrapper {
  flex-shrink: 0;
}

.action-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.invoice-action { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.customer-action { background: linear-gradient(135deg, #a855f7, #7c3aed); }
.product-action { background: linear-gradient(135deg, #f97316, #ea580c); }
.report-action { background: linear-gradient(135deg, #22c55e, #16a34a); }

.action-content {
  flex: 1;
}

.action-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.container-dark .action-content h3 {
  color: #f8fafc;
}

.action-content p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.container-dark .action-content p {
  color: #94a3b8;
}

.action-arrow {
  color: #64748b;
  transition: all 0.3s ease;
}

.container-dark .action-arrow {
  color: #94a3b8;
}

.quick-action-card:hover .action-arrow {
  color: #f97316;
  transform: translateX(4px);
}

.action-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent, rgba(249, 115, 22, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.quick-action-card:hover .action-glow {
  opacity: 1;
}

/* ===== FOOTER ===== */
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.container-dark .footer-content {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.footer-section {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.footer-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.footer-info h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.container-dark .footer-info h4 {
  color: #f8fafc;
}

.footer-info p {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #64748b;
  margin: 0;
}

.container-dark .footer-info p {
  color: #94a3b8;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .description-content,
  .integration-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .modern-hero-section,
  .modern-description-section,
  .modern-features-section,
  .modern-integration-section,
  .modern-workflow-section,
  .modern-quick-actions-section,
  .modern-footer-section {
    padding: 40px 16px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .workflow-steps {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .workflow-line {
    display: none;
  }

  .features-grid,
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }

  .action-background {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 8px;
  }

  .stat-divider {
    display: none;
  }
}
</style>