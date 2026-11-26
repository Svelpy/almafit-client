<script lang="ts">
	import type { Snippet } from 'svelte';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';
	import type {
		PaginatedResponse,
		TiendaFiltros,
		TiendaFiltrosOpciones,
		TiendaProducto,
		TiendaProductosQuery
	} from '#lib/interfaces/index.ts';
	import { tiendaPublicaService } from '#lib/services/index.ts';
	import {
		conPagina,
		contarFiltros,
		duracion,
		escalonado,
		filtrosToSearchParams,
		filtrosVacios
	} from '#lib/utils/index.ts';
	import TiendaFiltrosPanel from './tiendaFiltros.svelte';
	import TiendaProductoCard from './tiendaProductoCard.svelte';

	interface Props {
		titulo: string;
		/** h2 cuando la página ya tiene su h1 (la home, con el hero) */
		nivel?: 'h1' | 'h2';
		/** Migas de pan sobre el título */
		migas?: { label: string; href: string }[];
		productos: PaginatedResponse<TiendaProducto>;
		opciones: TiendaFiltrosOpciones | null;
		filtros: TiendaFiltros;
		/** Query base del listado (sin `page`), para pedir las páginas siguientes */
		query: TiendaProductosQuery;
		/** Contenido cuando no hay resultados */
		vacio?: Snippet;
	}

	let {
		titulo,
		nivel = 'h1',
		migas = [],
		productos,
		opciones,
		filtros,
		query,
		vacio
	}: Props = $props();

	// Se reinician cuando el load trae otro listado (otra página, filtro u orden)
	let lista = $derived(productos.data);
	let pagina = $derived(productos.page);
	let cargando = $state(false);
	let errorCarga = $state(false);
	let filtrosAbiertos = $state(false);

	const hayMas = $derived(pagina < productos.total_pages);
	const activos = $derived(contarFiltros(filtros));
	const siguienteHref = $derived(`${page.url.pathname}?${conPagina(page.url.search, pagina + 1)}`);
	const limpiarHref = $derived.by(() => {
		const params = filtrosToSearchParams(
			{ ...filtrosVacios(), orden: filtros.orden },
			page.url.search
		);
		return `${page.url.pathname}${params.size ? `?${params}` : ''}`;
	});

	// "Ver más" agrega la página siguiente sin navegar; sin JS el enlace abre ?page=n
	async function verMas(event: MouseEvent) {
		event.preventDefault();
		if (cargando) return;
		cargando = true;
		errorCarga = false;
		try {
			const res = await tiendaPublicaService.productos({ ...query, page: pagina + 1 });
			const vistos = new Set(lista.map((p) => p.id));
			lista = [...lista, ...res.data.filter((p) => !vistos.has(p.id))];
			pagina = res.page;
		} catch {
			errorCarga = true;
		} finally {
			cargando = false;
		}
	}
</script>

<svelte:head>
	{#if hayMas}
		<link rel="next" href="{page.url.origin}{siguienteHref}" />
	{/if}
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -- enlaces a la misma ruta con otra query -->
<section aria-labelledby="catalogo-titulo">
	<div class="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 text-editorial">
		<div class="min-w-0">
			{#if migas.length > 0}
				<nav aria-label="Ruta de navegación" class="mb-2 text-light-two_d dark:text-dark-two_d">
					<ol class="flex flex-wrap items-center gap-x-2">
						{#each migas as miga, index (miga.href)}
							<li class="flex items-center gap-2">
								{#if index > 0}<span aria-hidden="true">/</span>{/if}
								<a href={miga.href} class="hover:underline hover:underline-offset-4">{miga.label}</a
								>
							</li>
						{/each}
					</ol>
				</nav>
			{/if}
			<svelte:element
				this={nivel}
				id="catalogo-titulo"
				class="font-display text-2xl text-light-three md:text-[1.75rem] dark:text-dark-three"
			>
				{titulo}
			</svelte:element>
		</div>

		<div class="flex items-center gap-5">
			{#key productos.total}
				<span
					class="text-light-two_d tabular-nums dark:text-dark-two_d"
					in:fly={{ y: -6, duration: duracion(250), easing: cubicOut }}
				>
					{productos.total}
					{productos.total === 1 ? 'producto' : 'productos'}
				</span>
			{/key}
			{#if activos > 0}
				<a href={limpiarHref} class="underline underline-offset-4">Quitar filtros</a>
			{/if}
			<button
				type="button"
				onclick={() => (filtrosAbiertos = true)}
				aria-haspopup="dialog"
				class="inline-flex h-9 items-center rounded-full border border-light-two/20 px-4 transition-colors hover:border-light-three focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-accent dark:border-dark-two/25 dark:hover:border-dark-three"
			>
				Filtros{activos > 0 ? ` (${activos})` : ''}
			</button>
		</div>
	</div>

	{#if lista.length === 0}
		<div class="py-24 text-center text-editorial" in:fade={{ duration: duracion(300) }}>
			{#if vacio}
				{@render vacio()}
			{:else}
				<p>No hay kéfirs con esos filtros.</p>
				{#if activos > 0}
					<a href={limpiarHref} class="mt-4 inline-block underline underline-offset-4">
						Quitar filtros
					</a>
				{/if}
			{/if}
		</div>
	{:else}
		<!--
			Al filtrar u ordenar: los productos que siguen se reacomodan (flip), las nuevas entran en
			cascada y las que ya no coinciden se desvanecen. relative: Svelte fija con position
			absolute a las que salen mientras dura su animación.
		-->
		<ul
			class="relative grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 xl:grid-cols-4 xl:gap-x-10"
		>
			{#each lista as producto, index (producto.id)}
				<li
					animate:flip={{ duration: duracion(450), easing: cubicOut }}
					in:fly|global={{
						y: 24,
						duration: duracion(500),
						delay: escalonado(index),
						easing: cubicOut
					}}
					out:fade={{ duration: duracion(150) }}
				>
					<TiendaProductoCard {producto} prioridad={index < 4} />
				</li>
			{/each}
		</ul>

		{#if hayMas}
			<div class="mt-16 flex flex-col items-center gap-3 text-editorial">
				<a
					href={siguienteHref}
					onclick={verMas}
					aria-busy={cargando}
					class={[
						'inline-flex h-11 min-w-48 items-center justify-center rounded-full border border-light-three px-6 font-semibold text-light-three transition-colors hover:bg-light-three hover:text-light-one dark:border-dark-three dark:text-dark-three dark:hover:bg-dark-three dark:hover:text-dark-one',
						cargando && 'pointer-events-none opacity-60'
					]}
				>
					{cargando ? 'Cargando…' : 'Ver más'}
				</a>
				<p class="text-light-two_d dark:text-dark-two_d" aria-live="polite">
					{#if errorCarga}
						<span in:fade={{ duration: duracion(200) }}>
							No se pudieron cargar más productos. Probá de nuevo.
						</span>
					{:else}
						{lista.length} de {productos.total}
					{/if}
				</p>
			</div>
		{/if}
	{/if}
</section>

<TiendaFiltrosPanel
	open={filtrosAbiertos}
	onClose={() => (filtrosAbiertos = false)}
	{filtros}
	{opciones}
/>
