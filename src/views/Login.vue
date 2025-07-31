<template>
  <div class="login-page" :class="{ 'login-page--dark': $q.dark.isActive }">
    <!-- Partículas animadas de fondo -->
    <div class="particles-container">
      <div class="particle" v-for="n in 80" :key="n" :style="getParticleStyle()"></div>
    </div>

    <!-- Botón de modo oscuro -->
    <div class="theme-toggle">
      <q-btn 
        flat 
        round 
        dense 
        :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" 
        @click="toggleDarkMode"
        :color="$q.dark.isActive ? 'amber-4' : 'white'"
        size="md"
        class="theme-btn"
      >
        <q-tooltip>{{ $q.dark.isActive ? 'Modo claro' : 'Modo oscuro' }}</q-tooltip>
      </q-btn>
    </div>

    <!-- Contenedor principal tipo laptop -->
    <div class="laptop-container">
      <!-- Panel izquierdo - Bienvenida FACTUS -->
      <div class="welcome-panel">
        <div class="welcome-content">
          <!-- Logo FACTUS -->
          <div class="logo-container">
            <div class="logo-circle">
              <img src="/logo.png" alt="Logo FACTUS" class="logo" />
            </div>
          </div>
          
          <!-- Texto de bienvenida -->
          <div class="welcome-text">
            <h1 class="welcome-title">Bienvenido a nuestra plataforma</h1>
            <p class="welcome-subtitle">Gestión eficiente para tu negocio</p>
          </div>
        </div>
      </div>

      <!-- Panel derecho - Tecnológico con formulario -->
      <div class="tech-panel">
        <!-- Fondo tecnológico -->
        <div class="tech-background">
          <div class="tech-overlay"></div>
          <div class="tech-grid"></div>
          <div class="circuit-lines">
            <div class="circuit-line line-1"></div>
            <div class="circuit-line line-2"></div>
            <div class="circuit-line line-3"></div>
          </div>
        </div>

        <!-- Formulario flotante -->
        <div class="floating-form-container">
          <div class="floating-login-panel">
            <!-- Efectos de cristal -->
            <div class="glass-effects">
              <div class="glass-reflection"></div>
              <div class="tech-border"></div>
            </div>

            <!-- Contenido del formulario -->
            <div class="login-form-content">
              <!-- Campos de entrada -->
              <div class="input-group">
                <q-input
                  v-model="email"
                  outlined
                  dense
                  :rules="emailRules"
                  class="floating-input"
                  placeholder="Username or email"
                  :bg-color="'rgba(255, 255, 255, 0.9)'"
                  color="blue-6"
                  input-style="color: #37474f; font-weight: 500;"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="grey-7" size="sm" />
                  </template>
                </q-input>
              </div>

              <div class="input-group">
                <q-input
                  v-model="password"
                  outlined
                  dense
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[val => !!val || 'Este campo es obligatorio']"
                  class="floating-input"
                  placeholder="••••••••"
                  :bg-color="'rgba(255, 255, 255, 0.9)'"
                  color="blue-6"
                  input-style="color: #37474f; font-weight: 500;"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" color="grey-7" size="sm" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      @click="isPwd = !isPwd"
                      class="cursor-pointer"
                      color="grey-6"
                      size="sm"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Mensaje de error -->
              <div v-if="errorMessage" class="error-message">
                <q-icon name="error_outline" size="sm" />
                <span>{{ errorMessage }}</span>
              </div>

              <!-- Botón de login -->
              <q-btn
                label="login"
                type="submit"
                color="blue-6"
                class="floating-login-btn"
                :loading="loading"
                :disable="!email || !password"
                @click="login"
                no-caps
                size="lg"
              />
            </div>

            <!-- Efectos luminosos -->
            <div class="glow-effects">
              <div class="glow-orb glow-1"></div>
              <div class="glow-orb glow-2"></div>
              <div class="glow-orb glow-3"></div>
              <div class="glow-orb glow-4"></div>
            </div>
          </div>

          <!-- Simulación del dispositivo -->
          <div class="device-simulation">
            <div class="device-glow"></div>
            <div class="device-reflection"></div>
          </div>
        </div>

        <!-- Enlaces flotantes -->
        <div class="floating-links">
          <a href="#" class="floating-link">¿Olvidaste tu contraseña?</a>
          <span class="divider">•</span>
          <a href="#" class="floating-link">Crear cuenta</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { postData } from '../services/apiClient'
import { useAuth } from '../store/useAuth'

const store = useAuth()
const router = useRouter()
const $q = useQuasar()

const email = ref('')
const password = ref('')
const loading = ref(false)
const isPwd = ref(true)
const errorMessage = ref('')

const emailRules = [
  val => !!val || 'Este campo es obligatorio',
  val => /.+@.+\..+/.test(val) || 'Ingrese un correo válido'
]

// Generar estilos aleatorios para partículas
const getParticleStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 15 + 's',
    animationDuration: (Math.random() * 8 + 12) + 's'
  }
}

const toggleDarkMode = () => {
  $q.dark.toggle()
  localStorage.setItem('darkMode', $q.dark.isActive)
  
  $q.notify({
    message: $q.dark.isActive ? 'Modo oscuro activado' : 'Modo claro activado',
    color: $q.dark.isActive ? 'dark' : 'blue-6',
    position: 'top-right',
    timeout: 1500,
    icon: $q.dark.isActive ? 'dark_mode' : 'light_mode',
    actions: [{ icon: 'close', color: 'white' }]
  })
}

const login = async () => {
  loading.value = true
  errorMessage.value = ''
  
  const data = {
    username: email.value,
    password: password.value,
    grant_type: 'password',
    client_id: '9e2e167b-d588-44ee-b5e0-f1244880aed6',
    client_secret: 'wlLUQU1FzTQvUp7KUndhj3I8L1ydlNxVjFtMuNRQ'
  }
  
  try {
    console.log('🔐 Iniciando login...')
    const response = await postData('/oauth/token', data)
    
    if (response.access_token && response.refresh_token) {
      console.log('✅ Login exitoso, guardando tokens...')
      store.set_Token_RefreshToken(response.access_token, response.refresh_token)
      store.setUserName(email.value)
      
      $q.notify({
        message: 'Acceso autorizado',
        color: 'positive',
        position: 'center',
        timeout: 2000,
        icon: 'check_circle'
      })
      
      console.log('🔄 Redirigiendo a /app/home...')
      router.replace('/app/home')
    } else {
      console.log('❌ Login fallido: No se recibieron tokens')
      errorMessage.value = 'Credenciales incorrectas'
    }
  } catch (error) {
    console.error('❌ Error en login:', error)
    errorMessage.value = 'Credenciales incorrectas'
  }
  
  loading.value = false
}

onMounted(() => {
  if (localStorage.getItem('darkMode')) {
    const isDark = localStorage.getItem('darkMode') === 'true'
    $q.dark.set(isDark)
  } else {
    $q.dark.set(false)
    localStorage.setItem('darkMode', 'false')
  }
})
</script>

<style scoped>
/* ===== LAYOUT PRINCIPAL ===== */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 30%, #3b82f6 70%, #60a5fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

.login-page--dark {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%);
}

/* ===== PARTÍCULAS ANIMADAS ===== */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  width: 2px;
  height: 2px;
  animation: float linear infinite;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

@keyframes float {
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

/* ===== BOTÓN DE TEMA ===== */
.theme-toggle {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 100;
}

.theme-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* ===== CONTENEDOR TIPO LAPTOP ===== */
.laptop-container {
  display: flex;
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  min-height: 600px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 10;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

/* ===== PANEL DE BIENVENIDA (IZQUIERDO) ===== */
.welcome-panel {
  flex: 1;
  background: #6b7280;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 2rem;
  position: relative;
}

.login-page--dark .welcome-panel {
  background: #374151;
}

.welcome-content {
  text-align: center;
  z-index: 2;
  position: relative;
}

/* ===== LOGO FACTUS ===== */
.logo-container {
  margin-bottom: 3rem;
}

.logo-circle {
  width: 280px;
  height: 200px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.logo {
  width: 220px;
  height: 140px;
  object-fit: contain;
  z-index: 1;
  position: relative;
}

/* ===== TEXTO DE BIENVENIDA ===== */
.welcome-text {
  color: white;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

/* ===== PANEL TECNOLÓGICO (DERECHO) ===== */
.tech-panel {
  flex: 1;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-page--dark .tech-panel {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
}

/* ===== FONDO TECNOLÓGICO ===== */
.tech-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.tech-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 50%);
}

.tech-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.circuit-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circuit-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  height: 1px;
}

.line-1 {
  top: 30%;
  left: 0;
  width: 100%;
  animation: pulse 3s ease-in-out infinite;
}

.line-2 {
  top: 50%;
  left: 0;
  width: 70%;
  animation: pulse 3s ease-in-out infinite 1s;
}

.line-3 {
  top: 70%;
  right: 0;
  width: 60%;
  animation: pulse 3s ease-in-out infinite 2s;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* ===== CONTENEDOR DEL FORMULARIO FLOTANTE ===== */
.floating-form-container {
  position: relative;
  z-index: 10;
  margin-bottom: 2rem;
}

.floating-login-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  min-width: 380px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  position: relative;
  transform: perspective(1000px) rotateX(5deg);
  animation: float-in 1s ease-out;
}

@keyframes float-in {
  0% {
    opacity: 0;
    transform: perspective(1000px) rotateX(15deg) translateY(50px);
  }
  100% {
    opacity: 1;
    transform: perspective(1000px) rotateX(5deg) translateY(0);
  }
}

/* ===== EFECTOS DE CRISTAL ===== */
.glass-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  pointer-events: none;
}

.glass-reflection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  border-radius: 16px 16px 0 0;
}

.tech-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.3), transparent, rgba(255, 255, 255, 0.3));
  padding: 1px;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

/* ===== CONTENIDO DEL FORMULARIO ===== */
.login-form-content {
  position: relative;
  z-index: 2;
}

.input-group {
  margin-bottom: 1.5rem;
}

.floating-input :deep(.q-field__control) {
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.floating-input :deep(.q-field__control):hover {
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.floating-input :deep(.q-field--focused .q-field__control) {
  border-color: #3b82f6;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

/* ===== MENSAJE DE ERROR ===== */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  backdrop-filter: blur(10px);
}

/* ===== BOTÓN FLOTANTE ===== */
.floating-login-btn {
  width: 100%;
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.floating-login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.floating-login-btn:hover::before {
  left: 100%;
}

.floating-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
}

/* ===== EFECTOS LUMINOSOS ===== */
.glow-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: 16px;
  overflow: hidden;
}

.glow-orb {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 10px #3b82f6;
  animation: glow-pulse 3s ease-in-out infinite;
}

.glow-1 {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.glow-2 {
  top: 25%;
  right: 15%;
  animation-delay: 1s;
}

.glow-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: 2s;
}

.glow-4 {
  bottom: 15%;
  right: 10%;
  animation-delay: 1.5s;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

/* ===== SIMULACIÓN DEL DISPOSITIVO ===== */
.device-simulation {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 15px;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 197, 253, 0.5));
  border-radius: 10px;
  filter: blur(3px);
  opacity: 0.7;
}

.device-glow {
  position: absolute;
  top: -10px;
  left: -20px;
  width: calc(100% + 40px);
  height: calc(100% + 20px);
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  border-radius: 20px;
  animation: device-pulse 2s ease-in-out infinite;
}

@keyframes device-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.device-reflection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 10px;
  animation: reflection-move 3s ease-in-out infinite;
}

@keyframes reflection-move {
  0%, 100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}

/* ===== ENLACES FLOTANTES ===== */
.floating-links {
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 10;
  position: relative;
}

.floating-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.floating-link:hover {
  color: #93c5fd;
  text-shadow: 0 0 15px rgba(147, 197, 253, 0.5);
}

.divider {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .welcome-panel {
    display: none;
  }
  
  .tech-panel {
    flex: none;
    width: 100%;
  }
  
  .laptop-container {
    width: 95%;
    height: auto;
    min-height: auto;
    margin: 2rem 0;
  }
}

@media (max-width: 768px) {
  .floating-login-panel {
    min-width: 350px;
    padding: 1.5rem 2rem;
    margin: 0 1rem;
  }
  
  .theme-toggle {
    top: 1rem;
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .floating-login-panel {
    min-width: 300px;
    padding: 1.5rem 1.5rem;
  }
  
  .floating-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .divider {
    display: none;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
}

/* ===== ANIMACIONES ADICIONALES ===== */
.floating-login-panel:hover {
  transform: perspective(1000px) rotateX(2deg) translateY(-5px);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translate3d(-100px, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.welcome-panel {
  animation: slideInLeft 0.8s ease-out;
}

.tech-panel {
  animation: slideInLeft 0.8s ease-out 0.2s both;
}
</style>