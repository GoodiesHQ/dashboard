<script lang="ts">
	import type { Bookmark } from '$lib/types';
	import type { Categorized } from '$lib/utils';
	import Subsection from './Subsection.svelte';

	export let bookmarksCategorized: Categorized<Bookmark>;
	export let category: string;
</script>

<Subsection subtitle={category}>
	<div class="flex flex-col">
		{#each bookmarksCategorized[category] as bookmark}
			<a
				class="flex flex-row hover:text-blue-400"
				href={bookmark.url}
				target={bookmark.new_tab ? '_blank' : '_self'}
			>
				{bookmark.name}
			</a>
		{/each}
	</div>
</Subsection>
