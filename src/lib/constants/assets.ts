/**
 * Marca de la plataforma (Almafit): panel, login y respaldo cuando la API no responde.
 * Los datos de la tienda (nombre, descripción, logo, redes) salen de `GET /tienda/config`.
 */
export const APP_SITE_CONFIG = {
	APP_NAME: 'Almafit',
	APP_TAGLINE: 'Natural como vos',
	/** Cuenta de X (Twitter) para `twitter:site`; vacío si no hay */
	APP_TWITTER_HANDLE: '',
	/** 1200×630, generada a partir del logo */
	DEFAULT_OG_IMAGE: '/images/og_almafit.jpg'
};
