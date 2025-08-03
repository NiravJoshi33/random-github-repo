<script lang="ts">
	import type { RepoOwner } from '$lib/types/repo';
	import Icon from '@iconify/svelte';

	let { repoOwnerData }: { repoOwnerData: RepoOwner } = $props();
</script>

<a
	class="flex flex-row items-center justify-center gap-1 rounded-md p-2 transition-colors duration-300 hover:bg-accent/10"
	href={repoOwnerData.html_url}
	target="_blank"
>
	<Icon icon="lucide:user" />
	<p class="text-sm text-gray-500">{repoOwnerData.login}</p>
</a>
