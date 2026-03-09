<script lang="ts">
	import RepoCard from '$lib/components/repo-card.svelte';
	import SearchFilters from '$lib/components/search-filters.svelte';
	import type { Repo } from '$lib/types/repo';
	import { searchRepos } from '$lib/utils/github-utils';
	import Icon from '@iconify/svelte';

	let query = $state('');
	let language = $state('');
	let sort = $state<'stars' | 'forks' | 'updated' | 'best-match'>('stars');
	let dateRange = $state('');
	let minStars = $state(100);
	let results = $state<Repo[]>([]);
	let isLoading = $state(false);
	let totalCount = $state(0);
	let page = $state(1);
	let error = $state<string | null>(null);
	let hasSearched = $state(false);

	// Read query param on mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const q = params.get('q');
			if (q) {
				query = q;
				doSearch();
			}
		}
	});

	const doSearch = async (resetPage = true) => {
		if (resetPage) {
			page = 1;
			results = [];
		}
		isLoading = true;
		error = null;
		hasSearched = true;

		const result = await searchRepos({
			query: query || undefined,
			language: language || undefined,
			minStars,
			sort,
			order: 'desc',
			dateRange: (dateRange as 'day' | 'week' | 'month' | 'year') || undefined,
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
		await doSearch(false);
	};

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		doSearch();
	};
</script>

<div class="flex w-full max-w-6xl flex-col gap-6 px-4 pt-20 pb-8">
	<h1 class="text-3xl font-bold">Search Repositories</h1>

	<!-- Search bar -->
	<form onsubmit={handleSubmit} class="flex flex-row gap-2">
		<input
			type="text"
			bind:value={query}
			placeholder="Search GitHub repos... (e.g. 'react state management')"
			class="flex-1 rounded-lg border border-accent/30 bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
		/>
		<button
			type="submit"
			class="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-white hover:bg-accent/80"
		>
			<Icon icon="lucide:search" width="18" height="18" />
			Search
		</button>
	</form>

	<!-- Filters -->
	<SearchFilters bind:language bind:sort bind:dateRange bind:minStars />

	<!-- Results count -->
	{#if hasSearched && !isLoading && !error}
		<p class="text-sm text-gray-500">
			{totalCount.toLocaleString()} repositories found
		</p>
	{/if}

	<!-- Error -->
	{#if error}
		<div class="rounded-lg bg-red-100 px-4 py-3 text-red-700">
			{error}
		</div>
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

		<!-- Load more -->
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
	{:else if hasSearched && !isLoading && !error}
		<div class="flex flex-col items-center justify-center gap-2 py-12 text-gray-500">
			<Icon icon="lucide:search-x" width="48" height="48" />
			<p>No repositories found. Try different search terms or filters.</p>
		</div>
	{/if}
</div>
