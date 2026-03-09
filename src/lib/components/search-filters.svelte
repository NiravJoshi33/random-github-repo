<script lang="ts">
	import { githubConfig } from '$lib/configs/github';

	let {
		language = $bindable(''),
		sort = $bindable<'stars' | 'forks' | 'updated' | 'best-match'>('stars'),
		dateRange = $bindable(''),
		minStars = $bindable(100)
	}: {
		language: string;
		sort: 'stars' | 'forks' | 'updated' | 'best-match';
		dateRange: string;
		minStars: number;
	} = $props();
</script>

<div class="flex flex-wrap items-center gap-3">
	<select
		bind:value={language}
		class="rounded-lg border border-accent/30 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
	>
		<option value="">All Languages</option>
		{#each githubConfig.popularLanguages as lang}
			<option value={lang}>{lang}</option>
		{/each}
	</select>

	<select
		bind:value={sort}
		class="rounded-lg border border-accent/30 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
	>
		<option value="stars">Most Stars</option>
		<option value="forks">Most Forks</option>
		<option value="updated">Recently Updated</option>
		<option value="best-match">Best Match</option>
	</select>

	<select
		bind:value={dateRange}
		class="rounded-lg border border-accent/30 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
	>
		<option value="">Any Time</option>
		<option value="day">Past Day</option>
		<option value="week">Past Week</option>
		<option value="month">Past Month</option>
		<option value="year">Past Year</option>
	</select>

	<div class="flex items-center gap-2">
		<label for="minStarsFilter" class="text-sm text-gray-500">Min Stars</label>
		<input
			id="minStarsFilter"
			type="number"
			bind:value={minStars}
			min="0"
			class="w-24 rounded-lg border border-accent/30 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
		/>
	</div>
</div>
