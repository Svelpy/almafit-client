<script lang="ts">
	import { fly } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import { SearchIcon } from '#lib/icons/outline/index.ts';
	import type { TiendaConfigPublica } from '#lib/interfaces/index.ts';
	import { duracion } from '#lib/utils/index.ts';
	import TiendaBuscador from './tiendaBuscador.svelte';

	interface Props {
		tienda: TiendaConfigPublica;
		cantidad: number;
		menuAbierto: boolean;
		onMenu: () => void;
		onCesta: () => void;
	}

	let { tienda, cantidad, menuAbierto, onMenu, onCesta }: Props = $props();
</script>

<header
	class="sticky top-0 z-30 bg-light-one/95 backdrop-blur-sm supports-backdrop-filter:bg-light-one/85 dark:bg-dark-one/95 dark:supports-backdrop-filter:bg-dark-one/85"
>
	<div
		class="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:gap-4 md:h-24 md:px-10 xl:px-12"
	>
		<!-- Menú: dos líneas finas -->
		<div class="flex items-center">
			<button
				type="button"
				onclick={onMenu}
				aria-label={menuAbierto ? 'Ocultar menú' : 'Abrir menú'}
				aria-expanded={menuAbierto}
				class="group -ml-2 flex h-10 w-12 flex-col justify-center gap-[7px] px-2 md:w-24"
			>
				<span class="block h-px w-full bg-current transition-transform group-hover:scale-x-90"
				></span>
				<span class="block h-px w-full bg-current transition-transform group-hover:scale-x-75"
				></span>
			</button>
		</div>

		<a
			href={resolve('/(tienda)')}
			class="flex items-center justify-center"
			aria-label="{tienda.nombre_tienda}, inicio"
		>
			<!-- Siempre el nombre en texto: el logo puede traer el nombre y se muestra aparte (TiendaLogo) -->
			<span
				class="block max-w-[52vw] truncate font-editorial text-lg tracking-[0.08em] text-light-three sm:text-xl md:max-w-[40vw] md:text-3xl md:tracking-[0.12em] dark:text-dark-three"
			>
				{tienda.nombre_tienda}
			</span>
		</a>

		<div class="flex items-center justify-end gap-3 text-editorial sm:gap-5 md:gap-8">
			<TiendaBuscador
				id="tienda-buscar"
				label="Buscar productos"
				placeholder="Buscar sabores"
				class="hidden w-48 border-b border-light-two/40 focus-within:border-light-accent md:block xl:w-56 dark:border-dark-two/40"
				inputClass="w-full border-0 bg-transparent px-0 pt-0 pb-1 text-right text-editorial placeholder:text-light-two_d focus:ring-0 focus:outline-none dark:placeholder:text-dark-two_d"
			/>
			<a href={resolve('/(tienda)/buscar')} class="p-1 md:hidden" aria-label="Buscar">
				<SearchIcon class="size-5 stroke-[1.25]" />
			</a>

			<button
				type="button"
				onclick={onCesta}
				class="flex items-center gap-2 hover:underline hover:underline-offset-4"
				aria-label="Tu pedido, {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'}"
			>
				<span class="hidden sm:inline">Pedido</span>
				<span
					class="inline-flex h-6 min-w-6 items-center justify-center overflow-hidden rounded-full bg-light-brote px-1.5 text-xs leading-none font-semibold text-light-three tabular-nums dark:bg-dark-brote dark:text-dark-one"
				>
					<!-- El número sube al agregar un producto -->
					{#key cantidad}
						<span class="inline-block" in:fly={{ y: 10, duration: duracion(300) }}>{cantidad}</span>
					{/key}
				</span>
			</button>
		</div>
	</div>
</header>
