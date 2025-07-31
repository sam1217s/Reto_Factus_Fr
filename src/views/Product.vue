<template>
  <div class="modern-products-container" :class="{ 'container-dark': $q.dark.isActive }">
    <!-- Partículas de fondo -->
    <div class="background-particles">
      <div class="particle" v-for="n in 15" :key="n" :style="getParticleStyle()"></div>
    </div>

    <!-- Header Glassmorphism -->
    <div class="modern-header-section">
      <div class="header-content">
        <div class="header-info">
          <div class="page-icon">
            <q-icon name="inventory_2" size="2rem" />
          </div>
          <div>
            <h4 class="page-title">Gestión de Productos</h4>
            <div class="page-subtitle">Administra los productos y servicios</div>
          </div>
        </div>

        <q-btn 
          label="Nuevo Producto" 
          icon="add" 
          @click="openDialog" 
          class="modern-create-btn"
          no-caps
          unelevated
        >
          <div class="btn-glow"></div>
        </q-btn>
      </div>
    </div>

    <!-- Filtros Modernos -->
    <div class="modern-filters-card">
      <div class="filters-header">
        <q-icon name="tune" class="filters-icon" />
        <span class="filters-title">Filtros de búsqueda</span>
      </div>
      
      <div class="filters-grid">
        <div class="filter-item">
          <q-input 
            v-model="filterCode" 
            label="Código" 
            dense 
            outlined 
            class="modern-input"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="code" class="input-icon" />
            </template>
          </q-input>
        </div>

        <div class="filter-item">
          <q-input 
            v-model="filterName" 
            label="Nombre" 
            dense 
            outlined 
            class="modern-input"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="inventory_2" class="input-icon" />
            </template>
          </q-input>
        </div>

        <div class="filter-item">
          <q-select
            v-model="filterUnit" 
            :options="unitOptions" 
            label="Unidad de Medida" 
            dense 
            outlined 
            class="modern-select"
            clearable
            emit-value
            map-options
            option-label="name"
            option-value="id"
          >
            <template v-slot:prepend>
              <q-icon name="straighten" class="input-icon" />
            </template>
          </q-select>
        </div>

        <div class="filter-item">
          <q-select
            v-model="filterState" 
            :options="stateOptions" 
            label="Estado" 
            dense 
            outlined 
            class="modern-select"
            clearable
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="circle" class="input-icon" />
            </template>
          </q-select>
        </div>
      </div>
    </div>

    <!-- Tabla Moderna -->
    <div class="modern-table-container">
      <q-table 
        flat
        :rows="filteredRows" 
        :columns="columns" 
        row-key="id" 
        :pagination="pagination"
        :rows-per-page-options="[5,10,20,50]" 
        class="modern-table"
        :loading="loading"
        :class="{ 'table-dark': $q.dark.isActive }"
      >
        <template v-slot:header="props">
          <q-tr :props="props" class="modern-table-header">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="header-cell">
              <div class="header-content">
                <q-icon :name="getColumnIcon(col.name)" size="sm" class="header-icon" />
                {{ col.label }}
              </div>
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" class="modern-table-row">
            <q-td key="code_reference" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="code" />
                </div>
                <span class="cell-text">{{ props.row.code_reference || 'N/A' }}</span>
              </div>
            </q-td>

            <q-td key="name" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="inventory_2" />
                </div>
                <span class="cell-text">{{ props.row.name || 'N/A' }}</span>
              </div>
            </q-td>

            <q-td key="unit_measure_id" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="straighten" />
                </div>
                <span class="cell-text">{{ getUnitName(props.row.unit_measure_id) }}</span>
              </div>
            </q-td>

            <q-td key="price" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar price-avatar">
                  <q-icon name="attach_money" />
                </div>
                <span class="cell-text price-text">{{ formatCurrency(props.row.price) }}</span>
              </div>
            </q-td>

            <q-td key="factus_ready" class="text-center">
              <q-chip 
                :color="isFactusReady(props.row) ? 'positive' : 'warning'"
                :label="isFactusReady(props.row) ? 'Listo Factus' : 'Revisar'"
                class="modern-status-chip"
                :icon="isFactusReady(props.row) ? 'verified' : 'warning'"
              />
            </q-td>

            <q-td key="state" class="text-center">
              <q-chip 
                :color="props.row.state === 1 ? 'positive' : 'negative'"
                :label="props.row.state === 1 ? 'Activo' : 'Inactivo'" 
                class="modern-status-chip"
                :icon="props.row.state === 1 ? 'check_circle' : 'cancel'"
              />
            </q-td>

            <q-td key="actions" class="text-center">
              <div class="action-buttons-modern">
                <q-btn 
                  round 
                  dense 
                  icon="edit" 
                  @click="editProduct(props.row)" 
                  class="action-btn edit-btn"
                  size="sm"
                >
                  <q-tooltip class="modern-tooltip">Editar</q-tooltip>
                  <div class="btn-ripple"></div>
                </q-btn>
                
                <q-btn 
                  round 
                  dense 
                  icon="fact_check" 
                  @click="validateForFactus(props.row)"
                  v-if="!isFactusReady(props.row)"
                  class="action-btn validate-btn"
                  size="sm"
                >
                  <q-tooltip class="modern-tooltip">Validar para Factus</q-tooltip>
                  <div class="btn-ripple"></div>
                </q-btn>
                
                <q-btn 
                  round 
                  dense 
                  :icon="props.row.state === 1 ? 'toggle_off' : 'toggle_on'" 
                  @click="showConfirmationState(props.row)"
                  :class="['action-btn', props.row.state === 1 ? 'deactivate-btn' : 'activate-btn']"
                  size="sm"
                >
                  <q-tooltip class="modern-tooltip">
                    {{ props.row.state === 1 ? 'Desactivar' : 'Activar' }}
                  </q-tooltip>
                  <div class="btn-ripple"></div>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:no-data>
          <div class="no-data-modern">
            <div class="no-data-icon">
              <q-icon name="inventory_off" size="3rem" />
            </div>
            <div class="no-data-text">
              <div class="no-data-title">No se encontraron productos</div>
              <div class="no-data-subtitle">Intenta ajustar los filtros de búsqueda</div>
            </div>
          </div>
        </template>
      </q-table>
    </div>

    <!-- Modal Moderno -->
    <q-dialog v-model="dialog" persistent maximized class="modern-dialog">
      <div class="modal-backdrop">
        <div class="modal-particles">
          <div class="modal-particle" v-for="n in 8" :key="n" :style="getModalParticleStyle()"></div>
        </div>
        
        <q-card class="modern-modal">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <q-icon :name="editMode ? 'edit' : 'add'" />
              </div>
              <div class="modal-title">
                <h6>{{ editMode ? 'Editar Producto' : 'Nuevo Producto' }}</h6>
                <p>{{ editMode ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto' }}</p>
              </div>
            </div>
            <q-btn icon="close" flat round dense @click="dialog = false" class="close-btn">
              <div class="btn-ripple"></div>
            </q-btn>
          </div>

          <div class="modal-body">
            <div class="modern-stepper">
              <!-- Paso 1: Información Básica -->
              <div class="step-card" :class="{ 'active': currentStep === 1 }">
                <div class="step-header" @click="currentStep = 1">
                  <div class="step-indicator">
                    <q-icon name="info" />
                  </div>
                  <div class="step-info">
                    <div class="step-title">Información Básica</div>
                    <div class="step-subtitle">Datos principales del producto</div>
                  </div>
                  <div class="step-status">
                    <q-icon name="check_circle" color="positive" v-if="isStepValid(1)" />
                  </div>
                </div>

                <div class="step-content" v-if="currentStep === 1">
                  <div class="form-grid">
                    <q-input 
                      v-model="form.code_reference" 
                      label="Código de Referencia *" 
                      outlined 
                      dense
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido para Factus']"
                      class="modern-field"
                    />
                    
                    <q-input 
                      v-model="form.name" 
                      label="Nombre del Producto *" 
                      outlined 
                      dense
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido para Factus']"
                      class="modern-field"
                    />
                    
                    <q-input 
                      v-model.number="form.price" 
                      label="Precio *" 
                      outlined 
                      dense 
                      prefix="$"
                      lazy-rules
                      :rules="[val => val > 0 || 'Precio debe ser mayor a 0']"
                      class="modern-field"
                    />
                    
                    <q-select 
                      v-model="form.unit_measure_id" 
                      :options="unitOptions" 
                      label="Unidad de Medida *" 
                      outlined 
                      dense
                      emit-value 
                      map-options
                      option-label="name" 
                      option-value="id"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido para Factus']"
                      class="modern-field"
                    />
                  </div>
                </div>
              </div>

              <!-- Paso 2: Información Tributaria -->
              <div class="step-card" :class="{ 'active': currentStep === 2 }">
                <div class="step-header" @click="currentStep = 2">
                  <div class="step-indicator">
                    <q-icon name="receipt" />
                  </div>
                  <div class="step-info">
                    <div class="step-title">Información Tributaria</div>
                    <div class="step-subtitle">Configuración fiscal y tributaria</div>
                  </div>
                  <div class="step-status">
                    <q-icon name="check_circle" color="positive" v-if="isStepValid(2)" />
                  </div>
                </div>

                <div class="step-content" v-if="currentStep === 2">
                  <!-- Banner informativo -->
                  <div class="info-banner">
                    <div class="banner-icon">
                      <q-icon name="info" />
                    </div>
                    <div class="banner-content">
                      <div class="banner-title">Campos Obligatorios para Factus</div>
                      <div class="banner-text">Los campos marcados con (*) son requeridos para facturación electrónica</div>
                    </div>
                  </div>

                  <div class="form-grid">
                    <q-input 
                      v-model.number="form.tax_rate" 
                      label="Impuesto (%) *" 
                      outlined 
                      dense
                      type="number" 
                      suffix="%"
                      lazy-rules
                      :rules="[val => val >= 0 || 'Impuesto debe ser mayor o igual a 0']"
                      class="modern-field"
                    />
                    
                    <q-select 
                      v-model="form.standard_code_id" 
                      :options="standardCodeOptions" 
                      label="Código Estándar *" 
                      outlined 
                      dense
                      emit-value 
                      map-options
                      option-label="name" 
                      option-value="id"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido para Factus']"
                      class="modern-field"
                    />
                    
                    <q-select 
                      v-model="form.tribute_id" 
                      :options="tributeOptions" 
                      label="Tributo *" 
                      outlined 
                      dense
                      emit-value 
                      map-options
                      option-label="name" 
                      option-value="id"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido para Factus']"
                      class="modern-field"
                    />
                    
                    <q-input 
                      v-model.number="form.discount_rate" 
                      label="Descuento (%)" 
                      outlined 
                      dense
                      type="number" 
                      suffix="%"
                      class="modern-field"
                    />
                    
                    <q-select 
                      v-model="form.is_excluded" 
                      label="¿Exento?" 
                      :options="[
                        { label: 'No', value: 0 },
                        { label: 'Sí', value: 1 }
                      ]"
                      emit-value 
                      map-options 
                      outlined 
                      dense
                      class="modern-field"
                    />
                  </div>

                  <!-- Impuestos Retenidos -->
                  <div class="withholding-section">
                    <div class="section-header">
                      <q-icon name="account_balance" class="section-icon" />
                      <span class="section-title">Impuestos Retenidos</span>
                    </div>
                    
                    <div class="withholding-list">
                      <div v-for="(tax, index) in form.withholding_taxes" :key="index" class="withholding-item">
                        <q-input 
                          v-model="tax.code" 
                          label="Código" 
                          outlined 
                          dense 
                          class="modern-field"
                        />
                        <q-input 
                          v-model.number="tax.withholding_tax_rate" 
                          label="Tasa (%)" 
                          outlined 
                          dense 
                          type="number" 
                          suffix="%" 
                          class="modern-field"
                        />
                        <q-btn 
                          icon="delete" 
                          flat 
                          round 
                          dense 
                          @click="removeTax(index)" 
                          class="delete-tax-btn"
                        />
                      </div>
                      
                      <q-btn 
                        icon="add" 
                        label="Añadir Retención" 
                        flat 
                        @click="addTax" 
                        class="add-tax-btn"
                      />
                    </div>
                  </div>

                  <!-- Validación Factus -->
                  <div class="factus-validation">
                    <div class="validation-header">
                      <q-icon name="verified" class="validation-icon" />
                      <span class="validation-title">Validación Factus</span>
                    </div>
                    
                    <div class="validation-content">
                      <q-chip 
                        :color="isFactusReady(form) ? 'positive' : 'warning'" 
                        :icon="isFactusReady(form) ? 'check_circle' : 'warning'"
                        class="validation-chip"
                      >
                        {{ isFactusReady(form) ? 'Listo para facturación' : 'Campos faltantes' }}
                      </q-chip>
                      
                      <div v-if="!isFactusReady(form)" class="missing-fields">
                        <div class="missing-title">Campos faltantes:</div>
                        <ul class="missing-list">
                          <li v-if="!form.code_reference">Código de referencia</li>
                          <li v-if="!form.name">Nombre del producto</li>
                          <li v-if="!form.unit_measure_id">Unidad de medida</li>
                          <li v-if="!form.standard_code_id">Código estándar</li>
                          <li v-if="!form.tribute_id">Tributo</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="footer-actions">
              <q-btn 
                label="Cancelar" 
                flat 
                @click="dialog = false" 
                class="cancel-btn"
              />
              
              <div class="primary-actions">
                <q-btn 
                  label="Anterior" 
                  flat 
                  v-if="currentStep > 1" 
                  @click="prevStep" 
                  class="nav-btn"
                />
                <q-btn 
                  label="Siguiente" 
                  v-if="currentStep < 2" 
                  @click="nextStep" 
                  class="modern-primary-btn"
                  :disable="!canGoToNextStep"
                />
                <q-btn 
                  :label="editMode ? 'Actualizar Producto' : 'Guardar Producto'" 
                  v-if="currentStep === 2" 
                  @click="editMode ? updateProduct() : saveProduct()"
                  :loading="loading"
                  class="modern-primary-btn"
                  :disable="!canSaveProduct"
                />
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
// El script setup permanece similar al original con algunas funciones adicionales para efectos visuales
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { getData } from '../services/apiClient';
import { backgetData, backpostData, backputData } from '../services/backClient';
import { Notify } from 'quasar';
import Swal from 'sweetalert2';

const $q = useQuasar();

// Variables reactivas (mantener las originales)
const rows = ref([]);
const pagination = ref({ page: 1, rowsPerPage: 10 });
const loading = ref(false);
const dialog = ref(false);
const editMode = ref(false);
const currentStep = ref(1);

// Filtros
const filterCode = ref('');
const filterName = ref('');
const filterUnit = ref(null);
const filterState = ref(null);
const stateOptions = [
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 0 }
];

// Formulario con valores por defecto seguros para Factus
const form = ref({
  code_reference: '',
  name: '',
  price: 0,
  tax_rate: 19,
  unit_measure_id: 1,
  standard_code_id: 1,
  is_excluded: 0,
  tribute_id: 1,
  discount_rate: 0,
  withholding_taxes: []
});

// Opciones
const unitOptions = ref([]);
const tributeOptions = ref([]);
const standardCodeOptions = ref([
  { id: 1, name: 'Estándar de adopción del contribuyente' },
  { id: 2, name: 'UNSPSC' },
  { id: 3, name: 'Partida Arancelaria' },
  { id: 4, name: 'GTIN' }
]);

// Columnas
const columns = [
  { name: "code_reference", label: "Código", align: "center", field: row => row.code_reference || 'N/A', sortable: true },
  { name: "name", label: "Producto", align: "center", field: row => row.name || 'N/A', sortable: true },
  { name: "unit_measure_id", label: "Unidad", align: "center", field: row => row.unit_measure_id, sortable: true },
  { name: "price", label: "Precio", align: "center", field: row => row.price, sortable: true },
  { name: "factus_ready", label: "Factus", align: "center" },
  { name: "state", label: "Estado", align: "center", field: row => row.state, sortable: true },
  { name: "actions", label: "Acciones", align: "center" }
];

// Funciones para efectos visuales
const getParticleStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 15 + 's',
    animationDuration: (Math.random() * 8 + 12) + 's'
  }
}

const getModalParticleStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 10 + 's',
    animationDuration: (Math.random() * 6 + 8) + 's'
  }
}

const getColumnIcon = (columnName) => {
  const icons = {
    code_reference: 'code',
    name: 'inventory_2',
    unit_measure_id: 'straighten',
    price: 'attach_money',
    factus_ready: 'verified',
    state: 'circle',
    actions: 'settings'
  }
  return icons[columnName] || 'info'
}

// Computed
const filteredRows = computed(() => {
  return rows.value.filter(row => {
    const matchesCode = !filterCode.value || (row.code_reference || '').toLowerCase().includes(filterCode.value.toLowerCase());
    const matchesName = !filterName.value || (row.name || '').toLowerCase().includes(filterName.value.toLowerCase());
    const matchesUnit = !filterUnit.value || row.unit_measure_id === filterUnit.value;
    const matchesState = filterState.value === null || row.state === filterState.value;
    return matchesCode && matchesName && matchesUnit && matchesState;
  });
});

const canSaveProduct = computed(() => {
  return isFactusReady(form.value) && form.value.price > 0;
});

const canGoToNextStep = computed(() => {
  if (currentStep.value === 1) {
    return !!(form.value.code_reference && form.value.name && form.value.price > 0 && form.value.unit_measure_id);
  }
  return true;
});

// Métodos de validación
const isFactusReady = (product) => {
  return !!(
    product.code_reference && 
    product.name && 
    product.unit_measure_id && 
    product.standard_code_id && 
    product.tribute_id
  );
};

const isStepValid = (step) => {
  if (step === 1) {
    return !!(form.value.code_reference && form.value.name && form.value.price > 0 && form.value.unit_measure_id);
  }
  if (step === 2) {
    return !!(form.value.standard_code_id && form.value.tribute_id && form.value.tax_rate >= 0);
  }
  return false;
};

const validateForFactus = (product) => {
  const missingFields = [];
  if (!product.code_reference) missingFields.push('Código de referencia');
  if (!product.name) missingFields.push('Nombre');
  if (!product.unit_measure_id) missingFields.push('Unidad de medida');
  if (!product.standard_code_id) missingFields.push('Código estándar');
  if (!product.tribute_id) missingFields.push('Tributo');

  if (missingFields.length > 0) {
    Swal.fire({
      title: 'Producto no válido para Factus',
      html: `<p>Faltan los siguientes campos:</p><ul style="text-align: left;">${missingFields.map(field => `<li>${field}</li>`).join('')}</ul>`,
      icon: 'warning',
      confirmButtonText: 'Editar Producto',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      background: $q.dark.isActive ? '#1e293b' : '#ffffff',
      color: $q.dark.isActive ? '#f8fafc' : '#1e293b'
    }).then((result) => {
      if (result.isConfirmed) {
        editProduct(product);
      }
    });
  } else {
    Notify.create({
      type: 'positive',
      message: '✨ El producto está listo para usar con Factus',
      position: 'top-right'
    });
  }
};

// Métodos generales
const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { 
  style: 'currency', 
  currency: 'COP', 
  minimumFractionDigits: 0 
}).format(value);

const getUnitName = (unitId) => {
  const unit = unitOptions.value.find(u => u.id === unitId);
  return unit ? unit.name : "No especificado";
};

const resetForm = () => {
  form.value = {
    code_reference: '',
    name: '',
    price: 0,
    tax_rate: 19,
    unit_measure_id: unitOptions.value.length > 0 ? unitOptions.value[0].id : 1,
    standard_code_id: 1,
    is_excluded: 0,
    tribute_id: tributeOptions.value.length > 0 ? tributeOptions.value[0].id : null,
    discount_rate: 0,
    withholding_taxes: []
  };
  currentStep.value = 1;
  editMode.value = false;
};

const openDialog = () => {
  dialog.value = true;
  resetForm();
};

const addTax = () => form.value.withholding_taxes.push({ code: '', withholding_tax_rate: null });
const removeTax = (index) => form.value.withholding_taxes.splice(index, 1);
const nextStep = () => { if (currentStep.value < 2) currentStep.value++ };
const prevStep = () => { if (currentStep.value > 1) currentStep.value-- };

// CRUD (mantener las funciones originales con notificaciones modernas)
async function getDatafromAPI() {
  try {
    loading.value = true;
    const response = await backgetData('product');
    rows.value = response.sort((a, b) => {
      return b._id.localeCompare(a._id);
    });

    const notReady = response.filter(product => !isFactusReady(product));
    if (notReady.length > 0) {
      console.warn(`⚠️ ${notReady.length} productos necesitan actualización para Factus:`, notReady.map(p => p.name));
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    Notify.create({ 
      type: 'negative', 
      message: 'Error al cargar los productos',
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
}

const saveProduct = async () => {
  if (!isFactusReady(form.value)) {
    Notify.create({ 
      type: 'warning', 
      message: 'Por favor completa todos los campos requeridos para Factus',
      position: 'top-right'
    });
    return;
  }

  const formUpper = {};
  for (const key in form.value) {
    const value = form.value[key];
    formUpper[key] = typeof value === 'string' ? value.toUpperCase() : value;
  }

  loading.value = true;

  const newProduct = {
    ...formUpper,
    price: Number(formUpper.price),
    tax_rate: Number(formUpper.tax_rate),
    unit_measure_id: Number(formUpper.unit_measure_id),
    standard_code_id: Number(formUpper.standard_code_id),
    tribute_id: Number(formUpper.tribute_id),
    discount_rate: Number(formUpper.discount_rate) || 0,
    is_excluded: Number(formUpper.is_excluded),
    withholding_taxes: formUpper.withholding_taxes.map(item => ({
      code: item.code.toUpperCase(),
      withholding_tax_rate: Number(item.withholding_tax_rate)
    })),
    state: 1
  };

  try {
    const saved = await backpostData('product', newProduct);
    dialog.value = false;
    Notify.create({ 
      type: 'positive', 
      message: '✨ Producto registrado exitosamente y listo para Factus',
      position: 'top-right',
      timeout: 3000
    });
    rows.value.unshift(saved);
  } catch (error) {
    console.error('Error al guardar producto:', error);
    Notify.create({ 
      type: 'negative', 
      message: 'Error al guardar el producto',
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
};

const editProduct = (product) => {
  form.value = {
    ...JSON.parse(JSON.stringify(product)),
    unit_measure_id: product.unit_measure_id || (unitOptions.value.length > 0 ? unitOptions.value[0].id : 1),
    standard_code_id: product.standard_code_id || 1,
    tribute_id: product.tribute_id || (tributeOptions.value.length > 0 ? tributeOptions.value[0].id : null),
    tax_rate: product.tax_rate || 19,
    discount_rate: product.discount_rate || 0,
    is_excluded: product.is_excluded || 0
  };
  
  if (!Array.isArray(form.value.withholding_taxes)) {
    form.value.withholding_taxes = [];
  }
  editMode.value = true;
  dialog.value = true;
};

const updateProduct = async () => {
  if (!isFactusReady(form.value)) {
    Notify.create({ 
      type: 'warning', 
      message: 'Por favor completa todos los campos requeridos para Factus',
      position: 'top-right'
    });
    return;
  }

  loading.value = true;
  const updatedProduct = {
    ...form.value,
    price: Number(form.value.price),
    tax_rate: Number(form.value.tax_rate),
    unit_measure_id: Number(form.value.unit_measure_id),
    standard_code_id: Number(form.value.standard_code_id),
    tribute_id: Number(form.value.tribute_id),
    discount_rate: Number(form.value.discount_rate) || 0,
    is_excluded: Number(form.value.is_excluded),
    withholding_taxes: form.value.withholding_taxes.map(item => ({
      code: item.code,
      withholding_tax_rate: Number(item.withholding_tax_rate)
    }))
  };

  try {
    await backputData(`product/${form.value._id}`, updatedProduct);
    dialog.value = false;
    Notify.create({ 
      type: 'positive', 
      message: '✨ Producto actualizado exitosamente',
      position: 'top-right',
      timeout: 3000
    });
    await getDatafromAPI();
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    Notify.create({ 
      type: 'negative', 
      message: 'Error al actualizar el producto',
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
};

const confirmChangeState = async (product) => {
  if (!product) return;
  product.state = product.state === 1 ? 0 : 1;
  try {
    await backputData(`product/${product._id}`, { state: product.state });
    Notify.create({ 
      type: 'positive', 
      message: 'Estado actualizado con éxito',
      position: 'top-right'
    });
    await getDatafromAPI();
  } catch (error) {
    console.error('Error al cambiar el estado:', error);
    Notify.create({ 
      type: 'negative', 
      message: 'Error al cambiar el estado',
      position: 'top-right'
    });
  }
};

const showConfirmationState = (product) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `Estás a punto de ${product.state === 1 ? 'desactivar' : 'activar'} este producto`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Confirmar',
    background: $q.dark.isActive ? '#1e293b' : '#ffffff',
    color: $q.dark.isActive ? '#f8fafc' : '#1e293b'
  }).then((result) => { 
    if (result.isConfirmed) confirmChangeState(product) 
  });
};

// Fetching units & tributes
const fetchUnitOptions = async () => {
  try {
    const response = await getData('/v1/measurement-units');
    unitOptions.value = Array.isArray(response.data)
      ? response.data.map(unit => ({ name: unit.name, id: unit.id }))
      : [{ id: 1, name: 'Unidad' }];
  } catch (error) {
    console.error('Error al cargar unidades, usando valores por defecto:', error);
    unitOptions.value = [{ id: 1, name: 'Unidad' }];
  }
};

const fetchTributeOptions = async () => {
  try {
    const response = await getData('/v1/tributes/products?name=&code=');
    tributeOptions.value = response.data.map(item => ({ 
      name: `${item.code} - ${item.name}`, 
      id: item.id 
    }));
    
    if (tributeOptions.value.length > 0 && !form.value.tribute_id) {
      form.value.tribute_id = tributeOptions.value[0].id;
    }
  } catch (error) {
    console.error('Error al obtener los tributos:', error);
    Notify.create({ 
      type: 'warning', 
      message: 'No se pudieron cargar los tributos desde Factus. Algunos productos podrían no funcionar en facturas.',
      position: 'top-right'
    });
  }
};

// Inicialización
onMounted(async () => {
  await Promise.all([
    fetchUnitOptions(),
    fetchTributeOptions()
  ]);
  await getDatafromAPI();
});
</script>

<style scoped>
/* ===== USAR LOS MISMOS ESTILOS BASE DEL CUSTOMER MODERNIZADO ===== */
/* Reutilizar toda la estructura CSS del Customer.vue modernizado */

/* ===== TRANSICIONES GLOBALES ===== */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== CONTENEDOR PRINCIPAL ===== */
.modern-products-container {
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
  background: linear-gradient(45deg, #10b981, #34d399);
  border-radius: 50%;
  opacity: 0.6;
  animation: particle-float linear infinite;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.3);
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
  background: linear-gradient(135deg, #10b981, #059669);
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
  background: linear-gradient(135deg, #1e293b, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.container-dark .page-title {
  background: linear-gradient(135deg, #f8fafc, #10b981);
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

.modern-create-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
  border: none;
}

.modern-create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
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

.modern-create-btn:hover .btn-glow {
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
  color: #10b981;
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
}

.filter-item {
  position: relative;
}

.modern-input :deep(.q-field__control),
.modern-select :deep(.q-field__control) {
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  height: 48px;
  transition: all 0.3s ease;
}

.modern-input :deep(.q-field--focused .q-field__control),
.modern-select :deep(.q-field--focused .q-field__control) {
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  background: rgba(16, 185, 129, 0.08);
}

.input-icon {
  color: #10b981;
}

/* ===== TABLA MODERNA ===== */
.modern-table-container {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.container-dark .modern-table-container {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.modern-table {
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
}

.modern-table-header {
  background: linear-gradient(135deg, #10b981, #059669);
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

.table-dark .modern-table-row {
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modern-table-row:hover {
  background: rgba(16, 185, 129, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
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
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
}

.cell-avatar.price-avatar {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.cell-text {
  font-weight: 500;
  color: #1e293b;
}

.cell-text.price-text {
  font-weight: 700;
  color: #059669;
}

.table-dark .cell-text {
  color: #f8fafc;
}

.table-dark .cell-text.price-text {
  color: #34d399;
}

.modern-status-chip {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-buttons-modern {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.edit-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.edit-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.validate-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.validate-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
}

.activate-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.activate-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.deactivate-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.deactivate-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

.btn-ripple {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  transform: scale(0);
  transition: transform 0.3s ease;
}

.action-btn:active .btn-ripple {
  transform: scale(1);
}

.modern-tooltip {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  font-size: 0.75rem;
  padding: 8px 12px;
}

/* ===== NO DATA ===== */
.no-data-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 32px;
  text-align: center;
}

.no-data-icon {
  color: #94a3b8;
  margin-bottom: 16px;
}

.no-data-title {
  font-size: 1.25rem;
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

/* ===== MODAL MODERNO ===== */
.modern-dialog :deep(.q-dialog__inner) {
  padding: 0;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  overflow-y: auto;
}

.modal-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.modal-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(16, 185, 129, 0.4);
  border-radius: 50%;
  animation: particle-float linear infinite;
}

.modern-modal {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.container-dark .modern-modal {
  background: rgba(15, 23, 42, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
}

.modal-header {
  padding: 32px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05));
}

.container-dark .modal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.modal-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.modal-title h6 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #1e293b;
}

.container-dark .modal-title h6 {
  color: #f8fafc;
}

.modal-title p {
  color: #64748b;
  margin: 4px 0 0 0;
  font-size: 0.875rem;
}

.container-dark .modal-title p {
  color: #94a3b8;
}

.close-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  position: relative;
  overflow: hidden;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.05);
}

.modal-body {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

/* ===== STEPPER MODERNO ===== */
.modern-stepper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.container-dark .step-card {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.step-card.active {
  border-color: #10b981;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
}

.step-header {
  padding: 20px;
  background: rgba(16, 185, 129, 0.05);
  border-bottom: 1px solid rgba(16, 185, 129, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.container-dark .step-header {
  background: rgba(16, 185, 129, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.step-header:hover {
  background: rgba(16, 185, 129, 0.1);
}

.step-indicator {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.container-dark .step-title {
  color: #f8fafc;
}

.step-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.container-dark .step-subtitle {
  color: #94a3b8;
}

.step-status {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-content {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.modern-field :deep(.q-field__control) {
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  height: 48px;
  transition: all 0.3s ease;
}

.modern-field :deep(.q-field--focused .q-field__control) {
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  background: rgba(16, 185, 129, 0.08);
}

/* ===== BANNER INFORMATIVO ===== */
.info-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.container-dark .info-banner {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.banner-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.banner-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.container-dark .banner-title {
  color: #f8fafc;
}

.banner-text {
  color: #64748b;
  font-size: 0.875rem;
}

.container-dark .banner-text {
  color: #94a3b8;
}

/* ===== SECCIÓN DE IMPUESTOS RETENIDOS ===== */
.withholding-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.container-dark .withholding-section {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-icon {
  color: #10b981;
  font-size: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.container-dark .section-title {
  color: #f8fafc;
}

.withholding-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.withholding-item {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-radius: 12px;
}

.container-dark .withholding-item {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.delete-tax-btn {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
}

.delete-tax-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.add-tax-btn {
  align-self: flex-start;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  padding: 8px 16px;
}

.add-tax-btn:hover {
  background: rgba(16, 185, 129, 0.2);
}

/* ===== VALIDACIÓN FACTUS ===== */
.factus-validation {
  margin-top: 32px;
  padding: 24px;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-radius: 16px;
}

.container-dark .factus-validation {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.validation-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.validation-icon {
  color: #10b981;
  font-size: 1.5rem;
}

.validation-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.container-dark .validation-title {
  color: #f8fafc;
}

.validation-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.validation-chip {
  align-self: flex-start;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 12px;
}

.missing-fields {
  color: #f59e0b;
}

.missing-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.missing-list {
  margin: 0;
  padding-left: 16px;
}

.missing-list li {
  margin-bottom: 4px;
}

/* ===== FOOTER DEL MODAL ===== */
.modal-footer {
  padding: 24px 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(248, 250, 252, 0.5);
}

.container-dark .modal-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(15, 23, 42, 0.5);
}

.footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.primary-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  color: #64748b;
  font-weight: 500;
  border-radius: 12px;
  padding: 8px 16px;
}

.cancel-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.nav-btn {
  color: #10b981;
  font-weight: 500;
  border-radius: 12px;
  padding: 8px 16px;
}

.nav-btn:hover {
  background: rgba(16, 185, 129, 0.1);
}

.modern-primary-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
  border: none;
}

.modern-primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.modern-primary-btn:disabled {
  opacity: 0.6;
  transform: none !important;
  box-shadow: none !important;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .modern-products-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .modern-modal {
    margin: 16px;
    max-height: calc(100vh - 32px);
  }

  .modal-header {
    padding: 24px;
  }

  .modal-header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .modal-body {
    padding: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .withholding-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .footer-actions {
    flex-direction: column;
    gap: 16px;
  }

  .primary-actions {
    width: 100%;
    justify-content: center;
  }

  .action-buttons-modern {
    flex-wrap: wrap;
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

.modern-table-row {
  animation: slideInUp 0.3s ease-out;
}

.step-card {
  animation: slideInUp 0.3s ease-out;
}

.modern-header-section,
.modern-filters-card,
.modern-table-container {
  animation: slideInUp 0.4s ease-out;
}

/* ===== EFECTOS DE HOVER ADICIONALES ===== */
.modern-filters-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

.container-dark .modern-filters-card:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.modern-table-container:hover {
  transform: translateY(-1px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

.container-dark .modern-table-container:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}
</style>