<script lang="ts">
	import { getRateLimitStatus } from '$lib/utils/github-utils';
	import Icon from '@iconify/svelte';

	let token = $state('');
	let saved = $state(false);
	let rateLimitRemaining = $state<number | null>(null);
	let rateLimitTotal = $state(10);
	let rateLimitReset = $state<Date | null>(null);
	let isCheckingRate = $state(false);

	// Load token on mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			token = localStorage.getItem('github_token') || '';
		}
	});

	const saveToken = () => {
		if (typeof window !== 'undefined') {
			if (token.trim()) {
				localStorage.setItem('github_token', token.trim());
			} else {
				localStorage.removeItem('github_token');
			}
			saved = true;
			setTimeout(() => (saved = false), 2000);
		}
	};

	const checkRateLimit = async () => {
		isCheckingRate = true;
		const status = await getRateLimitStatus();
		rateLimitRemaining = status.remaining;
		rateLimitTotal = status.limit;
		rateLimitReset = status.resetAt;
		isCheckingRate = false;
	};

	const getRateLimitColor = () => {
		if (rateLimitRemaining === null) return 'text-gray-500';
		if (rateLimitRemaining > 5) return 'text-green-600';
		if (rateLimitRemaining > 1) return 'text-yellow-600';
		return 'text-red-600';
	};
</script>

<div class="flex w-full max-w-2xl flex-col gap-8 px-4 pt-20 pb-8">
	<h1 class="text-3xl font-bold">Settings</h1>

	<!-- GitHub Token -->
	<div class="flex flex-col gap-3 rounded-2xl border border-accent/10 p-6">
		<h2 class="text-lg font-semibold">GitHub Token</h2>
		<p class="text-sm text-gray-500">
			Add a GitHub personal access token to increase the API rate limit from 10 to 30 search
			requests per minute. No scopes needed — a token with zero permissions works.
		</p>

		<div class="flex gap-2">
			<input
				type="password"
				bind:value={token}
				placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
				class="flex-1 rounded-lg border border-accent/30 bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-accent"
			/>
			<button
				onclick={saveToken}
				class="flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-white hover:bg-accent/80"
			>
				{#if saved}
					<Icon icon="lucide:check" width="16" height="16" />
					Saved
				{:else}
					Save
				{/if}
			</button>
		</div>
	</div>

	<!-- Rate Limit Status -->
	<div class="flex flex-col gap-3 rounded-2xl border border-accent/10 p-6">
		<h2 class="text-lg font-semibold">API Rate Limit</h2>

		<button
			onclick={checkRateLimit}
			disabled={isCheckingRate}
			class="flex w-fit items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-sm text-accent hover:bg-accent/20"
		>
			{#if isCheckingRate}
				<Icon icon="mdi:loading" class="animate-spin" width="16" height="16" />
				Checking...
			{:else}
				<Icon icon="lucide:activity" width="16" height="16" />
				Check Status
			{/if}
		</button>

		{#if rateLimitRemaining !== null}
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<span class={`text-2xl font-bold ${getRateLimitColor()}`}>
						{rateLimitRemaining}
					</span>
					<span class="text-gray-500">/ {rateLimitTotal} requests remaining</span>
				</div>

				{#if rateLimitReset}
					<p class="text-sm text-gray-500">
						Resets at {rateLimitReset.toLocaleTimeString()}
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
