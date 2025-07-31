<template>
  <div class="modern-settings-container" :class="{ 'container-dark': $q.dark.isActive }">
    <!-- Partículas de fondo -->
    <div class="background-particles">
      <div class="particle" v-for="n in 15" :key="n" :style="getParticleStyle()"></div>
    </div>

    <!-- Header Glassmorphism -->
    <div class="modern-header-section">
      <div class="header-content">
        <div class="header-info">
          <div class="page-icon">
            <q-icon name="settings" size="2rem" />
          </div>
          <div>
            <h4 class="page-title">Configuración del Sistema</h4>
            <div class="page-subtitle">Administra la configuración general del sistema</div>
          </div>
        </div>

        <div class="header-buttons">
          <q-btn 
            label="Restaurar" 
            icon="restore" 
            @click="restoreDefaults"
            class="modern-secondary-btn"
            no-caps
          >
            <div class="btn-glow"></div>
          </q-btn>

          <q-btn 
            label="Guardar Todo" 
            icon="save" 
            @click="saveAllSettings" 
            class="modern-create-btn"
            no-caps
            :loading="loading"
          >
            <div class="btn-glow"></div>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Navegación Moderna -->
    <div class="modern-navigation-card">
      <q-tabs 
        v-model="activeTab" 
        dense 
        :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'" 
        active-color="white"
        indicator-color="transparent"
        align="justify" 
        narrow-indicator
        class="modern-tabs"
      >
        <q-tab name="company" icon="business" label="Empresa" class="modern-tab" />
        <q-tab name="factus" icon="receipt_long" label="Factus" class="modern-tab" />
        <q-tab name="user" icon="person" label="Usuario" class="modern-tab" />
        <q-tab name="system" icon="settings" label="Sistema" class="modern-tab" />
        <q-tab name="backup" icon="backup" label="Respaldos" class="modern-tab" />
        <q-tab name="logs" icon="description" label="Logs" class="modern-tab" />
      </q-tabs>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-section">
      <div class="loading-card">
        <q-spinner-dots size="50px" color="primary" />
        <div class="loading-text">Guardando configuración...</div>
      </div>
    </div>

    <!-- Contenido de los Tabs -->
    <q-tab-panels v-else v-model="activeTab" animated class="modern-tab-panels">

      <!-- ===== CONFIGURACIÓN DE EMPRESA ===== -->
      <q-tab-panel name="company" class="modern-tab-panel">
        <div class="modern-content-card">
          <div class="content-header">
            <div class="content-icon">
              <q-icon name="business" />
            </div>
            <div class="content-title">
              <h5>Información de la Empresa</h5>
              <p>Configura los datos principales de tu empresa</p>
            </div>
          </div>

          <div class="content-body">
            <div class="form-grid">
              <div class="form-group">
                <q-input 
                  v-model="companySettings.name" 
                  label="Nombre de la Empresa *" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>
              
              <div class="form-group">
                <q-input 
                  v-model="companySettings.nit" 
                  label="NIT *" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>

              <div class="form-group">
                <q-input 
                  v-model="companySettings.email" 
                  label="Email Corporativo" 
                  type="email" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>

              <div class="form-group">
                <q-input 
                  v-model="companySettings.phone" 
                  label="Teléfono" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>

              <div class="form-group full-width">
                <q-input 
                  v-model="companySettings.address" 
                  label="Dirección" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>

              <div class="form-group">
                <q-input 
                  v-model="companySettings.city" 
                  label="Ciudad" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>

              <div class="form-group">
                <q-input 
                  v-model="companySettings.website" 
                  label="Sitio Web" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>
            </div>

            <div class="logo-section">
              <div class="section-title">Logo de la Empresa</div>
              <div class="logo-upload-area">
                <div class="logo-preview">
                  <img v-if="companySettings.logo" :src="companySettings.logo" alt="Logo" class="company-logo" />
                  <div v-else class="logo-placeholder">
                    <q-icon name="image" size="2rem" />
                    <div>Sin logo</div>
                  </div>
                </div>
                <div class="logo-actions">
                  <q-btn 
                    icon="upload" 
                    label="Subir Logo" 
                    @click="uploadLogo" 
                    class="upload-btn"
                    flat 
                  />
                  <q-btn 
                    icon="delete" 
                    label="Eliminar" 
                    @click="removeLogo" 
                    flat 
                    v-if="companySettings.logo" 
                    class="delete-btn"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="content-footer">
            <q-btn 
              label="Guardar Empresa" 
              icon="save" 
              @click="saveCompanySettings"
              :loading="loadingCompany"
              class="modern-save-btn"
            />
          </div>
        </div>
      </q-tab-panel>

      <!-- ===== CONFIGURACIÓN DE FACTUS ===== -->
      <q-tab-panel name="factus" class="modern-tab-panel">
        <!-- Estado de Conexión -->
        <div class="modern-content-card">
          <div class="content-header">
            <div class="content-icon">
              <q-icon name="wifi" />
            </div>
            <div class="content-title">
              <h5>Estado de Conexión</h5>
              <p>Verifica la conexión con los servicios de Factus</p>
            </div>
            <div class="status-badge-container">
              <q-chip 
                :color="factusSettings.connected ? 'positive' : 'negative'"
                :label="factusSettings.connected ? 'Conectado' : 'Desconectado'" 
                :icon="factusSettings.connected ? 'check_circle' : 'error'"
                class="status-chip"
                text-color="white"
              />
            </div>
          </div>

          <div class="content-body">
            <div class="connection-details">
              <div class="detail-item">
                <div class="detail-label">Última sincronización:</div>
                <div class="detail-value">{{ factusSettings.lastSync || 'Nunca' }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Token válido hasta:</div>
                <div class="detail-value">{{ factusSettings.tokenExpiry || 'No disponible' }}</div>
              </div>
            </div>

            <div class="action-buttons">
              <q-btn 
                label="Probar Conexión" 
                icon="sync" 
                @click="testFactusConnection"
                :loading="testingConnection"
                class="test-btn"
              />
              <q-btn 
                label="Renovar Token" 
                icon="refresh" 
                @click="renewFactusToken"
                :loading="renewingToken"
                class="renew-btn"
              />
            </div>
          </div>
        </div>
      </q-tab-panel>

      <!-- ===== CONFIGURACIÓN DE USUARIO ===== -->
      <q-tab-panel name="user" class="modern-tab-panel">
        <div class="modern-content-card">
          <div class="content-header">
            <div class="content-icon">
              <q-icon name="person" />
            </div>
            <div class="content-title">
              <h5>Información Personal</h5>
              <p>Actualiza tus datos personales y preferencias</p>
            </div>
          </div>

          <div class="content-body">
            <div class="form-grid">
              <div class="form-group">
                <q-input 
                  v-model="userSettings.name" 
                  label="Nombre Completo" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>

              <div class="form-group">
                <q-input 
                  v-model="userSettings.email" 
                  label="Email" 
                  type="email" 
                  outlined 
                  dense 
                  readonly
                  class="modern-field"
                />
              </div>

              <div class="form-group">
                <q-input 
                  v-model="userSettings.phone" 
                  label="Teléfono" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>

              <div class="form-group">
                <q-input 
                  v-model="userSettings.position" 
                  label="Cargo" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>
            </div>

            <!-- Cambiar Contraseña -->
            <div class="password-section">
              <div class="section-title">Cambiar Contraseña</div>
              <div class="form-grid">
                <div class="form-group">
                  <q-input 
                    v-model="passwordChange.current" 
                    label="Contraseña Actual" 
                    type="password" 
                    outlined 
                    dense
                    class="modern-field"
                  />
                </div>

                <div class="form-group">
                  <q-input 
                    v-model="passwordChange.new" 
                    label="Nueva Contraseña" 
                    type="password" 
                    outlined 
                    dense
                    class="modern-field"
                  />
                </div>

                <div class="form-group">
                  <q-input 
                    v-model="passwordChange.confirm" 
                    label="Confirmar Contraseña" 
                    type="password" 
                    outlined 
                    dense
                    class="modern-field"
                  />
                </div>
              </div>

              <q-btn 
                label="Cambiar Contraseña" 
                icon="lock" 
                @click="changePassword"
                :loading="changingPassword" 
                :disable="!canChangePassword"
                class="password-btn"
              />
            </div>

            <!-- Preferencias -->
            <div class="preferences-section">
              <div class="section-title">Preferencias</div>
              <div class="form-grid">
                <div class="form-group">
                  <q-select 
                    v-model="userSettings.theme" 
                    :options="themeOptions" 
                    label="Tema" 
                    outlined 
                    dense 
                    emit-value 
                    map-options
                    class="modern-field"
                  />
                </div>

                <div class="form-group">
                  <q-select 
                    v-model="userSettings.language" 
                    :options="languageOptions" 
                    label="Idioma" 
                    outlined 
                    dense 
                    emit-value 
                    map-options
                    class="modern-field"
                  />
                </div>

                <div class="form-group">
                  <div class="toggle-field">
                    <q-toggle 
                      v-model="userSettings.notifications" 
                      label="Notificaciones" 
                      color="primary"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <div class="toggle-field">
                    <q-toggle 
                      v-model="userSettings.emailNotifications" 
                      label="Notificaciones por Email" 
                      color="primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-footer">
            <q-btn 
              label="Guardar Usuario" 
              icon="save" 
              @click="saveUserSettings"
              :loading="loadingUser"
              class="modern-save-btn"
            />
          </div>
        </div>
      </q-tab-panel>

      <!-- ===== CONFIGURACIÓN DEL SISTEMA ===== -->
      <q-tab-panel name="system" class="modern-tab-panel">
        <!-- Información del Sistema -->
        <div class="modern-content-card">
          <div class="content-header">
            <div class="content-icon">
              <q-icon name="info" />
            </div>
            <div class="content-title">
              <h5>Información del Sistema</h5>
              <p>Detalles técnicos de la aplicación</p>
            </div>
          </div>

          <div class="content-body">
            <div class="system-info-grid">
              <div class="info-card">
                <div class="info-icon">
                  <q-icon name="code" />
                </div>
                <div class="info-content">
                  <div class="info-label">Versión</div>
                  <div class="info-value">{{ systemInfo.version }}</div>
                </div>
              </div>

              <div class="info-card">
                <div class="info-icon">
                  <q-icon name="update" />
                </div>
                <div class="info-content">
                  <div class="info-label">Última actualización</div>
                  <div class="info-value">{{ systemInfo.lastUpdate }}</div>
                </div>
              </div>

              <div class="info-card">
                <div class="info-icon">
                  <q-icon name="storage" />
                </div>
                <div class="info-content">
                  <div class="info-label">Base de datos</div>
                  <div class="info-value">{{ systemInfo.database }}</div>
                </div>
              </div>

              <div class="info-card">
                <div class="info-icon">
                  <q-icon name="folder" />
                </div>
                <div class="info-content">
                  <div class="info-label">Espacio usado</div>
                  <div class="info-value">{{ systemInfo.diskUsage }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuración General -->
        <div class="modern-content-card">
          <div class="content-header">
            <div class="content-icon">
              <q-icon name="tune" />
            </div>
            <div class="content-title">
              <h5>Configuración General</h5>
              <p>Ajustes del comportamiento del sistema</p>
            </div>
          </div>

          <div class="content-body">
            <div class="form-grid">
              <div class="form-group">
                <q-input 
                  v-model.number="systemSettings.sessionTimeout" 
                  label="Tiempo de Sesión (minutos)"
                  type="number" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>

              <div class="form-group">
                <q-input 
                  v-model.number="systemSettings.maxFileSize" 
                  label="Tamaño Máximo de Archivo (MB)"
                  type="number" 
                  outlined 
                  dense
                  class="modern-field"
                />
              </div>

              <div class="form-group">
                <div class="toggle-field">
                  <q-toggle 
                    v-model="systemSettings.maintenanceMode" 
                    label="Modo Mantenimiento" 
                    color="warning"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="toggle-field">
                  <q-toggle 
                    v-model="systemSettings.debugMode" 
                    label="Modo Debug" 
                    color="info"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="toggle-field">
                  <q-toggle 
                    v-model="systemSettings.autoBackup" 
                    label="Respaldo Automático" 
                    color="positive"
                  />
                </div>
              </div>

              <div class="form-group">
                <q-select 
                  v-model="systemSettings.backupFrequency" 
                  :options="backupFrequencyOptions"
                  label="Frecuencia de Respaldo" 
                  outlined 
                  dense 
                  emit-value 
                  map-options
                  class="modern-field"
                />
              </div>
            </div>
          </div>

          <div class="content-footer">
            <q-btn 
              label="Guardar Sistema" 
              icon="save" 
              @click="saveSystemSettings"
              :loading="loadingSystem"
              class="modern-save-btn"
            />
          </div>
        </div>
      </q-tab-panel>

      <!-- ===== RESPALDOS ===== -->
      <q-tab-panel name="backup" class="modern-tab-panel">
        <!-- Crear Respaldo -->
        <div class="modern-content-card">
          <div class="content-header">
            <div class="content-icon">
              <q-icon name="backup" />
            </div>
            <div class="content-title">
              <h5>Gestión de Respaldos</h5>
              <p>Crea y administra copias de seguridad</p>
            </div>
          </div>

          <div class="content-body">
            <div class="backup-actions">
              <q-btn 
                label="Crear Respaldo Ahora" 
                icon="add" 
                @click="createBackup"
                :loading="creatingBackup"
                class="create-backup-btn"
              />
              <q-btn 
                label="Restaurar desde Archivo" 
                icon="restore" 
                @click="restoreBackup"
                class="restore-backup-btn"
              />
            </div>
          </div>
        </div>

        <!-- Historial de Respaldos -->
        <div class="modern-content-card">
          <div class="content-header">
            <div class="content-icon">
              <q-icon name="history" />
            </div>
            <div class="content-title">
              <h5>Historial de Respaldos</h5>
              <p>Lista de todas las copias de seguridad</p>
            </div>
          </div>

          <div class="content-body">
            <div class="modern-table-container">
              <q-table 
                :rows="backupHistory" 
                :columns="backupColumns" 
                row-key="id" 
                flat
                :rows-per-page-options="[10, 25, 50]" 
                :pagination="{ rowsPerPage: 10 }"
                class="modern-table"
                :class="{ 'table-dark': $q.dark.isActive }"
              >
                <template v-slot:header="props">
                  <q-tr :props="props" class="modern-table-header">
                    <q-th v-for="col in props.cols" :key="col.name" :props="props" class="header-cell">
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>

                <template v-slot:body-cell-size="props">
                  <q-td :props="props">
                    <span class="size-text">{{ formatFileSize(props.row.size) }}</span>
                  </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <div class="table-actions">
                      <q-btn 
                        icon="cloud_download" 
                        flat 
                        round 
                        dense 
                        @click="downloadBackup(props.row)"
                        class="action-btn download-btn"
                      >
                        <q-tooltip>Descargar</q-tooltip>
                      </q-btn>
                      <q-btn 
                        icon="restore" 
                        flat 
                        round 
                        dense 
                        @click="restoreSpecificBackup(props.row)"
                        class="action-btn restore-btn"
                      >
                        <q-tooltip>Restaurar</q-tooltip>
                      </q-btn>
                      <q-btn 
                        icon="delete" 
                        flat 
                        round 
                        dense 
                        @click="deleteBackup(props.row)"
                        class="action-btn delete-btn"
                      >
                        <q-tooltip>Eliminar</q-tooltip>
                      </q-btn>
                    </div>
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>
        </div>
      </q-tab-panel>

      <!-- ===== LOGS DEL SISTEMA ===== -->
      <q-tab-panel name="logs" class="modern-tab-panel">
        <!-- Filtros de Logs -->
        <div class="modern-content-card">
          <div class="content-header">
            <div class="content-icon">
              <q-icon name="filter_list" />
            </div>
            <div class="content-title">
              <h5>Filtros de Logs</h5>
              <p>Filtra y busca en los registros del sistema</p>
            </div>
          </div>

          <div class="content-body">
            <div class="filters-grid">
              <div class="filter-group">
                <q-select
                  v-model="logFilters.level" 
                  :options="logLevelOptions" 
                  label="Nivel" 
                  outlined 
                  dense
                  clearable
                  class="modern-field"
                />
              </div>

              <div class="filter-group">
                <q-input 
                  v-model="logFilters.search" 
                  label="Buscar" 
                  outlined 
                  dense 
                  clearable
                  class="modern-field"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="filter-group">
                <q-btn 
                  label="Limpiar Logs" 
                  icon="clear_all" 
                  @click="clearLogs"
                  class="clear-logs-btn"
                />
              </div>

              <div class="filter-group">
                <q-btn 
                  label="Exportar" 
                  icon="file_download" 
                  @click="exportLogs"
                  class="export-logs-btn"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Visualizador de Logs -->
        <div class="modern-content-card">
          <div class="content-header">
            <div class="content-icon">
              <q-icon name="description" />
            </div>
            <div class="content-title">
              <h5>Logs del Sistema</h5>
              <p>Registros de actividad y errores</p>
            </div>
          </div>

          <div class="content-body">
            <div class="logs-viewer">
              <div v-for="log in filteredLogs" :key="log.id" class="log-entry" :class="`log-${log.level}`">
                <div class="log-header">
                  <span class="log-timestamp">{{ log.timestamp }}</span>
                  <q-chip 
                    :color="getLogColor(log.level)" 
                    :label="log.level.toUpperCase()" 
                    size="sm"
                    class="log-level-chip"
                  />
                </div>
                <div class="log-message">{{ log.message }}</div>
                <div v-if="log.details" class="log-details">
                  <pre>{{ log.details }}</pre>
                </div>
              </div>

              <div v-if="filteredLogs.length === 0" class="no-logs">
                <div class="no-logs-icon">
                  <q-icon name="info" size="2rem" />
                </div>
                <div class="no-logs-text">No hay logs disponibles con los filtros aplicados</div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>

    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Notify, useQuasar } from 'quasar'
import dayjs from 'dayjs'
import { useAuth } from '../store/useAuth'
import apiCliente from '../plugins/apiFactusClient'

const $q = useQuasar();

// Variables reactivas de estado
const darkMode = ref(false);
const activeTab = ref('company')
const loading = ref(false)
const loadingCompany = ref(false)
const loadingFactus = ref(false)
const loadingUser = ref(false)
const loadingSystem = ref(false)
const testingConnection = ref(false)
const renewingToken = ref(false)
const creatingBackup = ref(false)
const changingPassword = ref(false)

// Funciones para efectos visuales
const getParticleStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 15 + 's',
    animationDuration: (Math.random() * 8 + 12) + 's'
  }
}

// Configuración de la empresa
const companySettings = ref({
  name: 'Mi Empresa SAS',
  nit: '900123456-1',
  email: 'info@miempresa.com',
  phone: '+57 1 234 5678',
  address: 'Calle 123 # 45-67',
  city: 'Bogotá',
  website: 'https://www.miempresa.com',
  logo: '/logo.png'
})

// Configuración de Factus
const factusSettings = ref({
  connected: true,
  lastSync: dayjs().format('DD/MM/YYYY HH:mm'),
  tokenExpiry: dayjs().add(30, 'day').format('DD/MM/YYYY'),
  apiUrl: 'https://api.factus.com.co',
  clientId: '9e2e167b-d588-44ee-b5e0-f1244880aed6',
  clientSecret: '••••••••••••••••••••••••••••••••••••••••',
  autoSync: true,
  autoEmail: false,
  defaultPaymentMethod: '10',
  defaultTaxRate: 19
})

// Configuración de usuario
const userSettings = ref({
  name: 'SAM_DEV',
  email: 'sandbox@factus.com.co',
  phone: '+57 300 123 4567',
  position: 'Administrador',
  theme: 'light',
  language: 'es',
  notifications: true,
  emailNotifications: true
})

const passwordChange = ref({
  current: '',
  new: '',
  confirm: ''
})

const themeOptions = [
  { value: 'light', label: '☀️ Claro' },
  { value: 'dark', label: '🌙 Oscuro' },
  { value: 'auto', label: '🔄 Automático (sistema)' }
]

const languageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' }
]

// Configuración del sistema
const systemSettings = ref({
  sessionTimeout: 30,
  maxFileSize: 10,
  maintenanceMode: false,
  debugMode: false,
  autoBackup: true,
  backupFrequency: 'daily'
})

const systemInfo = ref({
  version: '2.1.0',
  lastUpdate: '15/12/2024',
  database: 'MongoDB 7.0',
  diskUsage: '2.5 GB'
})

const backupFrequencyOptions = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' }
]

// Respaldos
const backupHistory = ref([
  {
    id: 1,
    name: 'backup_2024_12_15_14_30.zip',
    date: '15/12/2024 14:30',
    size: 2500000,
    type: 'Automático'
  },
  {
    id: 2,
    name: 'backup_2024_12_14_14_30.zip',
    date: '14/12/2024 14:30',
    size: 2450000,
    type: 'Automático'
  },
  {
    id: 3,
    name: 'backup_manual_2024_12_13.zip',
    date: '13/12/2024 09:15',
    size: 2480000,
    type: 'Manual'
  }
])

const backupColumns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
  { name: 'date', label: 'Fecha', field: 'date', align: 'center' },
  { name: 'size', label: 'Tamaño', field: 'size', align: 'center' },
  { name: 'type', label: 'Tipo', field: 'type', align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

// Logs
const logFilters = ref({
  level: null,
  search: ''
})

const logLevelOptions = [
  { value: 'error', label: 'Error' },
  { value: 'warning', label: 'Advertencia' },
  { value: 'info', label: 'Información' },
  { value: 'debug', label: 'Debug' }
]

const systemLogs = ref([
  {
    id: 1,
    timestamp: '15/12/2024 14:30:25',
    level: 'info',
    message: 'Usuario SAM_DEV inició sesión exitosamente',
    details: null
  },
  {
    id: 2,
    timestamp: '15/12/2024 14:25:10',
    level: 'warning',
    message: 'Intento de conexión fallido con Factus API',
    details: 'Connection timeout after 30 seconds'
  },
  {
    id: 3,
    timestamp: '15/12/2024 14:20:05',
    level: 'error',
    message: 'Error al procesar factura #1234',
    details: 'Error: Product validation failed\n  at validateProduct (product.js:45)\n  at processInvoice (invoice.js:120)'
  },
  {
    id: 4,
    timestamp: '15/12/2024 14:15:30',
    level: 'info',
    message: 'Respaldo automático completado exitosamente',
    details: null
  }
])

// Computed
const canChangePassword = computed(() => {
  return passwordChange.value.current &&
    passwordChange.value.new &&
    passwordChange.value.confirm &&
    passwordChange.value.new === passwordChange.value.confirm &&
    passwordChange.value.new.length >= 6
})

const filteredLogs = computed(() => {
  let logs = systemLogs.value

  if (logFilters.value.level) {
    logs = logs.filter(log => log.level === logFilters.value.level)
  }

  if (logFilters.value.search) {
    const search = logFilters.value.search.toLowerCase()
    logs = logs.filter(log =>
      log.message.toLowerCase().includes(search) ||
      (log.details && log.details.toLowerCase().includes(search))
    )
  }

  return logs
})

// Métodos de inicialización
const initializeDarkMode = () => {
  try {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      darkMode.value = savedDarkMode === 'true';
    } else {
      darkMode.value = false;
      localStorage.setItem('darkMode', 'false');
    }
    $q.dark.set(darkMode.value);
  } catch (error) {
    console.error('Error inicializando modo oscuro:', error);
    darkMode.value = false;
    $q.dark.set(false);
  }
};

const handleStorageChange = (e) => {
  if (e.key === 'darkMode') {
    const newValue = e.newValue === 'true';
    if (darkMode.value !== newValue) {
      darkMode.value = newValue;
    }
  }
};

// Watchers
watch(() => darkMode.value, (newValue) => {
  localStorage.setItem('darkMode', newValue.toString());
  $q.dark.set(newValue);
});

watch(() => userSettings.value.theme, (newTheme) => {
  if (newTheme === 'auto') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    darkMode.value = systemPrefersDark;
  } else {
    darkMode.value = newTheme === 'dark';
  }
});

// Métodos de guardado
const saveAllSettings = async () => {
  loading.value = true
  try {
    await Promise.all([
      saveCompanySettings(),
      saveFactusSettings(),
      saveUserSettings(),
      saveSystemSettings()
    ])
    Notify.create({
      type: 'positive',
      message: '✅ Toda la configuración se guardó exitosamente',
      position: 'top-right'
    })
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: '❌ Error al guardar la configuración',
      position: 'top-right'
    })
  } finally {
    loading.value = false
  }
}

const restoreDefaults = () => {
  Notify.create({
    type: 'info',
    message: '🔄 Función de restaurar valores por defecto en desarrollo',
    position: 'top-right'
  })
}

const saveCompanySettings = async () => {
  loadingCompany.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    Notify.create({
      type: 'positive',
      message: '✅ Configuración de empresa guardada',
      position: 'top-right'
    })
  } finally {
    loadingCompany.value = false
  }
}

const saveFactusSettings = async () => {
  loadingFactus.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    Notify.create({
      type: 'positive',
      message: '✅ Configuración de Factus guardada',
      position: 'top-right'
    })
  } finally {
    loadingFactus.value = false
  }
}

const saveUserSettings = async () => {
  loadingUser.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (userSettings.value.theme === 'auto') {
      localStorage.removeItem('darkMode-manual')
      localStorage.removeItem('darkMode')
    } else {
      localStorage.setItem('darkMode', userSettings.value.theme === 'dark')
      localStorage.setItem('darkMode-manual', 'true')
    }

    Notify.create({
      type: 'positive',
      message: '✅ Configuración de usuario guardada',
      position: 'top-right'
    })
  } finally {
    loadingUser.value = false
  }
}

const saveSystemSettings = async () => {
  loadingSystem.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    Notify.create({
      type: 'positive',
      message: '✅ Configuración del sistema guardada',
      position: 'top-right'
    })
  } finally {
    loadingSystem.value = false
  }
}

const renewFactusToken = async () => {
  renewingToken.value = true
  try {
    const authStore = useAuth();
    const refreshToken = authStore.refreshToken;

    if (!refreshToken) {
      Notify.create({
        type: 'negative',
        message: '❌ No hay refresh token disponible. Inicia sesión nuevamente.',
        position: 'top-right'
      });
      return;
    }

    const response = await apiCliente.post('/oauth/token', { 
      grant_type: "refresh_token",
      client_id: "9e2e167b-d588-44ee-b5e0-f1244880aed6",
      client_secret: "wlLUQU1FzTQvUp7KUndhj3I8L1ydlNxVjFtMuNRQ",
      refresh_token: refreshToken
    });

    if (response.data.access_token && response.data.refresh_token) {
      authStore.set_Token_RefreshToken(
        response.data.access_token,
        response.data.refresh_token
      );

      const expiresIn = response.data.expires_in || 3600;
      factusSettings.value.tokenExpiry = new Date(
        Date.now() + (expiresIn * 1000)
      ).toLocaleDateString('es-CO');

      factusSettings.value.lastSync = new Date().toLocaleDateString('es-CO');
      factusSettings.value.connected = true;

      Notify.create({
        type: 'positive',
        message: '✅ Token renovado exitosamente',
        position: 'top-right'
      });
    }

  } catch (error) {
    console.error('❌ Error renovando token:', error);
    factusSettings.value.connected = false;
    Notify.create({
      type: 'negative',
      message: '❌ Error renovando token',
      position: 'top-right'
    });
  } finally {
    renewingToken.value = false;
  }
}

const testFactusConnection = async () => {
  testingConnection.value = true
  try {
    const response = await apiCliente.get('/auth/verify');

    if (response.data.valid) {
      factusSettings.value.connected = true;
      factusSettings.value.lastSync = new Date().toLocaleDateString('es-CO');

      Notify.create({
        type: 'positive',
        message: '✅ Conexión exitosa con Factus',
        position: 'top-right'
      });
    }
  } catch (error) {
    factusSettings.value.connected = false;
    Notify.create({
      type: 'negative',
      message: '❌ Error de conexión',
      position: 'top-right'
    });
  } finally {
    testingConnection.value = false;
  }
}

const changePassword = async () => {
  changingPassword.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    passwordChange.value = { current: '', new: '', confirm: '' }
    Notify.create({
      type: 'positive',
      message: '✅ Contraseña cambiada exitosamente',
      position: 'top-right'
    })
  } finally {
    changingPassword.value = false
  }
}

const uploadLogo = () => {
  Notify.create({
    type: 'info',
    message: '📤 Función de carga de logo en desarrollo',
    position: 'top-right'
  })
}

const removeLogo = () => {
  companySettings.value.logo = null
  Notify.create({
    type: 'positive',
    message: '🗑️ Logo eliminado',
    position: 'top-right'
  })
}

const createBackup = async () => {
  creatingBackup.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 3000))
    const newBackup = {
      id: backupHistory.value.length + 1,
      name: `backup_manual_${dayjs().format('YYYY_MM_DD_HH_mm')}.zip`,
      date: dayjs().format('DD/MM/YYYY HH:mm'),
      size: 2500000 + Math.random() * 500000,
      type: 'Manual'
    }
    backupHistory.value.unshift(newBackup)
    Notify.create({
      type: 'positive',
      message: '✅ Respaldo creado exitosamente',
      position: 'top-right'
    })
  } finally {
    creatingBackup.value = false
  }
}

const restoreBackup = () => {
  Notify.create({
    type: 'warning',
    message: '⚠️ Función de restauración en desarrollo',
    position: 'top-right'
  })
}

const downloadBackup = (backup) => {
  Notify.create({
    type: 'info',
    message: `📥 Descargando ${backup.name}...`,
    position: 'top-right'
  })
}

const restoreSpecificBackup = (backup) => {
  Notify.create({
    type: 'warning',
    message: `🔄 Restaurar desde ${backup.name} - Función en desarrollo`,
    position: 'top-right'
  })
}

const deleteBackup = (backup) => {
  const index = backupHistory.value.findIndex(b => b.id === backup.id)
  if (index > -1) {
    backupHistory.value.splice(index, 1)
    Notify.create({
      type: 'positive',
      message: '🗑️ Respaldo eliminado',
      position: 'top-right'
    })
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getLogColor = (level) => {
  switch (level) {
    case 'error': return 'negative'
    case 'warning': return 'warning'
    case 'info': return 'info'
    case 'debug': return 'purple'
    default: return 'grey'
  }
}

const clearLogs = () => {
  systemLogs.value = []
  Notify.create({
    type: 'positive',
    message: '🧹 Logs limpiados',
    position: 'top-right'
  })
}

const exportLogs = () => {
  Notify.create({
    type: 'info',
    message: '📤 Exportando logs...',
    position: 'top-right'
  })
}

// Inicialización
onMounted(() => {
  console.log('🚀 Iniciando módulo de configuración...')
  initializeDarkMode();
  window.addEventListener('storage', handleStorageChange);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = (e) => {
    if (userSettings.value.theme === 'auto') {
      darkMode.value = e.matches;
    }
  };

  mediaQuery.addEventListener('change', handleSystemThemeChange);

  if (userSettings.value.theme === 'auto') {
    darkMode.value = mediaQuery.matches;
  }

  console.log('✅ Módulo de configuración inicializado')
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange);
});
</script>

<style scoped>
/* ===== TRANSICIONES GLOBALES ===== */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== CONTENEDOR PRINCIPAL ===== */
.modern-settings-container {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
}

.container-dark {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

/* ===== PARTÍCULAS DE FONDO ===== */
.background-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: linear-gradient(45deg, #8b5cf6, #a855f7);
  border-radius: 50%;
  opacity: 0.6;
  animation: particle-float linear infinite;
  box-shadow: 0 0 6px rgba(139, 92, 246, 0.3);
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
}

/* ===== HEADER MODERNO ===== */
.modern-header-section {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.container-dark .modern-header-section {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #1e293b, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.container-dark .page-title {
  background: linear-gradient(135deg, #f8fafc, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-top: 4px;
}

.container-dark .page-subtitle {
  color: #94a3b8;
}

.header-buttons {
  display: flex;
  gap: 12px;
}

.modern-secondary-btn {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  border-radius: 16px;
  padding: 12px 20px;
  font-weight: 600;
  text-transform: none;
  font-size: 0.9rem;
  box-shadow: 0 8px 25px rgba(107, 114, 128, 0.3);
  position: relative;
  overflow: hidden;
  border: none;
}

.modern-secondary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(107, 114, 128, 0.4);
}

.modern-create-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
  position: relative;
  overflow: hidden;
  border: none;
}

.modern-create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(139, 92, 246, 0.4);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.modern-create-btn:hover .btn-glow,
.modern-secondary-btn:hover .btn-glow {
  left: 100%;
}

/* ===== NAVEGACIÓN MODERNA ===== */
.modern-navigation-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 8px;
  margin-bottom: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.container-dark .modern-navigation-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.modern-tabs {
  border-radius: 16px;
  overflow: hidden;
}

.modern-tab {
  border-radius: 12px;
  margin: 4px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
}

.modern-tab.q-tab--active {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

/* ===== LOADING SECTION ===== */
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.container-dark .loading-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.loading-text {
  margin-top: 16px;
  font-weight: 600;
  color: #64748b;
}

.container-dark .loading-text {
  color: #94a3b8;
}

/* ===== TAB PANELS ===== */
.modern-tab-panels {
  position: relative;
  z-index: 1;
}

.modern-tab-panel {
  padding: 0;
}

/* ===== CONTENT CARDS ===== */
.modern-content-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  margin-bottom: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.container-dark .modern-content-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.content-header {
  padding: 32px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(124, 58, 237, 0.05));
}

.container-dark .content-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1));
}

.content-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.content-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.content-title h5 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #1e293b;
}

.container-dark .content-title h5 {
  color: #f8fafc;
}

.content-title p {
  color: #64748b;
  margin: 4px 0 0 0;
  font-size: 0.875rem;
}

.container-dark .content-title p {
  color: #94a3b8;
}

.content-body {
  padding: 32px;
}

.content-footer {
  padding: 24px 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(248, 250, 252, 0.5);
  display: flex;
  justify-content: flex-end;
}

.container-dark .content-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(15, 23, 42, 0.5);
}

/* ===== FORMULARIOS ===== */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.form-group {
  position: relative;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.modern-field :deep(.q-field__control) {
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  height: 48px;
  transition: all 0.3s ease;
}

.modern-field :deep(.q-field--focused .q-field__control) {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  background: rgba(139, 92, 246, 0.08);
}

.toggle-field {
  padding: 12px 16px;
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.toggle-field:hover {
  background: rgba(139, 92, 246, 0.08);
}

/* ===== SECCIONES ESPECÍFICAS ===== */
.section-title {
  font-weight: 600;
  margin-bottom: 16px;
  font-size: 1rem;
  color: #8b5cf6;
  border-bottom: 2px solid rgba(139, 92, 246, 0.2);
  padding-bottom: 8px;
}

.container-dark .section-title {
  color: #a855f7;
}

.logo-section,
.password-section,
.preferences-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.container-dark .logo-section,
.container-dark .password-section,
.container-dark .preferences-section {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* ===== LOGO UPLOAD ===== */
.logo-upload-area {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo-preview {
  width: 120px;
  height: 120px;
  border: 2px dashed rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.05);
  transition: all 0.3s ease;
}

.company-logo {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  border-radius: 8px;
}

.logo-placeholder {
  text-align: center;
  color: #8b5cf6;
}

.logo-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-btn {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 8px;
}

.upload-btn:hover {
  background: rgba(139, 92, 246, 0.2);
}

.delete-btn {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* ===== STATUS BADGES Y CHIPS ===== */
.status-badge-container {
  display: flex;
  align-items: center;
}

.status-chip {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 12px;
}

/* ===== CONNECTION DETAILS ===== */
.connection-details {
  background: rgba(139, 92, 246, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #64748b;
}

.container-dark .detail-label {
  color: #94a3b8;
}

.detail-value {
  font-weight: 600;
  color: #1e293b;
}

.container-dark .detail-value {
  color: #f8fafc;
}

/* ===== ACTION BUTTONS ===== */
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.test-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.test-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.renew-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.renew-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.password-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  margin-top: 16px;
}

.password-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
}

.modern-save-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.modern-save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

/* ===== SYSTEM INFO GRID ===== */
.system-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.15);
}

.info-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
}

.container-dark .info-label {
  color: #94a3b8;
}

.info-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.container-dark .info-value {
  color: #f8fafc;
}

/* ===== BACKUP ACTIONS ===== */
.backup-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.create-backup-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.create-backup-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.restore-backup-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.restore-backup-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
}

/* ===== TABLA MODERNA ===== */
.modern-table-container {
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
}

.modern-table {
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
}

.modern-table-header {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.header-cell {
  padding: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
}

.size-text {
  font-weight: 600;
  color: #64748b;
}

.container-dark .size-text {
  color: #94a3b8;
}

.table-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn.download-btn {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.action-btn.download-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.1);
}

.action-btn.restore-btn {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.action-btn.restore-btn:hover {
  background: rgba(245, 158, 11, 0.2);
  transform: scale(1.1);
}

.action-btn.delete-btn {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.action-btn.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

/* ===== FILTROS DE LOGS ===== */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: end;
}

.filter-group {
  position: relative;
}

.clear-logs-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  width: 100%;
}

.clear-logs-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.export-logs-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  width: 100%;
}

.export-logs-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

/* ===== LOGS VIEWER ===== */
.logs-viewer {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  background: rgba(139, 92, 246, 0.02);
}

.log-entry {
  padding: 16px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-entry.log-error {
  background: rgba(239, 68, 68, 0.05);
  border-left: 4px solid #ef4444;
}

.log-entry.log-warning {
  background: rgba(245, 158, 11, 0.05);
  border-left: 4px solid #f59e0b;
}

.log-entry.log-info {
  background: rgba(59, 130, 246, 0.05);
  border-left: 4px solid #3b82f6;
}

.log-entry.log-debug {
  background: rgba(139, 92, 246, 0.05);
  border-left: 4px solid #8b5cf6;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.log-timestamp {
  font-size: 0.75rem;
  color: #64748b;
}

.container-dark .log-timestamp {
  color: #94a3b8;
}

.log-level-chip {
  font-size: 0.625rem;
}

.log-message {
  font-weight: 500;
  margin-bottom: 8px;
  color: #1e293b;
}

.container-dark .log-message {
  color: #f8fafc;
}

.log-details {
  font-size: 0.75rem;
  background: rgba(0, 0, 0, 0.05);
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
}

.container-dark .log-details {
  background: rgba(255, 255, 255, 0.05);
}

.log-details pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #64748b;
}

.container-dark .log-details pre {
  color: #94a3b8;
}

.no-logs {
  text-align: center;
  padding: 48px;
}

.no-logs-icon {
  margin-bottom: 16px;
  color: #94a3b8;
}

.no-logs-text {
  color: #64748b;
  font-size: 0.875rem;
}

.container-dark .no-logs-text {
  color: #94a3b8;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .modern-settings-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .header-buttons {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }

  .modern-secondary-btn,
  .modern-create-btn {
    width: 100%;
  }

  .content-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .content-body {
    padding: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .logo-upload-area {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .action-buttons,
  .backup-actions {
    flex-direction: column;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .system-info-grid {
    grid-template-columns: 1fr;
  }

  .info-card {
    flex-direction: column;
    text-align: center;
  }
}

/* ===== ANIMACIONES ADICIONALES ===== */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-content-card {
  animation: slideInUp 0.3s ease-out;
}

.modern-header-section,
.modern-navigation-card {
  animation: slideInUp 0.4s ease-out;
}

/* ===== EFECTOS DE HOVER ADICIONALES ===== */
.modern-content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

.container-dark .modern-content-card:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}
</style>