<script lang="ts">
	import './layout.css';
	import { AppUpdateBanner } from '#lib/components/layout/index.ts';

	let { children } = $props();
</script>

<!-- El favicon de la plataforma está en app.html; la tienda puede poner el suyo (favicon_url) -->
{@render children()}

<AppUpdateBanner />
