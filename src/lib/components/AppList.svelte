<script lang="ts">
	import App from './App.svelte';
	import type { Applications } from '../types';
	import { categories, categorize, titleCase } from '../utils';
	import Section from './Section.svelte';
	import Subsection from './Subsection.svelte';

	export let apps: Applications;
	$: appsCategorized = categorize(apps);
</script>

<Section title="Applications">
	{#each categories(appsCategorized) as category}
		<Subsection subtitle={category}>
			<div class="flex flex-wrap">
				{#each appsCategorized[category] as app}
					<div class="w-full sm:w-1/2 xl:w-1/3 2xl:w-1/4">
						<App {app} />
					</div>
				{/each}
			</div>
		</Subsection>
	{/each}
</Section>
