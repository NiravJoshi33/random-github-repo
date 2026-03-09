<script lang="ts">
	import RepoCard from '$lib/components/repo-card.svelte';
	import SearchFilters from '$lib/components/search-filters.svelte';
	import { githubConfig } from '$lib/configs/github';
	import type { Repo } from '$lib/types/repo';
	import { searchRepos } from '$lib/utils/github-utils';
	import Icon from '@iconify/svelte';

	let activeTopic = $state<(typeof githubConfig.popularTopics)[0] | null>(null);
	let language = $state('');
	let sort = $state<'stars' | 'forks' | 'updated' | 'best-match'>('stars');
	let dateRange = $state('');
	let minStars = $state(100);
	let results = $state<Repo[]>([]);
	let isLoading = $state(false);
	let totalCount = $state(0);
	let page = $state(1);
	let error = $state<string | null>(null);

	// Check URL params for pre-selected topic
	$effect(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const t = params.get('t');
			if (t) {
				const found = githubConfig.popularTopics.find((topic) => topic.label === t);
				if (found) {
					activeTopic = found;
				}
			}
		}
	});

	// Fetch when topic changes
	$effect(() => {
		if (activeTopic) {
			fetchTopicRepos();
		}
	});

	const fetchTopicRepos = async (resetPage = true) => {
		if (!activeTopic) return;
		if (resetPage) {
			page = 1;
			results = [];
		}
		isLoading = true;
		error = null;

		const result = await searchRepos({
			query: activeTopic.query,
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

	const selectTopic = (topic: (typeof githubConfig.popularTopics)[0]) => {
		activeTopic = topic;
	};

	const clearTopic = () => {
		activeTopic = null;
		results = [];
		totalCount = 0;
	};

	const loadMore = async () => {
		page++;
		await fetchTopicRepos(false);
	};
</script>

<div class="flex w-full max-w-6xl flex-col gap-6 px-4 pt-20 pb-8">
	<div class="flex items-center gap-3">
		{#if activeTopic}
			<button
				onclick={clearTopic}
				class="rounded-lg bg-transparent p-2 text-foreground hover:bg-accent/10"
			>
				<Icon icon="lucide:arrow-left" width="20" height="20" />
			</button>
		{/if}
		<h1 class="text-3xl font-bold">
			{activeTopic ? activeTopic.label : 'Browse Topics'}
		</h1>
	</div>

	{#if !activeTopic}
		<!-- Topic grid -->
		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each githubConfig.popularTopics as topic (topic.label)}
				<button
					onclick={() => selectTopic(topic)}
					class="flex flex-col items-center gap-3 rounded-2xl border border-accent/20 bg-background p-6 transition-all hover:border-accent hover:bg-accent/5 hover:shadow-md"
				>
					<Icon icon={topic.icon} width="32" height="32" class="text-accent" />
					<span class="font-medium">{topic.label}</span>
				</button>
			{/each}
		</div>
	{:else}
		<!-- Filters -->
		<SearchFilters bind:language bind:sort bind:dateRange bind:minStars />

		<button
			onclick={() => fetchTopicRepos()}
			class="flex w-fit items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-white hover:bg-accent/80"
		>
			<Icon icon="lucide:search" width="16" height="16" />
			Apply Filters
		</button>

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

		<!-- Results -->
		{#if results.length > 0}
			<p class="text-sm text-gray-500">{totalCount.toLocaleString()} repositories found</p>

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
				<Icon icon="lucide:folder-open" width="48" height="48" />
				<p>No repositories found for this topic.</p>
			</div>
		{/if}
	{/if}
</div>
