<template>
  <div class="modern-customers-container" :class="{ 'container-dark': $q.dark.isActive }">
    <!-- Partículas de fondo -->
    <div class="background-particles">
      <div class="particle" v-for="n in 15" :key="n" :style="getParticleStyle()"></div>
    </div>

    <!-- Header Glassmorphism -->
    <div class="modern-header-section">
      <div class="header-content">
        <div class="header-info">
          <div class="page-icon">
            <q-icon name="groups" size="2rem" />
          </div>
          <div>
            <h4 class="page-title">Gestión de Clientes</h4>
            <div class="page-subtitle">Administra los clientes y su información</div>
          </div>
        </div>

        <q-btn label="Nuevo Cliente" icon="add" @click="openDialog" class="modern-create-btn" no-caps unelevated>
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
          <q-input v-model="filterIdentification" label="Identificación" dense outlined class="modern-input" clearable>
            <template v-slot:prepend>
              <q-icon name="badge" class="input-icon" />
            </template>
          </q-input>
        </div>

        <div class="filter-item">
          <q-input v-model="filterName" label="Nombre" dense outlined class="modern-input" clearable>
            <template v-slot:prepend>
              <q-icon name="person" class="input-icon" />
            </template>
          </q-input>
        </div>

        <div class="filter-item">
          <q-input v-model="filterEmail" label="Email" dense outlined class="modern-input" clearable>
            <template v-slot:prepend>
              <q-icon name="email" class="input-icon" />
            </template>
          </q-input>
        </div>

        <div class="filter-item">
          <q-select v-model="filterState" :options="stateOptions" label="Estado" dense outlined class="modern-select"
            clearable emit-value map-options>
            <template v-slot:prepend>
              <q-icon name="circle" class="input-icon" />
            </template>
          </q-select>
        </div>
      </div>
    </div>

    <!-- Tabla Moderna -->
    <div class="modern-table-container">
      <q-table flat :rows="filteredRows" :columns="columns" row-key="_id" :pagination="pagination"
        :rows-per-page-options="[10, 20, 50]" class="modern-table" :loading="loading"
        :class="{ 'table-dark': $q.dark.isActive }">
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
            <q-td key="identification" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="badge" />
                </div>
                <span class="cell-text">{{ props.row.identification }}</span>
              </div>
            </q-td>

            <q-td key="names" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="person" />
                </div>
                <span class="cell-text">{{ props.row.company || props.row.names }}</span>
              </div>
            </q-td>

            <q-td key="email" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="email" />
                </div>
                <span class="cell-text">{{ props.row.email || 'N/A' }}</span>
              </div>
            </q-td>

            <q-td key="phone" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="phone" />
                </div>
                <span class="cell-text">{{ props.row.phone || 'N/A' }}</span>
              </div>
            </q-td>

            <q-td key="municipality_id" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="location_on" />
                </div>
                <span class="cell-text">{{ obtenerLocalidad(props.row.municipality_id) }}</span>
              </div>
            </q-td>

            <q-td key="state" class="text-center">
              <q-chip :color="props.row.state == 1 ? 'positive' : 'negative'"
                :label="props.row.state == 1 ? 'Activo' : 'Inactivo'" class="modern-status-chip"
                :icon="props.row.state == 1 ? 'check_circle' : 'cancel'" />
            </q-td>

            <q-td key="actions" class="text-center">
              <div class="action-buttons-modern">
                <q-btn round dense icon="edit" @click="editCustomer(props.row)" class="action-btn edit-btn" size="sm">
                  <q-tooltip class="modern-tooltip">Editar</q-tooltip>
                  <div class="btn-ripple"></div>
                </q-btn>

                <q-btn round dense :icon="props.row.state === 1 ? 'toggle_off' : 'toggle_on'"
                  @click="showConfirmationState(props.row)"
                  :class="['action-btn', props.row.state === 1 ? 'deactivate-btn' : 'activate-btn']" size="sm">
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
              <q-icon name="search_off" size="3rem" />
            </div>
            <div class="no-data-text">
              <div class="no-data-title">No se encontraron clientes</div>
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
                <h6>{{ editMode ? 'Editar Cliente' : 'Nuevo Cliente' }}</h6>
                <p>{{ editMode ? 'Actualiza la información del cliente' : 'Completa los datos del nuevo cliente' }}</p>
              </div>
            </div>
            <q-btn icon="close" flat round dense @click="dialog = false" class="close-btn">
              <div class="btn-ripple"></div>
            </q-btn>
          </div>

          <div class="modal-body">
            <q-form ref="customerForm" @submit.prevent>
              <div class="modern-stepper">
                <!-- Paso 1: Información Básica -->
                <div class="step-card" :class="{ 'active': currentStep === 1 }">
                  <div class="step-header" @click="currentStep = 1">
                    <div class="step-indicator">
                      <q-icon name="info" />
                    </div>
                    <div class="step-info">
                      <div class="step-title">Información Básica</div>
                      <div class="step-subtitle">Datos principales del cliente</div>
                    </div>
                    <div class="step-status">
                      <q-icon name="check_circle" color="positive" v-if="isStepValid(1)" />
                      <q-icon name="error" color="negative" v-else-if="hasStepErrors(1)" />
                    </div>
                  </div>

                  <div class="step-content" v-if="currentStep === 1">
                    <div class="form-grid">
                      <q-select v-model="form.legal_organization_id" :options="entityTypes" label="Tipo de Entidad *"
                        outlined dense emit-value map-options option-label="name" option-value="id"
                        @update:model-value="changeEntityType" class="modern-field"
                        :rules="validationRules.legal_organization_id" reactive-rules />

                      <q-input v-model="form.company" label="Razón Social *" outlined dense class="modern-field"
                        v-if="form.legal_organization_id === 1" :rules="validationRules.company" reactive-rules />

                      <q-input v-model="form.trade_name" label="Nombre Comercial" outlined dense class="modern-field"
                        v-if="form.legal_organization_id === 1" :rules="validationRules.trade_name" reactive-rules />

                      <q-input v-model="form.names" label="Nombre Completo *" outlined dense class="modern-field"
                        v-if="form.legal_organization_id === 2" :rules="validationRules.names" reactive-rules />

                      <q-select v-model="form.identification_document_id" :options="documentTypes"
                        label="Tipo de Documento *" outlined dense emit-value map-options class="modern-field"
                        :rules="validationRules.identification_document_id" reactive-rules />

                      <q-input v-model="form.identification" label="Número de Documento *" outlined dense
                        class="modern-field" :rules="validationRules.identification" reactive-rules
                        @blur="validateIdentificationUnique" />
                    </div>
                  </div>
                </div>

                <!-- Paso 2: Información de Contacto -->
                <div class="step-card" :class="{ 'active': currentStep === 2 }">
                  <div class="step-header" @click="currentStep = 2">
                    <div class="step-indicator">
                      <q-icon name="contact_mail" />
                    </div>
                    <div class="step-info">
                      <div class="step-title">Información de Contacto</div>
                      <div class="step-subtitle">Datos de contacto y ubicación</div>
                    </div>
                    <div class="step-status">
                      <q-icon name="check_circle" color="positive" v-if="isStepValid(2)" />
                      <q-icon name="error" color="negative" v-else-if="hasStepErrors(2)" />
                    </div>
                  </div>

                  <div class="step-content" v-if="currentStep === 2">
                    <div class="form-grid">
                      <q-input v-model="form.address" label="Dirección" outlined dense class="modern-field full-width"
                        :rules="validationRules.address" reactive-rules />

                      <q-input v-model="form.email" label="Correo Electrónico" type="email" outlined dense
                        class="modern-field" :rules="validationRules.email" reactive-rules
                        @blur="validateEmailUnique" />

                      <q-input v-model="form.phone" label="Teléfono" type="tel" outlined dense class="modern-field"
                        :rules="validationRules.phone" reactive-rules />

                      <q-select v-model="form.municipality_id" :options="filteredLocations" label="Localidad" outlined
                        dense use-input input-debounce="0" @filter="filterLocations" emit-value map-options
                        option-label="nombre" option-value="codigo" class="modern-field"
                        :rules="validationRules.municipality_id" reactive-rules />

                      <q-select  v-if="form.legal_organization_id !== 2" v-model="form.tribute_id" :options="taxOptions" label="Régimen Fiscal" outlined dense
                        emit-value map-options class="modern-field" :rules="validationRules.tribute_id"
                        reactive-rules />
                    </div>
                  </div>
                </div>
              </div>
            </q-form>
          </div>

          <div class="modal-footer">
            <div class="footer-actions">
              <q-btn label="Cancelar" flat @click="dialog = false" class="cancel-btn" />

              <div class="primary-actions">
                <q-btn label="Anterior" flat v-if="currentStep > 1" @click="prevStep" class="nav-btn" />
                <q-btn label="Siguiente" v-if="currentStep < 2" @click="nextStep" class="modern-primary-btn"
                  :disable="!canGoToNextStep" />
                <q-btn :label="editMode ? 'Actualizar Cliente' : 'Guardar Cliente'" v-if="currentStep === 2"
                  @click="editMode ? updateCustomer() : saveCustomer()" :loading="loading" class="modern-primary-btn"
                  :disable="!canSaveCustomer" />
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
// El script setup permanece igual que el original
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { getData } from '../services/apiClient';
import { backgetData, backpostData, backputData } from '../services/backClient';
import { Notify } from 'quasar';
import Swal from 'sweetalert2';

const $q = useQuasar();

// Variables reactivas (mantener las originales)
const customers = ref([]);
const pagination = ref({ page: 1, rowsPerPage: 10 });
const loading = ref(false);
const dialog = ref(false);
const editMode = ref(false);
const currentStep = ref(1);
const customerForm = ref(null);

// Filtros
const filterIdentification = ref('');
const filterName = ref('');
const filterEmail = ref('');
const filterState = ref(null);
const stateOptions = [
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 0 }
];

// Formulario
const form = ref({
  legal_organization_id: null,
  identification: '',
  company: '',
  trade_name: '',
  names: '',
  address: '',
  email: '',
  phone: '',
  tribute_id: null,
  identification_document_id: null,
  municipality_id: null
});

// Reglas de validación
const validationRules = {
  legal_organization_id: [
    val => val !== null && val !== '' && val !== undefined || 'El tipo de entidad es requerido'
  ],
  company: [
    val => {
      if (form.value.legal_organization_id === 1) {
        return (val && val.trim().length >= 2) || 'La razón social debe tener al menos 2 caracteres'
      }
      return true
    }
  ],
  trade_name: [
    val => {
      if (form.value.legal_organization_id === 1 && val && val.trim().length > 0) {
        return val.trim().length >= 2 || 'El nombre comercial debe tener al menos 2 caracteres'
      }
      return true
    }
  ],
  names: [
    val => {
      if (form.value.legal_organization_id === 2) {
        return (val && val.trim().length >= 2) || 'El nombre completo debe tener al menos 2 caracteres'
      }
      return true
    }
  ],
  identification_document_id: [
    val => val !== null && val !== '' && val !== undefined || 'El tipo de documento es requerido'
  ],
  identification: [
    val => (val && val.toString().trim().length > 0) || 'El número de documento es requerido',
    val => {
      const cleaned = val ? val.toString().replace(/\D/g, '') : '';
      return cleaned.length >= 5 || 'El número de documento debe tener al menos 5 dígitos'
    },
    val => {
      const cleaned = val ? val.toString().replace(/\D/g, '') : '';
      return cleaned.length <= 12 || 'El número de documento no puede tener más de 12 dígitos'
    },
    val => /^[0-9]+$/.test(val ? val.toString().replace(/\D/g, '') : '') || 'El número de documento solo puede contener números'
  ],
  email: [
    val => {
      if (!val || val.trim() === '') return true; // Opcional
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(val) || 'Ingrese un email válido'
    }
  ],
  phone: [
    val => {
      if (!val || val.toString().trim() === '') return true; // Opcional
      const phonePattern = /^[0-9+\-\s()]+$/
      return phonePattern.test(val) || 'Ingrese un teléfono válido (solo números, +, -, espacios y paréntesis)'
    },
    val => {
      if (!val || val.toString().trim() === '') return true;
      const cleaned = val.toString().replace(/\D/g, '');
      return cleaned.length >= 7 || 'El teléfono debe tener al menos 7 dígitos'
    },
    val => {
      if (!val || val.toString().trim() === '') return true;
      const cleaned = val.toString().replace(/\D/g, '');
      return cleaned.length <= 13 || 'El teléfono no puede tener más de 13 dígitos'
    }
  ],
  address: [
    val => {
      if (!val || val.trim() === '') return true; // Opcional
      return val.trim().length >= 5 || 'La dirección debe tener al menos 5 caracteres'
    }
  ],
  municipality_id: [
    // Opcional - no se requiere validación específica ya que es un select
  ],
  tribute_id: [
    // Opcional - no se requiere validación específica ya que es un select
  ]
};
const validateEmailUnique = async () => {
  if (!form.value.email || editMode.value) return;

  const existingCustomer = customers.value.find(customer =>
    customer.email && customer.email.toLowerCase() === form.value.email.toLowerCase()
  );

  if (existingCustomer) {
    Notify.create({
      type: 'warning',
      message: 'Ya existe un cliente con este correo electrónico',
      position: 'top-right'
    });
    return true; // Indica que hay un duplicado
  }
  return false; // No hay duplicado
}

// Datos y opciones (mantener originales)
const entityTypes = [
  { id: 1, name: 'Empresa' },
  { id: 2, name: 'Persona natural' }
];

const taxOptions = ref([
  { label: 'IVA', value: 18 },
  { label: 'Exento', value: 21 }
]);

const documentTypes = ref([
  { label: 'RC - Registro civil', value: 1 },
  { label: 'TI - Tarjeta identidad', value: 2 },
  { label: 'CC - Cédula ciudadanía', value: 3 },
  { label: 'TE - Tarjeta extranjería', value: 4 },
  { label: 'CE - Cédula extranjería', value: 5 },
  { label: 'NIT - Número identificación tributaria', value: 6 },
  { label: 'PP - Pasaporte', value: 7 },
  { label: 'DIE - Documento identificación extranjero', value: 8 },
  { label: 'PEP - Permiso especial permanencia', value: 9 },
  { label: 'NIT-EX - NIT extranjero', value: 10 },
  { label: 'NUIP - Número único identificación personal', value: 11 }
]);

const locations = ref([]);
const filteredLocations = ref([]);

// Columnas
const columns = [
  { name: 'identification', label: 'Identificación', align: 'left', field: row => row.identification, sortable: true },
  { name: 'names', label: 'Nombre', align: 'left', field: row => row.company || row.names, sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: row => row.email, sortable: true },
  { name: 'phone', label: 'Teléfono', align: 'center', field: row => row.phone, sortable: true },
  { name: 'municipality_id', label: 'Localidad', align: 'center', field: row => row.municipality_id, sortable: true },
  { name: 'state', label: 'Estado', align: 'center', field: row => row.state, sortable: true },
  { name: 'actions', label: 'Acciones', align: 'center' }
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
    identification: 'badge',
    names: 'person',
    email: 'email',
    phone: 'phone',
    municipality_id: 'location_on',
    state: 'circle',
    actions: 'settings'
  }
  return icons[columnName] || 'info'
}

// Función para validar identificación única
const validateIdentificationUnique = async () => {
  if (!form.value.identification || editMode.value) return;

  const existingCustomer = customers.value.find(customer =>
    customer.identification === form.value.identification.toString()
  );

  if (existingCustomer) {
    Notify.create({
      type: 'warning',
      message: 'Ya existe un cliente con este número de identificación',
      position: 'top-right'
    });
  }
}

// Función para validar un paso específico
const validateStep = async (step) => {
  if (!customerForm.value) return false;

  try {
    let isValid = true;

    if (step === 1) {
      // Validar campos del paso 1
      const step1Fields = ['legal_organization_id', 'identification_document_id', 'identification'];

      if (form.value.legal_organization_id === 1) {
        step1Fields.push('company');
      } else if (form.value.legal_organization_id === 2) {
        step1Fields.push('names');
      }

      for (const field of step1Fields) {
        const rules = validationRules[field];
        if (rules) {
          for (const rule of rules) {
            const result = rule(form.value[field]);
            if (typeof result === 'string') {
              isValid = false;
              break;
            }
          }
        }
      }
    } else if (step === 2) {
      // Validar campos del paso 2 si tienen valor
      const step2Fields = ['email', 'phone', 'address'];

      for (const field of step2Fields) {
        if (form.value[field]) {
          const rules = validationRules[field];
          if (rules) {
            for (const rule of rules) {
              const result = rule(form.value[field]);
              if (typeof result === 'string') {
                isValid = false;
                break;
              }
            }
          }
        }
      }
    }

    return isValid;
  } catch (error) {
    console.error('Error validating step:', error);
    return false;
  }
}

// Computed actualizado
const filteredRows = computed(() => {
  return customers.value.filter(customer => {
    const matchesIdentification = !filterIdentification.value ||
      (customer.identification || '').toLowerCase().includes(filterIdentification.value.toLowerCase());
    const matchesName = !filterName.value ||
      ((customer.company || customer.names || '').toLowerCase().includes(filterName.value.toLowerCase()));
    const matchesEmail = !filterEmail.value ||
      (customer.email || '').toLowerCase().includes(filterEmail.value.toLowerCase());
    const matchesState = filterState.value === null ||
      customer.state === filterState.value;
    return matchesIdentification && matchesName && matchesEmail && matchesState;
  });
});

const canGoToNextStep = computed(() => {
  if (currentStep.value === 1) {
    // Validaciones básicas para el paso 1
    if (!form.value.legal_organization_id || !form.value.identification || !form.value.identification_document_id) {
      return false;
    }

    // Validar que tenga nombre según el tipo de entidad
    if (form.value.legal_organization_id === 1 && !form.value.company) {
      return false;
    }

    if (form.value.legal_organization_id === 2 && !form.value.names) {
      return false;
    }

    // Validar formato de identificación
    const identification = form.value.identification.toString().replace(/\D/g, '');
    if (identification.length < 5 || identification.length > 15) {
      return false;
    }

    return true;
  }
  return true;
});

const canSaveCustomer = computed(() => {
  // Mismas validaciones que canGoToNextStep para el paso 1
  if (!form.value.legal_organization_id || !form.value.identification || !form.value.identification_document_id) {
    return false;
  }

  if (form.value.legal_organization_id === 1 && !form.value.company) {
    return false;
  }

  if (form.value.legal_organization_id === 2 && !form.value.names) {
    return false;
  }

  const identification = form.value.identification.toString().replace(/\D/g, '');
  if (identification.length < 5 || identification.length > 15) {
    return false;
  }

  // Validar email si se proporciona
  if (form.value.email && form.value.email.trim() !== '') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.value.email)) {
      return false;
    }
  }

  // Validar teléfono si se proporciona
  if (form.value.phone && form.value.phone.toString().trim() !== '') {
    const phonePattern = /^[0-9+\-\s()]+$/;
    const cleaned = form.value.phone.toString().replace(/\D/g, '');
    if (!phonePattern.test(form.value.phone) || cleaned.length < 7 || cleaned.length > 15) {
      return false;
    }
  }

  return true;
});

const isStepValid = (step) => {
  if (step === 1) {
    return !!(form.value.legal_organization_id &&
      form.value.identification &&
      form.value.identification_document_id &&
      (form.value.legal_organization_id === 1 ? form.value.company : form.value.names));
  }
  if (step === 2) {
    // El paso 2 siempre es válido ya que todos sus campos son opcionales
    return true;
  }
  return false;
};

const hasStepErrors = (step) => {
  if (step === 1) {
    // Verificar si hay errores en los campos requeridos del paso 1
    if (!form.value.legal_organization_id || !form.value.identification_document_id) {
      return true;
    }

    if (form.value.identification) {
      const identification = form.value.identification.toString().replace(/\D/g, '');
      if (identification.length < 5 || identification.length > 15) {
        return true;
      }
    }

    if (form.value.legal_organization_id === 1 && form.value.company && form.value.company.trim().length < 2) {
      return true;
    }

    if (form.value.legal_organization_id === 2 && form.value.names && form.value.names.trim().length < 2) {
      return true;
    }
  }

  if (step === 2) {
    // Verificar errores en campos opcionales del paso 2
    if (form.value.email && form.value.email.trim() !== '') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.value.email)) {
        return true;
      }
    }

    if (form.value.phone && form.value.phone.toString().trim() !== '') {
      const phonePattern = /^[0-9+\-\s()]+$/;
      const cleaned = form.value.phone.toString().replace(/\D/g, '');
      if (!phonePattern.test(form.value.phone) || cleaned.length < 7 || cleaned.length > 15) {
        return true;
      }
    }
  }

  return false;
};

// Métodos (mantener las funciones originales)
const changeEntityType = () => {
  if (form.value.legal_organization_id === 1) {
    form.value.names = '';
  } else if (form.value.legal_organization_id === 2) {
    // Persona natural - establecer IVA por defecto
    form.value.company = '';
    form.value.trade_name = '';
    form.value.tribute_id = 18; // Establece IVA como valor por defecto
  }
};

const openDialog = () => {
  dialog.value = true;
  resetForm();
};

const resetForm = () => {
  form.value = {
    legal_organization_id: null,
    identification: '',
    company: '',
    trade_name: '',
    names: '',
    address: '',
    email: '',
    phone: '',
    tribute_id: 18, // Valor por defecto (IVA)
    identification_document_id: null,
    municipality_id: null
  };
  currentStep.value = 1;
  editMode.value = false;
  
  if (customerForm.value) {
    customerForm.value.resetValidation();
  }
};

const nextStep = async () => {
  const isValid = await validateStep(currentStep.value);
  if (isValid && currentStep.value < 2) {
    currentStep.value++;
  } else if (!isValid) {
    Notify.create({
      type: 'warning',
      message: 'Por favor corrige los errores antes de continuar',
      position: 'top-right'
    });
  }
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const filterLocations = (val, update) => {
  if (val === '') {
    update(() => {
      filteredLocations.value = locations.value;
    });
    return;
  }
  update(() => {
    const search = val.toLowerCase();
    filteredLocations.value = locations.value.filter(
      loc => loc.nombre.toLowerCase().includes(search)
    );
  });
};

const obtenerLocalidad = (idLocalidad) => {
  const location = locations.value.find(l => Number(l.codigo) === Number(idLocalidad));
  return location ? location.nombre : "No especificada";
};

// Funciones CRUD (mantener originales pero añadir validaciones antes de guardar)
async function loadCustomers() {
  try {
    loading.value = true;
    const response = await backgetData('customer');
    if (response && Array.isArray(response)) {
      customers.value = response.sort((a, b) => {
        if (a._id && b._id) {
          return b._id.localeCompare(a._id);
        }
        return 0;
      });
    } else {
      customers.value = [];
    }
  } catch (error) {
    console.error('Error al cargar clientes:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al cargar los clientes',
      position: 'top-right'
    });
    customers.value = [];
  } finally {
    loading.value = false;
  }
}

const saveCustomer = async () => {
  // Validar formulario antes de guardar
  if (!customerForm.value) {
    console.error('Form reference not found');
    return;
  }

  const isFormValid = await customerForm.value.validate();
  if (!isFormValid) {
    Notify.create({
      type: 'warning',
      message: 'Por favor corrige los errores en el formulario',
      position: 'top-right'
    });
    return;
  }

  // Verificar identificación única
  const existingByIdentification = customers.value.find(customer =>
    customer.identification === form.value.identification.toString()
  );

  if (existingByIdentification) {
    Notify.create({
      type: 'negative',
      message: 'Ya existe un cliente con este número de identificación',
      position: 'top-right'
    });
    return;
  }

  // Verificar correo único solo si se proporciona un email
  if (form.value.email && form.value.email.trim() !== '') {
    const emailExists = await validateEmailUnique();
    if (emailExists) return;
  }

  loading.value = true;
  const toUpperCaseObject = (obj) => {
    const result = {};
    for (const key in obj) {
      const value = obj[key];
      result[key] = typeof value === 'string' ? value.toUpperCase() : value;
    }
    return result;
  };

  const formattedForm = toUpperCaseObject(form.value);
  const newCustomer = {
    ...formattedForm,
    identification: String(formattedForm.identification),
    municipality_id: Number(formattedForm.municipality_id),
    legal_organization_id: Number(formattedForm.legal_organization_id),
    tribute_id: Number(formattedForm.tribute_id),
    identification_document_id: Number(formattedForm.identification_document_id),
    state: 1
  };

  try {
    const saved = await backpostData('customer', newCustomer);
    dialog.value = false;
    Notify.create({
      type: 'positive',
      message: '✨ Cliente registrado exitosamente',
      position: 'top-right',
      timeout: 3000
    });
    customers.value.unshift(saved);
  } catch (error) {
    console.error('Error al guardar cliente:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al guardar el cliente',
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
};

const editCustomer = (customer) => {
  form.value = {
    ...JSON.parse(JSON.stringify(customer)),
    legal_organization_id: Number(customer.legal_organization_id),
    tribute_id: Number(customer.tribute_id),
    identification_document_id: Number(customer.identification_document_id),
    municipality_id: Number(customer.municipality_id)
  };
  editMode.value = true;
  dialog.value = true;
};

const updateCustomer = async () => {
  // Validar formulario antes de actualizar
  if (!customerForm.value) {
    console.error('Form reference not found');
    return;
  }

  const isFormValid = await customerForm.value.validate();
  if (!isFormValid) {
    Notify.create({
      type: 'warning',
      message: 'Por favor corrige los errores en el formulario',
      position: 'top-right'
    });
    return;
  }

  // Verificar correo único solo si se proporciona un email y ha cambiado
  if (form.value.email && form.value.email.trim() !== '') {
    const originalCustomer = customers.value.find(c => c._id === form.value._id);
    if (!originalCustomer || originalCustomer.email !== form.value.email) {
      const emailExists = await validateEmailUnique();
      if (emailExists) return;
    }
  }

  loading.value = true;
  const updatedCustomer = {
    ...form.value,
    identification: String(form.value.identification),
    municipality_id: Number(form.value.municipality_id),
    legal_organization_id: Number(form.value.legal_organization_id),
    tribute_id: Number(form.value.tribute_id),
    identification_document_id: Number(form.value.identification_document_id)
  };

  try {
    await backputData(`customer/${form.value._id}`, updatedCustomer);
    dialog.value = false;
    Notify.create({
      type: 'positive',
      message: '✨ Cliente actualizado exitosamente',
      position: 'top-right',
      timeout: 3000
    });
    await loadCustomers();
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al actualizar el cliente',
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
};

const changeCustomerState = async (customer) => {
  if (!customer) return;
  customer.state = customer.state === 1 ? 0 : 1;
  try {
    await backputData(`customer/${customer._id}`, { state: customer.state });
    Notify.create({
      type: customer.state === 1 ? 'positive' : 'warning',
      message: `Cliente ${customer.state === 1 ? 'activado' : 'desactivado'} correctamente`,
      position: 'top-right'
    });
    await loadCustomers();
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al cambiar el estado del cliente',
      position: 'top-right'
    });
  }
};

const showConfirmationState = (customer) => {
  Swal.fire({
    title: '¿Cambiar estado del cliente?',
    text: `El cliente pasará a estado ${customer.state === 1 ? 'Inactivo' : 'Activo'}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sí, cambiar',
    background: $q.dark.isActive ? '#1e293b' : '#ffffff',
    color: $q.dark.isActive ? '#f8fafc' : '#1e293b'
  }).then((result) => {
    if (result.isConfirmed) {
      changeCustomerState(customer);
    }
  });
};

const loadLocations = async () => {
  try {
    const response = await getData('/v1/municipalities');
    if (response.data && Array.isArray(response.data)) {
      locations.value = response.data.map(item => ({
        nombre: `${item.name} - ${item.department}`,
        codigo: item.id
      }));
      filteredLocations.value = locations.value;
    }
  } catch (error) {
    console.error('Error al cargar municipios:', error);
    locations.value = [
      { nombre: 'Bogotá - Cundinamarca', codigo: 11001 },
      { nombre: 'Medellín - Antioquia', codigo: 5001 },
      { nombre: 'Cali - Valle del Cauca', codigo: 76001 },
      { nombre: 'Barranquilla - Atlántico', codigo: 8001 },
      { nombre: 'Cartagena - Bolívar', codigo: 13001 }
    ];
    filteredLocations.value = locations.value;
  }
};

// Inicialización
onMounted(async () => {
  await loadCustomers();
  await loadLocations();
});
</script>

<style scoped>
/* ===== TRANSICIONES GLOBALES ===== */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== CONTENEDOR PRINCIPAL ===== */
.modern-customers-container {
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
  background: linear-gradient(45deg, #3b82f6, #60a5fa);
  border-radius: 50%;
  opacity: 0.6;
  animation: particle-float linear infinite;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.3);
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
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
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
  background: linear-gradient(135deg, #1e293b, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.container-dark .page-title {
  background: linear-gradient(135deg, #f8fafc, #3b82f6);
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
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  border: none;
}

.modern-create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
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
  color: #3b82f6;
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
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  height: 48px;
  transition: all 0.3s ease;
}

.modern-input :deep(.q-field--focused .q-field__control),
.modern-select :deep(.q-field--focused .q-field__control) {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: rgba(59, 130, 246, 0.08);
}

.input-icon {
  color: #3b82f6;
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
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
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
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
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
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
}

.cell-text {
  font-weight: 500;
  color: #1e293b;
}

.table-dark .cell-text {
  color: #f8fafc;
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
  background: rgba(59, 130, 246, 0.4);
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
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(29, 78, 216, 0.05));
}

.container-dark .modal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.modal-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
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
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.container-dark .step-card {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.step-card.active {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.step-header {
  padding: 20px;
  background: rgba(59, 130, 246, 0.05);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.container-dark .step-header {
  background: rgba(59, 130, 246, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.step-header:hover {
  background: rgba(59, 130, 246, 0.1);
}

.step-indicator {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
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

.full-width {
  grid-column: 1 / -1;
}

.modern-field :deep(.q-field__control) {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  height: 48px;
  transition: all 0.3s ease;
}

.modern-field :deep(.q-field--focused .q-field__control) {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: rgba(59, 130, 246, 0.08);
}

/* ===== ESTILOS PARA VALIDACIÓN ===== */
.modern-field :deep(.q-field--error .q-field__control) {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.modern-field :deep(.q-field__messages) {
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 4px;
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
  color: #3b82f6;
  font-weight: 500;
  border-radius: 12px;
  padding: 8px 16px;
}

.nav-btn:hover {
  background: rgba(59, 130, 246, 0.1);
}

.modern-primary-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  border: none;
}

.modern-primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.modern-primary-btn:disabled {
  opacity: 0.6;
  transform: none !important;
  box-shadow: none !important;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .modern-customers-container {
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