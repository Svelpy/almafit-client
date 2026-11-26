<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		/** Texto de la fecha de última actualización, tal como figura en el documento */
		updatedAt: string;
		children: Snippet;
	}

	let { title, updatedAt, children }: Props = $props();
</script>

<article
	class="prose max-w-none text-light-two_d marker:text-light-three dark:text-dark-two_d dark:marker:text-dark-three prose-headings:text-light-three dark:prose-headings:text-dark-three prose-h2:mt-10 prose-h2:font-display prose-h2:text-xl prose-h2:font-semibold prose-strong:text-light-two dark:prose-strong:text-dark-two prose-li:my-1.5"
>
	<header class="not-prose mb-8 border-b border-light-oro/40 pb-6 dark:border-dark-oro/30">
		<h1 class="font-display text-3xl text-light-three md:text-4xl dark:text-dark-three">
			{title}
		</h1>
		<p class="mt-2 text-sm text-light-two_d dark:text-dark-two_d">
			Última actualización: {updatedAt}
		</p>
	</header>

	{@render children()}
</article>
