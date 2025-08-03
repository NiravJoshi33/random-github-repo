<script lang="ts">
	import type { Repo } from '$lib/types/repo';
	import Icon from '@iconify/svelte';
	import Language from './language.svelte';
	import License from './license.svelte';
	import RepoOwner from './repo-owner.svelte';

	let { repoData }: { repoData: Repo } = $props();
</script>

<a
	class="flex w-xl flex-col items-start justify-start gap-4 rounded-2xl border border-accent p-4 transition-colors duration-300 hover:bg-accent/10"
	href={repoData.html_url}
	target="_blank"
>
	<!-- Name & Stars -->
	<div class="flex w-full flex-row items-center justify-between">
		<h2 class="text-xl font-semibold">{repoData.name}</h2>
		<div class="flex flex-row items-center justify-center gap-1 rounded-md p-2">
			<Icon icon="lucide:star" />
			<p class="text-sm text-gray-500">
				{repoData.stargazers_count}
			</p>
		</div>
	</div>

	<p class="w-full truncate text-sm text-gray-500">{repoData.description}</p>

	<!-- Language & License -->
	<div class="flex w-full flex-row items-center justify-between">
		<RepoOwner repoOwnerData={repoData.owner} />

		<Language {repoData} />

		<License {repoData} />
	</div>
</a>
