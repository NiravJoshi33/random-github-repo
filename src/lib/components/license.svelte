<script lang="ts">
	import type { Repo } from '$lib/types/repo';
	import Icon from '@iconify/svelte';

	let { repoData }: { repoData: Repo } = $props();
</script>

<div class="flex flex-row items-center justify-center gap-1 rounded-md p-2">
	<Icon icon="mdi:license" />

	<p class="text-sm text-gray-500">
		{repoData.license?.spdx_id ? repoData.license.spdx_id : 'No License specified'}
	</p>
</div>
