<script lang="ts">
	import { page } from '$app/state';
	import type { TiendaFiltros, TiendaFiltrosOpciones } from '#lib/interfaces/index.ts';
	import { filtrosToSearchParams } from '#lib/utils/index.ts';

	interface Props {
		/** Sabores (colores en la API) y tamaños (tallas) con productos en este listado */
		opciones: TiendaFiltrosOpciones | null;
		filtros: TiendaFiltros;
	}

	let { opciones, filtros }: Props = $props();

	const sabores = $derived(opciones?.colores ?? []);
	const tamanos = $derived(opciones?.tallas ?? []);
	const todos = $derived(filtros.colores.length === 0);

	// "Todos" es una tapa con todos los tonos, en porciones iguales
	const mezcla = $derived.by(() => {
		const tonos = sabores.map((s) => s.codigo_hex).filter((hex): hex is string => Boolean(hex));
		if (tonos.length === 0) return 'var(--color-light-one_d)';
		const paso = 100 / tonos.length;
		const porciones = tonos.map((hex, i) => `${hex} ${i * paso}% ${(i + 1) * paso}%`);
		return `conic-gradient(${porciones.join(', ')})`;
	});

	/** Elegir uno reemplaza la selección; tocar el elegido lo quita */
	function alternar(lista: string[], id: string): string[] {
		return lista.includes(id) ? lista.filter((x) => x !== id) : [id];
	}

	function href(cambios: Partial<TiendaFiltros>): string {
		const params = filtrosToSearchParams({ ...filtros, ...cambios }, page.url.search);
		return `${page.url.pathname}${params.size > 0 ? `?${params}` : ''}`;
	}
</script>

{#snippet tapa(fondo: string, activa: boolean)}
	<span
		class={[
			'block size-14 rounded-full outline-1 -outline-offset-1 outline-light-two/15 transition-shadow md:size-16 dark:outline-dark-two/20',
			activa &&
				'ring-2 ring-light-oro ring-offset-3 ring-offset-light-one dark:ring-offset-dark-one'
		]}
		style:background={fondo}
		aria-hidden="true"
	></span>
{/snippet}

<!-- eslint-disable svelte/no-navigation-without-resolve -- misma ruta, solo cambia la query -->
{#if sabores.length > 0 || tamanos.length > 1}
	<!-- noscroll: al elegir, la página no vuelve arriba; el listado cambia justo debajo -->
	<section
		aria-labelledby="sabores-titulo"
		class="border-y border-light-oro/40 py-8 md:py-10 dark:border-dark-oro/30"
		data-sveltekit-noscroll
	>
		<h2
			id="sabores-titulo"
			class="font-display text-2xl text-light-three md:text-[1.75rem] dark:text-dark-three"
		>
			{sabores.length > 0 ? 'Elegí tu sabor' : 'Elegí tu tamaño'}
		</h2>

		{#if sabores.length > 0}
			<ul
				class="scrollbar-hide -mx-4 mt-5 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pt-2 pb-2 md:mx-0 md:scroll-px-0 md:flex-wrap md:gap-x-7 md:gap-y-6 md:overflow-visible md:px-1"
			>
				<li class="shrink-0 snap-start">
					<a
						href={href({ colores: [] })}
						aria-current={todos ? 'true' : undefined}
						class="flex w-18 flex-col items-center gap-2.5 rounded-md text-center text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-light-accent md:w-20"
					>
						{@render tapa(mezcla, todos)}
						<span class={todos ? 'font-semibold' : 'text-light-two_d dark:text-dark-two_d'}>
							Todos
						</span>
					</a>
				</li>
				{#each sabores as sabor (sabor.id)}
					{@const activa = filtros.colores.includes(sabor.id)}
					<li class="shrink-0 snap-start">
						<a
							href={href({ colores: alternar(filtros.colores, sabor.id) })}
							aria-current={activa ? 'true' : undefined}
							class="flex w-18 flex-col items-center gap-2.5 rounded-md text-center text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-light-accent md:w-20"
						>
							{@render tapa(sabor.codigo_hex ?? 'var(--color-light-one_d)', activa)}
							<span
								class={[
									'line-clamp-2 leading-snug',
									activa ? 'font-semibold' : 'text-light-two_d dark:text-dark-two_d'
								]}
							>
								{sabor.nombre}
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		{#if tamanos.length > 1}
			<div class="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
				<h3 class="text-sm font-semibold">Tamaño</h3>
				<ul class="flex flex-wrap gap-2">
					{#each tamanos as tamano (tamano.id)}
						{@const activo = filtros.tallas.includes(tamano.id)}
						<li>
							<a
								href={href({ tallas: alternar(filtros.tallas, tamano.id) })}
								aria-current={activo ? 'true' : undefined}
								class={[
									'inline-flex h-9 items-center rounded-full border px-4 text-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-accent',
									activo
										? 'border-light-three bg-light-three text-light-one dark:border-dark-three dark:bg-dark-three dark:text-dark-one'
										: 'border-light-two/20 hover:border-light-three dark:border-dark-two/25 dark:hover:border-dark-three'
								]}
							>
								{tamano.etiqueta}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</section>
{/if}
