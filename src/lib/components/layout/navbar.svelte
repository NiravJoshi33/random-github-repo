<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';

	const links = [
		{ href: '/', label: 'Home', icon: 'lucide:home' },
		{ href: '/search', label: 'Search', icon: 'lucide:search' },
		{ href: '/trending', label: 'Trending', icon: 'lucide:trending-up' },
		{ href: '/topics', label: 'Topics', icon: 'lucide:layers' },
		{ href: '/my-repos', label: 'Saved', icon: 'lucide:bookmark' },
		{ href: '/settings', label: 'Settings', icon: 'lucide:settings' }
	];

	let mobileOpen = $state(false);

	const resolveHref = (href: string) => `${base}${href === '/' ? '' : href}` || '/';

	const isActive = (href: string) => {
		const path = page.url?.pathname || '';
		const resolved = resolveHref(href);
		if (href === '/') return path === '/' || path === resolved;
		return path.startsWith(resolved);
	};
</script>

<nav
	class="fixed top-0 z-50 flex w-full flex-row items-center justify-between border-b border-accent/10 bg-background/80 px-6 py-3 backdrop-blur-md"
>
	<a href={resolveHref('/')} class="text-lg font-bold text-foreground">
		<span class="text-accent">GH</span> Finder
	</a>

	<!-- Desktop links -->
	<div class="hidden flex-row items-center gap-6 md:flex">
		{#each links as link (link.href)}
			<a
				href={resolveHref(link.href)}
				class={`flex items-center gap-1.5 text-sm transition-colors hover:text-accent ${isActive(link.href) ? 'font-semibold text-accent' : 'text-foreground/70'}`}
			>
				<Icon icon={link.icon} width="16" height="16" />
				{link.label}
			</a>
		{/each}
	</div>

	<!-- Mobile hamburger -->
	<button
		class="bg-transparent p-1 text-foreground md:hidden"
		onclick={() => (mobileOpen = !mobileOpen)}
	>
		<Icon icon={mobileOpen ? 'lucide:x' : 'lucide:menu'} width="24" height="24" />
	</button>
</nav>

<!-- Mobile menu -->
{#if mobileOpen}
	<div
		class="fixed top-14 right-0 left-0 z-40 flex flex-col gap-2 border-b border-accent/10 bg-background p-4 md:hidden"
	>
		{#each links as link (link.href)}
			<a
				href={resolveHref(link.href)}
				onclick={() => (mobileOpen = false)}
				class={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/10 ${isActive(link.href) ? 'font-semibold text-accent' : 'text-foreground/70'}`}
			>
				<Icon icon={link.icon} width="18" height="18" />
				{link.label}
			</a>
		{/each}
	</div>
{/if}
