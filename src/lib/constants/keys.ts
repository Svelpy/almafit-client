export const ACCESS_TOKEN_KEY = 'almafit::auth::at';
export const REFRESH_TOKEN_KEY = 'almafit::auth::rt';
export const USER_DATA_KEY = 'almafit::auth::ud';
// Configuración de la tienda (GET /config/), guardada tras el login
export const TIENDA_DATA_KEY = 'almafit::tienda::data';
// Nombre del Web Lock que serializa el refresh del token entre pestañas
export const REFRESH_LOCK_KEY = 'almafit::auth::refresh';
// Venta en curso de la caja (carrito y datos del cobro) para no perderla al recargar
export const VENTA_BORRADOR_KEY = 'almafit::venta::borrador';
// Cesta de la tienda pública (no se borra al cerrar sesión del panel)
export const CESTA_KEY = 'almafit::tienda::cesta';
