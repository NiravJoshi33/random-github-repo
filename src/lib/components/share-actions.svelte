<script lang="ts">
	import type { Repo } from '$lib/types/repo';
	import {
		generateXPost,
		generateLinkedInPost,
		copyToClipboard,
		getXShareUrl,
		getLinkedInShareUrl
	} from '$lib/utils/share-utils';
	import Icon from '@iconify/svelte';

	let { repo }: { repo: Repo } = $props();

	let copiedX = $state(false);
	let copiedLi = $state(false);

	const withStop = (fn: () => void) => (e: Event) => {
		e.stopPropagation();
		fn();
	};

	const copyForX = withStop(async () => {
		const text = generateXPost(repo);
		const success = await copyToClipboard(text);
		if (success) {
			copiedX = true;
			setTimeout(() => (copiedX = false), 2000);
		}
	});

	const copyForLinkedIn = withStop(async () => {
		const text = generateLinkedInPost(repo);
		const success = await copyToClipboard(text);
		if (success) {
			copiedLi = true;
			setTimeout(() => (copiedLi = false), 2000);
		}
	});

	const shareOnX = withStop(() => {
		window.open(getXShareUrl(generateXPost(repo)), '_blank');
	});

	const shareOnLinkedIn = withStop(() => {
		window.open(getLinkedInShareUrl(repo.html_url), '_blank');
	});
</script>

<div class="flex flex-row items-center gap-1">
	<button
		onclick={shareOnX}
		title="Share on X"
		class="rounded-md bg-transparent p-1.5 text-gray-500 hover:bg-accent/10 hover:text-foreground"
	>
		<Icon icon="ri:twitter-x-fill" width="16" height="16" />
	</button>

	<button
		onclick={copyForX}
		title="Copy post for X"
		class="rounded-md bg-transparent p-1.5 text-gray-500 hover:bg-accent/10 hover:text-foreground"
	>
		<Icon
			icon={copiedX ? 'lucide:check' : 'lucide:copy'}
			width="16"
			height="16"
			class={copiedX ? 'text-green-500' : ''}
		/>
	</button>

	<button
		onclick={shareOnLinkedIn}
		title="Share on LinkedIn"
		class="rounded-md bg-transparent p-1.5 text-gray-500 hover:bg-accent/10 hover:text-foreground"
	>
		<Icon icon="mdi:linkedin" width="16" height="16" />
	</button>

	<button
		onclick={copyForLinkedIn}
		title="Copy post for LinkedIn"
		class="rounded-md bg-transparent p-1.5 text-gray-500 hover:bg-accent/10 hover:text-foreground"
	>
		<Icon
			icon={copiedLi ? 'lucide:check' : 'lucide:clipboard-list'}
			width="16"
			height="16"
			class={copiedLi ? 'text-green-500' : ''}
		/>
	</button>
</div>
