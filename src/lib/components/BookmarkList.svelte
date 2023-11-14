<script lang="ts">
	import type { Bookmarks } from '../types';
	import { categories, categorize } from '../utils';
	import BookmarkGroup from './BookmarkGroup.svelte';
	import Section from './Section.svelte';

	export let bookmarks: Bookmarks;
	$: bookmarksCategorized = categorize(bookmarks);
</script>

<Section title="Bookmarks">
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
		{#each categories(bookmarksCategorized) as category}
			<div class="col-span-1">
				<BookmarkGroup {bookmarksCategorized} {category} />
			</div>
		{/each}
	</div>
</Section>
