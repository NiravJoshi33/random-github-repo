<script lang="ts">
	import type { Repo } from '$lib/types/repo';
	import Icon from '@iconify/svelte';
	import Language from './language.svelte';
	import License from './license.svelte';
	import RepoOwner from './repo-owner.svelte';
	import ShareActions from './share-actions.svelte';
	import {
		getSavedReposFromLocalStorage,
		saveRepoToLocalStorage
	} from '$lib/utils/storage-utils';

	let {
		repoData,
		showSave = true,
		onRemove
	}: {
		repoData: Repo;
		showSave?: boolean;
		onRemove?: (id: number) => void;
	} = $props();

	let isSaved = $state(false);

	$effect(() => {
		const saved = getSavedReposFromLocalStorage();
		isSaved = saved.some((r) => r.id === repoData.id);
	});

	const formatStarsCount = (count: number): string => {
		if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
		if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
		return count.toString();
	};

	const toggleSave = () => {
		const saved = getSavedReposFromLocalStorage();
		if (isSaved) {
			const filtered = saved.filter((r) => r.id !== repoData.id);
			saveRepoToLocalStorage(filtered);
			isSaved = false;
			onRemove?.(repoData.id);
		} else {
			saved.push(repoData);
			saveRepoToLocalStorage(saved);
			isSaved = true;
		}
	};
</script>

<div
	class="flex h-full flex-col items-start justify-between gap-3 rounded-2xl border border-accent/30 p-4 transition-colors duration-300 hover:border-accent hover:bg-accent/5"
>
	<!-- Top: Name & Stars -->
	<a href={repoData.html_url} target="_blank" class="flex w-full flex-col gap-3">
		<div class="flex w-full flex-row items-center justify-between">
			<h2 class="truncate text-lg font-semibold">{repoData.name}</h2>
			<div class="flex shrink-0 flex-row items-center gap-1">
				<Icon icon="lucide:star" width="14" height="14" />
				<span class="text-sm text-gray-500">{formatStarsCount(repoData.stargazers_count)}</span>
			</div>
		</div>

		<p class="line-clamp-2 text-sm text-gray-500">
			{repoData.description || 'No description provided'}
		</p>
	</a>

	<!-- Topics -->
	{#if repoData.topics?.length}
		<div class="flex flex-wrap gap-1">
			{#each repoData.topics.slice(0, 4) as topic (topic)}
				<span class="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{topic}</span>
			{/each}
		</div>
	{/if}

	<!-- Meta: Owner, Language, License -->
	<div class="flex w-full flex-row flex-wrap items-center justify-between gap-1 text-sm">
		<RepoOwner repoOwnerData={repoData.owner} />
		<Language {repoData} />
		<License {repoData} />
	</div>

	<!-- Actions: Share + Save -->
	<div class="flex w-full flex-row items-center justify-between border-t border-accent/10 pt-2">
		<ShareActions repo={repoData} />

		<div class="flex items-center gap-1">
			{#if showSave}
				<button
					onclick={toggleSave}
					title={isSaved ? 'Remove from saved' : 'Save repo'}
					class="rounded-md bg-transparent p-1.5 text-gray-500 hover:bg-accent/10 hover:text-foreground"
				>
					<Icon
						icon={isSaved ? 'lucide:bookmark-check' : 'lucide:bookmark'}
						width="16"
						height="16"
						class={isSaved ? 'text-accent' : ''}
					/>
				</button>
			{/if}

			{#if onRemove}
				<button
					onclick={() => onRemove(repoData.id)}
					title="Remove"
					class="rounded-md bg-transparent p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-500"
				>
					<Icon icon="lucide:trash-2" width="16" height="16" />
				</button>
			{/if}
		</div>
	</div>
</div>
