<script lang="ts">
	import { titleCase } from '$lib/utils';
	export let subtitle: string;
</script>

<p class="font-semibold text-lg">{titleCase(subtitle)}:</p>
<slot />
