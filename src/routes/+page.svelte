<script lang="ts">
	import RepoCard from '$lib/components/repo-card.svelte';
	import type { Repo } from '$lib/types/repo';
	import { getRandomRepo, getTotalCount } from '$lib/utils/github-utils';
	import { githubConfig } from '$lib/configs/github';
	import Icon from '@iconify/svelte';
	import { getSavedReposFromLocalStorage, saveRepoToLocalStorage } from '$lib/utils/storage-utils';

	let totalCount = $state(0);
	let minStars = $state(githubConfig.defaultMinStars);
	let randomRepo: Repo | null = $state(null);
	let isLoading = $state(false);
	let isSaveLoading = $state(false);
	let error = $state<string | null>(null);
	let savedRepos = $state(getSavedReposFromLocalStorage());

	$effect(() => {
		isSaveLoading = true;
		saveRepoToLocalStorage(savedRepos);
		isSaveLoading = false;
	});

	export const addRepo = () => {
		if (!randomRepo) {
			return;
		}

		// check if same repo already exists in savedRepos
		const alreadySavedRepo = savedRepos.find((repo) => repo.id === randomRepo?.id);
		if (alreadySavedRepo) {
			return;
		}

		savedRepos.push(randomRepo);
	};

	export const handleClick = async () => {
		isLoading = true;
		error = null;
		const { data, error: totalCountError } = await getTotalCount(minStars);
		if (totalCountError) {
			console.error('Error fetching total count:', totalCountError);
			error = totalCountError;
			isLoading = false;
			return;
		}

		totalCount = data;

		if (totalCount > 0) {
			if (totalCount > 1000) {
				console.warn('Total count exceeds 1000, limiting to 1000 for random selection.');
				totalCount = 1000;
			}
			const randomIndex = Math.floor(Math.random() * totalCount);

			const { data, error: randomRepoError } = await getRandomRepo(randomIndex, minStars);
			if (!data || randomRepoError) {
				console.error('Error fetching random repo:', randomRepoError);
				isLoading = false;
				error = randomRepoError;
				return;
			}

			randomRepo = data;
			isLoading = false;
		}
	};
</script>

<div class="flex flex-col items-center justify-center gap-4">
	{#if randomRepo}
		<div class="flex flex-col gap-2">
			<RepoCard repoData={randomRepo} />
			<button
				class="flex w-fit flex-row items-center justify-center gap-2 self-end"
				onclick={addRepo}
			>
				<Icon
					icon={`${isSaveLoading ? 'mdi:loading' : 'lucide:save'}`}
					class={`${isLoading ? 'animate-spin' : ''}`}
				/>
			</button>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center gap-4">
			<h1 class="mb-4 text-2xl font-bold">Find Random GitHub Repo</h1>

			<div class="mb-4 flex flex-row items-center justify-start gap-2">
				<label for="minStars">Minimum Stars</label>
				<input
					id="minStars"
					bind:value={minStars}
					type="number"
					class="rounded-sm border border-accent px-2 py-1"
				/>
			</div>

			<button
				onclick={handleClick}
				class="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
			>
				<Icon icon="mdi:loading" class={`${isLoading ? 'animate-spin' : 'hidden'}`} />
				{isLoading ? 'Loading...' : 'Get Random Repo'}
			</button>

			{#if error}
				<div class="rounded-md bg-red-200 px-2 py-1">
					<p class="text-sm">{error}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
