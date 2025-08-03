<script lang="ts">
	import RepoCard from '$lib/components/repo-card.svelte';
	import { getSavedReposFromLocalStorage } from '$lib/utils/storage-utils';

	let savedRepos = $state(getSavedReposFromLocalStorage());
</script>

<div class="flex flex-col items-center justify-center gap-2">
	{#each savedRepos as repo (repo.id)}
		<RepoCard repoData={repo} />
	{/each}
</div>
