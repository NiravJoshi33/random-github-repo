<script lang="ts">
	import RepoCard from '$lib/components/repo-card.svelte';
	import type { Repo } from '$lib/types/repo';
	import { getRandomRepo, getTotalCount, searchRepos } from '$lib/utils/github-utils';
	import { githubConfig } from '$lib/configs/github';
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';

	let searchQuery = $state('');
	let minStars = $state(githubConfig.defaultMinStars);
	let randomRepo: Repo | null = $state(null);
	let isRandomLoading = $state(false);
	let randomError = $state<string | null>(null);

	// Trending preview
	let trendingRepos = $state<Repo[]>([]);
	let isTrendingLoading = $state(true);

	// Load trending on mount
	$effect(() => {
		loadTrending();
	});

	const loadTrending = async () => {
		isTrendingLoading = true;
		const result = await searchRepos({
			minStars: 10,
			sort: 'stars',
			order: 'desc',
			dateRange: 'week',
			perPage: 6
		});
		if (!result.error) {
			trendingRepos = result.repos;
		}
		isTrendingLoading = false;
	};

	const handleSearch = (e: Event) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = resolve(`/search`) + `?q=${encodeURIComponent(searchQuery.trim())}`;
		}
	};

	const handleRandomRepo = async () => {
		isRandomLoading = true;
		randomError = null;
		randomRepo = null;

		const { data: count, error: countError } = await getTotalCount(minStars);
		if (countError || !count) {
			randomError = countError || 'Failed to get repo count';
			isRandomLoading = false;
			return;
		}

		const total = Math.min(count, 1000);
		const randomIndex = Math.floor(Math.random() * total);

		const { data, error } = await getRandomRepo(randomIndex, minStars);
		if (error || !data) {
			randomError = error || 'Failed to fetch repo';
		} else {
			randomRepo = data;
		}
		isRandomLoading = false;
	};
</script>

<div class="flex w-full max-w-6xl flex-col gap-10 px-4 pt-24 pb-8">
	<!-- Hero -->
	<div class="flex flex-col items-center gap-4 text-center">
		<h1 class="text-4xl font-bold">
			<span class="text-accent">Discover</span> GitHub Repos Worth Sharing
		</h1>
		<p class="max-w-lg text-gray-500">
			Find trending, random, and keyword-matching repos to share on X and LinkedIn.
		</p>

		<!-- Search bar -->
		<form onsubmit={handleSearch} class="mt-2 flex w-full max-w-xl flex-row gap-2">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search repos... (e.g. 'AI agents', 'rust cli tools')"
				class="flex-1 rounded-lg border border-accent/30 bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
			/>
			<button
				type="submit"
				class="flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-white hover:bg-accent/80"
			>
				<Icon icon="lucide:search" width="18" height="18" />
				Search
			</button>
		</form>
	</div>

	<!-- Topic chips -->
	<div class="flex flex-col gap-3">
		<h2 class="text-lg font-semibold">Browse by Topic</h2>
		<div class="flex flex-wrap gap-2">
			{#each githubConfig.popularTopics as topic (topic.label)}
				<a
					href={resolve('/topics') + `?t=${encodeURIComponent(topic.label)}`}
					class="flex items-center gap-1.5 rounded-full border border-accent/20 px-4 py-2 text-sm transition-colors hover:border-accent hover:bg-accent/10"
				>
					<Icon icon={topic.icon} width="16" height="16" />
					{topic.label}
				</a>
			{/each}
		</div>
	</div>

	<!-- Random repo section -->
	<div class="flex flex-col gap-3 rounded-2xl border border-accent/10 p-6">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold">Feeling Lucky?</h2>
			<div class="flex items-center gap-2">
				<label for="homeMinStars" class="text-sm text-gray-500">Min Stars</label>
				<input
					id="homeMinStars"
					type="number"
					bind:value={minStars}
					class="w-24 rounded-lg border border-accent/30 bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
				/>
			</div>
		</div>

		<button
			onclick={handleRandomRepo}
			disabled={isRandomLoading}
			class="flex w-fit items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-white hover:bg-accent/80"
		>
			{#if isRandomLoading}
				<Icon icon="mdi:loading" class="animate-spin" width="18" height="18" />
				Finding...
			{:else}
				<Icon icon="lucide:shuffle" width="18" height="18" />
				Get Random Repo
			{/if}
		</button>

		{#if randomError}
			<div class="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{randomError}</div>
		{/if}

		{#if randomRepo}
			<div class="mt-2 max-w-md">
				<RepoCard repoData={randomRepo} />
			</div>
		{/if}
	</div>

	<!-- Trending preview -->
	<div class="flex flex-col gap-3">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold">Trending This Week</h2>
			<a
				href={resolve('/trending')}
				class="flex items-center gap-1 text-sm text-accent hover:underline"
			>
				See all
				<Icon icon="lucide:arrow-right" width="14" height="14" />
			</a>
		</div>

		{#if isTrendingLoading}
			<div class="flex items-center justify-center py-8">
				<Icon icon="mdi:loading" class="animate-spin text-accent" width="32" height="32" />
			</div>
		{:else if trendingRepos.length > 0}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each trendingRepos as repo (repo.id)}
					<RepoCard repoData={repo} />
				{/each}
			</div>
		{/if}
	</div>
</div>
