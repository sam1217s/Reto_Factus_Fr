<template>
  <div class="modern-invoices-container" :class="{ 'container-dark': $q.dark.isActive }">
    <!-- Partículas de fondo -->
    <div class="background-particles">
      <div class="particle" v-for="n in 15" :key="n" :style="getParticleStyle()"></div>
    </div>

    <!-- Header Glassmorphism -->
    <div class="modern-header-section">
      <div class="header-content">
        <div class="header-info">
          <div class="page-icon">
            <q-icon name="receipt_long" size="2rem" />
          </div>
          <div>
            <h4 class="page-title">Gestión de Facturas</h4>
            <div class="page-subtitle">Administra las facturas electrónicas</div>
          </div>
        </div>

        <div class="header-buttons">
          <q-btn 
            label="Sincronizar Estados" 
            icon="sync" 
            @click="sincronizarEstados"
            class="modern-sync-btn"
            no-caps
            :loading="syncLoading"
          >
            <q-tooltip>Sincronizar estados de facturas con Factus</q-tooltip>
            <div class="btn-glow"></div>
          </q-btn>

          <q-btn 
            label="Nueva Factura" 
            icon="add" 
            @click="openInvoiceModal" 
            class="modern-create-btn"
            no-caps
            unelevated
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
        <span class="filters-title">Filtros de búsqueda</span>
      </div>
      
      <div class="filters-grid">
        <div class="filter-item">
          <q-input 
            v-model="filterNumber" 
            label="N° Factura" 
            dense 
            outlined 
            class="modern-input"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="description" class="input-icon" />
            </template>
          </q-input>
        </div>

        <div class="filter-item">
          <q-input 
            v-model="filterCustomer" 
            label="Nombre Cliente" 
            dense 
            outlined 
            class="modern-input"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="person" class="input-icon" />
            </template>
          </q-input>
        </div>

        <div class="filter-item">
          <q-input 
            v-model="filterIdentification" 
            label="Identificación Cliente" 
            dense 
            outlined 
            class="modern-input"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="badge" class="input-icon" />
            </template>
          </q-input>
        </div>

        <div class="filter-item">
          <q-input 
            v-model="filterDate" 
            label="Fecha" 
            dense 
            outlined 
            type="date" 
            class="modern-input"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="event" class="input-icon" />
            </template>
          </q-input>
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
            <q-td key="number" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="description" />
                </div>
                <span class="cell-text">{{ props.row.factusData?.number || props.row.number || 'N/A' }}</span>
              </div>
            </q-td>

            <q-td key="customer" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar customer-avatar">
                  <q-icon name="person" />
                </div>
                <span class="cell-text">{{ props.row.names || props.row.customer?.names || props.row.customer?.company || 'Cliente' }}</span>
              </div>
            </q-td>

            <q-td key="product" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar product-avatar">
                  <q-icon name="inventory_2" />
                </div>
                <span class="cell-text">{{ getProductName(props.row) }}</span>
              </div>
            </q-td>

            <q-td key="identification" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="badge" />
                </div>
                <span class="cell-text">{{ props.row.identification || props.row.customer?.identification || 'N/A' }}</span>
              </div>
            </q-td>

            <q-td key="createdAt" class="cell-with-icon">
              <div class="cell-content">
                <div class="cell-avatar">
                  <q-icon name="event" />
                </div>
                <span class="cell-text">{{ date.formatDate(props.row.createdAt, 'DD/MM/YYYY') }}</span>
              </div>
            </q-td>

            <q-td key="status" class="text-center">
              <q-chip 
                :color="getStatusColor(props.row)" 
                :label="getStatusLabel(props.row)" 
                class="modern-status-chip"
                :icon="getStatusIcon(props.row)"
              />
            </q-td>

            <q-td key="actions" class="text-center">
              <div class="action-buttons-modern">
                <q-btn 
                  round 
                  dense 
                  icon="visibility" 
                  @click="handleAction('view', props.row)" 
                  class="action-btn view-btn"
                  size="sm"
                >
                  <q-tooltip class="modern-tooltip">Detalles</q-tooltip>
                  <div class="btn-ripple"></div>
                </q-btn>

                <q-btn 
                  round 
                  dense 
                  icon="file_download" 
                  @click="handleAction('download', props.row)" 
                  class="action-btn download-btn"
                  size="sm"
                >
                  <q-tooltip class="modern-tooltip">Descargar PDF</q-tooltip>
                  <div class="btn-ripple"></div>
                </q-btn>

                <q-btn 
                  round 
                  dense 
                  icon="email" 
                  @click="handleAction('email', props.row)" 
                  class="action-btn email-btn"
                  size="sm"
                >
                  <q-tooltip class="modern-tooltip">Enviar por email</q-tooltip>
                  <div class="btn-ripple"></div>
                </q-btn>

                <q-btn 
                  round 
                  dense 
                  icon="refresh" 
                  @click="verificarEstadoIndividual(props.row)"
                  v-if="props.row.status === 'pending' && props.row.factusData?.number"
                  class="action-btn refresh-btn"
                  size="sm"
                >
                  <q-tooltip class="modern-tooltip">Verificar estado en Factus</q-tooltip>
                  <div class="btn-ripple"></div>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:no-data>
          <div class="no-data-modern">
            <div class="no-data-icon">
              <q-icon name="receipt_off" size="3rem" />
            </div>
            <div class="no-data-text">
              <div class="no-data-title">No se encontraron facturas</div>
              <div class="no-data-subtitle">Intenta ajustar los filtros de búsqueda</div>
            </div>
          </div>
        </template>
      </q-table>
    </div>

    <!-- ✅ DIÁLOGO DE CONFIRMACIÓN PARA FACTURAS PENDIENTES -->
    <q-dialog v-model="mostrarDialogoForzar" persistent class="modern-dialog">
      <div class="modal-backdrop">
        <div class="modal-particles">
          <div class="modal-particle" v-for="n in 8" :key="n" :style="getModalParticleStyle()"></div>
        </div>
        
        <q-card class="modern-modal confirmation-modal">
          <div class="modal-header warning-header">
            <div class="modal-header-content">
              <div class="modal-icon warning-icon">
                <q-icon name="warning" />
              </div>
              <div class="modal-title">
                <h6>Facturas Pendientes Detectadas</h6>
                <p>Se detectaron facturas pendientes, revisa antes de continuar</p>
              </div>
            </div>
          </div>

          <div class="modal-body">
            <div class="pending-invoices-list">
              <div v-for="factura in facturasPendientesDetectadas" :key="factura._id" class="pending-invoice-item">
                <div class="invoice-info">
                  <div class="invoice-number">{{ factura.factusData?.number || factura.reference_code }}</div>
                  <div class="invoice-details">
                    {{ factura.customer?.names || factura.customer?.company }} - 
                    {{ date.formatDate(factura.createdAt, 'DD/MM/YYYY HH:mm') }}
                  </div>
                </div>
                <q-chip 
                  :color="factura.factusData?.cufe ? 'positive' : 'warning'" 
                  :label="factura.factusData?.cufe ? 'Ya Procesada' : 'Pendiente'"
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="footer-actions">
              <q-btn 
                label="Cancelar" 
                flat 
                @click="mostrarDialogoForzar = false" 
                class="cancel-btn"
              />
              <div class="primary-actions">
                <q-btn 
                  label="Sincronizar Estados" 
                  @click="sincronizarEstados(); mostrarDialogoForzar = false" 
                  :loading="syncLoading"
                  class="modern-secondary-btn"
                />
                <q-btn 
                  label="Crear de Todas Formas" 
                  @click="forzarCreacionFactura"
                  class="modern-primary-btn"
                />
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </q-dialog>

    <!-- ✅ MODAL DE CREAR FACTURA MEJORADO -->
    <q-dialog v-model="showModal" maximized class="modern-dialog">
      <div class="modal-backdrop">
        <div class="modal-particles">
          <div class="modal-particle" v-for="n in 8" :key="n" :style="getModalParticleStyle()"></div>
        </div>
        
        <q-card class="modern-modal invoice-creation-modal">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <q-icon name="add" />
              </div>
              <div class="modal-title">
                <h6>Nueva Factura</h6>
                <p>Completa los datos para crear una nueva factura electrónica</p>
              </div>
            </div>
            <q-btn icon="close" flat round dense @click="showModal = false" class="close-btn">
              <div class="btn-ripple"></div>
            </q-btn>
          </div>

          <div class="modal-body">
            <!-- ✅ BANNER DE ESTADO FACTUS -->
            <div class="factus-status-banner">
              <q-banner 
                :class="authStatus.authenticated ? 'bg-positive text-white' : 'bg-warning text-black'"
                :icon="authStatus.authenticated ? 'check_circle' : 'warning'"
                class="modern-banner"
              >
                <template v-slot:avatar>
                  <q-icon :name="authStatus.authenticated ? 'check_circle' : 'warning'" />
                </template>
                {{ authStatus.message }}
              </q-banner>
            </div>

            <div class="modern-stepper">
              <!-- PASO 1: Información Básica -->
              <div class="step-card" :class="{ 'active': currentStep === 1 }">
                <div class="step-header" @click="currentStep = 1">
                  <div class="step-indicator">
                    <q-icon name="info" />
                  </div>
                  <div class="step-info">
                    <div class="step-title">Información Básica</div>
                    <div class="step-subtitle">Datos principales de la factura</div>
                  </div>
                  <div class="step-status">
                    <q-icon name="check_circle" color="positive" v-if="validations.step1.isValid" />
                    <q-icon name="error" color="negative" v-else-if="validations.step1.attempted" />
                  </div>
                </div>

                <div class="step-content" v-if="currentStep === 1">
                  <div class="form-grid">
                    <q-select 
                      v-model="factura.numbering_range_id" 
                      :options="rangeOptions" 
                      label="Tipo de Documento *"
                      outlined 
                      dense 
                      emit-value 
                      map-options 
                      option-label="label" 
                      option-value="value"
                      :error="validations.step1.attempted && !factura.numbering_range_id"
                      error-message="Campo requerido" 
                      class="modern-field"
                    />

                    <q-input 
                      v-model="factura.reference_code" 
                      label="Referencia" 
                      outlined 
                      dense 
                      class="modern-field"
                    />
                  </div>

                  <div class="customer-section">
                    <div class="section-title">Cliente *</div>
                    <div class="form-grid">
                      <q-select 
                        v-model="factura.customer" 
                        :options="customers" 
                        label="Seleccionar Cliente" 
                        outlined
                        dense 
                        :option-label="customer => customer?.names || customer?.company || ''" 
                        clearable 
                        use-input
                        input-debounce="0" 
                        class="modern-field"
                        :error="validations.step1.attempted && !factura.customer"
                        error-message="Debe seleccionar un cliente"
                      >
                        <template v-slot:option="scope">
                          <q-item v-bind="scope.itemProps">
                            <q-item-section>
                              <q-item-label>{{ scope.opt.names || scope.opt.company }}</q-item-label>
                              <q-item-label caption>
                                {{ scope.opt.identification }} - {{ scope.opt.email }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>

                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              No hay clientes disponibles
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>

                      <q-btn 
                        label="Nuevo Cliente" 
                        icon="person_add" 
                        color="secondary" 
                        to="/app/customer"
                        class="modern-secondary-btn full-width" 
                      />
                    </div>

                    <!-- Detalles del cliente seleccionado -->
                    <div class="customer-details" v-if="factura.customer">
                      <div class="form-grid">
                        <q-input 
                          :model-value="factura.customer.identification" 
                          label="Identificación" 
                          outlined 
                          dense
                          readonly 
                          class="modern-field"
                        />

                        <q-input 
                          :model-value="factura.customer.email" 
                          label="Email" 
                          outlined 
                          dense 
                          readonly
                          class="modern-field"
                        />

                        <q-input 
                          :model-value="factura.customer.phone" 
                          label="Teléfono" 
                          outlined 
                          dense 
                          readonly
                          class="modern-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ✅ PASO 2: Productos MEJORADO -->
              <div class="step-card" :class="{ 'active': currentStep === 2 }">
                <div class="step-header" @click="currentStep = 2">
                  <div class="step-indicator">
                    <q-icon name="shopping_cart" />
                  </div>
                  <div class="step-info">
                    <div class="step-title">Productos</div>
                    <div class="step-subtitle">Selecciona los productos para la factura</div>
                  </div>
                  <div class="step-status">
                    <q-icon name="check_circle" color="positive" v-if="validations.step2.isValid" />
                    <q-icon name="error" color="negative" v-else-if="validations.step2.attempted" />
                  </div>
                </div>

                <div class="step-content" v-if="currentStep === 2">
                  <!-- ✅ VALIDACIÓN DE PRODUCTOS FACTUS -->
                  <div class="factus-products-banner" v-if="productsNotReadyForFactus.length > 0">
                    <q-banner class="bg-warning text-dark modern-banner">
                      <template v-slot:avatar>
                        <q-icon name="warning" />
                      </template>
                      <strong>Productos no válidos para Factus:</strong>
                      <div class="q-mt-sm">
                        <div v-for="product in productsNotReadyForFactus" :key="product._id" class="text-caption">
                          • {{ product.name }} - Faltan: {{ getMissingFactusFields(product).join(', ') }}
                        </div>
                      </div>
                      <template v-slot:action>
                        <q-btn flat label="Ir a Productos" to="/app/product" />
                      </template>
                    </q-banner>
                  </div>

                  <!-- ✅ SELECTOR DE PRODUCTOS MEJORADO -->
                  <div class="product-selection">
                    <q-select 
                      v-model="productSelected" 
                      :options="filteredFactusProducts" 
                      label="Buscar y agregar producto" 
                      outlined
                      dense 
                      option-label="name" 
                      @update:model-value="agregarItem" 
                      class="modern-field product-select" 
                      clearable
                      use-input 
                      input-debounce="300"
                      @filter="filterProducts"
                      hint="Buscar por nombre, código o descripción del producto"
                    >
                      <!-- Template para mostrar cada opción -->
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section avatar>
                            <q-avatar color="primary" text-color="white" size="sm">
                              {{ scope.opt.name.charAt(0).toUpperCase() }}
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ scope.opt.name }}</q-item-label>
                            <q-item-label caption>
                              <span class="text-weight-medium">Código:</span> {{ scope.opt.code_reference || 'Sin código' }} | 
                              <span class="text-weight-medium">Precio:</span> ${{ formatNumber(scope.opt.price) }} | 
                              <span class="text-weight-medium">IVA:</span> {{ scope.opt.tax_rate || 0 }}%
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-chip size="sm" color="positive" icon="verified" text-color="white">
                              Factus OK
                            </q-chip>
                          </q-item-section>
                        </q-item>
                      </template>

                      <!-- Template cuando no hay opciones -->
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-center">
                            <q-item-label>
                              <q-icon name="search_off" size="2em" />
                            </q-item-label>
                            <q-item-label>
                              {{ productSearchTerm ? 
                                 `No se encontraron productos con "${productSearchTerm}"` : 
                                 (factusReadyProducts.length === 0 ? 
                                  'No hay productos válidos para Factus' : 
                                  'Escribe para buscar productos') }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>

                    <!-- ✅ BÚSQUEDA RÁPIDA POR CÓDIGO -->
                    <div class="quick-search-section">
                      <q-input
                        v-model="quickSearchCode"
                        label="Búsqueda rápida por código"
                        outlined
                        dense
                        @keyup.enter="buscarYAgregarPorCodigo"
                        hint="Presiona Enter para agregar directamente"
                        class="modern-field"
                      >
                        <template v-slot:append>
                          <q-btn 
                            icon="add_shopping_cart" 
                            flat 
                            round 
                            dense 
                            color="primary"
                            @click="buscarYAgregarPorCodigo"
                          >
                            <q-tooltip>Agregar por código</q-tooltip>
                          </q-btn>
                        </template>
                      </q-input>
                    </div>

                    <!-- ✅ PRODUCTOS DE ACCESO RÁPIDO -->
                    <div class="quick-products" v-if="!productSearchTerm && quickAccessProducts.length > 0">
                      <div class="quick-products-title">
                        <q-icon name="flash_on" />
                        Productos de acceso rápido:
                      </div>
                      <div class="quick-products-grid">
                        <q-chip 
                          v-for="product in quickAccessProducts" 
                          :key="product._id"
                          @click="agregarItem(product)"
                          clickable
                          color="secondary"
                          text-color="white"
                          icon="add_shopping_cart"
                          class="quick-product-chip"
                        >
                          {{ product.name }}
                          <q-tooltip>{{ product.code_reference || 'Sin código' }} - ${{ formatNumber(product.price) }}</q-tooltip>
                        </q-chip>
                      </div>
                    </div>
                  </div>

                  <!-- ✅ TABLA DE PRODUCTOS -->
                  <q-table 
                    :rows="factura.products" 
                    :columns="productColumns" 
                    row-key="_id" 
                    class="modern-table products-table" 
                    flat 
                    bordered 
                    :rows-per-page-options="[0]" 
                    hide-pagination
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

                    <template v-slot:body-cell-name="props">
                      <q-td :props="props" class="cell-with-icon">
                        <div class="cell-content">
                          <div class="cell-avatar">
                            <q-icon name="inventory_2" />
                          </div>
                          <div class="product-name-cell">
                            <span class="cell-text">{{ props.row.name }}</span>
                            <q-chip 
                              v-if="isProductFactusReady(props.row)" 
                              size="xs" 
                              color="positive" 
                              icon="verified"
                              class="q-ml-xs"
                            >
                              Factus OK
                            </q-chip>
                            <q-chip 
                              v-else 
                              size="xs" 
                              color="warning" 
                              icon="warning" 
                              class="q-ml-xs"
                            >
                              Revisar
                            </q-chip>
                          </div>
                        </div>
                      </q-td>
                    </template>

                    <template v-slot:body-cell-quantity="props">
                      <q-td :props="props">
                        <q-input 
                          v-model.number="props.row.quantity" 
                          type="number" 
                          min="1" 
                          outlined 
                          dense
                          class="quantity-input" 
                          @update:model-value="updateCalculations"
                        />
                      </q-td>
                    </template>

                    <template v-slot:body-cell-price="props">
                      <q-td :props="props" class="cell-with-icon">
                        <div class="cell-content">
                          <div class="cell-avatar price-avatar">
                            <q-icon name="attach_money" />
                          </div>
                          <span class="cell-text price-text">
                            ${{ formatNumber(props.row.price) }}
                          </span>
                        </div>
                      </q-td>
                    </template>

                    <template v-slot:body-cell-tax_rate="props">
                      <q-td :props="props">
                        <span class="cell-text">
                          {{ props.row.tax_rate || 0 }}%
                        </span>
                      </q-td>
                    </template>

                    <template v-slot:body-cell-total="props">
                      <q-td :props="props">
                        <span class="cell-text total-text">
                          ${{ formatNumber((props.row.price || 0) * (props.row.quantity || 1)) }}
                        </span>
                      </q-td>
                    </template>

                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props" class="text-center">
                        <q-btn 
                          icon="delete" 
                          color="negative" 
                          flat 
                          dense 
                          @click="deleteProduct(props.row)" 
                          round
                          class="action-btn delete-btn"
                        >
                          <q-tooltip>Eliminar producto</q-tooltip>
                          <div class="btn-ripple"></div>
                        </q-btn>
                      </q-td>
                    </template>

                    <template v-slot:no-data>
                      <div class="no-data-modern">
                        <div class="no-data-icon">
                          <q-icon name="shopping_cart" size="2em" />
                        </div>
                        <div class="no-data-text">
                          <div class="no-data-title">No hay productos agregados</div>
                          <div class="no-data-subtitle">Selecciona productos del listado superior</div>
                        </div>
                      </div>
                    </template>
                  </q-table>

                  <!-- ✅ VALIDACIÓN DE PRODUCTOS AL FINAL DEL PASO 2 -->
                  <div class="step2-validation" v-if="factura.products.length > 0">
                    <div class="validation-header">
                      <q-icon name="verified" class="validation-icon" />
                      <span class="validation-title">Validación para Factus:</span>
                    </div>
                    <div class="validation-content">
                      <q-chip 
                        :color="allProductsFactusReady ? 'positive' : 'warning'"
                        :icon="allProductsFactusReady ? 'check_circle' : 'warning'"
                        class="validation-chip"
                      >
                        {{ allProductsFactusReady ? 'Todos los productos están listos' : 'Algunos productos necesitan revisión' }}
                      </q-chip>
                      <div v-if="!allProductsFactusReady" class="missing-fields">
                        <div class="missing-title">Productos con problemas:</div>
                        <ul class="missing-list">
                          <li v-for="product in factura.products.filter(p => !isProductFactusReady(p))" :key="product._id">
                            {{ product.name }} - Faltan: {{ getMissingFactusFields(product).join(', ') }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- PASO 3: Configuración -->
              <div class="step-card" :class="{ 'active': currentStep === 3 }">
                <div class="step-header" @click="currentStep = 3">
                  <div class="step-indicator">
                    <q-icon name="settings" />
                  </div>
                  <div class="step-info">
                    <div class="step-title">Configuración</div>
                    <div class="step-subtitle">Configuración de pago y observaciones</div>
                  </div>
                  <div class="step-status">
                    <q-icon name="check_circle" color="positive" v-if="validations.step3.isValid" />
                    <q-icon name="error" color="negative" v-else-if="validations.step3.attempted" />
                  </div>
                </div>

                <div class="step-content" v-if="currentStep === 3">
                  <div class="form-grid">
                    <div class="payment-section">
                      <div class="section-title">Pago *</div>
                      <q-select 
                        v-model="factura.payment_method_code" 
                        :options="paymentMethods" 
                        label="Método de Pago"
                        outlined 
                        dense 
                        option-label="label" 
                        option-value="value" 
                        emit-value 
                        map-options
                        :error="validations.step3.attempted && !factura.payment_method_code"
                        error-message="Campo requerido"
                        class="modern-field"
                      />

                      <q-select 
                        v-model="factura.payment_form" 
                        :options="paymentForms" 
                        label="Forma de Pago" 
                        outlined
                        dense 
                        option-label="name" 
                        option-value="id" 
                        emit-value 
                        map-options
                        @update:model-value="updatePaymentForm"
                        :error="validations.step3.attempted && !factura.payment_form" 
                        error-message="Campo requerido"
                        class="modern-field"
                      />

                      <q-input 
                        v-if="showDueDate" 
                        v-model="factura.payment_due_date" 
                        label="Fecha de Vencimiento"
                        type="date" 
                        outlined 
                        dense 
                        class="modern-field"
                      />
                    </div>

                    <div class="observation-section">
                      <div class="section-title">Observaciones</div>
                      <q-input 
                        v-model="factura.observation" 
                        label="Observaciones" 
                        type="textarea" 
                        outlined 
                        rows="4"
                        class="modern-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ RESUMEN MEJORADO CON VALIDACIONES -->
            <div class="invoice-summary">
              <div class="summary-card">
                <div class="summary-header">
                  <q-icon name="receipt" />
                  <span>Resumen de Factura</span>
                  <q-chip 
                    :color="canSubmitInvoice ? 'positive' : 'warning'"
                    :icon="canSubmitInvoice ? 'check_circle' : 'warning'" 
                    size="sm" 
                    class="q-ml-md"
                  >
                    {{ canSubmitInvoice ? 'Lista para enviar' : 'Pendiente validaciones' }}
                  </q-chip>
                </div>
                <div class="summary-content">
                  <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>${{ formatNumber(subtotal) }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Impuestos (IVA):</span>
                    <span>${{ formatNumber(taxes) }}</span>
                  </div>
                  <div class="summary-row total">
                    <span>TOTAL A PAGAR:</span>
                    <span>${{ formatNumber(totalFactura) }}</span>
                  </div>

                  <!-- Validaciones en el resumen -->
                  <div v-if="!canSubmitInvoice" class="validation-summary">
                    <div class="validation-summary-title">
                      <strong>Pendientes:</strong>
                    </div>
                    <ul class="validation-summary-list">
                      <li v-if="!authStatus.authenticated">Autenticación con Factus</li>
                      <li v-if="!factura.customer">Seleccionar cliente</li>
                      <li v-if="!factura.numbering_range_id">Tipo de documento</li>
                      <li v-if="factura.products.length === 0">Agregar productos</li>
                      <li v-if="!allProductsFactusReady">Validar productos para Factus</li>
                      <li v-if="!factura.payment_method_code">Método de pago</li>
                      <li v-if="!factura.payment_form">Forma de pago</li>
                    </ul>
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
                @click="showModal = false" 
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
                  v-if="currentStep < 3" 
                  @click="nextStep"
                  :disable="!canGoToNextStep"
                  class="modern-primary-btn"
                />
                <q-btn 
                  label="Guardar Factura" 
                  v-if="currentStep === 3" 
                  @click="submitInvoice"
                  :loading="loading" 
                  :disable="!canSubmitInvoice"
                  class="modern-primary-btn"
                />
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </q-dialog>

    <!-- MODAL DE VISUALIZACIÓN DE FACTURA PROFESIONAL -->
    <q-dialog persistent v-model="viewInvoicemodal" maximized class="modern-dialog">
      <div class="modal-backdrop">
        <div class="modal-particles">
          <div class="modal-particle" v-for="n in 8" :key="n" :style="getModalParticleStyle()"></div>
        </div>
        
        <q-card class="modern-modal professional-invoice-modal">
          <div class="professional-toolbar">
            <q-toolbar class="toolbar-content">
              <q-avatar>
                <q-icon name="description" color="white" />
              </q-avatar>
              <q-toolbar-title class="text-h6">
                Factura Electrónica #{{ factura.factusData?.number || 'N/A' }}
              </q-toolbar-title>
              <q-space />
              <q-btn flat round dense icon="close" color="white" @click="viewInvoicemodal = false">
                <q-tooltip>Cerrar</q-tooltip>
              </q-btn>
            </q-toolbar>
          </div>

          <!-- Botones de Acción Profesionales -->
          <div class="professional-actions-bar">
            <div class="actions-container">
              <q-btn-group flat>
                <q-btn 
                  icon="public" 
                  label="Portal DIAN" 
                  color="primary" 
                  @click="goToDIAN" 
                  :disable="!canAccessDIAN"
                  class="professional-btn"
                >
                  <q-tooltip>{{ canAccessDIAN ? 'Ver factura en portal DIAN' : 'No disponible para esta factura' }}</q-tooltip>
                </q-btn>

                <q-btn 
                  icon="email" 
                  label="Enviar Email" 
                  color="secondary"
                  @click="sendInvoiceByEmail(factura.factusData?.number)" 
                  :disable="!canDownloadOrEmail"
                  class="professional-btn"
                >
                  <q-tooltip>{{ canDownloadOrEmail ? 'Enviar por correo electrónico' : 'No disponible para esta factura' }}</q-tooltip>
                </q-btn>

                <q-btn 
                  icon="file_download" 
                  label="Descargar PDF" 
                  color="positive"
                  @click="downloadInvoice(factura.factusData?.number)" 
                  :disable="!canDownloadOrEmail"
                  class="professional-btn"
                >
                  <q-tooltip>{{ canDownloadOrEmail ? 'Descargar en formato PDF' : 'No disponible para esta factura' }}</q-tooltip>
                </q-btn>
              </q-btn-group>

              <!-- Estado de la factura -->
              <div class="invoice-status-chip">
                <q-chip 
                  :color="canDownloadOrEmail ? 'positive' : 'orange'"
                  :icon="canDownloadOrEmail ? 'verified' : 'pending'" 
                  text-color="white" 
                  size="md"
                >
                  {{ invoiceStatus }}
                </q-chip>
              </div>
            </div>
          </div>

          <div class="professional-invoice-container">
            <div class="professional-scrollable-content">
              <div class="professional-invoice-content">

                <!-- Header con Logo y Datos de la Empresa -->
                <div class="invoice-header">
                  <div class="row items-start">
                    <div class="col-3 logo-section">
                      <div class="professional-logo-container">
                        <img :src="logoUrl" alt="Logo de la empresa" class="professional-logo" @error="handleImageError">
                      </div>
                    </div>

                    <div class="col-6 company-section">
                      <div class="document-header">
                        <h5 class="document-type">{{ factura.factusData?.document?.name || 'Factura Electrónica' }}</h5>
                        <div class="document-number">N° {{ factura.factusData?.number || 'SIN NÚMERO' }}</div>
                      </div>
                      <div class="company-details">
                        <div class="company-name">{{ factura.factusCompany?.company || 'Empresa' }}</div>
                        <div class="company-nit">NIT: {{ factura.factusCompany?.nit || 'N/A' }}</div>
                        <div class="company-contact">Tel: {{ factura.factusCompany?.phone || 'N/A' }}</div>
                        <div class="company-address">{{ factura.factusCompany?.direction || 'N/A' }}</div>
                      </div>
                    </div>

                    <div class="col-3 qr-section">
                      <div class="qr-container" v-if="factura.factusData?.qr_image">
                        <img :src="factura.factusData.qr_image" alt="Código QR" class="professional-qr">
                        <div class="qr-label">Código QR DIAN</div>
                      </div>
                    </div>
                  </div>
                </div>

                <q-separator class="professional-separator" />

                <!-- Información del Cliente y Periodo -->
                <div class="invoice-info-section">
                  <div class="row q-col-gutter-md">
                    <div class="col-md-6 col-12">
                      <div class="info-card">
                        <div class="card-header">
                          <q-icon name="person" class="card-icon" />
                          <span class="card-title">INFORMACIÓN DEL CLIENTE</span>
                        </div>
                        <div class="card-content">
                          <div class="info-row">
                            <span class="info-label">Cliente:</span>
                            <span class="info-data">{{ factura.customer?.names || factura.customer?.company || 'N/A' }}</span>
                          </div>
                          <div class="info-row">
                            <span class="info-label">Documento:</span>
                            <span class="info-data">{{ factura.customer?.identification || 'N/A' }}</span>
                          </div>
                          <div class="info-row">
                            <span class="info-label">Email:</span>
                            <span class="info-data">{{ factura.customer?.email || 'N/A' }}</span>
                          </div>
                          <div class="info-row">
                            <span class="info-label">Teléfono:</span>
                            <span class="info-data">{{ factura.customer?.phone || 'N/A' }}</span>
                          </div>
                          <div class="info-row">
                            <span class="info-label">Dirección:</span>
                            <span class="info-data">{{ factura.customer?.address || 'N/A' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-6 col-12">
                      <div class="info-card">
                        <div class="card-header">
                          <q-icon name="schedule" class="card-icon" />
                          <span class="card-title">PERIODO DE FACTURACIÓN</span>
                        </div>
                        <div class="card-content">
                          <div class="info-row">
                            <span class="info-label">Fecha de Generación:</span>
                            <span class="info-data">
                              {{ date.formatDate(factura.createdAt, 'DD/MM/YYYY') }}
                              {{ factura.billing_period?.start_time ? `- ${factura.billing_period.start_time}` : '' }}
                            </span>
                          </div>
                          <div class="info-row">
                            <span class="info-label">Fecha de Expedición:</span>
                            <span class="info-data">
                              {{ date.formatDate(factura.payment_due_date || factura.createdAt, 'DD/MM/YYYY') }}
                              {{ factura.billing_period?.end_time ? `- ${factura.billing_period.end_time}` : '' }}
                            </span>
                          </div>
                          <div class="info-row" v-if="factura.factusData?.cufe">
                            <span class="info-label">CUFE:</span>
                            <span class="info-data cufe-text">{{ factura.factusData.cufe }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Detalle de Productos -->
                <div class="products-section">
                  <div class="section-header">
                    <q-icon name="inventory_2" class="section-icon" />
                    <span class="section-title">DETALLE DE LA FACTURA</span>
                  </div>

                  <div class="professional-table-container">
                    <q-table 
                      :rows="factura.products" 
                      :columns="professionalInvoiceColumns" 
                      row-key="id" 
                      hide-pagination
                      hide-bottom 
                      class="professional-products-table" 
                      flat 
                      bordered
                    >
                      <template v-slot:header="props">
                        <q-tr :props="props" class="professional-table-header">
                          <q-th v-for="col in props.cols" :key="col.name" :props="props">
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>

                      <template v-slot:body-cell-price="props">
                        <q-td :props="props" class="text-right">
                          ${{ formatNumber(props.row.price) }}
                        </q-td>
                      </template>

                      <template v-slot:body-cell-total="props">
                        <q-td :props="props" class="text-right professional-total-cell">
                          ${{ formatNumber(props.row.price * props.row.quantity) }}
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </div>

                <!-- Totales y Información de Pago -->
                <div class="totals-payment-section">
                  <div class="row q-col-gutter-md">
                    <div class="col-md-6 col-12">
                      <div class="info-card">
                        <div class="card-header">
                          <q-icon name="payment" class="card-icon" />
                          <span class="card-title">INFORMACIÓN DE PAGO</span>
                        </div>
                        <div class="card-content">
                          <div class="payment-info">
                            <div class="payment-method">
                              <span class="payment-label">Método de Pago:</span>
                              <span class="payment-value">{{ factura.factusData?.payment_method?.name || 'N/A' }}</span>
                            </div>
                            <div class="payment-form">
                              <span class="payment-label">Forma de Pago:</span>
                              <span class="payment-value">{{ factura.factusData?.payment_form?.name || 'N/A' }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="info-card q-mt-md">
                        <div class="card-header">
                          <q-icon name="notes" class="card-icon" />
                          <span class="card-title">OBSERVACIONES</span>
                        </div>
                        <div class="card-content">
                          <div class="observations-text">
                            {{ factura.factusData?.observation || factura.observation || "Sin observaciones" }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-6 col-12">
                      <div class="info-card totals-card">
                        <div class="card-header">
                          <q-icon name="calculate" class="card-icon" />
                          <span class="card-title">RESUMEN FINANCIERO</span>
                        </div>
                        <div class="card-content">
                          <div class="amount-in-words">
                            <div class="words-label">Valor en Letras:</div>
                            <div class="words-text">
                              {{ numberLetter(factura.factusData?.total || totalFactura) }}
                            </div>
                          </div>

                          <div class="totals-breakdown">
                            <div class="total-line">
                              <span class="total-label">Subtotal:</span>
                              <span class="total-amount">${{ formatNumber(factura.factusData?.gross_value || subtotal) }}</span>
                            </div>
                            <div class="total-line">
                              <span class="total-label">IVA:</span>
                              <span class="total-amount">${{ formatNumber(factura.factusData?.tax_amount || taxes) }}</span>
                            </div>
                            <div class="total-line">
                              <span class="total-label">Descuentos:</span>
                              <span class="total-amount">{{ factura.factusData?.discount_rate || '0' }}%</span>
                            </div>
                            <q-separator class="q-my-sm" />
                            <div class="total-line grand-total-line">
                              <span class="grand-total-label">TOTAL A PAGAR:</span>
                              <span class="grand-total-amount">${{ formatNumber(factura.factusData?.total || totalFactura) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <!-- Footer Profesional -->
                <div class="professional-footer">
                  <div class="footer-content">
                    <div class="footer-line" v-if="factura.factusData?.cufe">
                      <strong>CUFE:</strong> {{ factura.factusData.cufe }}
                    </div>
                    <div class="footer-line">
                      <strong>{{ factura.factusCompany?.company || 'Empresa' }}</strong> - NIT: {{ factura.factusCompany?.nit || 'N/A' }}
                    </div>
                    <div class="footer-line">
                      {{ factura.factusCompany?.email || 'N/A' }} - Tel: {{ factura.factusCompany?.phone || 'N/A' }}
                    </div>
                    <div class="footer-line legal-notice">
                      Factura electrónica generada conforme a la normatividad DIAN
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch, toRaw } from "vue";
import { getData } from "../services/apiClient";
import { backgetData, backpostData, backputData } from "../services/backClient";
import { date } from 'quasar';
import dayjs from 'dayjs';
import { useQuasar } from 'quasar';
import { Notify } from 'quasar';
import { NumerosALetras } from 'numero-a-letras';

const $q = useQuasar();

// ✅ NUEVO: Variable para el modo oscuro
const darkMode = ref(true); // Por defecto modo oscuro

// ✅ NUEVO: Inicializar el modo oscuro desde localStorage
const initializeDarkMode = () => {
  try {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      darkMode.value = savedDarkMode === 'true';
    } else {
      // Si no hay preferencia guardada, usar modo oscuro por defecto
      darkMode.value = true;
      localStorage.setItem('darkMode', 'true');
    }

    // Aplicar el modo al componente
    $q.dark.set(darkMode.value);
  } catch (error) {
    console.error('Error inicializando modo oscuro:', error);
    darkMode.value = true;
    $q.dark.set(true);
  }
};

// ✅ NUEVO: Watcher para sincronizar con cambios en localStorage
watch(() => darkMode.value, (newValue) => {
  localStorage.setItem('darkMode', newValue.toString());
  $q.dark.set(newValue);
});

// ✅ NUEVO: Escuchar cambios en localStorage desde otros componentes
const handleStorageChange = (e) => {
  if (e.key === 'darkMode') {
    darkMode.value = e.newValue === 'true';
  }
};

// ✅ NUEVAS VARIABLES PARA MANEJO DE FACTURAS PENDIENTES
const syncLoading = ref(false);
const mostrarDialogoForzar = ref(false);
const facturasPendientesDetectadas = ref([]);

// ✅ NUEVAS VARIABLES PARA FILTRADO DE PRODUCTOS
const productSearchTerm = ref('');
const filteredFactusProducts = ref([]);
const quickSearchCode = ref('');

// Variables reactivas principales
const showModal = ref(false);
const viewInvoicemodal = ref(false);
const loading = ref(false);
const currentStep = ref(1);

// Filtros para la tabla
const filterNumber = ref("");
const filterCustomer = ref("");
const filterIdentification = ref("");
const filterDate = ref("");

// Datos para el formulario
const productSelected = ref(null);
const selectproduct = ref([]);
const customers = ref([]);
const rangeOptions = ref([]);
const rows = ref([]);
const pagination = ref({ page: 1, rowsPerPage: 10 });
const showDueDate = ref(false);

// ✅ VARIABLES PARA VALIDACIONES
const validations = ref({
  step1: { isValid: false, attempted: false },
  step2: { isValid: false, attempted: false },
  step3: { isValid: false, attempted: false }
});

const authStatus = ref({
  authenticated: false,
  message: 'Verificando autenticación...'
});

// Configuración inicial de fechas
const now = dayjs();
const factura = ref({
  billing_period: {
    start_date: now.format("YYYY-MM-DD"),
    start_time: now.format("HH:mm"),
    end_date: now.add(1, "day").format("YYYY-MM-DD"),
    end_time: now.format("HH:mm")
  },
  products: [],
  customer: {},
  payment_due_date: now.add(2, "day").format("YYYY-MM-DD"),
  payment_form: 1,
  numbering_range_id: null,
  reference_code: '',
  observation: '',
  payment_method_code: null
});

// Funciones para efectos visuales (nuevas)
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

// Función para obtener el nombre del producto
const getProductName = (row) => {
  // Si tiene productos como array
  if (row.products && Array.isArray(row.products) && row.products.length > 0) {
    const producto = row.products[0];
    // Si el producto tiene nombre
    if (producto.name) {
      return producto.name;
    }
    // Si tiene código de referencia
    if (producto.code_reference) {
      return producto.code_reference;
    }
    // Si es un objeto producto anidado
    if (producto.product && typeof producto.product === 'object') {
      return producto.product.name || producto.product.code_reference || 'Producto';
    }
  }
  
  // Fallback
  return 'Sin producto';
};

const getColumnIcon = (columnName) => {
  const icons = {
    number: 'description',
    customer: 'person',
    product: 'inventory_2',
    identification: 'badge',
    createdAt: 'event',
    status: 'circle',
    actions: 'settings'
  }
  return icons[columnName] || 'info'
}

const getProductColumnIcon = (columnName) => {
  const icons = {
    name: 'inventory_2',
    quantity: 'tag',
    price: 'attach_money',
    tax_rate: 'receipt',
    total: 'calculate',
    actions: 'settings'
  }
  return icons[columnName] || 'info'
}

// ✅ NUEVAS FUNCIONES PARA MANEJO DE ESTADOS

const getStatusColor = (factura) => {
  if (factura.factusData?.cufe) return 'positive';
  if (factura.status === 'pending') return 'warning';
  if (factura.status === 'issued') return 'positive';
  return 'grey';
};

const getStatusLabel = (factura) => {
  if (factura.status === 'pending') return 'Pendiente';
  if (factura.status === 'issued') return 'Emitida';
  if (factura.factusData?.cufe) return 'Procesada';
  return 'Local';
};

const getStatusIcon = (factura) => {
  if (factura.factusData?.cufe) return 'verified';
  if (factura.status === 'pending') return 'pending';
  if (factura.status === 'issued') return 'check_circle';
  return 'help';
};

const verificarFacturasPendientesReales = async (facturasPendientes) => {
  const facturasRealmentePendientes = [];

  for (const factura of facturasPendientes) {
    try {
      // ✅ Si tiene CUFE, ya está procesada - NO VERIFICAR EN FACTUS
      if (factura.factusData?.cufe) {
        console.log(`✅ Factura ${factura.factusData.number} ya tiene CUFE, no está pendiente`);
        continue;
      }

      // ✅ Verificar edad de la factura
      const tiempoCreacion = new Date(factura.createdAt);
      const ahora = new Date();
      const minutosTranscurridos = (ahora - tiempoCreacion) / (1000 * 60);

      // Si tiene más de 15 minutos, probablemente ya fue procesada
      if (minutosTranscurridos > 15) {
        console.log(`⏰ Factura ${factura.factusData?.number || factura._id} tiene ${Math.round(minutosTranscurridos)} minutos, probablemente procesada`);
        continue;
      }

      // Solo considerar pendientes las facturas recientes (menos de 15 minutos)
      facturasRealmentePendientes.push(factura);

    } catch (error) {
      console.warn(`⚠️ Error verificando factura ${factura._id}:`, error);
      // En caso de error, solo considerar pendiente si es muy reciente
      const tiempoCreacion = new Date(factura.createdAt);
      const ahora = new Date();
      const minutosTranscurridos = (ahora - tiempoCreacion) / (1000 * 60);

      if (minutosTranscurridos < 5) {
        facturasRealmentePendientes.push(factura);
      }
    }
  }

  return facturasRealmentePendientes;
};

const sincronizarEstados = async () => {
  syncLoading.value = true;

  try {
    console.log('🔄 Iniciando sincronización de estados...');

    const todasLasFacturas = await backgetData("/invoice");
    const facturasPorSincronizar = todasLasFacturas.filter(f =>
      f.status === 'pending' && f.factusData?.number
    );

    if (facturasPorSincronizar.length === 0) {
      Notify.create({
        type: 'info',
        message: 'No hay facturas pendientes por sincronizar'
      });
      return;
    }

    let facturasActualizadas = 0;

    for (const factura of facturasPorSincronizar) {
      try {
        if (factura.factusData?.number && factura.factusData?.cufe) {
          // Si ya tiene CUFE, actualizar estado
          await backputData(`/invoice/${factura._id}`, {
            status: 'issued'
          });

          facturasActualizadas++;
          console.log(`✅ Estado actualizado para factura ${factura.factusData.number}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error actualizando factura ${factura._id}:`, error);
      }
    }

    await getDatafromAPI();

    Notify.create({
      type: 'positive',
      message: `${facturasActualizadas} facturas sincronizadas correctamente`,
      timeout: 5000
    });

  } catch (error) {
    console.error('❌ Error en sincronización:', error);

    let mensaje = 'Error al sincronizar estados';
    if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
      mensaje = 'Error de conectividad. Verifica tu conexión y el backend.';
    }

    Notify.create({
      type: 'negative',
      message: mensaje,
      timeout: 8000
    });
  } finally {
    syncLoading.value = false;
  }
};

const verificarEstadoIndividual = async (factura) => {
  loading.value = true;

  try {
    // Solo actualizar si ya tiene CUFE
    if (factura.factusData?.cufe) {
      await backputData(`/invoice/${factura._id}`, {
        status: 'issued'
      });

      await getDatafromAPI();

      Notify.create({
        type: 'positive',
        message: `Factura ${factura.factusData.number} actualizada correctamente`,
        timeout: 3000
      });
    } else {
      Notify.create({
        type: 'info',
        message: `Factura ${factura.factusData?.number || factura.reference_code} aún está en procesamiento`,
        timeout: 3000
      });
    }

  } catch (error) {
    console.error('❌ Error verificando estado individual:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al verificar el estado de la factura'
    });
  } finally {
    loading.value = false;
  }
};

// ✅ COMPUTED PROPERTIES MEJORADOS CON VALIDACIONES FACTUS

const isProductFactusReady = (product) => {
  return !!(
    product.name &&
    product.code_reference &&
    product.unit_measure_id &&
    product.standard_code_id &&
    product.tribute_id
  );
};

const getMissingFactusFields = (product) => {
  const missing = [];
  if (!product.name) missing.push('Nombre');
  if (!product.code_reference) missing.push('Código de referencia');
  if (!product.unit_measure_id) missing.push('Unidad de medida');
  if (!product.standard_code_id) missing.push('Código estándar');
  if (!product.tribute_id) missing.push('Tributo');
  return missing;
};

const factusReadyProducts = computed(() => {
  return selectproduct.value.filter(product => isProductFactusReady(product));
});

const productsNotReadyForFactus = computed(() => {
  return selectproduct.value.filter(product => !isProductFactusReady(product));
});

const allProductsFactusReady = computed(() => {
  return factura.value.products.length > 0 &&
    factura.value.products.every(product => isProductFactusReady(product));
});

// ✅ COMPUTED PARA PRODUCTOS DE ACCESO RÁPIDO
const quickAccessProducts = computed(() => {
  // Mostrar los primeros 5 productos más usados o destacados
  // Aquí puedes implementar lógica más sofisticada basada en ventas históricas
  return factusReadyProducts.value.slice(0, 5);
});

const canGoToNextStep = computed(() => {
  if (currentStep.value === 1) {
    return !!(factura.value.customer && factura.value.numbering_range_id);
  }
  if (currentStep.value === 2) {
    return factura.value.products.length > 0 && allProductsFactusReady.value;
  }
  return true;
});

const canSubmitInvoice = computed(() => {
  return !!(
    authStatus.value.authenticated &&
    factura.value.customer &&
    factura.value.numbering_range_id &&
    factura.value.products.length > 0 &&
    allProductsFactusReady.value &&
    factura.value.payment_method_code &&
    factura.value.payment_form
  );
});

// Computed properties para cálculos
const filteredRows = computed(() => {
  return rows.value.filter(row => {
    const matchesNumber = !filterNumber.value ||
      (row.factusData?.number || row.number || row.reference_code || '').toString().includes(filterNumber.value);

    const matchesCustomer = !filterCustomer.value ||
      (row.names || row.customer?.names || row.customer?.company || '').toLowerCase()
        .includes(filterCustomer.value.toLowerCase());

    const matchesIdentification = !filterIdentification.value ||
      (row.identification || row.customer?.identification || '').toString()
        .includes(filterIdentification.value);

    const matchesDate = !filterDate.value ||
      date.formatDate(row.createdAt, 'YYYY-MM-DD') === filterDate.value;

    return matchesNumber && matchesCustomer && matchesIdentification && matchesDate;
  });
});

const subtotal = computed(() => {
  const total = factura.value.products.reduce((sum, product) => {
    return sum + (Number(product.price || 0) * Number(product.quantity || 1));
  }, 0);
  console.log('💰 Subtotal calculado:', total, 'productos:', factura.value.products.length);
  return total;
});

const taxes = computed(() => {
  const total = factura.value.products.reduce((sum, product) => {
    const productTotal = Number(product.price || 0) * Number(product.quantity || 1);
    const tax = productTotal * (Number(product.tax_rate || 0) / 100);
    return sum + tax;
  }, 0);
  console.log('📊 Impuestos calculados:', total);
  return total;
});

const totalFactura = computed(() => {
  const total = subtotal.value + taxes.value;
  console.log('🧮 Total factura:', total);
  return total;
});

const logoUrl = computed(() => {
  return factura.value.factusCompany?.logo || '/logo.png';
});

const canAccessDIAN = computed(() => {
  return !!(factura.value.factusData?.cufe || factura.value.factusData?.qr);
});

const canDownloadOrEmail = computed(() => {
  return !!factura.value.factusData?.number;
});

const invoiceStatus = computed(() => {
  if (factura.value.factusData?.number) {
    return 'Procesada en Factus';
  } else if (factura.value.reference_code) {
    return 'Factura Local';
  } else {
    return 'Sin Procesar';
  }
});

const professionalInvoiceColumns = [
  {
    name: 'name',
    label: 'Descripción',
    field: 'name',
    align: 'left',
    style: 'width: 40%'
  },
  {
    name: 'quantity',
    label: 'Cant.',
    field: 'quantity',
    align: 'center',
    style: 'width: 10%'
  },
  {
    name: 'price',
    label: 'Valor Unit.',
    field: 'price',
    align: 'right',
    style: 'width: 20%'
  },
  {
    name: 'tax_rate',
    label: 'IVA',
    field: row => `${row.tax_rate || 0}%`,
    align: 'center',
    style: 'width: 10%'
  },
  {
    name: 'total',
    label: 'Total',
    field: row => formatNumber(row.price * row.quantity),
    align: 'right',
    style: 'width: 20%'
  }
];

// ✅ WATCHER PARA INICIALIZAR PRODUCTOS FILTRADOS
watch(() => factusReadyProducts.value, (newProducts) => {
  if (!productSearchTerm.value) {
    filteredFactusProducts.value = newProducts;
  }
}, { immediate: true });

// ✅ WATCHERS PARA VALIDACIONES EN TIEMPO REAL
watch(() => [factura.value.customer, factura.value.numbering_range_id], () => {
  validations.value.step1.isValid = !!(factura.value.customer && factura.value.numbering_range_id);
});

watch(() => [factura.value.products, allProductsFactusReady.value], () => {
  validations.value.step2.isValid = factura.value.products.length > 0 && allProductsFactusReady.value;
});

watch(() => [factura.value.payment_method_code, factura.value.payment_form], () => {
  validations.value.step3.isValid = !!(factura.value.payment_method_code && factura.value.payment_form);
});

// Watch para controlar visibilidad de fecha de vencimiento
watch(() => factura.value.payment_form, (newVal) => {
  showDueDate.value = newVal === 2;
});

// Configuración de columnas para la tabla
const columns = [
  {
    name: "number",
    label: "Número",
    align: "center",
    field: row => row.factusData?.number || row.number || row.reference_code || 'N/A',
    sortable: true
  },
  {
    name: "customer",
    label: "Cliente",
    align: "center",
    field: row => row.names || row.customer?.names || row.customer?.company || 'N/A',
    sortable: true
  },
  {
    name: "product",
    label: "Producto",
    align: "center",
    field: row => getProductName(row),
    sortable: true
  },
  {
    name: "identification",
    label: "Identificación",
    align: "center",
    field: row => row.identification || row.customer?.identification || 'N/A',
    sortable: true
  },
  {
    name: "createdAt",
    label: "Fecha",
    align: "center",
    field: row => date.formatDate(row.createdAt, 'DD/MM/YYYY'),
    sortable: true
  },
  {
    name: "status",
    label: "Estado",
    align: "center",
    field: row => row.status,
    sortable: true
  },
  {
    name: "actions",
    label: "Acciones",
    align: "center"
  }
];

const productColumns = [
  { name: 'name', label: 'Producto', field: 'name', align: 'center' },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center' },
  { name: 'price', label: 'Valor Unitario', field: 'price', align: 'center' },
  { name: 'tax_rate', label: 'Impuesto', field: 'tax_rate', align: 'center' },
  {
    name: 'total',
    label: 'Total',
    field: row => formatNumber(Number(row.price || 0) * Number(row.quantity || 1)),
    align: 'center'
  },
  { name: 'actions', label: 'Acciones', align: 'center' }
];

// Opciones para formularios
const paymentForms = ref([
  { id: 1, name: 'Pago de Contado' },
  { id: 2, name: 'Pago de Crédito' },
]);

const paymentMethods = [
  { value: "10", label: "Efectivo" },
  { value: "42", label: "Consignación" },
  { value: "20", label: "Cheque" },
  { value: "47", label: "Transferencia" },
  { value: "71", label: "Bonos" },
  { value: "72", label: "Vales" },
  { value: "1", label: "Medio de pago no definido" },
  { value: "49", label: "Tarjeta Débito" },
  { value: "48", label: "Tarjeta Crédito" },
  { value: "ZZZ", label: "Otro*" }
];

// ✅ FUNCIONES PARA FILTRADO DE PRODUCTOS

// Función para filtrar productos
const filterProducts = (val, update, abort) => {
  if (val === '') {
    update(() => {
      productSearchTerm.value = '';
      filteredFactusProducts.value = factusReadyProducts.value;
    });
    return;
  }

  update(() => {
    productSearchTerm.value = val;
    const needle = val.toLowerCase();
    
    filteredFactusProducts.value = factusReadyProducts.value.filter(product => {
      // Buscar por nombre
      const nameMatch = product.name?.toLowerCase().includes(needle);
      
      // Buscar por código de referencia
      const codeMatch = product.code_reference?.toLowerCase().includes(needle);
      
      // Buscar por descripción si existe
      const descriptionMatch = product.description?.toLowerCase().includes(needle);
      
      // También buscar por categoría si existe
      const categoryMatch = product.category?.toLowerCase().includes(needle);
      
      return nameMatch || codeMatch || descriptionMatch || categoryMatch;
    });
    
    console.log(`🔍 Filtrado: "${val}" - ${filteredFactusProducts.value.length} resultados`);
  });
};

// Función para resetear filtros
const resetProductFilter = () => {
  productSearchTerm.value = '';
  filteredFactusProducts.value = factusReadyProducts.value;
  productSelected.value = null;
};

// Función para buscar y agregar por código
const buscarYAgregarPorCodigo = () => {
  if (!quickSearchCode.value.trim()) {
    Notify.create({
      message: 'Ingresa un código de producto',
      color: 'warning',
      icon: 'warning'
    });
    return;
  }

  const producto = factusReadyProducts.value.find(p => 
    p.code_reference?.toLowerCase() === quickSearchCode.value.toLowerCase()
  );
  
  if (producto) {
    agregarItem(producto);
    quickSearchCode.value = '';
  } else {
    Notify.create({
      message: `No se encontró producto con código: ${quickSearchCode.value}`,
      color: 'warning',
      icon: 'search_off'
    });
  }
};

// Funciones auxiliares
const numberLetter = (number) => {
  if (!number) return '';
  const total = NumerosALetras(number).split(" 00/100")[0];
  return total.split("de").join("");
};

const formatNumber = (num) => {
  if (!num) return '0.00';
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const handleImageError = (event) => {
  console.log('⚠️ Error al cargar logo de empresa, usando logo por defecto');
  if (event.target.src.includes('/logo.png')) {
    event.target.style.display = 'none';
    console.log('❌ Logo por defecto no encontrado');
  } else {
    event.target.src = '/logo.png';
  }
};

const updateCalculations = () => {
  console.log('🔄 Actualizando cálculos...');
};

const updatePaymentForm = (value) => {
  if (value === 1) {
    factura.value.payment_due_date = null;
  } else {
    factura.value.payment_due_date = now.add(2, "day").format("YYYY-MM-DD");
  }
};

// ✅ FUNCIÓN MEJORADA PARA RESETEAR FACTURA
const resertFactura = () => {
  console.log('🔄 Reseteando factura...');
  factura.value = {
    billing_period: {
      start_date: now.format("YYYY-MM-DD"),
      start_time: now.format("HH:mm"),
      end_date: now.add(1, "day").format("YYYY-MM-DD"),
      end_time: now.format("HH:mm")
    },
    products: [],
    customer: {},
    payment_due_date: now.add(2, "day").format("YYYY-MM-DD"),
    payment_form: 1,
    numbering_range_id: null,
    reference_code: '',
    observation: '',
    payment_method_code: null
  };
  
  showDueDate.value = false;
  currentStep.value = 1;
  
  // Resetear variables de filtrado
  productSelected.value = null;
  productSearchTerm.value = '';
  filteredFactusProducts.value = factusReadyProducts.value;
  quickSearchCode.value = '';

  validations.value = {
    step1: { isValid: false, attempted: false },
    step2: { isValid: false, attempted: false },
    step3: { isValid: false, attempted: false }
  };

  console.log('✅ Factura reseteada completamente');
};

const nextStep = () => {
  validations.value[`step${currentStep.value}`].attempted = true;

  if (canGoToNextStep.value) {
    if (currentStep.value < 3) currentStep.value++;
  } else {
    let message = 'Complete los campos requeridos';
    if (currentStep.value === 1) {
      message = 'Debe seleccionar un cliente y tipo de documento';
    } else if (currentStep.value === 2) {
      message = 'Debe agregar productos válidos para Factus';
    }

    Notify.create({
      message,
      color: 'warning',
      icon: 'warning'
    });
  }
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const checkAuthStatus = () => {
  try {
    const authData = JSON.parse(localStorage.getItem("Auth") || '{}');
    const hasToken = !!authData.token;

    authStatus.value = {
      authenticated: hasToken,
      message: hasToken
        ? '✅ Conectado con Factus - Listo para facturar'
        : '⚠️ No autenticado - Debe iniciar sesión con Factus'
    };

    if (!hasToken) {
      console.warn('⚠️ No hay token de Factus disponible');
    } else {
      console.log('✅ Token de Factus disponible');
    }

    return hasToken;
  } catch (error) {
    console.error('❌ Error verificando autenticación:', error);
    authStatus.value = {
      authenticated: false,
      message: '❌ Error verificando autenticación'
    };
    return false;
  }
};

const openInvoiceModal = () => {
  checkAuthStatus();
  showModal.value = true;
  resertFactura();
};

// ✅ FUNCIÓN MEJORADA PARA AGREGAR PRODUCTOS
const agregarItem = (selectedProduct) => {
  console.log('🛒 Función agregarItem llamada con:', selectedProduct);
  
  const producto = selectedProduct || productSelected.value;

  if (producto) {
    if (!isProductFactusReady(producto)) {
      const missingFields = getMissingFactusFields(producto);
      Notify.create({
        message: `Producto "${producto.name}" no es válido para Factus. Faltan: ${missingFields.join(', ')}`,
        color: 'warning',
        icon: 'warning',
        timeout: 5000,
        actions: [
          {
            label: 'Ir a Productos',
            color: 'white',
            handler: () => {
              // Navegar a la página de productos para editarlos
              // router.push('/app/product');
            }
          }
        ]
      });
      return;
    }

    console.log('✅ Agregando producto:', producto);

    const existingProduct = factura.value.products.find(p => p._id === producto._id);
    if (existingProduct) {
      console.log('⚠️ Producto ya existe, aumentando cantidad');
      existingProduct.quantity = Number(existingProduct.quantity) + 1;
      
      Notify.create({
        message: `Cantidad de "${producto.name}" aumentada a ${existingProduct.quantity}`,
        color: 'info',
        icon: 'add',
        timeout: 2000
      });
    } else {
      const nuevoProducto = {
        _id: producto._id,
        name: producto.name,
        price: Number(producto.price || 0),
        tax_rate: Number(producto.tax_rate || 0),
        quantity: 1,
        code_reference: producto.code_reference,
        unit_measure_id: producto.unit_measure_id,
        standard_code_id: producto.standard_code_id,
        tribute_id: producto.tribute_id,
        description: producto.description
      };

      console.log('📝 Nuevo producto a agregar:', nuevoProducto);
      factura.value.products.push(nuevoProducto);
      
      Notify.create({
        message: `Producto "${producto.name}" agregado`,
        color: 'positive',
        icon: 'add_shopping_cart',
        timeout: 2000
      });
    }

    // Limpiar selección y búsqueda
    productSelected.value = null;
    productSearchTerm.value = '';
    filteredFactusProducts.value = factusReadyProducts.value;

    console.log('📊 Productos en factura después de agregar:', factura.value.products);
    console.log('💰 Subtotal actual:', subtotal.value);

  } else {
    console.log('❌ No hay producto seleccionado');
    Notify.create({
      message: 'Selecciona un producto primero',
      color: 'warning',
      icon: 'warning'
    });
  }
};

const deleteProduct = (product) => {
  console.log('🗑️ Eliminando producto:', product);
  const index = factura.value.products.findIndex(p => p._id === product._id);
  if (index > -1) {
    factura.value.products.splice(index, 1);
    console.log('✅ Producto eliminado. Productos restantes:', factura.value.products.length);

    Notify.create({
      message: `Producto "${product.name}" eliminado`,
      color: 'negative',
      icon: 'remove_shopping_cart',
      timeout: 2000
    });
  }
};

// ✅ FUNCIÓN MEJORADA PARA CREAR FACTURAS
const submitInvoice = async () => {
  loading.value = true;

  try {
    if (!authStatus.value.authenticated) {
      throw new Error('No hay autenticación válida con Factus. Inicie sesión nuevamente.');
    }

    // ✅ VERIFICAR SI SE ACABA DE CREAR UNA FACTURA (rate limiting)
    const ultimaFactura = rows.value[0];
    if (ultimaFactura) {
      const tiempoUltimaFactura = new Date(ultimaFactura.createdAt);
      const ahora = new Date();
      const segundosTranscurridos = (ahora - tiempoUltimaFactura) / 1000;

      if (segundosTranscurridos < 10) {
        const esperarSegundos = Math.ceil(10 - segundosTranscurridos);

        Notify.create({
          type: 'warning',
          message: `Espera ${esperarSegundos} segundos antes de crear otra factura`,
          timeout: 3000
        });

        for (let i = esperarSegundos; i > 0; i--) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (i > 1) {
            Notify.create({
              type: 'info',
              message: `${i - 1} segundos restantes...`,
              timeout: 1000
            });
          }
        }
      }
    }

    try {
      const facturasPendientes = await backgetData("/invoice?status=pending");

      if (facturasPendientes.length > 0) {
        console.log('🔍 Verificando facturas pendientes...');
        const facturasRealmentePendientes = await verificarFacturasPendientesReales(facturasPendientes);

        if (facturasRealmentePendientes.length > 0) {
          facturasPendientesDetectadas.value = facturasRealmentePendientes;
          mostrarDialogoForzar.value = true;
          loading.value = false;
          return;
        } else {
          console.log('✅ No hay facturas realmente pendientes');
        }
      }
    } catch (backendError) {
      console.warn('⚠️ Error verificando facturas pendientes:', backendError.message);

      if (backendError.message.includes('Network Error') || backendError.message.includes('ERR_')) {
        Notify.create({
          type: 'warning',
          message: 'Backend no disponible. Creando factura de todas formas...',
          timeout: 3000
        });
      }
    }

    await crearFacturaSinValidaciones();

  } catch (error) {
    console.error("❌ Error al enviar factura:", error);

    let mensajeError = 'Error al crear la factura';
    let tipoError = 'negative';

    if (error.message.includes('Demasiadas solicitudes')) {
      mensajeError = error.message;
      tipoError = 'warning';
    } else if (error.message.includes('Token de Factus expirado')) {
      mensajeError = error.message;
      tipoError = 'warning';
    } else if (error.message.includes('Network Error') || error.message.includes('ERR_')) {
      mensajeError = '🔌 Error de conectividad. Verifica que el backend esté ejecutándose.';
    } else if (error.response?.data?.error) {
      mensajeError = error.response.data.error;
    } else if (error.message) {
      mensajeError = error.message;
    }

    Notify.create({
      type: tipoError,
      message: mensajeError,
      timeout: 10000
    });

    loading.value = false;
  }
};

const forzarCreacionFactura = async () => {
  mostrarDialogoForzar.value = false;

  Notify.create({
    type: 'warning',
    message: 'Creando factura aunque hay facturas pendientes...',
    timeout: 3000
  });

  await crearFacturaSinValidaciones();
};

const crearFacturaSinValidaciones = async () => {
  try {
    if (!factura.value.products.length) {
      throw new Error('Debe agregar al menos un producto');
    }

    if (!factura.value.customer || !factura.value.customer._id) {
      throw new Error('Debe seleccionar un cliente');
    }

    if (!factura.value.numbering_range_id) {
      throw new Error('Debe seleccionar un tipo de documento');
    }

    if (!factura.value.payment_method_code) {
      throw new Error('Debe seleccionar un método de pago');
    }

    if (!factura.value.payment_form) {
      throw new Error('Debe seleccionar una forma de pago');
    }

    const productosInvalidos = factura.value.products.filter(p => !isProductFactusReady(p));
    if (productosInvalidos.length > 0) {
      const nombresProductos = productosInvalidos.map(p => p.name).join(', ');
      throw new Error(`Los siguientes productos no son válidos para Factus: ${nombresProductos}. Actualice los productos primero.`);
    }

    const cantidadesInvalidas = factura.value.products.filter(p => !p.quantity || p.quantity <= 0);
    if (cantidadesInvalidas.length > 0) {
      throw new Error('Todos los productos deben tener cantidad mayor a 0');
    }

    const preciosInvalidos = factura.value.products.filter(p => !p.price || p.price <= 0);
    if (preciosInvalidos.length > 0) {
      throw new Error('Todos los productos deben tener precio mayor a 0');
    }

    // ✅ GENERAR REFERENCE_CODE MÁS ÚNICO
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);

    const datosFactura = {
      numbering_range_id: Number(factura.value.numbering_range_id),
      reference_code: factura.value.reference_code || `INV-${timestamp}-${random}`,
      observation: factura.value.observation || '',
      payment_form: Number(factura.value.payment_form),
      payment_method_code: factura.value.payment_method_code,
      payment_due_date: factura.value.payment_due_date || null,

      billing_period: {
        start_date: factura.value.billing_period.start_date,
        start_time: factura.value.billing_period.start_time + ":00",
        end_date: factura.value.billing_period.end_date,
        end_time: factura.value.billing_period.end_time + ":00",
      },

      customer: factura.value.customer._id,

      products: factura.value.products.map(item => ({
        product: item._id,
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        tax_rate: Number(item.tax_rate || 0),
        code_reference: item.code_reference,
        unit_measure_id: Number(item.unit_measure_id),
        standard_code_id: Number(item.standard_code_id),
        tribute_id: Number(item.tribute_id)
      }))
    };

    console.log('📤 Enviando factura con reference_code único:', datosFactura.reference_code);

    let respuesta;
    try {
      respuesta = await backpostData("/invoice", datosFactura);
      console.log('✅ Respuesta de Factus:', respuesta);

    } catch (backendError) {
      console.error('❌ Error del backend:', backendError);

      const errorData = backendError.response?.data;
      const errorCode = errorData?.code;
      const errorStatus = backendError.response?.status;

      // Manejo mejorado para error 409
      if (errorStatus === 409) {
        // Mostrar alerta principal
        Notify.create({
          type: 'warning',
          message: '⚠️ Esta factura ya existe',
          caption: 'Se generará un nuevo código automáticamente',
          timeout: 5000,
          icon: 'warning',
          position: 'top'
        });

        // Esperar un momento para que el usuario vea la alerta
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generar nuevo código
        const newTimestamp = Date.now();
        const newRandom = Math.random().toString(36).substr(2, 9);
        datosFactura.reference_code = `INV-${newTimestamp}-${newRandom}-RETRY`;

        try {
          respuesta = await backpostData("/invoice", datosFactura);
          console.log('✅ Respuesta de Factus (retry):', respuesta);

          // Alerta de éxito
          Notify.create({
            type: 'positive',
            message: '✅ Factura creada con nuevo código',
            caption: `Código: ${datosFactura.reference_code}`,
            timeout: 5000,
            icon: 'check_circle',
            position: 'top'
          });

        } catch (retryError) {
          // Alerta de error persistente
          Notify.create({
            type: 'negative',
            message: '❌ No se pudo crear la factura',
            caption: 'Intenta nuevamente en unos momentos',
            timeout: 6000,
            icon: 'error',
            position: 'top'
          });

          throw new Error(`Error persistente: ${retryError.response?.data?.error || retryError.message}`);
        }

      } else if (backendError.response?.status === 429 && errorCode === 'RATE_LIMIT_EXCEEDED') {
        throw new Error('Demasiadas solicitudes a Factus. Espera 30 segundos antes de crear otra factura.');

      } else if (backendError.response?.status === 401 && errorCode === 'TOKEN_EXPIRED') {
        throw new Error('Token de Factus expirado. Inicia sesión nuevamente en la aplicación.');

      } else if (backendError.response?.status === 504 && errorCode === 'TIMEOUT') {
        throw new Error('Timeout en la conexión con Factus. La factura podría haberse creado, verifica la lista.');

      } else if (errorCode === 'FACTUS_API_ERROR') {
        const factusError = errorData?.details || 'Error desconocido de Factus';
        throw new Error(`Error de Factus: ${factusError}`);

      } else {
        const errorMsg = errorData?.error || backendError.message;
        throw new Error(`Error del servidor: ${errorMsg}`);
      }
    }

    const invoiceData = respuesta.invoice || respuesta;

    Notify.create({
      type: 'positive',
      message: `Factura ${invoiceData.factusData?.number || invoiceData.reference_code} creada exitosamente`,
      caption: 'El proceso con la DIAN puede tardar unos minutos',
      timeout: 8000,
      actions: [
        {
          label: 'Ver Detalles',
          color: 'white',
          handler: () => viewInvoice(invoiceData)
        }
      ]
    });

    showModal.value = false;

    try {
      await getDatafromAPI();
    } catch (refreshError) {
      console.warn('⚠️ Error actualizando lista:', refreshError.message);
      Notify.create({
        type: 'warning',
        message: 'Factura creada, pero hubo un error actualizando la lista. Recarga la página.',
        timeout: 5000
      });
    }

    if (invoiceData.status === 'pending') {
      monitorearEstadoFactura(invoiceData._id);
    }

  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
};

const monitorearEstadoFactura = (facturaId) => {
  let intentos = 0;
  const maxIntentos = 20;

  const intervalo = setInterval(async () => {
    try {
      intentos++;

      const factura = await backgetData(`/invoice/${facturaId}`);

      if (factura.status !== 'pending' || factura.factusData?.cufe) {
        clearInterval(intervalo);

        await getDatafromAPI();

        Notify.create({
          type: 'positive',
          message: `Factura ${factura.factusData?.number || factura.reference_code} procesada`,
          caption: factura.factusData?.cufe ? 'Ya disponible para descarga' : 'Procesamiento completado',
          timeout: 5000
        });

        return;
      }

      if (intentos >= maxIntentos) {
        clearInterval(intervalo);
        console.log('⏰ Timeout monitoreando factura, dejando de verificar');

        Notify.create({
          type: 'info',
          message: 'La factura está tomando más tiempo del esperado en procesarse',
          caption: 'Puedes verificar el estado manualmente',
          timeout: 5000
        });
      }

    } catch (error) {
      intentos++;
      console.warn(`⚠️ Error monitoreando factura (intento ${intentos}):`, error.message);

      if (intentos >= maxIntentos) {
        clearInterval(intervalo);
      }
    }
  }, 15000);
};

const getDatafromAPI = async () => {
  try {
    loading.value = true;
    console.log('📊 Cargando facturas...');

    const response = await backgetData("invoice");
    console.log('📄 Respuesta del backend:', response);

    if (Array.isArray(response)) {
      const transformedInvoices = response.map(invoice => {
        console.log('🔄 Procesando factura:', invoice._id);

        return {
          ...invoice,
          number: invoice.factusData?.number || invoice.reference_code || 'N/A',
          names: invoice.customer?.names || invoice.customer?.company || 'Cliente',
          identification: invoice.customer?.identification || 'N/A',

          products: Array.isArray(invoice.products) ?
            invoice.products.map(item => {
              if (item.product && typeof item.product === 'object') {
                return {
                  _id: item.product._id,
                  name: item.product.name || item.name,
                  price: item.price || item.product.price,
                  tax_rate: item.tax_rate || item.product.tax_rate,
                  quantity: item.quantity,
                  code_reference: item.product.code_reference || item.code_reference,
                  unit_measure_id: item.product.unit_measure_id,
                  standard_code_id: item.product.standard_code_id,
                  tribute_id: item.product.tribute_id,
                  description: item.product.description
                };
              } else {
                return {
                  _id: item.product || item._id,
                  name: item.name || `Producto-${item.product || item._id}`,
                  price: item.price,
                  tax_rate: item.tax_rate,
                  quantity: item.quantity,
                  code_reference: item.code_reference
                };
              }
            }) : [],

          customer: typeof invoice.customer === 'object' ?
            invoice.customer :
            { _id: invoice.customer },

          factusData: invoice.factusData || {},
          factusCompany: invoice.factusCompany || {},
          status: invoice.status || 'issued',
          source: invoice.source || 'local'
        };
      });

      rows.value = transformedInvoices.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      console.log(`✅ ${rows.value.length} facturas cargadas y transformadas`);

    } else {
      console.warn('⚠️ La respuesta no es un array:', response);
      rows.value = [];
    }

  } catch (error) {
    console.error("❌ Error al obtener facturas:", error);

    let errorMessage = 'Error al cargar las facturas';

    if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
      errorMessage = 'No se puede conectar al backend. Verifica que esté ejecutándose en http://localhost:3000';
    } else if (error.response?.status === 401) {
      errorMessage = 'Error de autenticación. Inicie sesión nuevamente.';
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    Notify.create({
      type: 'negative',
      message: errorMessage,
      timeout: 8000,
      actions: error.message.includes('Network Error') ? [
        {
          label: 'Verificar Backend',
          color: 'white',
          handler: () => {
            window.open('http://localhost:3000', '_blank');
          }
        }
      ] : undefined
    });

    rows.value = [];
  } finally {
    loading.value = false;
  }
};

// Funciones para manejar acciones de la tabla
const handleAction = (action, row) => {
  if (action === "view") {
    viewInvoice(row);
  } else if (action === "download") {
    downloadInvoice(row.factusData?.number);
  } else if (action === "email") {
    sendInvoiceByEmail(row.factusData?.number);
  }
};

const viewInvoice = (invoice) => {
  factura.value = {
    ...{
      billing_period: {},
      products: [],
      customer: {},
      factusCompany: {},
      factusData: {},
    },
    ...invoice
  };
  viewInvoicemodal.value = true;
};

const goToDIAN = () => {
  try {
    const qrUrl = factura.value.factusData?.qr?.url;
    const qrCode = factura.value.factusData?.qr;
    const cufe = factura.value.factusData?.cufe;

    let url;

    if (qrUrl) {
      url = qrUrl;
    } else if (qrCode && typeof qrCode === 'string') {
      url = qrCode;
    } else if (cufe) {
      url = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`;
    } else {
      Notify.create({
        message: 'No se encontró información para acceder al portal de la DIAN',
        color: 'warning',
        icon: 'warning'
      });
      return;
    }

    console.log('🌐 Abriendo factura en DIAN:', url);
    window.open(url, '_blank');

  } catch (error) {
    console.error('❌ Error al abrir factura en DIAN:', error);
    Notify.create({
      message: 'Error al abrir la factura en el portal de la DIAN',
      color: 'negative',
      icon: 'error'
    });
  }
};

const downloadInvoice = async (number) => {
  try {
    if (!number) {
      Notify.create({
        message: 'No se encontró el número de factura para descargar',
        color: 'warning',
        icon: 'warning'
      });
      return;
    }

    console.log('📥 Descargando factura:', number);

    const invoiceResponse = await getData(`/v1/bills/download-pdf/${number}`);
    if (!invoiceResponse?.data?.pdf_base_64_encoded) {
      throw new Error("No se encontró el PDF de la factura");
    }

    const { pdf_base_64_encoded } = invoiceResponse.data;
    const byteCharacters = atob(pdf_base_64_encoded);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `factura_${number}.pdf`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    Notify.create({
      message: 'Factura descargada correctamente',
      color: 'positive',
      icon: 'cloud_download'
    });
  } catch (error) {
    console.error("❌ Error al descargar factura:", error);

    let errorMessage = 'Error al descargar la factura';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Notify.create({
      message: errorMessage,
      color: 'negative',
      icon: 'warning'
    });
  }
};

const sendInvoiceByEmail = async (number) => {
  try {
    if (!number) {
      Notify.create({
        message: 'No se encontró el número de factura para enviar por email',
        color: 'warning',
        icon: 'warning'
      });
      return;
    }

    loading.value = true;
    console.log('📧 Enviando factura por email:', number);

    const response = await backpostData(`/invoice/send-email/${number}`);
    Notify.create({
      message: 'Factura enviada por correo exitosamente',
      color: 'positive',
      icon: 'email'
    });
  } catch (error) {
    console.error("❌ Error al enviar factura por email:", error);

    let errorMessage = 'Error al enviar la factura por correo';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    Notify.create({
      message: errorMessage,
      color: 'negative',
      icon: 'warning'
    });
  } finally {
    loading.value = false;
  }
};

// Funciones para cargar datos iniciales
const getDataCustomers = async () => {
  try {
    console.log('👥 Cargando clientes...');
    const response = await backgetData("customer");
    customers.value = response || [];
    console.log(`✅ ${customers.value.length} clientes cargados`);
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error);
  }
};

const getDataProducts = async () => {
  try {
    console.log('📦 Cargando productos...');
    const response = await backgetData("product");
    selectproduct.value = response || [];
    console.log(`✅ ${selectproduct.value.length} productos cargados`);
    console.log(`📊 ${factusReadyProducts.value.length} productos listos para Factus`);
    console.log(`⚠️ ${productsNotReadyForFactus.value.length} productos con problemas para Factus`);

    if (productsNotReadyForFactus.value.length > 0) {
      console.warn('⚠️ Productos que necesitan actualización para Factus:',
        productsNotReadyForFactus.value.map(p => ({
          name: p.name,
          missing: getMissingFactusFields(p)
        }))
      );
    }
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
  }
};

const fetchRangesNumber = async () => {
  try {
    console.log('📋 Cargando rangos de numeración...');
    const response = await getData('/v1/numbering-ranges');
    rangeOptions.value = response.data?.map(item => ({
      value: item.id,
      label: item.document
    })) || [];
    console.log(`✅ ${rangeOptions.value.length} rangos cargados`);
  } catch (error) {
    console.error('❌ Error al obtener rangos:', error);
  }
};

// FUNCIÓN AUXILIAR: Verificar backend
const verificarBackend = async () => {
  try {
    const baseURL = import.meta.env.VITE_API_URL || '/api';
    const response = await fetch(`${baseURL}/customer`);
    return response.ok;
  } catch {
    return false;
  }
};

// ✅ INICIALIZACIÓN MEJORADA
onMounted(async () => {
  console.log('🚀 Iniciando módulo de facturas...');

  // ✅ INICIALIZAR MODO OSCURO
  initializeDarkMode();

  // ✅ ESCUCHAR CAMBIOS EN LOCALSTORAGE
  window.addEventListener('storage', handleStorageChange);

  // Verificar estado del backend
  const backendOk = await verificarBackend();
  if (!backendOk) {
    Notify.create({
      type: 'warning',
      message: '⚠️ Backend no disponible en http://localhost:3000. Algunas funciones pueden no funcionar.',
      timeout: 8000,
      actions: [
        {
          label: 'Intentar de nuevo',
          color: 'white',
          handler: () => location.reload()
        }
      ]
    });
  }

  // Verificar autenticación al cargar
  checkAuthStatus();

  // Cargar datos en paralelo con manejo de errores
  const promises = [
    getDatafromAPI().catch(e => console.warn('Error cargando facturas:', e.message)),
    getDataCustomers().catch(e => console.warn('Error cargando clientes:', e.message)),
    getDataProducts().catch(e => console.warn('Error cargando productos:', e.message)),
    fetchRangesNumber().catch(e => console.warn('Error cargando rangos:', e.message))
  ];

  await Promise.allSettled(promises);

  console.log('✅ Módulo inicializado (con manejo de errores)');
});

// ✅ LIMPIAR EVENT LISTENERS AL DESMONTAR
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
.modern-invoices-container {
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
  background: linear-gradient(45deg, #f59e0b, #d97706);
  border-radius: 50%;
  opacity: 0.6;
  animation: particle-float linear infinite;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.3);
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
  background: linear-gradient(135deg, #f59e0b, #d97706);
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
  background: linear-gradient(135deg, #1e293b, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.container-dark .page-title {
  background: linear-gradient(135deg, #f8fafc, #f59e0b);
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

.modern-sync-btn {
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

.modern-sync-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(107, 114, 128, 0.4);
}

.modern-create-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
  position: relative;
  overflow: hidden;
  border: none;
}

.modern-create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(245, 158, 11, 0.4);
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
.modern-sync-btn:hover .btn-glow {
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
  color: #f59e0b;
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

.modern-input :deep(.q-field__control) {
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.1);
  border-radius: 12px;
  height: 48px;
  transition: all 0.3s ease;
}

.modern-input :deep(.q-field--focused .q-field__control) {
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  background: rgba(245, 158, 11, 0.08);
}

.input-icon {
  color: #f59e0b;
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
  background: linear-gradient(135deg, #f59e0b, #d97706);
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
  background: rgba(245, 158, 11, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
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
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
}

.cell-avatar.customer-avatar {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.cell-avatar.product-avatar {
  background: linear-gradient(135deg, #10b981, #34d399);
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

.cell-text.total-text {
  font-weight: 700;
  color: #f59e0b;
}

.table-dark .cell-text {
  color: #f8fafc;
}

.table-dark .cell-text.price-text {
  color: #34d399;
}

.table-dark .cell-text.total-text {
  color: #fbbf24;
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

.view-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.view-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.download-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.download-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.email-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.email-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

.refresh-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.refresh-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.delete-btn:hover {
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
  background: rgba(245, 158, 11, 0.4);
  border-radius: 50%;
  animation: particle-float linear infinite;
}

.modern-modal {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modern-modal.invoice-creation-modal {
  max-width: 1200px;
  width: 90%;
  max-height: 95vh;
}

.modern-modal.professional-invoice-modal {
  max-width: 100vw;
  width: 100vw;
  max-height: 100vh;
  height: 100vh;
  border-radius: 0;
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
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(217, 119, 6, 0.05));
}

.modal-header.warning-header {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05));
}

.container-dark .modal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.modal-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.modal-icon.warning-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
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

/* ===== BANNER FACTUS ===== */
.factus-status-banner {
  margin-bottom: 24px;
}

.modern-banner {
  border-radius: 12px;
  overflow: hidden;
}

/* ===== STEPPER MODERNO ===== */
.modern-stepper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(245, 158, 11, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.container-dark .step-card {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.step-card.active {
  border-color: #f59e0b;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15);
}

.step-header {
  padding: 20px;
  background: rgba(245, 158, 11, 0.05);
  border-bottom: 1px solid rgba(245, 158, 11, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.container-dark .step-header {
  background: rgba(245, 158, 11, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.step-header:hover {
  background: rgba(245, 158, 11, 0.1);
}

.step-indicator {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
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
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.1);
  border-radius: 12px;
  height: 48px;
  transition: all 0.3s ease;
}

.modern-field :deep(.q-field--focused .q-field__control) {
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  background: rgba(245, 158, 11, 0.08);
}

/* ===== SECCIONES ===== */
.section-title {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: #f59e0b;
  transition: color 0.3s ease;
}

.container-dark .section-title {
  color: #fbbf24;
}

.customer-section,
.payment-section,
.observation-section {
  margin-top: 24px;
}

.customer-details {
  margin-top: 16px;
  padding: 16px;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.container-dark .customer-details {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

/* ===== PRODUCTOS ===== */
.product-selection {
  margin-bottom: 24px;
}

.quick-search-section {
  margin-top: 12px;
}

.quick-products {
  margin-top: 16px;
  padding: 16px;
  background: rgba(245, 158, 11, 0.05);
  border: 1px dashed rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.container-dark .quick-products {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.quick-products-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.container-dark .quick-products-title {
  color: #f8fafc;
}

.quick-products-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-product-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-product-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.products-table {
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
}

.quantity-input {
  max-width: 80px;
}

.product-name-cell {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.step2-validation {
  margin-top: 24px;
  padding: 16px;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.1);
  border-radius: 12px;
}

.container-dark .step2-validation {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.validation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.validation-icon {
  color: #f59e0b;
  font-size: 1.25rem;
}

.validation-title {
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

/* ===== RESUMEN DE FACTURA ===== */
.invoice-summary {
  margin-top: 32px;
}

.summary-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(245, 158, 11, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.container-dark .summary-card {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.summary-header {
  background: rgba(245, 158, 11, 0.05);
  padding: 16px 20px;
  font-weight: 600;
  border-bottom: 1px solid rgba(245, 158, 11, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.container-dark .summary-header {
  background: rgba(245, 158, 11, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
}

.summary-content {
  padding: 20px;
  transition: color 0.3s ease;
}

.container-dark .summary-content {
  color: white;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(245, 158, 11, 0.2);
}

.summary-row.total {
  font-weight: 600;
  font-size: 1.1rem;
  color: #f59e0b;
  border-bottom: none;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 2px solid rgba(245, 158, 11, 0.3);
}

.validation-summary {
  margin-top: 16px;
  padding: 12px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  color: #dc2626;
}

.container-dark .validation-summary {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.validation-summary-title {
  margin-bottom: 8px;
}

.validation-summary-list {
  margin: 0;
  padding-left: 16px;
}

.validation-summary-list li {
  margin-bottom: 4px;
}

/* ===== LISTADO DE FACTURAS PENDIENTES ===== */
.pending-invoices-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pending-invoice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.1);
  border-radius: 12px;
}

.container-dark .pending-invoice-item {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.invoice-info {
  flex: 1;
}

.invoice-number {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.container-dark .invoice-number {
  color: #f8fafc;
}

.invoice-details {
  color: #64748b;
  font-size: 0.875rem;
}

.container-dark .invoice-details {
  color: #94a3b8;
}

/* ===== MODAL PROFESIONAL DE VISUALIZACIÓN ===== */
.professional-toolbar {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  min-height: 64px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.container-dark .professional-toolbar {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.toolbar-content {
  padding: 0 24px;
}

.professional-actions-bar {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.container-dark .professional-actions-bar {
  background: #424242;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.professional-btn {
  color: white;
  font-weight: 500;
  text-transform: none;
  padding: 8px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.professional-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.invoice-status-chip {
  margin-left: 16px;
}

.professional-invoice-container {
  flex: 1;
  overflow: hidden;
  padding: 0;
  background: #ffffff;
  transition: background-color 0.3s ease;
}

.container-dark .professional-invoice-container {
  background: #424242;
}

.professional-scrollable-content {
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.professional-scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.professional-scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.professional-scrollable-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.professional-invoice-content {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  color: #000000;
  font-family: 'Arial', sans-serif;
  line-height: 1.5;
  transition: all 0.3s ease;
}

.container-dark .professional-invoice-content {
  background: #424242;
  color: white;
}

/* ===== HEADER DE LA FACTURA ===== */
.invoice-header {
  padding: 24px 0;
  margin-bottom: 24px;
}

.logo-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.professional-logo-container {
  width: 150px;
  height: 150px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.container-dark .professional-logo-container {
  border-color: rgba(255, 255, 255, 0.12);
  background: #616161;
}

.professional-logo {
  max-width: 130px;
  max-height: 130px;
  object-fit: contain;
  border-radius: 4px;
}

.company-section {
  padding: 0 16px;
}

.document-header {
  text-align: center;
  margin-bottom: 16px;
}

.document-type {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .document-type {
  color: white;
}

.document-number {
  font-size: 18px;
  font-weight: 600;
  background: #f8fafc;
  padding: 8px 16px;
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  display: inline-block;
  color: #1e293b;
  transition: all 0.3s ease;
}

.container-dark .document-number {
  background: #616161;
  border-color: rgba(255, 255, 255, 0.12);
  color: white;
}

.company-details {
  text-align: center;
}

.company-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .company-name {
  color: white;
}

.company-nit,
.company-contact,
.company-address {
  font-size: 14px;
  margin-bottom: 2px;
  color: #64748b;
  transition: color 0.3s ease;
}

.container-dark .company-nit,
.container-dark .company-contact,
.container-dark .company-address {
  color: #94a3b8;
}

.qr-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.qr-container {
  text-align: center;
}

.professional-qr {
  width: 120px;
  height: 120px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.qr-label {
  font-size: 12px;
  margin-top: 8px;
  font-weight: 500;
  color: #64748b;
  transition: color 0.3s ease;
}

.container-dark .qr-label {
  color: #94a3b8;
}

/* ===== SEPARADOR PROFESIONAL ===== */
.professional-separator {
  margin: 24px 0;
  border-color: #e2e8f0;
}

.container-dark .professional-separator {
  border-color: rgba(255, 255, 255, 0.12);
}

/* ===== SECCIONES DE INFORMACIÓN ===== */
.invoice-info-section {
  margin-bottom: 32px;
}

.info-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.container-dark .info-card {
  background-color: #424242;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-header {
  background: #f8fafc;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.container-dark .card-header {
  background-color: #616161;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.card-icon {
  color: #f59e0b;
  font-size: 18px;
}

.container-dark .card-icon {
  color: #fbbf24;
}

.card-title {
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .card-title {
  color: white;
}

.card-content {
  padding: 16px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  align-items: flex-start;
}

.info-label {
  font-weight: 600;
  min-width: 120px;
  font-size: 14px;
  margin-right: 8px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .info-label {
  color: white;
}

.info-data {
  font-size: 14px;
  flex: 1;
  word-break: break-word;
  color: #64748b;
  transition: color 0.3s ease;
}

.container-dark .info-data {
  color: #94a3b8;
}

.cufe-text {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  word-break: break-all;
}

/* ===== SECCIÓN DE PRODUCTOS ===== */
.products-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px 0;
  border-bottom: 2px solid #e2e8f0;
}

.container-dark .section-header {
  border-bottom: 2px solid rgba(255, 255, 255, 0.12);
}

.section-icon {
  color: #f59e0b;
  font-size: 20px;
}

.section-title {
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .section-title {
  color: white;
}

.professional-table-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.container-dark .professional-table-container {
  border-color: rgba(255, 255, 255, 0.12);
}

.professional-products-table {
  background: white;
  transition: background-color 0.3s ease;
}

.container-dark .professional-products-table {
  background: #424242;
}

.professional-table-header {
  background: #f8fafc;
  transition: background-color 0.3s ease;
}

.container-dark .professional-table-header {
  background: #757575;
}

.professional-table-header .q-th {
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
  border-bottom: 2px solid #e2e8f0;
  color: #1e293b;
  transition: all 0.3s ease;
}

.container-dark .professional-table-header .q-th {
  color: white;
  border-bottom: 2px solid rgba(255, 255, 255, 0.12);
}

.professional-products-table .q-td {
  font-size: 14px;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f3f4;
  color: #1e293b;
  transition: all 0.3s ease;
}

.container-dark .professional-products-table .q-td {
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.professional-total-cell {
  font-weight: 600;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.container-dark .professional-total-cell {
  background: #757575;
}

/* ===== SECCIÓN DE TOTALES Y PAGO ===== */
.totals-payment-section {
  margin-bottom: 32px;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-method,
.payment-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.payment-label {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .payment-label {
  color: white;
}

.payment-value {
  font-size: 14px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  transition: all 0.3s ease;
}

.container-dark .payment-value {
  background: #757575;
  border-color: rgba(255, 255, 255, 0.12);
  color: white;
}

.observations-text {
  font-size: 14px;
  line-height: 1.6;
  min-height: 40px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  transition: all 0.3s ease;
}

.container-dark .observations-text {
  background: #757575;
  border-color: rgba(255, 255, 255, 0.12);
  color: white;
}

.totals-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.amount-in-words {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.container-dark .amount-in-words {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.words-label {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .words-label {
  color: white;
}

.words-text {
  font-size: 13px;
  font-style: italic;
  line-height: 1.4;
  text-transform: capitalize;
  color: #64748b;
  transition: color 0.3s ease;
}

.container-dark .words-text {
  color: #94a3b8;
}

.totals-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.total-label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .total-label {
  color: white;
}

.total-amount {
  font-size: 14px;
  font-weight: 600;
  text-align: right;
  min-width: 100px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .total-amount {
  color: white;
}

.grand-total-line {
  background: #f8fafc;
  padding: 12px 16px;
  margin: 8px -16px -16px -16px;
  border-top: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.container-dark .grand-total-line {
  background-color: #616161;
  border-top: 2px solid rgba(255, 255, 255, 0.12);
}

.grand-total-label {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .grand-total-label {
  color: white;
}

.grand-total-amount {
  font-size: 18px;
  font-weight: 700;
  text-align: right;
  min-width: 120px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .grand-total-amount {
  color: white;
}

/* ===== FOOTER PROFESIONAL ===== */
.professional-footer {
  margin-top: 32px;
  padding: 24px 0;
  border-top: 2px solid #e2e8f0;
  transition: border-color 0.3s ease;
}

.container-dark .professional-footer {
  border-top: 2px solid rgba(255, 255, 255, 0.12);
}

.footer-content {
  text-align: center;
}

.footer-line {
  margin-bottom: 6px;
  font-size: 13px;
  color: #1e293b;
  transition: color 0.3s ease;
}

.container-dark .footer-line {
  color: white;
}

.legal-notice {
  font-style: italic;
  font-size: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;
}

.container-dark .legal-notice {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
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
  color: #f59e0b;
  font-weight: 500;
  border-radius: 12px;
  padding: 8px 16px;
}

.nav-btn:hover {
  background: rgba(245, 158, 11, 0.1);
}

.modern-secondary-btn {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
  border: none;
}

.modern-secondary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(107, 114, 128, 0.4);
}

.modern-primary-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  border: none;
}

.modern-primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
}

.modern-primary-btn:disabled {
  opacity: 0.6;
  transform: none !important;
  box-shadow: none !important;
}

.full-width {
  width: 100%;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .modern-invoices-container {
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

  .modern-sync-btn,
  .modern-create-btn {
    width: 100%;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .modern-modal {
    margin: 16px;
    max-height: calc(100vh - 32px);
  }

  .modern-modal.invoice-creation-modal {
    width: calc(100vw - 32px);
    max-width: calc(100vw - 32px);
  }

  .modern-modal.professional-invoice-modal {
    margin: 0;
    width: 100vw;
    max-width: 100vw;
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

  .pending-invoice-item {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .professional-scrollable-content {
    padding: 16px;
  }

  .invoice-header {
    padding: 16px 0;
  }

  .professional-logo-container {
    width: 120px;
    height: 120px;
  }

  .professional-logo {
    max-width: 100px;
    max-height: 100px;
  }

  .document-type {
    font-size: 18px;
  }

  .document-number {
    font-size: 16px;
  }

  .professional-qr {
    width: 100px;
    height: 100px;
  }

  .actions-container {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .professional-btn {
    width: 100%;
    justify-content: center;
  }

  .info-row {
    flex-direction: column;
    gap: 4px;
  }

  .info-label {
    min-width: auto;
    margin-right: 0;
  }

  .payment-method,
  .payment-form {
    margin-bottom: 16px;
  }

  .quick-products-grid {
    flex-direction: column;
  }

  .quick-product-chip {
    width: 100%;
    justify-content: center;
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

.pending-invoice-item {
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

.pending-invoice-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
}

.info-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.container-dark .info-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>