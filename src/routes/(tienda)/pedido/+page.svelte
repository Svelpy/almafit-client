<script lang="ts">
	import { onMount } from 'svelte';
	import { TiendaCesta, TiendaSeo } from '#lib/components/features/tienda/index.ts';
	import { cestaCantidad, cestaStore } from '#lib/stores/index.ts';

	let { data } = $props();

	// En esta página el pedido ya está a la vista: el drawer no hace falta
	onMount(() => cestaStore.cerrar());
</script>

<TiendaSeo title="Tu pedido" tienda={data.tienda.nombre_tienda} noIndex />

<section class="mx-auto max-w-2xl" aria-labelledby="pedido-titulo">
	<h1 id="pedido-titulo" class="mb-8 font-display text-2xl text-light-three dark:text-dark-three">
		Tu pedido ({$cestaCantidad})
	</h1>
	<TiendaCesta tienda={data.tienda} />
</section>
