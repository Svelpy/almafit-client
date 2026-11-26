<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const noEncontrado = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{noEncontrado ? 'Página no encontrada' : 'Algo salió mal'}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="flex flex-col items-center py-24 text-center text-editorial">
	<p class="text-light-two_d tabular-nums dark:text-dark-two_d">{page.status}</p>
	<h1 class="mt-3 font-display text-2xl text-light-three dark:text-dark-three">
		{noEncontrado ? 'Página no encontrada' : 'Algo salió mal'}
	</h1>
	<p class="mt-4 max-w-md text-sm leading-relaxed text-light-two_d dark:text-dark-two_d">
		{noEncontrado
			? 'El producto o la sección que buscás ya no está disponible o el enlace cambió.'
			: (page.error?.message ?? 'Probá de nuevo en unos minutos.')}
	</p>
	<a
		href={resolve('/(tienda)')}
		class="mt-10 inline-flex h-11 items-center rounded-full bg-light-three px-8 font-semibold text-light-one hover:bg-light-three_d dark:bg-dark-three dark:text-dark-one"
	>
		Ver los kéfirs
	</a>
</section>
