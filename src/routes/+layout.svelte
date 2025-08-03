<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="flex flex-row items-center justify-start gap-4">
	<a href="/">Home</a>
	<a href="/my-repos">My Repos</a>
</div>
{@render children?.()}
