<script lang="ts">
	import type { TiendaConfigPublica } from '#lib/interfaces/index.ts';

	interface Props {
		tienda: TiendaConfigPublica;
	}

	let { tienda }: Props = $props();

	// Es una secuencia real (así funciona la cesta → wa.me), por eso lleva números
	const pasos = [
		{
			titulo: 'Elegí sabor y tamaño',
			texto: 'Cada kéfir viene en varios sabores y tamaños; en la ficha ves cuáles quedan.'
		},
		{
			titulo: 'Sumalo a tu pedido',
			texto: 'Podés combinar sabores y cantidades en un mismo pedido.'
		},
		{
			titulo: 'Envialo por WhatsApp',
			texto: 'Te confirmamos disponibilidad, precio final, forma de pago y entrega.'
		}
	];
</script>

<!-- Sin WhatsApp el pedido no se envía así (la cesta muestra teléfono o correo): no se muestra -->
{#if tienda.whatsapp}
	<section
		aria-labelledby="como-pedir-titulo"
		class="mt-24 border-t border-light-oro/40 pt-12 dark:border-dark-oro/30"
	>
		<h2
			id="como-pedir-titulo"
			class="font-display text-2xl text-light-three md:text-[1.75rem] dark:text-dark-three"
		>
			Cómo pedir
		</h2>
		<ol class="mt-8 grid gap-8 md:grid-cols-3 md:gap-12">
			{#each pasos as paso, index (paso.titulo)}
				<li class="flex gap-4">
					<!-- El número va dentro de un aro, como el del logo -->
					<span
						class="flex size-11 shrink-0 items-center justify-center rounded-full border border-light-oro font-display text-lg text-light-three dark:border-dark-oro dark:text-dark-three"
						aria-hidden="true"
					>
						{index + 1}
					</span>
					<div>
						<h3 class="font-semibold">{paso.titulo}</h3>
						<p
							class="mt-1 max-w-[36ch] text-sm leading-relaxed text-light-two_d dark:text-dark-two_d"
						>
							{paso.texto}
						</p>
					</div>
				</li>
			{/each}
		</ol>
	</section>
{/if}
