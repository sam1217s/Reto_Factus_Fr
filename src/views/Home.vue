<template>
    <div>
      <!-- Botón para abrir el modal -->
      <q-btn 
        label="Ver Factura" 
        color="primary" 
        @click="modalFactura = true"
        icon="receipt"
      />
  
      <!-- Modal de Factura -->
      <q-dialog v-model="modalFactura" maximized>
        <q-card>
          <!-- Barra de herramientas del modal -->
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>
              Factura Electrónica No. FE 141
            </q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
  
          <!-- Contenido de la factura (scrollable) -->
          <q-card-section class="scroll" style="max-height: calc(100vh - 50px)">
            <div class="factura-container q-pa-md">
              <!-- Logo y Encabezado -->
              <div class="header-section row items-center q-px-md q-pt-md">
                <div class="col-xs-12 col-sm-3">
                  <div class="logo-placeholder flex flex-center">
                    <q-icon name="image" size="xl" color="grey-5" />
                    <div class="logo-text">LOGO</div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-9 text-center text-sm-right">
                  <div class="text-h4 text-weight-bold text-primary">FACTURA ELECTRÓNICA</div>
                  <div class="text-subtitle1">FUNDACIÓN COLORBIA VIVE Y RUEBA</div>
                  <div>NIT: 210.654-22-5</div>
                  <div>TEL: (001) 3125118851</div>
                  <div>Fantasy@fantasy.com</div>
                </div>
              </div>
  
              <q-separator class="q-my-sm" color="grey-8" />
  
              <!-- Número de factura y fechas -->
              <div class="row q-px-md q-pt-md">
                <div class="col-xs-12 col-md-6">
                  <div class="info-box">
                    <div class="info-box-title">Factura No.</div>
                    <div class="info-box-content text-h5">FE 141</div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-6">
                  <div class="info-box">
                    <div class="info-box-title">Fecha de Expedición</div>
                    <div class="info-box-content">24/12/2024, 16:10</div>
                  </div>
                </div>
              </div>
  
              <!-- Datos del cliente -->
              <div class="section-box q-mx-md q-mt-md">
                <div class="section-title">DATOS DEL CLIENTE</div>
                <div class="row q-col-gutter-md">
                  <div class="col-xs-12 col-sm-6">
                    <div class="info-field">
                      <span class="info-label">Razón Social:</span>
                      <span class="info-value">ALCALDIA MUNICIPAL SAN JOAQUIN</span>
                    </div>
                    <div class="info-field">
                      <span class="info-label">NIT:</span>
                      <span class="info-value">50.208.675-2</span>
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-6">
                    <div class="info-field">
                      <span class="info-label">Teléfono:</span>
                      <span class="info-value">(000) 3142582314 – Ext. 000</span>
                    </div>
                    <div class="info-field">
                      <span class="info-label">Dirección:</span>
                      <span class="info-value">Carrera 4 # 9-28, San Joaquín - Colombia</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Detalle de productos -->
              <div class="section-box q-mx-md q-mt-md">
                <div class="section-title">DETALLE DE LA TRANSACCIÓN</div>
                
                <q-table
                  flat
                  bordered
                  :rows="[producto]"
                  :columns="columns"
                  row-key="id"
                  hide-pagination
                  hide-bottom
                  class="detalle-table"
                >
                  <template v-slot:body-cell-descripcion="props">
                    <q-td :props="props">
                      <div class="text-bold">{{ props.row.descripcion }}</div>
                      <div class="text-caption text-grey-7">CONVENIO DE ASOCIACIÓN NO. 644</div>
                    </q-td>
                  </template>
                </q-table>
              </div>
  
              <!-- Totales -->
              <div class="row q-mx-md q-mt-md">
                <div class="col-xs-12 col-md-6">
                  <div class="valor-letras-box">
                    <div class="text-caption">VALOR EN LETRAS:</div>
                    <div>Dieciocho millones ochocientos doce mil novecientos diecinueve pesos</div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-6">
                  <div class="totales-box">
                    <div class="total-row">
                      <span>Subtotal:</span>
                      <span>18.812.919,00</span>
                    </div>
                    <div class="total-row">
                      <span>Descuentos:</span>
                      <span>0,00</span>
                    </div>
                    <div class="total-row text-h6 text-weight-bold">
                      <span>TOTAL:</span>
                      <span>18.812.919,00</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Forma de pago y observaciones -->
              <div class="row q-mx-md q-mt-md">
                <div class="col-xs-12 col-md-6">
                  <div class="section-box">
                    <div class="section-title">FORMA DE PAGO</div>
                    <div class="info-field">
                      <span class="info-label">Método:</span>
                      <span class="info-value">Efectivo</span>
                    </div>
                    <div class="info-field">
                      <span class="info-label">Valor:</span>
                      <span class="info-value">$18.812.919,00</span>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-6">
                  <div class="section-box">
                    <div class="section-title">OBSERVACIONES</div>
                    <div class="observaciones">
                      <p>A Acta lectura de venta estructural se compara enviando a la serie del cambio territorial a Ley 1211 de 2009.</p>
                      <p>No responsable de: UA.-Actividad Excelenteza SE II. Actividades de Seguros Sociales.</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Pie de página -->
              <div class="footer q-mt-lg q-pa-md text-center text-grey-7">
                <div>Fundación Colorbia Vive y Rueba - NIT: 210.654-22-5</div>
                <div>www.fundaciel.org - Tel: (001) 3125118851</div>
                <div class="q-mt-sm text-caption">Resolución DIAN No. 18764000234234 - Fecha: 15/03/2024</div>
              </div>
            </div>
          </q-card-section>
  
          <!-- Botones de acción -->
          <q-card-actions align="right" class="bg-grey-2 q-pa-md">
            <q-btn 
              label="Imprimir" 
              color="primary" 
              icon="print"
              @click="imprimirFactura"
            />
            <q-btn 
              label="Cerrar" 
              color="grey" 
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const modalFactura = ref(false);
  
  const columns = [
    {
      name: 'descripcion',
      required: true,
      label: 'DESCRIPCIÓN',
      align: 'left',
      field: 'descripcion'
    },
    {
      name: 'cantidad',
      label: 'CANT.',
      align: 'center',
      field: 'cantidad',
      style: 'width: 80px'
    },
    {
      name: 'valor',
      label: 'VALOR UNITARIO',
      align: 'right',
      field: 'valor',
      style: 'width: 120px'
    },
    {
      name: 'total',
      label: 'TOTAL',
      align: 'right',
      field: 'total',
      style: 'width: 120px'
    }
  ];
  
  const producto = ref({
    id: 1,
    descripcion: 'PAGO CONVENIO DE ASOCIACIÓN NO. ',
    cantidad: 1,
    valor: '18.812.919,00',
    total: '18.812.919,00'
  });
  
  const imprimirFactura = () => {
    window.print();
  };
  </script>
  
  <style scoped>
  .factura-container {
    max-width: 900px;
    margin: 0 auto;
    font-family: 'Roboto', Arial, sans-serif;
  }
  
  .header-section {
    background-color: #f5f5f5;
    padding-bottom: 20px;
  }
  
  .logo-placeholder {
    height: 100px;
    width: 100%;
    border: 2px dashed #ccc;
    border-radius: 4px;
    position: relative;
  }
  
  .logo-text {
    position: absolute;
    color: #999;
    font-size: 12px;
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
    font-size: 1.1rem;
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
    font-size: 1.2rem;
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
    .q-dialog, .q-dialog * {
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
    .q-toolbar, .q-card-actions {
      display: none;
    }
  }
  </style>