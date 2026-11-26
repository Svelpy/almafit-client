<script lang="ts">
	import { resolve } from '$app/paths';
	import type { TiendaProducto } from '#lib/interfaces/index.ts';
	import { imagenSrcset, imagenUrl, slugIdParam } from '#lib/utils/index.ts';
	import TiendaPrecio from './tiendaPrecio.svelte';

	interface Props {
		producto: TiendaProducto;
		/** Las primeras tarjetas (sobre el pliegue) se cargan sin lazy */
		prioridad?: boolean;
	}

	let { producto, prioridad = false }: Props = $props();

	const href = $derived(
		resolve('/(tienda)/[producto=producto]', { producto: slugIdParam(producto, 'p') })
	);
	// En la API los sabores son "colores": su hex es el tono que representa al sabor
	const sabores = $derived(producto.colores);
</script>

<article class="group flex flex-col">
	<a
		{href}
		class="flex flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-light-accent"
	>
		<!-- Tope en arco: el hombro de una botella -->
		<div
			class="relative aspect-3/4 overflow-hidden rounded-t-full bg-light-one_d dark:bg-dark-one_d"
		>
			{#if producto.portada_url}
				<img
					src={imagenUrl(producto.portada_url, 700)}
					srcset={imagenSrcset(producto.portada_url)}
					sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
					alt={producto.nombre}
					loading={prioridad ? 'eager' : 'lazy'}
					fetchpriority={prioridad ? 'high' : 'auto'}
					decoding="async"
					class={[
						'h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none',
						producto.agotado && 'opacity-60'
					]}
				/>
			{/if}
			{#if producto.agotado}
				<span
					class="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-light-one px-3 py-0.5 text-xs font-semibold dark:bg-dark-one"
				>
					Agotado
				</span>
			{/if}
		</div>

		<div class="mt-4 flex flex-col items-center gap-1 px-1 text-center">
			<h3
				class="w-full truncate font-display text-[0.9375rem] font-semibold tracking-[0.03em] text-light-three dark:text-dark-three"
			>
				{producto.nombre}
			</h3>
			<TiendaPrecio precios={producto} compacto class="justify-center text-sm" />
		</div>
	</a>

	{#if sabores.length > 0}
		<div class="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
			<span class="sr-only">
				{sabores.length === 1 ? 'Sabor' : 'Sabores'}: {sabores.map((s) => s.nombre).join(', ')}
			</span>
			{#each sabores as sabor (sabor.id)}
				<span
					class="size-3 rounded-full outline-1 -outline-offset-1 outline-light-two/20 dark:outline-dark-two/30"
					style:background-color={sabor.codigo_hex ?? 'transparent'}
					title={sabor.nombre}
					aria-hidden="true"
				></span>
			{/each}
		</div>
	{/if}
</article>
