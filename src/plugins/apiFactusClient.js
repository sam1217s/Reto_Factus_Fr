import axios from "axios";
import { useAuth } from "../store/useAuth";

// ✅ APUNTA A TU BACKEND
const apiCliente = axios.create({
  baseURL: "https://api-sandbox.factus.com.co",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ INTERCEPTOR PARA AGREGAR TOKEN
apiCliente.interceptors.request.use((config) => {
  const authStore = useAuth();
  const token = authStore.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅ INTERCEPTOR DE RESPUESTA CON REFRESH OAUTH2
apiCliente.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuth();

    if (error.response && error.response.status === 401) {
      console.log("🚨 Token expirado, intentando refrescar automáticamente...");

      const refreshToken = authStore.refreshToken;

      if (!refreshToken) {
        console.error("❌ No hay refresh token. El usuario debe volver a autenticarse.");
        authStore.logout();
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        // ✅ USAR OAUTH TOKEN CON GRANT_TYPE REFRESH_TOKEN (según documentación Factus)
        const refreshResponse = await axios.post(
          `${apiCliente.defaults.baseURL}/oauth/token`,
          {
            grant_type: "refresh_token",
            client_id: "9e2e167b-d588-44ee-b5e0-f1244880aed6",
            client_secret: "wlLUQU1FzTQvUp7KUndhj3I8L1ydlNxVjFtMuNRQ",
            refresh_token: refreshToken
          },
          {
            headers: { "Content-Type": "application/json" }
          }
        );

        // ✅ VERIFICAR QUE SE RECIBIERON TOKENS VÁLIDOS
        if (refreshResponse.data.access_token && refreshResponse.data.refresh_token) {
          // Actualizar tokens en la tienda
          authStore.set_Token_RefreshToken(
            refreshResponse.data.access_token,
            refreshResponse.data.refresh_token
          );

          console.log("✅ Token refrescado automáticamente usando OAuth2");

          // Reintenta la solicitud original con el nuevo token
          error.config.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
          return apiCliente(error.config);
        } else {
          throw new Error('No se recibieron tokens válidos en el refresh');
        }

      } catch (refreshError) {
        console.error("❌ No se pudo refrescar el token automáticamente:", refreshError);
        
        // Limpiar la autenticación y redirigir
        authStore.logout();
        window.location.href = '/';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiCliente;