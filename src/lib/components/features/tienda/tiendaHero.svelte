<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { draw } from 'svelte/transition';
	import { asset } from '$app/paths';
	import { WhatsappIcon } from '#lib/icons/outline/index.ts';
	import type { TiendaConfigPublica } from '#lib/interfaces/index.ts';
	import { duracion, whatsappUrl } from '#lib/utils/index.ts';

	interface Props {
		tienda: TiendaConfigPublica;
	}

	let { tienda }: Props = $props();

	const whatsapp = $derived(
		whatsappUrl(tienda.whatsapp, `¡Hola, ${tienda.nombre_tienda}! Quiero consultar por sus kéfirs.`)
	);

	// El aro del logo se dibuja una vez al abrir la home: es el único movimiento que no pide el usuario.
	// En SSR no se pinta (las intros no corren al hidratar); con reduced motion aparece al instante
	let montado = $state(false);
	onMount(() => {
		montado = true;
	});
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- ancla en la misma página y enlace a wa.me -->
<section
	aria-labelledby="hero-titulo"
	class="grid items-center gap-8 pt-2 pb-14 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16 md:pt-8 md:pb-20"
>
	<div class="order-2 max-w-2xl md:order-1">
		<h1
			id="hero-titulo"
			class="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[0.02em] text-light-three dark:text-dark-three"
		>
			Kéfir natural, como vos.
		</h1>
		{#if tienda.descripcion}
			<p class="mt-6 max-w-[52ch] text-base leading-relaxed text-light-two_d dark:text-dark-two_d">
				{tienda.descripcion}
			</p>
		{/if}
		<div class="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
			<a
				href="#catalogo"
				class="inline-flex h-12 items-center rounded-full bg-light-three px-7 text-sm font-semibold text-light-one transition-colors hover:bg-light-three_d focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-accent dark:bg-dark-three dark:text-dark-one"
			>
				Ver los sabores
			</a>
			{#if whatsapp}
				<a
					href={whatsapp}
					target="_blank"
					rel="noopener"
					class="inline-flex items-center gap-2 text-sm font-semibold text-light-accent underline-offset-4 hover:underline dark:text-dark-accent"
				>
					<WhatsappIcon class="size-4" />
					Escribinos por WhatsApp
				</a>
			{/if}
		</div>
	</div>

	<!-- Isotipo dentro del aro oro→oliva, como en el logo -->
	<div class="relative order-1 size-28 md:order-2 md:size-80 lg:size-96" aria-hidden="true">
		<!-- La imagen tiene fondo blanco: va dentro del círculo (sus esquinas no lo tocan) y bajo el aro -->
		<img
			src={asset('images/logo_almafit_mark.webp')}
			alt=""
			width="512"
			height="512"
			fetchpriority="high"
			class="absolute inset-[16%] size-[68%] object-contain"
		/>
		<svg viewBox="0 0 100 100" class="absolute inset-0 size-full -rotate-90">
			<defs>
				<!-- Girado -90°: x=1 queda arriba (oro) y x=0 abajo (oliva) -->
				<linearGradient id="hero-aro" x1="1" y1="0" x2="0" y2="0">
					<stop offset="0" stop-color="var(--color-light-oro)" />
					<stop offset="1" stop-color="#8fa11e" />
				</linearGradient>
			</defs>
			{#if montado}
				<circle
					cx="50"
					cy="50"
					r="48.5"
					fill="none"
					stroke="url(#hero-aro)"
					stroke-width="1.1"
					in:draw={{ duration: duracion(1400), easing: cubicInOut }}
				/>
			{/if}
		</svg>
	</div>
</section>
