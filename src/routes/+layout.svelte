<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="flex flex-row items-center justify-start gap-4">
	<a href={resolve('/')}>Home</a>
	<a href={resolve('/my-repos')}>My Repos</a>
</div>
{@render children?.()}
