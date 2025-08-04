<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/layout/navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Random GitHub Repo</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta
		name="description"
		content="Discover random GitHub repositories based on your preferences."
	/>
	<meta name="author" content="Nirav Joshi" />
</svelte:head>

<Navbar />
{@render children?.()}
