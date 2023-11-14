<script lang="ts">
	import { formatTime } from '$lib/utils';
	import { onMount } from 'svelte';

	export let title: string = 'Dashboard';
	export let datetime: string | undefined;

	$: formatted = formatTime(datetime, new Date());

	onMount(() => {
		// If a datetime format is defined, update it every 1s
		let formatter: NodeJS.Timeout;
		if (datetime) {
			formatter = setInterval(() => {
				formatted = formatTime(datetime, new Date());
			}, 1000);
		}

		return () => {
			if (datetime) {
				clearInterval(formatter);
			}
		};
	});
</script>

<p class="font-sans text-3xl">{title}</p>
{#if datetime}
	<p class="font-mono text-lg">{formatted}</p>
{/if}
