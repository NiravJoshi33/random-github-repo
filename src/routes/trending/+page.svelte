<script lang="ts">
	import RepoCard from '$lib/components/repo-card.svelte';
	import SearchFilters from '$lib/components/search-filters.svelte';
	import type { Repo } from '$lib/types/repo';
	import { searchRepos } from '$lib/utils/github-utils';
	import Icon from '@iconify/svelte';

	const tabs = [
		{ label: 'Today', value: 'day' },
		{ label: 'This Week', value: 'week' },
		{ label: 'This Month', value: 'month' }
	] as const;

	let activeTab = $state<'day' | 'week' | 'month'>('week');
	let language = $state('');
	let sort = $state<'stars' | 'forks' | 'updated' | 'best-match'>('stars');
	let dateRange = $state('');
	let minStars = $state(10);
	let results = $state<Repo[]>([]);
	let isLoading = $state(false);
	let totalCount = $state(0);
	let page = $state(1);
	let error = $state<string | null>(null);

	const fetchTrending = async (resetPage = true) => {
		if (resetPage) {
			page = 1;
			results = [];
		}
		isLoading = true;
		error = null;

		const result = await searchRepos({
			language: language || undefined,
			minStars,
			sort: 'stars',
			order: 'desc',
			dateRange: activeTab,
			page,
			perPage: 12
		});

		if (result.error) {
			error = result.error;
		} else {
			if (resetPage) {
				results = result.repos;
			} else {
				results = [...results, ...result.repos];
			}
			totalCount = result.totalCount;
		}
		isLoading = false;
	};

	const loadMore = async () => {
		page++;
		await fetchTrending(false);
	};

	// Fetch on mount
	$effect(() => {
		fetchTrending();
	});
</script>

<div class="flex w-full max-w-6xl flex-col gap-6 px-4 pt-20 pb-8">
	<h1 class="text-3xl font-bold">Trending Repositories</h1>

	<!-- Time tabs -->
	<div class="flex flex-row gap-2">
		{#each tabs as tab (tab.value)}
			<button
				onclick={() => {
					activeTab = tab.value;
				}}
				class={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
					activeTab === tab.value
						? 'bg-accent text-white'
						: 'bg-accent/10 text-foreground hover:bg-accent/20'
				}`}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Filters -->
	<SearchFilters bind:language bind:sort bind:dateRange bind:minStars />

	<!-- Error -->
	{#if error}
		<div class="rounded-lg bg-red-100 px-4 py-3 text-red-700">{error}</div>
	{/if}

	<!-- Loading -->
	{#if isLoading && results.length === 0}
		<div class="flex items-center justify-center py-12">
			<Icon icon="mdi:loading" class="animate-spin text-accent" width="32" height="32" />
		</div>
	{/if}

	<!-- Results grid -->
	{#if results.length > 0}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each results as repo (repo.id)}
				<RepoCard repoData={repo} />
			{/each}
		</div>

		{#if results.length < totalCount}
			<div class="flex justify-center pt-4">
				<button
					onclick={loadMore}
					disabled={isLoading}
					class="flex items-center gap-2 rounded-lg bg-accent/10 px-6 py-3 text-accent hover:bg-accent/20"
				>
					{#if isLoading}
						<Icon icon="mdi:loading" class="animate-spin" width="18" height="18" />
						Loading...
					{:else}
						Load More
					{/if}
				</button>
			</div>
		{/if}
	{:else if !isLoading && !error}
		<div class="flex flex-col items-center justify-center gap-2 py-12 text-gray-500">
			<Icon icon="lucide:trending-up" width="48" height="48" />
			<p>No trending repos found for this period.</p>
		</div>
	{/if}
</div>
