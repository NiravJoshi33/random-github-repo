<script lang="ts">
	import RepoCard from '$lib/components/repo-card.svelte';
	import {
		getSavedReposFromLocalStorage,
		saveRepoToLocalStorage
	} from '$lib/utils/storage-utils';
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';

	let savedRepos = $state(getSavedReposFromLocalStorage());

	const removeRepo = (id: number) => {
		savedRepos = savedRepos.filter((r) => r.id !== id);
		saveRepoToLocalStorage(savedRepos);
	};

	const clearAll = () => {
		savedRepos = [];
		saveRepoToLocalStorage([]);
	};
</script>

<div class="flex w-full max-w-6xl flex-col gap-6 px-4 pt-20 pb-8">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Saved Repos</h1>
		{#if savedRepos.length > 0}
			<button
				onclick={clearAll}
				class="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600 hover:bg-red-200"
			>
				<Icon icon="lucide:trash-2" width="16" height="16" />
				Clear All
			</button>
		{/if}
	</div>

	{#if savedRepos.length > 0}
		<p class="text-sm text-gray-500">{savedRepos.length} saved repositories</p>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each savedRepos as repo (repo.id)}
				<RepoCard repoData={repo} showSave={false} onRemove={removeRepo} />
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center gap-4 py-16 text-gray-500">
			<Icon icon="lucide:bookmark" width="48" height="48" />
			<p>No saved repos yet.</p>
			<a
				href={resolve('/search')}
				class="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-white hover:bg-accent/80"
			>
				<Icon icon="lucide:search" width="16" height="16" />
				Start Discovering
			</a>
		</div>
	{/if}
</div>
