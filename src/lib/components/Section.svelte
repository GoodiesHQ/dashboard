<script lang="ts">
	import { titleCase } from '$lib/utils';
	export let title: string;
</script>

<p class="font-light text-3xl pb-2 md:pb-5 pt-4 md:pt-6">{titleCase(title)}:</p>
<slot />
