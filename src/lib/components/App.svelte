<script lang="ts">
	import type { Application } from '../types';
	import Icon from '@iconify/svelte';
	import { getHost, isUrl } from '$lib/utils';

	export let app: Application;
</script>

<a
	class="w-100 transition-colors text-gray-700 dark:text-gray-200 hover:text-blue-500 text-left"
	target={app.tab ? '_blank' : '_self'}
	href={app.url}
>
	<div class="max-w-sm rounded overflow-hidden p-4 flex items-start space-x-4">
		<div class="flex-shrink-0 mt-0 text-[48px] pt-0">
			{#if app.icon_data}
				<!-- If Icon data is provided, the server has injected SVG data and should be used directly -->
				<Icon icon={app.icon_data} />
			{:else if typeof app.icon === 'string' && isUrl(app.icon)}
				<!-- If a URL is provided, use <img> tags and provide the source -->
				{#if app.icon.toLowerCase().endsWith('svg')}
					<!-- Maybe do something with SVG specifically here? -->
					<img src={app.icon} style="width: 48px; height: 48px;" alt="" />
				{:else}
					<img src={app.icon} style="width: 48px; height: 48px;" alt="" />
				{/if}
			{:else}
				<!-- If it is just an icon name, use the Iconify Public API to resolve and load the icon -->
				<Icon icon={app.icon} />
			{/if}
		</div>
		<div>
			<div class="font-bold text-xl mb-0">{app.name}</div>
			<p class="text-gray-700 dark:text-gray-200 text-base">
				{app.url_display || getHost(app.url)}
			</p>
		</div>
	</div>
</a>
