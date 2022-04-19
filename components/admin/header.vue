<template>
    <header class="HeaderAdmin">
        <div class="HeaderAdmin_left">
            <p class="ft-m-bold">{{ title }}</p>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderAdmin',
    computed: {
        title () { return this.$store.state.page.meta.title },
    }
}
</script>