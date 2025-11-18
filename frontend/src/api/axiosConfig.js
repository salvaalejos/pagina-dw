import axios from 'axios';

// 1. Definimos la URL base de nuestra API
const baseURL = 'https://localhost:5000/api';

// 2. Creamos una "instancia" de axios
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true  // <-- ¡ESTA ES LA MAGIA!
});

// 3. Exportamos esta instancia para usarla en toda la app
export default api;

axios.defaults.withCredentials = true;
