<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="absolute top-0 flex w-full flex-row items-center justify-start gap-12 px-8 py-4">
	<a href={resolve('/')} class="hover:text-accent">Home</a>
	<a href={resolve('/my-repos')} class="hover:text-accent">My Repos</a>
</div>
