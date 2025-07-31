<template>
  <div class="modern-reports-container" :class="{ 'container-dark': $q.dark.isActive }">
    <!-- Partículas de fondo -->
    <div class="background-particles">
      <div class="particle" v-for="n in 15" :key="n" :style="getParticleStyle()"></div>
    </div>

    <!-- Header Glassmorphism -->
    <div class="modern-header-section">
      <div class="header-content">
        <div class="header-info">
          <div class="page-icon">
            <q-icon name="analytics" size="2rem" />
          </div>
          <div>
            <h4 class="page-title">Reportes y Análisis</h4>
            <div class="page-subtitle">Análisis detallado de ventas, clientes y productos</div>
          </div>
        </div>

        <div class="header-buttons">
          <q-btn 
            label="Actualizar Datos" 
            icon="refresh" 
            @click="loadAllData"
            class="modern-secondary-btn"
            no-caps
            :loading="loading"
          >
            <div class="btn-glow"></div>
          </q-btn>
          
          <q-btn 
            label="Exportar PDF" 
            icon="picture_as_pdf" 
            @click="exportToPDF"
            class="modern-export-btn"
            no-caps
          >
            <div class="btn-glow"></div>
          </q-btn>
          
          <q-btn 
            label="Exportar Excel" 
            icon="table_view" 
            @click="exportToExcel"
            class="modern-excel-btn"
            no-caps
          >
            <div class="btn-glow"></div>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Filtros Modernos -->
    <div class="modern-filters-card">
      <div class="filters-header">
        <q-icon name="tune" class="filters-icon" />
        <span class="filters-title">Filtros de Período</span>
      </div>
      
      <div class="filters-grid">
        <div class="filter-item">
          <q-input 
            v-model="filters.startDate" 
            label="Fecha Inicio" 
            type="date"
            dense 
            outlined 
            class="modern-input"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="input-icon" />
            </template>
          </q-input>
        </div>

        <div class="filter-item">
          <q-input 
            v-model="filters.endDate" 
            label="Fecha Fin" 
            type="date"
            dense 
            outlined 
            class="modern-input"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="input-icon" />
            </template>
          </q-input>
        </div>

        <div class="filter-item">
          <q-select
            v-model="filters.period" 
            :options="periodOptions" 
            label="Período Rápido" 
            dense 
            outlined 
            class="modern-select"
            emit-value
            map-options
            @update:model-value="updatePeriod"
          >
            <template v-slot:prepend>
              <q-icon name="schedule" class="input-icon" />
            </template>
          </q-select>
        </div>

        <div class="filter-item">
          <q-btn 
            label="Aplicar Filtros" 
            icon="search" 
            @click="applyFilters"
            class="modern-primary-btn apply-btn"
            :loading="loading"
            no-caps
          />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-section">
      <div class="loading-card">
        <q-spinner-dots size="50px" color="primary" />
        <div class="loading-text">Cargando datos...</div>
      </div>
    </div>

    <div v-else class="content-section">
      <!-- Métricas Principales -->
      <div class="metrics-section">
        <div class="metrics-grid">
          <div class="metric-card sales-card">
            <div class="metric-background">
              <div class="metric-icon sales-icon">
                <q-icon name="attach_money" size="2rem" />
              </div>
              <div class="metric-content">
                <div class="metric-value">${{ formatCurrency(metrics.totalSales) }}</div>
                <div class="metric-label">Ventas Totales</div>
                <div class="metric-change" :class="metrics.salesChange >= 0 ? 'positive' : 'negative'">
                  <q-icon :name="metrics.salesChange >= 0 ? 'trending_up' : 'trending_down'" />
                  {{ Math.abs(metrics.salesChange).toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card invoices-card">
            <div class="metric-background">
              <div class="metric-icon invoices-icon">
                <q-icon name="receipt" size="2rem" />
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ metrics.totalInvoices }}</div>
                <div class="metric-label">Facturas Emitidas</div>
                <div class="metric-change" :class="metrics.invoicesChange >= 0 ? 'positive' : 'negative'">
                  <q-icon :name="metrics.invoicesChange >= 0 ? 'trending_up' : 'trending_down'" />
                  {{ Math.abs(metrics.invoicesChange).toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card customers-card">
            <div class="metric-background">
              <div class="metric-icon customers-icon">
                <q-icon name="people" size="2rem" />
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ metrics.totalCustomers }}</div>
                <div class="metric-label">Clientes Activos</div>
                <div class="metric-change" :class="metrics.customersChange >= 0 ? 'positive' : 'negative'">
                  <q-icon :name="metrics.customersChange >= 0 ? 'trending_up' : 'trending_down'" />
                  {{ Math.abs(metrics.customersChange).toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card products-card">
            <div class="metric-background">
              <div class="metric-icon products-icon">
                <q-icon name="inventory_2" size="2rem" />
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ metrics.totalProducts }}</div>
                <div class="metric-label">Productos Vendidos</div>
                <div class="metric-change" :class="metrics.productsChange >= 0 ? 'positive' : 'negative'">
                  <q-icon :name="metrics.productsChange >= 0 ? 'trending_up' : 'trending_down'" />
                  {{ Math.abs(metrics.productsChange).toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="charts-section">
        <!-- Gráfico de Ventas -->
        <div class="chart-card sales-chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <q-icon name="trending_up" class="chart-icon" />
              <span>Ventas por Período</span>
            </div>
            <q-select 
              v-model="chartType" 
              :options="chartTypeOptions" 
              dense 
              outlined 
              style="width: 120px"
              @update:model-value="updateSalesChart"
              class="chart-type-select"
            />
          </div>
          <div class="chart-container">
            <canvas ref="salesChart"></canvas>
          </div>
        </div>

        <!-- Productos Más Vendidos -->
        <div class="chart-card products-chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <q-icon name="inventory_2" class="chart-icon" />
              <span>Productos Más Vendidos</span>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="productsChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Tablas de Datos -->
      <div class="tables-section">
        <!-- Top Clientes -->
        <div class="data-card customers-data-card">
          <div class="data-header">
            <div class="data-title">
              <q-icon name="people" class="data-icon" />
              <span>Top 10 Clientes</span>
            </div>
            <q-btn 
              icon="refresh" 
              flat 
              round 
              @click="calculateTopCustomers"
              class="refresh-btn"
              :loading="calculatingCustomers"
            >
              <q-tooltip class="modern-tooltip">Actualizar</q-tooltip>
            </q-btn>
          </div>
          
          <div class="table-container">
            <q-table 
              :rows="topCustomers" 
              :columns="customersColumns" 
              hide-pagination
              :rows-per-page-options="[0]"
              flat
              class="modern-data-table"
            >
              <template v-slot:header="props">
                <q-tr :props="props" class="modern-table-header">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" class="header-cell">
                    <div class="header-content">
                      <q-icon :name="getCustomerColumnIcon(col.name)" size="sm" class="header-icon" />
                      {{ col.label }}
                    </div>
                  </q-th>
                </q-tr>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props" class="modern-table-row">
                  <q-td key="name" class="cell-with-icon">
                    <div class="cell-content">
                      <div class="cell-avatar">
                        <q-icon name="person" />
                      </div>
                      <span class="cell-text">{{ props.row.name }}</span>
                    </div>
                  </q-td>
                  <q-td key="invoices" class="text-center">
                    <span class="cell-text">{{ props.row.invoices }}</span>
                  </q-td>
                  <q-td key="total" class="cell-with-icon">
                    <div class="cell-content">
                      <div class="cell-avatar price-avatar">
                        <q-icon name="attach_money" />
                      </div>
                      <span class="cell-text price-text">${{ formatCurrency(props.row.total) }}</span>
                    </div>
                  </q-td>
                </q-tr>
              </template>

              <template v-slot:no-data>
                <div class="no-data-modern">
                  <div class="no-data-icon">
                    <q-icon name="people" size="3rem" />
                  </div>
                  <div class="no-data-text">
                    <div class="no-data-title">No hay datos de clientes</div>
                    <div class="no-data-subtitle">Los datos aparecerán después de aplicar filtros</div>
                  </div>
                </div>
              </template>
            </q-table>
          </div>
        </div>

        <!-- Ventas por Producto -->
        <div class="data-card products-data-card">
          <div class="data-header">
            <div class="data-title">
              <q-icon name="inventory_2" class="data-icon" />
              <span>Ventas por Producto</span>
            </div>
            <q-btn 
              icon="refresh" 
              flat 
              round 
              @click="calculateTopProducts"
              class="refresh-btn"
              :loading="calculatingProducts"
            >
              <q-tooltip class="modern-tooltip">Actualizar</q-tooltip>
            </q-btn>
          </div>
          
          <div class="table-container">
            <q-table 
              :rows="topProducts" 
              :columns="productsColumns" 
              hide-pagination
              :rows-per-page-options="[0]"
              flat
              class="modern-data-table"
            >
              <template v-slot:header="props">
                <q-tr :props="props" class="modern-table-header">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" class="header-cell">
                    <div class="header-content">
                      <q-icon :name="getProductColumnIcon(col.name)" size="sm" class="header-icon" />
                      {{ col.label }}
                    </div>
                  </q-th>
                </q-tr>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props" class="modern-table-row">
                  <q-td key="name" class="cell-with-icon">
                    <div class="cell-content">
                      <div class="cell-avatar">
                        <q-icon name="inventory_2" />
                      </div>
                      <span class="cell-text">{{ props.row.name }}</span>
                    </div>
                  </q-td>
                  <q-td key="quantity" class="text-center">
                    <span class="cell-text">{{ props.row.quantity }}</span>
                  </q-td>
                  <q-td key="revenue" class="cell-with-icon">
                    <div class="cell-content">
                      <div class="cell-avatar price-avatar">
                        <q-icon name="attach_money" />
                      </div>
                      <span class="cell-text price-text">${{ formatCurrency(props.row.revenue) }}</span>
                    </div>
                  </q-td>
                </q-tr>
              </template>

              <template v-slot:no-data>
                <div class="no-data-modern">
                  <div class="no-data-icon">
                    <q-icon name="inventory_2" size="3rem" />
                  </div>
                  <div class="no-data-text">
                    <div class="no-data-title">No hay datos de productos</div>
                    <div class="no-data-subtitle">Los datos aparecerán después de aplicar filtros</div>
                  </div>
                </div>
              </template>
            </q-table>
          </div>
        </div>
      </div>

      <!-- Análisis Detallado -->
      <div class="analysis-section">
        <div class="analysis-card">
          <div class="analysis-header">
            <q-icon name="analytics" class="analysis-icon" />
            <span class="analysis-title">Análisis Detallado del Período</span>
          </div>
          
          <div class="analysis-grid">
            <div class="analysis-item">
              <div class="analysis-item-content">
                <div class="analysis-item-icon">
                  <q-icon name="receipt" />
                </div>
                <div class="analysis-item-info">
                  <div class="analysis-item-value">${{ formatCurrency(analysis.averageTicket) }}</div>
                  <div class="analysis-item-label">Ticket Promedio</div>
                  <div class="analysis-item-description">Valor promedio por factura</div>
                </div>
              </div>
            </div>

            <div class="analysis-item">
              <div class="analysis-item-content">
                <div class="analysis-item-icon">
                  <q-icon name="account_balance" />
                </div>
                <div class="analysis-item-info">
                  <div class="analysis-item-value">${{ formatCurrency(analysis.totalTax) }}</div>
                  <div class="analysis-item-label">IVA Recaudado</div>
                  <div class="analysis-item-description">Total de impuestos</div>
                </div>
              </div>
            </div>

            <div class="analysis-item">
              <div class="analysis-item-content">
                <div class="analysis-item-icon">
                  <q-icon name="verified" />
                </div>
                <div class="analysis-item-info">
                  <div class="analysis-item-value">{{ analysis.processedInvoices }}</div>
                  <div class="analysis-item-label">Facturas Procesadas</div>
                  <div class="analysis-item-description">Con CUFE válido</div>
                </div>
              </div>
            </div>

            <div class="analysis-item">
              <div class="analysis-item-content">
                <div class="analysis-item-icon">
                  <q-icon name="schedule" />
                </div>
                <div class="analysis-item-info">
                  <div class="analysis-item-value">{{ analysis.periodDays }}</div>
                  <div class="analysis-item-label">Período Actual</div>
                  <div class="analysis-item-description">días analizados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { backgetData } from '../services/backClient'
import { Chart, registerables } from 'chart.js'
import { date } from 'quasar'
import { Notify } from 'quasar'
import dayjs from 'dayjs'

// Registrar Chart.js
Chart.register(...registerables)

const $q = useQuasar()

// Variables reactivas
const loading = ref(false)
const calculatingCustomers = ref(false)
const calculatingProducts = ref(false)
const salesChart = ref(null)
const productsChart = ref(null)
const chartType = ref('line')

// Datos base
const invoices = ref([])
const customers = ref([])
const products = ref([])
const filteredInvoices = ref([])

// Instancias de gráficos
let salesChartInstance = null
let productsChartInstance = null

// Filtros
const filters = ref({
  startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  period: 'last_30_days'
})

const periodOptions = [
  { label: 'Últimos 7 días', value: 'last_7_days' },
  { label: 'Últimos 30 días', value: 'last_30_days' },
  { label: 'Este mes', value: 'this_month' },
  { label: 'Mes anterior', value: 'last_month' },
  { label: 'Últimos 3 meses', value: 'last_3_months' },
  { label: 'Este año', value: 'this_year' },
  { label: 'Personalizado', value: 'custom' }
]

const chartTypeOptions = [
  { label: 'Línea', value: 'line' },
  { label: 'Barras', value: 'bar' },
  { label: 'Área', value: 'area' }
]

// Métricas calculadas
const metrics = ref({
  totalSales: 0,
  totalInvoices: 0,
  totalCustomers: 0,
  totalProducts: 0,
  salesChange: 0,
  invoicesChange: 0,
  customersChange: 0,
  productsChange: 0
})

// Análisis detallado
const analysis = ref({
  averageTicket: 0,
  totalTax: 0,
  processedInvoices: 0,
  periodDays: 0
})

// Datos para tablas
const topCustomers = ref([])
const topProducts = ref([])

// Columnas para tablas
const customersColumns = [
  { name: 'name', label: 'Cliente', field: 'name', align: 'left' },
  { name: 'invoices', label: 'Facturas', field: 'invoices', align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' }
]

const productsColumns = [
  { name: 'name', label: 'Producto', field: 'name', align: 'left' },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center' },
  { name: 'revenue', label: 'Ingresos', field: 'revenue', align: 'right' }
]

// Funciones para efectos visuales
const getParticleStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 15 + 's',
    animationDuration: (Math.random() * 8 + 12) + 's'
  }
}

const getCustomerColumnIcon = (columnName) => {
  const icons = {
    name: 'person',
    invoices: 'receipt',
    total: 'attach_money'
  }
  return icons[columnName] || 'info'
}

const getProductColumnIcon = (columnName) => {
  const icons = {
    name: 'inventory_2',
    quantity: 'tag',
    revenue: 'attach_money'
  }
  return icons[columnName] || 'info'
}

// Resto de funciones (mantener las originales del script)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0)
}

// ... (resto de métodos sin cambios)
const updatePeriod = (period) => {
  const now = dayjs()
  
  switch (period) {
    case 'last_7_days':
      filters.value.startDate = now.subtract(7, 'day').format('YYYY-MM-DD')
      filters.value.endDate = now.format('YYYY-MM-DD')
      break
    case 'last_30_days':
      filters.value.startDate = now.subtract(30, 'day').format('YYYY-MM-DD')
      filters.value.endDate = now.format('YYYY-MM-DD')
      break
    case 'this_month':
      filters.value.startDate = now.startOf('month').format('YYYY-MM-DD')
      filters.value.endDate = now.format('YYYY-MM-DD')
      break
    case 'last_month':
      filters.value.startDate = now.subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
      filters.value.endDate = now.subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
      break
    case 'last_3_months':
      filters.value.startDate = now.subtract(3, 'month').format('YYYY-MM-DD')
      filters.value.endDate = now.format('YYYY-MM-DD')
      break
    case 'this_year':
      filters.value.startDate = now.startOf('year').format('YYYY-MM-DD')
      filters.value.endDate = now.format('YYYY-MM-DD')
      break
  }
  
  if (period !== 'custom') {
    applyFilters()
  }
}

const applyFilters = async () => {
  console.log('📊 Aplicando filtros:', filters.value)
  
  filteredInvoices.value = getFilteredInvoices()
  
  await Promise.all([
    calculateMetrics(),
    calculateAnalysis(),
    calculateTopCustomers(),
    calculateTopProducts(),
    updateCharts()
  ])
  
  console.log('✅ Filtros aplicados:', {
    totalInvoices: filteredInvoices.value.length,
    period: `${filters.value.startDate} - ${filters.value.endDate}`
  })
}

const getFilteredInvoices = () => {
  const start = new Date(filters.value.startDate)
  const end = new Date(filters.value.endDate)
  end.setHours(23, 59, 59, 999)
  
  return invoices.value.filter(invoice => {
    const invoiceDate = new Date(invoice.createdAt)
    return invoiceDate >= start && invoiceDate <= end
  })
}

const loadAllData = async () => {
  loading.value = true
  try {
    console.log('🔄 Cargando todos los datos...')
    
    const [invoicesData, customersData, productsData] = await Promise.all([
      backgetData('invoice'),
      backgetData('customer'),
      backgetData('product')
    ])
    
    invoices.value = invoicesData || []
    customers.value = customersData || []
    products.value = productsData || []
    
    console.log('✅ Datos cargados:', {
      facturas: invoices.value.length,
      clientes: customers.value.length,
      productos: products.value.length
    })
    
    await applyFilters()
    
  } catch (error) {
    console.error('❌ Error al cargar datos:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar los datos'
    })
  } finally {
    loading.value = false
  }
}

const calculateMetrics = async () => {
  try {
    const currentPeriodInvoices = filteredInvoices.value
    
    const periodDays = dayjs(filters.value.endDate).diff(dayjs(filters.value.startDate), 'day') + 1
    const previousStartDate = dayjs(filters.value.startDate).subtract(periodDays, 'day').format('YYYY-MM-DD')
    const previousEndDate = dayjs(filters.value.startDate).subtract(1, 'day').format('YYYY-MM-DD')
    
    const previousPeriodInvoices = invoices.value.filter(invoice => {
      const invoiceDate = new Date(invoice.createdAt)
      const start = new Date(previousStartDate)
      const end = new Date(previousEndDate)
      end.setHours(23, 59, 59, 999)
      return invoiceDate >= start && invoiceDate <= end
    })
    
    const currentSales = currentPeriodInvoices.reduce((sum, invoice) => {
      return sum + calculateInvoiceTotal(invoice)
    }, 0)
    
    const currentInvoicesCount = currentPeriodInvoices.length
    
    const uniqueCustomers = new Set()
    currentPeriodInvoices.forEach(invoice => {
      if (invoice.customer?._id) {
        uniqueCustomers.add(invoice.customer._id)
      }
    })
    
    const uniqueProducts = new Set()
    currentPeriodInvoices.forEach(invoice => {
      if (invoice.products) {
        invoice.products.forEach(product => {
          if (product._id || product.product?._id) {
            uniqueProducts.add(product._id || product.product._id)
          }
        })
      }
    })
    
    const previousSales = previousPeriodInvoices.reduce((sum, invoice) => {
      return sum + calculateInvoiceTotal(invoice)
    }, 0)
    
    const previousInvoicesCount = previousPeriodInvoices.length
    
    const previousUniqueCustomers = new Set()
    previousPeriodInvoices.forEach(invoice => {
      if (invoice.customer?._id) {
        previousUniqueCustomers.add(invoice.customer._id)
      }
    })
    
    const previousUniqueProducts = new Set()
    previousPeriodInvoices.forEach(invoice => {
      if (invoice.products) {
        invoice.products.forEach(product => {
          if (product._id || product.product?._id) {
            previousUniqueProducts.add(product._id || product.product._id)
          }
        })
      }
    })
    
    const salesChange = previousSales > 0 ? ((currentSales - previousSales) / previousSales) * 100 : 0
    const invoicesChange = previousInvoicesCount > 0 ? ((currentInvoicesCount - previousInvoicesCount) / previousInvoicesCount) * 100 : 0
    const customersChange = previousUniqueCustomers.size > 0 ? ((uniqueCustomers.size - previousUniqueCustomers.size) / previousUniqueCustomers.size) * 100 : 0
    const productsChange = previousUniqueProducts.size > 0 ? ((uniqueProducts.size - previousUniqueProducts.size) / previousUniqueProducts.size) * 100 : 0
    
    metrics.value = {
      totalSales: currentSales,
      totalInvoices: currentInvoicesCount,
      totalCustomers: uniqueCustomers.size,
      totalProducts: uniqueProducts.size,
      salesChange,
      invoicesChange,
      customersChange,
      productsChange
    }
    
    console.log('📊 Métricas calculadas:', metrics.value)
    
  } catch (error) {
    console.error('❌ Error calculando métricas:', error)
  }
}

const calculateAnalysis = () => {
  try {
    const currentInvoices = filteredInvoices.value
    
    if (currentInvoices.length === 0) {
      analysis.value = {
        averageTicket: 0,
        totalTax: 0,
        processedInvoices: 0,
        periodDays: 0
      }
      return
    }
    
    const totalSales = currentInvoices.reduce((sum, invoice) => sum + calculateInvoiceTotal(invoice), 0)
    const totalTax = currentInvoices.reduce((sum, invoice) => sum + calculateInvoiceTax(invoice), 0)
    const processedInvoices = currentInvoices.filter(invoice => invoice.factusData?.cufe).length
    const periodDays = dayjs(filters.value.endDate).diff(dayjs(filters.value.startDate), 'day') + 1
    
    analysis.value = {
      averageTicket: totalSales / currentInvoices.length,
      totalTax,
      processedInvoices,
      periodDays
    }
    
    console.log('📈 Análisis calculado:', analysis.value)
    
  } catch (error) {
    console.error('❌ Error calculando análisis:', error)
  }
}

const calculateTopCustomers = async () => {
  calculatingCustomers.value = true
  try {
    const customerSales = new Map()
    
    filteredInvoices.value.forEach(invoice => {
      const customerId = invoice.customer?._id
      const customerName = invoice.customer?.names || invoice.customer?.company || 'Cliente desconocido'
      
      if (customerId) {
        if (!customerSales.has(customerId)) {
          customerSales.set(customerId, {
            name: customerName,
            invoices: 0,
            total: 0
          })
        }
        
        const customerData = customerSales.get(customerId)
        customerData.invoices++
        customerData.total += calculateInvoiceTotal(invoice)
      }
    })
    
    topCustomers.value = Array.from(customerSales.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
    
    console.log('👥 Top clientes:', topCustomers.value.length)
    
  } catch (error) {
    console.error('❌ Error calculando top clientes:', error)
  } finally {
    calculatingCustomers.value = false
  }
}

const calculateTopProducts = async () => {
  calculatingProducts.value = true
  try {
    const productSales = new Map()
    
    filteredInvoices.value.forEach(invoice => {
      if (invoice.products && Array.isArray(invoice.products)) {
        invoice.products.forEach(item => {
          const product = item.product || item
          const productId = product._id || product.id
          const productName = product.name || item.name || 'Producto desconocido'
          const quantity = Number(item.quantity) || 1
          const price = Number(item.price) || Number(product.price) || 0
          
          if (productId) {
            if (!productSales.has(productId)) {
              productSales.set(productId, {
                name: productName,
                quantity: 0,
                revenue: 0
              })
            }
            
            const productData = productSales.get(productId)
            productData.quantity += quantity
            productData.revenue += price * quantity
          }
        })
      }
    })
    
    topProducts.value = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
    
    console.log('📦 Top productos:', topProducts.value.length)
    
  } catch (error) {
    console.error('❌ Error calculando top productos:', error)
  } finally {
    calculatingProducts.value = false
  }
}

const calculateInvoiceTotal = (invoice) => {
  try {
    if (invoice.factusData?.total) {
      return Number(invoice.factusData.total)
    }
    
    if (invoice.products && Array.isArray(invoice.products)) {
      return invoice.products.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 1
        const price = Number(item.price) || Number(item.product?.price) || 0
        const subtotal = price * quantity
        const taxRate = Number(item.tax_rate) || Number(item.product?.tax_rate) || 0
        const tax = subtotal * (taxRate / 100)
        return sum + subtotal + tax
      }, 0)
    }
    
    return 0
  } catch (error) {
    console.warn('Error calculando total de factura:', error)
    return 0
  }
}

const calculateInvoiceTax = (invoice) => {
  try {
    if (invoice.factusData?.tax_amount) {
      return Number(invoice.factusData.tax_amount)
    }
    
    if (invoice.products && Array.isArray(invoice.products)) {
      return invoice.products.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 1
        const price = Number(item.price) || Number(item.product?.price) || 0
        const subtotal = price * quantity
        const taxRate = Number(item.tax_rate) || Number(item.product?.tax_rate) || 0
        return sum + (subtotal * (taxRate / 100))
      }, 0)
    }
    
    return 0
  } catch (error) {
    return 0
  }
}

const updateCharts = async () => {
  await nextTick()
  updateSalesChart()
  updateProductsChart()
}

const updateSalesChart = () => {
  if (!salesChart.value) return
  
  try {
    const ctx = salesChart.value.getContext('2d')
    
    if (salesChartInstance) {
      salesChartInstance.destroy()
    }
    
    const chartData = generateSalesChartData()
    
    salesChartInstance = new Chart(ctx, {
      type: chartType.value === 'area' ? 'line' : chartType.value,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + formatCurrency(value)
              },
              color: $q.dark.isActive ? '#e0e0e0' : '#666'
            },
            grid: {
              color: $q.dark.isActive ? '#404040' : '#e0e0e0'
            }
          },
          x: {
            ticks: {
              color: $q.dark.isActive ? '#e0e0e0' : '#666'
            },
            grid: {
              color: $q.dark.isActive ? '#404040' : '#e0e0e0'
            }
          }
        }
      }
    })
  } catch (error) {
    console.error('❌ Error actualizando gráfico de ventas:', error)
  }
}

const generateSalesChartData = () => {
  const periodDays = dayjs(filters.value.endDate).diff(dayjs(filters.value.startDate), 'day') + 1
  const salesByDate = new Map()
  
  for (let i = 0; i < periodDays; i++) {
    const date = dayjs(filters.value.startDate).add(i, 'day').format('YYYY-MM-DD')
    salesByDate.set(date, 0)
  }
  
  filteredInvoices.value.forEach(invoice => {
    const invoiceDate = dayjs(invoice.createdAt).format('YYYY-MM-DD')
    const currentSales = salesByDate.get(invoiceDate) || 0
    salesByDate.set(invoiceDate, currentSales + calculateInvoiceTotal(invoice))
  })
  
  const labels = Array.from(salesByDate.keys()).map(date => 
    dayjs(date).format(periodDays > 31 ? 'MM/DD' : 'DD/MM')
  )
  
  const data = Array.from(salesByDate.values())
  
  return {
    labels,
    datasets: [{
      label: 'Ventas',
      data,
      backgroundColor: chartType.value === 'area' 
        ? ($q.dark.isActive ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)')
        : ($q.dark.isActive ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.6)'),
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 2,
      tension: 0.4,
      fill: chartType.value === 'area'
    }]
  }
}

const updateProductsChart = () => {
  if (!productsChart.value) return
  
  try {
    const ctx = productsChart.value.getContext('2d')
    
    if (productsChartInstance) {
      productsChartInstance.destroy()
    }
    
    const top5Products = topProducts.value.slice(0, 5)
    
    if (top5Products.length === 0) {
      productsChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Sin datos'],
          datasets: [{
            data: [1],
            backgroundColor: ['rgba(128, 128, 128, 0.5)']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: $q.dark.isActive ? '#e0e0e0' : '#666'
              }
            }
          }
        }
      })
      return
    }
    
    productsChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: top5Products.map(p => p.name),
        datasets: [{
          data: top5Products.map(p => p.quantity),
          backgroundColor: [
            'rgba(139, 92, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(196, 181, 253, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(126, 34, 206, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: $q.dark.isActive ? '#e0e0e0' : '#666'
            }
          }
        }
      }
    })
  } catch (error) {
    console.error('❌ Error actualizando gráfico de productos:', error)
  }
}

const exportToPDF = () => {
  Notify.create({
    type: 'info',
    message: 'Generando reporte PDF...',
    caption: 'Función disponible próximamente'
  })
}

const exportToExcel = () => {
  Notify.create({
    type: 'info',
    message: 'Generando reporte Excel...',
    caption: 'Función disponible próximamente'
  })
}

onMounted(async () => {
  console.log('🚀 Iniciando módulo de reportes...')
  await loadAllData()
  console.log('✅ Módulo de reportes inicializado con datos reales')
})
</script>

<style scoped>
/* ===== TRANSICIONES GLOBALES ===== */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== CONTENEDOR PRINCIPAL ===== */
.modern-reports-container {
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
  background: linear-gradient(45deg, #8b5cf6, #a78bfa);
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
  flex-wrap: wrap;
  gap: 20px;
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
  flex-wrap: wrap;
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

.modern-export-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-radius: 16px;
  padding: 12px 20px;
  font-weight: 600;
  text-transform: none;
  font-size: 0.9rem;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
  position: relative;
  overflow: hidden;
  border: none;
}

.modern-excel-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 16px;
  padding: 12px 20px;
  font-weight: 600;
  text-transform: none;
  font-size: 0.9rem;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
  border: none;
}

.modern-secondary-btn:hover,
.modern-export-btn:hover,
.modern-excel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
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

.modern-secondary-btn:hover .btn-glow,
.modern-export-btn:hover .btn-glow,
.modern-excel-btn:hover .btn-glow {
  left: 100%;
}

/* ===== FILTROS MODERNOS ===== */
.modern-filters-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.container-dark .modern-filters-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.filters-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.filters-icon {
  color: #8b5cf6;
  font-size: 1.5rem;
}

.filters-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.container-dark .filters-title {
  color: #f8fafc;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: end;
}

.filter-item {
  position: relative;
}

.modern-input :deep(.q-field__control),
.modern-select :deep(.q-field__control) {
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  height: 48px;
  transition: all 0.3s ease;
}

.modern-input :deep(.q-field--focused .q-field__control),
.modern-select :deep(.q-field--focused .q-field__control) {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  background: rgba(139, 92, 246, 0.08);
}

.input-icon {
  color: #8b5cf6;
}

.modern-primary-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  border: none;
  height: 48px;
}

.modern-primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.apply-btn {
  width: 100%;
}

/* ===== LOADING ===== */
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 64px;
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
  font-size: 1.1rem;
  font-weight: 500;
  color: #64748b;
}

.container-dark .loading-text {
  color: #94a3b8;
}

/* ===== CONTENIDO ===== */
.content-section {
  position: relative;
  z-index: 1;
}

/* ===== MÉTRICAS ===== */
.metrics-section {
  margin-bottom: 32px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.container-dark .metric-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
}

.metric-background {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.metric-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
}

.sales-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.invoices-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.customers-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.products-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1e293b;
}

.container-dark .metric-value {
  color: #f8fafc;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #64748b;
}

.container-dark .metric-label {
  color: #94a3b8;
}

.metric-change {
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-change.positive {
  color: #10b981;
}

.metric-change.negative {
  color: #ef4444;
}

/* ===== GRÁFICOS ===== */
.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.container-dark .chart-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.container-dark .chart-title {
  color: #f8fafc;
}

.chart-icon {
  color: #8b5cf6;
  font-size: 1.5rem;
}

.chart-type-select :deep(.q-field__control) {
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 8px;
  height: 36px;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

/* ===== TABLAS ===== */
.tables-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.data-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.container-dark .data-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.data-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.container-dark .data-title {
  color: #f8fafc;
}

.data-icon {
  color: #8b5cf6;
  font-size: 1.25rem;
}

.refresh-btn {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 8px;
}

.refresh-btn:hover {
  background: rgba(139, 92, 246, 0.2);
}

.table-container {
  border-radius: 12px;
  overflow: hidden;
}

.modern-data-table {
  background: transparent;
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

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  opacity: 0.8;
}

.modern-table-row {
  background: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.container-dark .modern-table-row {
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modern-table-row:hover {
  background: rgba(139, 92, 246, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.cell-with-icon {
  padding: 16px;
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cell-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
}

.cell-avatar.price-avatar {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.cell-text {
  font-weight: 500;
  color: #1e293b;
}

.cell-text.price-text {
  font-weight: 700;
  color: #059669;
}

.container-dark .cell-text {
  color: #f8fafc;
}

.container-dark .cell-text.price-text {
  color: #34d399;
}

/* ===== NO DATA ===== */
.no-data-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 32px;
  text-align: center;
}

.no-data-icon {
  color: #94a3b8;
  margin-bottom: 16px;
}

.no-data-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.container-dark .no-data-title {
  color: #f8fafc;
}

.no-data-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.container-dark .no-data-subtitle {
  color: #94a3b8;
}

/* ===== ANÁLISIS ===== */
.analysis-section {
  position: relative;
  z-index: 1;
}

.analysis-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.container-dark .analysis-card {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.analysis-icon {
  color: #8b5cf6;
  font-size: 1.5rem;
}

.analysis-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.container-dark .analysis-title {
  color: #f8fafc;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.analysis-item {
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.container-dark .analysis-item {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.analysis-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
}

.analysis-item-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.analysis-item-icon {
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

.analysis-item-info {
  flex: 1;
}

.analysis-item-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.container-dark .analysis-item-value {
  color: #f8fafc;
}

.analysis-item-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #8b5cf6;
  margin-bottom: 4px;
}

.analysis-item-description {
  font-size: 0.75rem;
  color: #64748b;
}

.container-dark .analysis-item-description {
  color: #94a3b8;
}

.modern-tooltip {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  font-size: 0.75rem;
  padding: 8px 12px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .tables-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .modern-reports-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .header-buttons {
    flex-direction: column;
    width: 100%;
  }

  .modern-secondary-btn,
  .modern-export-btn,
  .modern-excel-btn {
    width: 100%;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .analysis-item-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}

/* ===== ANIMACIONES ===== */
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

.metric-card,
.chart-card,
.data-card,
.analysis-card {
  animation: slideInUp 0.4s ease-out;
}

.modern-header-section,
.modern-filters-card {
  animation: slideInUp 0.3s ease-out;
}
</style>