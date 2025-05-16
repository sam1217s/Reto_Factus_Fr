<template>
  <div class="q-pa-md">
    <!-- Botón para abrir el modal -->
    <h4>Facturas</h4>
    <hr>
    <q-card-actions align="right">
        <q-btn label="Crear" icon="add" @click="showModal = true; resertFactura()" class="crear"style="background-color: #007bff; color: white; border-radius: 6px; padding: 10px 20px; font-weight: 600;" />
    </q-card-actions>
      
  
    <!-- Tabla de Facturas -->
    <q-table separator="cell"
     flat
      bordered
       :rows="rows" 
       :columns="columns"
        row-key="id"
         v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 20, 50]">
     
      <template v-slot:header="props">
                <tr>
                  <th v-for="col in props.cols" :key="col.name" :class="'tabla-header'">
                    <span>{{ col.label }}</span>
                  </th>
                </tr>
              </template>

              <template v-slot:body-cell-actions="props">
  <q-td :props="props" class="tabla-cell opciones">
    <!-- Icono de Visualizar con Tooltip -->
    <q-btn color="primary" icon="visibility" flat @click="handleAction('view', props.row)">
      <q-tooltip>Visualizar</q-tooltip>
    </q-btn>

    <!-- Icono de Descargar con Tooltip -->
    <q-btn color="positive" icon="download" flat @click="handleAction('download', props.row)">
      <q-tooltip>Descargar</q-tooltip>
    </q-btn>
    <q-btn color="secondary" icon="email" flat @click="handleAction('email', props.row)">
      <q-tooltip>Enviar por correo</q-tooltip>
    </q-btn>
  </q-td>
</template>

    </q-table>

    <!-- Modal de Registro de Factura -->
    <q-dialog v-model="showModal" maximized>
      <q-card>
        <q-card-section class="row items-center justify-between bg-primary text-white">
          <div class="text-h6">Registrar Factura</div>
          <q-btn icon="close" flat dense @click="showModal = false" />
        </q-card-section>

        <q-card-section style="padding:  20px 130px 10px" class="bg-grey-4">
          <q-form @submit.prevent="submitInvoice" class="bg-white q-pa-md">
            <div class="factura-container q-pa-xl">
            <h4 style=" font-size: 13px;"> Información de la Factura</h4>
            <div class="row q-col-gutter-md">
              <q-select v-model="factura.numbering_range_id" :options="rangeOptions" label="Tipo de Documento"
                class="col-6 input-field" outlined emit-value dense map-options />

              <q-input v-model="factura.reference_code" label="Código de Referencia" class="col-6 input-field" outlined
                dense />

              <q-select v-model="factura.customer" :options="customers" label="Cliente"  :option-label="customer => customer?.names ||customer?.company || ''" map-options
                class="col-4 input-field" outlined dense />
              <q-input :model-value="factura.customer?.identification" label="Identificación" class="col-2 input-field"
                outlined readonly dense />
              <q-input :model-value="factura.customer?.email" label="Email" class="col-4 input-field" outlined readonly
                dense />
              <q-input :model-value="factura.customer?.phone" label="Teléfono" class="col-2 input-field" outlined
                readonly dense />
            </div>
            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-12 col-md-6">
                <q-btn label="Crear" icon="add" to="customer" class="crear"
                  style="background-color: #007bff; color: white; border-radius: 6px; padding: 5px 15px; font-weight: 600; font-size: 9px;" />
              </div>
            </div>

            <h4 style="font-size: 13px;">Periodo de facturación</h4>
            <div class="row q-col-gutter-md q-mt-md">

              <div class="col-4">
                <q-input v-model="factura.billing_period.start_date" label="Inicio Facturación" type="date"
                  class="col-3 input-field" outlined dense />
                <q-input v-model="factura.billing_period.start_time" label="Hora Inicio" type="time"
                  class="col-2 input-field" outlined dense />
              </div>
              <div class="col-4">

                <q-input v-model="factura.billing_period.end_date" label="Fin Facturación" type="date"
                  class="col-3 input-field" outlined dense />
                <q-input v-model="factura.billing_period.end_time" label="Hora Fin" type="time"
                  class="col-3 input-field" outlined dense />
              </div>

              <div class="col-4">
                <q-input v-model="factura.payment_due_date" label="Fecha de Vencimiento" type="date" outlined dense
                  class="col-3 input-field" />
              </div>
            </div>

            <q-separator></q-separator>

            <h4 style="font-size: 13px"> Productos</h4>
            <q-select v-model="productSelected" :options="selectproduct" label="Seleccionar Productos"
              option-label="name" @update:model-value="agregarItem" dense filled behavior="menu"
              style="width: 200px; margin-bottom: 3%;" />

            <q-table separator="cell" :rows="factura.products" :columns="productColumns" row-key="id"
              class="q-mt-md compact-table">

              <template v-slot:header="props">
                <tr>
                  <th v-for="col in props.cols" :key="col.name" :class="'tabla-header'">
                    <span>{{ col.label }}</span>
                  </th>
                </tr>
              </template>

              <template v-slot:body-cell-quantity="props" >
                <q-td :props="props" style="width: 20px;" >
                  <q-input v-model="props.row.quantity" type="number" min="1" dense outlined  /> 
                </q-td>
              </template>
              <template v-slot:body-cell-price="props" >
                <q-td :props="props">
                  <span>{{ formatNumber(props.row.price) }}</span>
                </q-td>
              </template>
              <template v-slot:body-cell-tax_rate="props">
                <q-td :props="props">
                  <span>{{ props.row.tax_rate }}%</span>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn color="red" icon="delete" dense flat @click="deleteProduct(props.row)" />
                </q-td>
              </template>
            </q-table>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-4">
                <q-select v-model="factura.payment_method_code" :options="paymentMethods" label="Método de Pago" outlined
                option-label="label" option-value="value" emit-value map-options dense class="col-6 input-field" />

              <q-select v-model="factura.payment_form" label="Forma de Pago" option-label="name" option-value="id"
                emit-value map-options :options="paymentForms" class="col-6 input-field" outlined dense /> 
              </div>
              <div class="col-4">
                <h4 style="font-size: 13px;">Total Neto</h4>
               
              </div>
              <div class="col-4 text-center items-center">
                <h4 style="font-size: 13px;" class="text-bold total ">${{ formatNumber(totalFactura) }}</h4>
              </div>
             
            </div>

            <q-input v-model="factura.observation" label="Observaciones" type="textarea" class="q-mt-md" outlined />
            </div>
            <div class="button-group">
              <q-btn label="Cancelar" color="blue-grey" flat @click="showModal = false" />
              <q-btn label="Guardar y enviar" color="blue" class="q-ml-md" @click="submitInvoice"  :loading="loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de vizualizacion de factura -->
    <q-dialog persistent v-model="viewInvoicemodal" maximized>
      <q-card>
        <q-toolbar class=" p-md-0 bg-primary text-white">
          <q-toolbar-title>
          
          </q-toolbar-title>
          <q-btn flat round dense icon="close" color="grey-5" v-close-popup />
        </q-toolbar>

        <!-- Sección de botones encima de factura-container -->
    <q-card-section class="q-pa-md flex justify-center ">
      
        <!-- Botón Ver en DIAN -->
        <q-btn 
          color="primary"
          icon="public"
          label="Ver en DIAN"
          @click="goToDIAN"
          class="q-mx-sm"
        />
        
        <!-- Botón Enviar por correo -->
        <q-btn 
          color="secondary"
          icon="email"
          label="Enviar por correo"
          @click="handleAction('email')"
          class="q-mx-sm"
        />
        
        <!-- Botón Descargar -->
        <q-btn 
          color="positive"
          icon="download"
          label="Descargar"
          @click="downloadInvoice(factura.factusData?.number)"
          class="q-mx-sm"
        />
     
    </q-card-section>

        <q-card-section >
          <div class="factura-container q-pa-md">
            <!-- Logo y Encabezado -->
            <div class="header-section row items-center q-px-md q-pt-md">
              <div class="col-xs-12 col-sm-3">
                <div class="logo-placeholder flex flex-center">
                 
                  <div class="logo-text">
                    <img src="http://api-sandbox.factus.com.co/storage/images/logos/GQi1cXtMgnS3rPOFDE9d6E2d2k1SocDtJ3goJVBT.png" alt="logo" style="width: 130px; height: 130px;">
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-4 text-center text-sm-right company ">
                <div class=" text-weight-bold text-primary"> {{ factura.factusData?.document.name }} Número {{ factura.factusData?.number }}</div>
                <div class="text-weight-bold" >{{ factura.factusCompany?.company }}</div>
                <div >NIT {{ factura.factusCompany?.nit }} </div>
                <div>TEL: {{  factura.factusCompany?.phone }} </div>
                <div>{{ factura.factusCompany?.direction }}</div>

              </div>
              <div class="col-xs-12 col-sm-3 text-center text-sm-right">
                <img v-if="factura.factusData?.qr_image" :src="factura.factusData.qr_image" alt="Código QR" style="width: 150px; height: 150px;">
              </div>
            </div>

            <q-separator class="q-my-sm" color="grey-8" />

            <div class="row q-px-md q-pt-md">
  <!-- Columna izquierda: Datos del cliente -->
  <div class="col-xs-12 col-md-6 dataCustomer">
    <div class="section-box">
      <div class="section-title">DATOS DEL CLIENTE</div>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-">
          <div class="info-field">
            <span class="info-label">Cliente:</span>
            <span class="info-value">{{ factura.customer.names }}</span>
          </div>
          
          <div class="info-field">
            <span class="info-label">Documento:</span>
            <span class="info-value">{{ factura.customer.identification }}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ factura.customer.email }}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Teléfono:</span>
            <span class="info-value">{{ factura.customer.phone }}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Dirección:</span>
            <span class="info-value">{{ factura.customer.address }}</span>
          </div>
        </div>
        
       
      </div>
    </div>
  </div>

  <!-- Columna derecha: Número de factura y fechas -->
  <div class="col-xs-12 col-md-6">
    <div class="section-box">
    
      <div class="section-title">PERIODO DE FACTURACIÓN</div>
      <div class="info-box-title">Fecha generación</div>
      
      <div class="info-box-content text-h5">{{ date.formatDate(factura.createdAt, 'DD/MM/YYYY') }}</div>
      <div class="info-box-title">Fecha de Expedición</div>
      <div class="info-box-content">{{ date.formatDate(factura.payment_due_date, 'DD/MM/YYYY') }}</div>
   </div>
  </div>
</div>
              <!-- Detalle de productos -->
              <div class="section-box q-mx-md q-mt-md">
                <div class="section-title">DETALLE DE LA FACTURA</div>
                <q-table
                separator="cell"
                  flat
                  bordered
                  :rows="factura.products"
                  :columns="productsInvoice"
                  row-key="id"
                  hide-pagination
                  hide-bottom
                  class="detalle-table"
                >
              
                <template v-slot:body-cell-price="props">
                <q-td :props="props">
                  {{ formatNumber(props.row.price) }}
                </q-td>
              </template>
              <template v-slot:header="props">
                <tr>
                  <th v-for="col in props.cols" :key="col.name" :class="'tabla-header'">
                    <span>{{ col.label }}</span>
                  </th>
                </tr>
              </template>
                
                </q-table>
              </div>
  
              <!-- Totales -->
              <div class="row q-mx-md q-mt-md">
                <div class="col-xs-12 col-md-6">
                  <div class="valor-letras-box">
                    <div class="section-title">VALOR EN LETRAS:</div>
                    <div>{{ numberLetter(factura.factusData.total)}}</div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-6">
                  <div class="totales-box text-weight-bold">
                    <div class="total-row">
                      <span>Subtotal:</span>
                      <span>{{ formatNumber(factura.factusData?.gross_value) }}</span>
                    </div>
                    <div class="total-row">
                      <span>IVA:</span>
                      <span>{{ formatNumber(factura.factusData?.tax_amount) }}</span>
                    </div>
                    <div class="total-row">
                      <span>Descuentos:</span>
                      <span>{{ factura.factusData?.discount_rate }}</span>
                    </div>
                    <div class="total-row text-weight-bold">
                      <span class="section-title">TOTAL:</span>
                      <span>{{ formatNumber(factura.factusData?.total) }}</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Forma de pago y observaciones -->
              <div class="row q-mx-md q-mt-md q-mb-md" >
                <div class="col-xs-12 col-md-6" >
                  <div class="section-box">
                    <div class="section-title">FORMA DE PAGO</div>
                    <div class="info-field">
                      <span class="info-label">Método:</span>
                      <span class="info-value">{{ factura.factusData?.payment_method.name }}</span>
                    </div>
                    <div class="info-field">
                      <span class="info-label">Forma de Pago:</span>
                      <span class="info-value">{{ factura.factusData?.payment_form.name }}</span>
                      
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-6">
                  <div class="section-box">
                    <div class="section-title">OBSERVACIONES</div>
                    <div class="observaciones" style="min-height: 58px;">
                      <p>{{ factura.factusData?.observation || "Sin observaciones"}}</p>
                      
                    </div>
                  </div>
                </div>
              </div>
            <!-- Pie de página -->
            <div class="footer q-mt-lg q-pa-md text-center text-grey-7">
              <div>CUFE: {{ factura.factusData?.cufe }}</div>
              <div>{{ factura.factusCompany?.company }} - NIT: {{ factura.factusCompany?.nit }}</div>
              <div>{{ factura.factusCompany.email }} - Tel: {{ factura.factusCompany?.phone }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, toRaw, computed } from "vue";
import { getData } from "../services/apiClient";
import { backgetData, backpostData } from "../services/backClient";
import { date } from 'quasar'
import dayjs from 'dayjs';
import { useQuasar } from 'quasar'
import { Notify } from 'quasar';
import {NumerosALetras} from 'numero-a-letras';

const numberLetter = (number) => {
  const total= NumerosALetras(number).split(" 00/100")[0];
  const numero = total.split("de").join("");
  return numero;
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};

const columns = [
  {
    name: "createdAt",
    label: "Fecha de Elaboración",
    align: "center",
    field: row => date.formatDate(row.createdAt, 'DD/MM/YYYY'),
    sortable: true
  },
  {
  name: "number",
  label: "Número",
  align: "center",
 field: row => {
      const numberSources = [row.number, row.setpNumber, row.referenceCode, row.factusData?.number];
      return row.factusData?.number || row.number || row.referenceCode || 'Sin número';
    },
},
  {
    name: "identification",
    label: "Identificación",
    align: "center",
    field: (row) => row.identification || row.customer?.identification,
    sortable: true
  },
  {
    name: "names",
    label: "Cliente",
    align: "center",
    field: (row) => row.names || row.customer?.names || "cliente sin nombre",
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
  { name: 'total', label: 'Total', field: ((row) => new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.price * row.quantity)), align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' }

];

const productsInvoice = ref([
  { name: 'name', label: 'descripción', field: 'name', align: 'center' },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center' },
  { name: 'price', label: 'Valor Unitario', field: 'price', align: 'center' },
  { name: 'tax_rate', label: 'Impuesto', field: 'tax_rate', align: 'center' },
  { name: 'total', label: 'Total', field: ((row) => new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.price * row.quantity)), align: 'center' },
 
]);

const $q = useQuasar()
const showModal = ref(false);
const productSelected = ref("");
const selectproduct = ref();
const search = ref('');
const viewInvoicemodal = ref(false);
const rows = ref([]);
const pagination = ref({ page: 1, rowsPerPage: 5 });
const loading = ref(false);

const totalFactura = computed(() => {
  const productos = factura.value.products
  if (!productos || productos.length === 0) return 0

  return productos.reduce((total, item) => {
    const precio = Number(item.price) || 0
    const cantidad = Number(item.quantity) || 0
    const impuesto = Number(item.tax_rate) || 0

    const subtotal = precio * cantidad
    /* const totalConImpuesto = subtotal + (subtotal * impuesto / 100) */

    return total + subtotal
  }, 0)
})


const now = dayjs();
const factura = ref({
  billing_period: {
    start_date: now.format("YYYY-MM-DD"), 
    start_time: now.format("HH:mm"), 
    end_date: now.add(1, "day").format("YYYY-MM-DD"), 
    end_time: now.format("HH:mm") 
  },
  products: [],
  items: [],
  customer: {},
  payment_due_date: now.add(2, "day").format("YYYY-MM-DD"),
});


// reset de formulario
const resertFactura = ()=> {
  factura.value = {
    billing_period: {
      start_date: now.format("YYYY-MM-DD"), 
      start_time: now.format("HH:mm"), 
      end_date: now.add(1, "day").format("YYYY-MM-DD"), 
      end_time: now.format("HH:mm") 
    },
    products: [],
    items: [],
    customer: {},
    payment_due_date: now.add(2, "day").format("YYYY-MM-DD"),
  };
}


const goToDIAN = () => window.open(
  factura.value.factusData?.qr?.url || 
  factura.value.factusData?.qr || 
  `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${factura.value.factusData?.cufe || ''}`,
  '_blank', 
  'noopener,noreferrer'
);

const viewInvoice = (invoice) => {
    factura.value = {
      ...{
        billing_period: {},
        products: [],
        items: [],
        customer: {},
        factusCompany: {},
        factusData: {},
       
      },
      ...invoice
    };
    // Asegurar que items exista y sea un array
    if (!factura.value.items) {
      factura.value.items = [];
    }
    // Abrir el modal de visualización de factura
    viewInvoicemodal.value = true;
  }

const customers = ref([]);

const rangeOptions = ref([]);



// Función para eliminar un producto
function deleteProduct(product) {
  factura.value.products = factura.value.products.filter(p => p !== product);
}

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


async function getDatafromAPI() {
  try {
    const invoiceResponse = await backgetData("invoice");
    if (invoiceResponse) {
      console.log(invoiceResponse)
      rows.value = invoiceResponse;
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error)
  }
}

async function getDataCustomers() {
  try {
    const customerResponse = await backgetData("customer");
    customers.value = customerResponse;

  } catch (error) {
    console.error("Error al obtener los datos:", error);

  }
}

async function getDataProducts() {
  try {
    const productResponse = await backgetData("/product");
    selectproduct.value = productResponse
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}


function agregarItem() {
  if (productSelected) {
    const producto = toRaw(productSelected.value)
    factura.value.products.push(producto)
    console.log(factura.value.products)
  }
}


const handleAction = (action, row) => {
  if (action === "view") {
    viewInvoice(row);
  } else if (action === "download") {
    downloadInvoice(row.factusData?.number);
  } 
};




const submitInvoice = async () => {
  loading.value = true;
  try {
    console.log("datos componente", toRaw(factura.value));
    const response = await backpostData("/invoice", {
      numbering_range_id: Number(factura.value.numbering_range_id),
      reference_code: factura.value.reference_code,
      observation: factura.value.observation,
      payment_form: factura.value.payment_form,
      payment_due_date: factura.value.payment_due_date,

      payment_method_code: factura.value.payment_method_code,
      billing_period: {
        start_date: factura.value.billing_period.start_date,
        start_time: factura.value.billing_period.start_time + ":00",
        end_date: factura.value.billing_period.end_date,
        end_time: factura.value.billing_period.end_time + ":00",

      },
      customer: toRaw(factura.value.customer),
      products: factura.value.products.map((item) => toRaw(item)),
      state: 1
    });
    console.log("vamo hp");
    console.log(response);
    showModal.value = false;
    await getDatafromAPI();
    resertFactura();
    Notify.create({
      message: 'Factura guardada exitosamente',
      color: 'positive',
      icon: 'check'
    })
  } catch (error) {
    Notify.create({
      message: 'Error al guardar factura',
      color: 'negative',
      icon: 'warning'
    })
    console.error("Error al guardar factura:", error);
  }
  finally {
    loading.value = false;
  }
};

async function downloadInvoice(number) {
  console.log("Iniciando descarga de factura:", number);
  
  try {
    // 1. Obtener datos de la API
    const invoiceResponse = await getData(`/v1/bills/download-pdf/${number}`);
    // 2. Validar respuesta
    if (!invoiceResponse?.data?.pdf_base_64_encoded) {
      throw new Error("La respuesta no contiene datos válidos del PDF");
    }
    const { file_name = `factura_${number}`, pdf_base_64_encoded } = invoiceResponse.data;
    // 3. Decodificar base64 (manejo más eficiente)
    const byteCharacters = atob(pdf_base_64_encoded);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    
    // 4. Crear Blob y descargar
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${number}.pdf`;
    
    document.body.appendChild(a);
    a.click();
    
    // 5. Limpieza
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    // 6. Notificar al usuario
    Notify.create({
      message: `Factura descargada correctamente`,
      color: 'positive',
      icon: 'cloud_download'
    })
    
    console.log(`Factura ${file_name} descargada correctamente`);
    
  } catch (error) {
    console.error("Error en downloadInvoice:", error);
    
    // Mostrar feedback al usuario (puedes personalizar esto)
    const errorMsg = error.response?.data?.message || 
                   error.message || 
                   "Error al descargar el PDF";
    
    Notify.create({
      message: errorMsg,
      color: 'negative',
      icon: 'warning'
    })
    throw error; // Opcional: re-lanzar el error para manejo superior
  }
}

onMounted(() => {
  getDatafromAPI();
  fetchRangesNumber();
  getDataCustomers();
  getDataProducts();
});

//endpoints

const fetchRangesNumber = async () => {
  try {
    const response = await getData('/v1/numbering-ranges?filter[id]&filter[document]&filter[resolution_number]&filter[technical_key]&filter[is_active]');
    if (response.data && Array.isArray(response.data)) {
      rangeOptions.value = response.data.map(item => ({ value: item.id, label: item.document }));
    } else {
      console.error('❌ Estructura inesperada en la respuesta:', response.data);
    }

  } catch (error) {
    console.error('❌ Error al obtener los rangos:', error);
  }
};
</script>

<style scoped>
* {
  
  box-sizing: border-box;
  font-family: 'NunitSans', sans-serif;

}


.q-btn{
  font-size: 11px;
}

.compact-table {
  font-size: small;
}

.input-field {
  margin-bottom: 10px;
  font-size: small;
  box-sizing: border-box;

}

.tittle {
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin: 20px;

}

h4 {

  color: #37465a;
  font-size: 24px;
  font-weight: 800;
  line-height: 25px;
  margin-bottom: 10px;
  font-family: NunitSans, sans-serif;
  text-align: center;
}

.tabla-header {
  font-weight: bold;
  text-transform: uppercase;
  background-color: #007bff;
  color: white;
  padding: 12px;
  text-align: center;
  font-size: 11px;
}

.company{
  
  line-height: normal;
}

.dataCustomer{
  line-height: 85%;
}

.button-group {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  font-size: 11px;
  padding: 20px;
}

.factura-container {
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Roboto', Arial, sans-serif;
  border: 3px solid ghostwhite;
  
}

.header-section {
  background-color: #f5f5f5d4;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}




.section-box {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 15px;
  background-color: #fafafa;
}

.section-title {
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 10px;
  font-size: 12px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 5px;
}

.info-box {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  height: 100%;
}

.info-box-title {
  font-size: 0.8rem;
  color: #666;
}

.info-box-content {
  font-weight: bold;
  font-size: 13px;
}

.info-field {
  margin-bottom: 8px;
}

.info-label {
  font-weight: bold;
  margin-right: 5px;
  color: #555;
}


.info-value {
  color: #333;
}

.detalle-table {
  border-radius: 4px;
  overflow: hidden;
}

.valor-letras-box {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  height: 100%;
}

.totales-box {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  height: 100%;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #ddd;
}

.total-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.observaciones {
  font-size: 0.9rem;
  line-height: 1.5;
}

.footer {
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

@media print {
  body * {
    visibility: hidden;
  }

  .q-dialog,
  .q-dialog * {
    visibility: visible;
  }

  .q-dialog {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }

  .q-toolbar,
  .q-card-actions {
    display: none;
  }
}
</style>