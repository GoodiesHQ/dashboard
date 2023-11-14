<script lang="ts">
	import type { PageServerData } from './$types';

	import type { Application } from '$lib/types';
	import Heading from '$lib/components/Heading.svelte';
	import Content from '$lib/components/Content.svelte';

	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { loadIcons } from '@iconify/svelte';
	import { Circle } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';

	// Refresh the dashboard once per minute in case anything changes
	const REFRESH_PERIOD = 60_000;
	const REFRESH_VARIANCE = 5_000;

	export let data: PageServerData;

	$: icons = data.apps.reduce((unique: string[], app: Application) => {
		if (app.icon_data === undefined && !unique.includes(app.icon)) {
			unique.push(app.icon);
		}
		return unique;
	}, []);

	let loading = false;

	function schedule_refresh() {
		// randomize refresh period
		let refresh_period = REFRESH_PERIOD;
		refresh_period += Math.floor(Math.random() * REFRESH_VARIANCE * 2) - REFRESH_VARIANCE;
		setTimeout(() => {
			// refresh data
			invalidateAll();
			schedule_refresh();
		}, refresh_period);
	}

	onMount(() => {
		// loading by default in javascript version, wait for icons to load
		loading = icons.length > 0;
		schedule_refresh();

		// for JS-enabled browser, update the display style
		const content = document.querySelector('.js-only') as HTMLElement;
		if (content != null) {
			content.style.display = 'block';
		}

		// Load icons and show a spinner while processing
		if (icons.length > 0) {
			loadIcons(icons, () => (loading = false));
		}
	});
</script>

<Heading title={data.title} datetime={data.datetime} />
<noscript>
	<Content {data} />
</noscript>

<div class="js-only" transition:fade={{ duration: 500 }}>
	{#if loading}
		<div class="fixed inset-0 flex items-center justify-center">
			<Circle size="120" color="gray" unit="px" duration="500ms" />
		</div>
	{:else}
		<Content {data} />
	{/if}
</div>

<style>
	.js-only {
		display: none;
	}
</style>
