<script lang="ts">
	import { WhatsappIcon } from '#lib/icons/outline/index.ts';
	import type { TiendaConfigPublica } from '#lib/interfaces/index.ts';
	import { mensajeMantenimiento, whatsappUrl } from '#lib/utils/index.ts';

	interface Props {
		tienda: TiendaConfigPublica;
	}

	let { tienda }: Props = $props();

	// Mensaje listo para que el cliente avise a la tienda que quiere comprar (editable en WhatsApp)
	const whatsapp = $derived(
		whatsappUrl(tienda.whatsapp, mensajeMantenimiento(tienda.nombre_tienda))
	);
</script>

<svelte:head>
	<title>{tienda.nombre_tienda} · Volvemos pronto</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -- enlaces externos (wa.me, tel:, mailto:) -->
<main
	class="flex min-h-dvh flex-col items-center justify-center bg-light-one px-6 text-center text-light-two dark:bg-dark-one dark:text-dark-two"
>
	{#if tienda.logo_url}
		<img
			src={tienda.logo_url}
			alt={tienda.nombre_tienda}
			class="mb-12 h-12 w-auto max-w-[70vw] object-contain"
		/>
	{:else}
		<p
			class="mb-12 font-editorial text-3xl tracking-[0.08em] text-light-three md:text-5xl dark:text-dark-three"
		>
			{tienda.nombre_tienda}
		</p>
	{/if}

	<h1 class="font-display text-2xl text-light-three dark:text-dark-three">Volvemos pronto</h1>
	<p class="mt-4 max-w-md text-sm leading-relaxed text-light-two_d dark:text-dark-two_d">
		La tienda en línea no está disponible en este momento. Estamos trabajando para volver a
		atenderte lo antes posible. Gracias por tu paciencia.
	</p>

	{#if whatsapp}
		<div class="mt-10 flex max-w-md flex-col items-center gap-3">
			<p class="text-sm leading-relaxed">
				¿Querías ver los kéfirs y hacer tu pedido? <strong>Avisale a la tienda</strong>: cuantos más
				clientes la esperan, antes vuelve.
			</p>
			<a
				href={whatsapp}
				target="_blank"
				rel="noopener"
				class="inline-flex h-12 items-center gap-2 rounded-full bg-light-three px-8 text-editorial font-semibold text-light-one transition-colors hover:bg-light-three_d dark:bg-dark-three dark:text-dark-one"
			>
				<WhatsappIcon class="size-4" />
				Quiero comprar, avisales
			</a>
			<p class="text-xs text-light-two_d dark:text-dark-two_d">
				Se abre WhatsApp con un mensaje listo; podés editarlo antes de enviar.
			</p>
		</div>
	{/if}

	{#if tienda.telefono || tienda.email_contacto}
		<div class="mt-10 space-y-2 text-editorial">
			<p class="text-light-two_d dark:text-dark-two_d">También podés contactarlos</p>
			{#if tienda.telefono}
				<p>
					<span class="underline underline-offset-4">{tienda.telefono}</span>
				</p>
			{/if}
			{#if tienda.email_contacto}
				<p>
					<a href="mailto:{tienda.email_contacto}" class="underline underline-offset-4"
						>{tienda.email_contacto}</a
					>
				</p>
			{/if}
		</div>
	{/if}
</main>
