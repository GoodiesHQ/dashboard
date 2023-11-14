<script lang="ts">
	import type { Config } from '$lib/types';
	import AppList from './AppList.svelte';
	import BookmarkList from './BookmarkList.svelte';

	export let data: Config;
</script>

{#if data.apps.length > 0}
	<AppList apps={data.apps} />
{/if}
{#if data.bookmarks.length > 0}
	<BookmarkList bookmarks={data.bookmarks} />
{/if}
