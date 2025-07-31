import { useNotifications } from '../composables/useNotifications';

const { showError } = useNotifications();

export const handleApiError = (error, context = '') => {
  console.error(`❌ Error en ${context}:`, error);
  
  const errorData = error.response?.data;
  const status = error.response?.status;
  
  // Errores de red
  if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
    showError('Error de conexión. Verifica que el backend esté ejecutándose.');
    return;
  }
  
  // Errores por status code
  switch (status) {
    case 400:
      showError(errorData?.error || 'Datos inválidos en la solicitud');
      break;
    case 401:
      showError('Sesión expirada. Inicia sesión nuevamente');
      break;
    case 403:
      showError('No tienes permisos para realizar esta acción');
      break;
    case 404:
      showError('Recurso no encontrado');
      break;
    case 409:
      showError('Ya existe un registro con esos datos');
      break;
    case 429:
      showError('Demasiadas solicitudes. Espera un momento');
      break;
    case 500:
      showError('Error interno del servidor');
      break;
    default:
      showError(errorData?.error || errorData?.message || 'Error desconocido');
  }
};

