<script lang="ts">
	import { page } from '$app/state';
	import {
		TiendaCatalogo,
		TiendaComoPedir,
		TiendaHero,
		TiendaSabores,
		TiendaSeo
	} from '#lib/components/features/tienda/index.ts';

	let { data } = $props();

	// Las páginas filtradas no se indexan: el contenido canónico es la home sin query
	const filtrada = $derived(page.url.search.length > 0);
</script>

<TiendaSeo
	tienda={data.tienda.nombre_tienda}
	description={data.tienda.descripcion}
	image={data.tienda.logo_url}
	canonicalPath="/"
	noIndex={filtrada}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Store',
		name: data.tienda.nombre_tienda,
		description: data.tienda.descripcion ?? undefined,
		logo: data.tienda.logo_url ?? undefined,
		url: page.url.origin,
		telephone: data.tienda.telefono ?? undefined,
		email: data.tienda.email_contacto ?? undefined,
		address: data.tienda.direccion
			? {
					'@type': 'PostalAddress',
					streetAddress: data.tienda.direccion,
					addressLocality: data.tienda.ciudad ?? undefined
				}
			: undefined,
		sameAs: Object.values(data.tienda.redes_sociales ?? {})
	}}
/>

<TiendaHero tienda={data.tienda} />

<TiendaSabores opciones={data.opciones} filtros={data.filtros} />

<!-- Destino de "Ver los sabores"; scroll-mt: que el header fijo no tape el título -->
<div id="catalogo" class="scroll-mt-20 pt-10 md:scroll-mt-28 md:pt-14">
	<TiendaCatalogo
		titulo="Nuestros kéfirs"
		nivel="h2"
		productos={data.productos}
		opciones={data.opciones}
		filtros={data.filtros}
		query={data.query}
	/>
</div>

<TiendaComoPedir tienda={data.tienda} />
