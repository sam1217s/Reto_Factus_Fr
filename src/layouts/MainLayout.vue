<template>
    <div class="q-md">
      <q-layout view="hHh Lpr lff" container class="shadow-2 rounded-borders"></q-layout>
        <q-header elevated class="header" v-show="$route.path !== '/' && $route.path !== '/'">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu" v-if="userName"/>
            <q-toolbar-title><strong>LRFactus</strong></q-toolbar-title>
            
            <q-btn-dropdown  id="dropdown" flat :label="userName" class="q-py-sm" style="color: white; ">
              <q-img class="absolute-top" 
                style="height: 160px; text-align: center;">
                <div class="absolute-bottom bg-transparent" style="color: #37465a ;">
                    <q-avatar size="56px" class="q-mb-sm">
                        <img src="/logo.png" alt="logo">
                    </q-avatar>
                    <div class="text-weight-bold">SanboxFactus</div>
                    <div style="font-size: 10px;">{{ userName }}</div>
                    <hr style="border-top: 1px solid #ddd; margin-top: 10px; margin-bottom: 10px;">
                </div>
            </q-img>
                    <q-list style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd; font-size:11px; "  >
                     
                        <q-item clickable v-close-popup @click="goToSettings" >
                            <q-item-section avatar style="min-width: 40px">
                                <q-icon name="settings" style=" font-size: 17px;" />
                            </q-item-section>
                            <q-item-section>Configuración</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="logout" to="/">
                            <q-item-section avatar style="min-width: 40px">
                                <q-icon name="logout" style=" font-size: 17px;"  />
                            </q-item-section>
                            <q-item-section>Cerrar sesión</q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
          </q-toolbar>
        </q-header>
        
  
        <q-drawer 
        
        v-show="$route.path !== '/' && $route.path !== '/'"
          v-model="drawer"
          show-if-above
          :mini="miniState"
          @mouseenter="miniState = false"
          @mouseleave="miniState = true"
          mini-to-overlay
          :width="200" 
          :breakpoint="500"
          bordered
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
        >
        <q-img class="absolute-top"  style="height: 100px; text-align: center;">
         
                <div class="absolute-bottom bg-transparent" style="color: #37465a ;">
                    <q-avatar  size="30px" class="q-mb-sm">
                        <img  src="/logo.png" alt="logo">
                    </q-avatar>
                    <hr style="border-top: 1px solid #ddd; margin-top: 10px; margin-bottom: 10px;">
                </div>
            </q-img>
          <q-scroll-area class="fit"   :horizontal-thumb-style="{ opacity: 0 }">
            <q-list padding style="height: calc(100% - 150px); margin-top: 70px; border-right: 1px solid #ddd; font-size:11px; " >
              <q-item clickable v-ripple to="/home" active-class="my-menu-link" exact>
                <q-item-section avatar>
                  <q-icon name="home" />
                </q-item-section>
  
                <q-item-section>
                  Inicio
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple to="/invoice" active-class="my-menu-link">
                <q-item-section avatar>
                  <q-icon name="receipt"  />
                </q-item-section>
  
                <q-item-section>
                  Facturas
                </q-item-section>
              </q-item>
  
              <q-item clickable v-ripple to="/customer" active-class="my-menu-link">
                <q-item-section avatar>
                  <q-icon name="groups" />
                </q-item-section>
  
                <q-item-section>
                  Clientes
                </q-item-section>
              </q-item>
  
              <q-item clickable v-ripple to="/product" active-class="my-menu-link">
                <q-item-section avatar>
                  <q-icon name="category" />
                </q-item-section>
  
                <q-item-section>
                  Productos
                </q-item-section>
              </q-item>
  
              <q-separator />

            </q-list>
          </q-scroll-area>
        </q-drawer>
  
        <q-page-container>
          <router-view />
        </q-page-container>

    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuth } from '../store/useAuth';
import { QPageContainer } from 'quasar';
  
  const router = useRouter();
  const auth = useAuth();
  const drawer = ref(false);
  const miniState = ref(true);
  let userName = auth.userName
  
  </script>
  <style>
  .header{
    background-color: #0d6efd;
  }

  #dropdown{
    font-size: 10px;
    font-weight: 700;
   
  }

  .q-drawer{
    color: #37465a;
    font-weight: 700;
   

  }

  .my-menu-link{
    color: #0d6efd;
  }

  

</style>