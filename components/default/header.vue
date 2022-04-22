<template>
    <div class="DefaultHeader">
        <div class="DefaultHeader_wrapper Wrapper">
            <nuxt-link :to="localePath({ name: '' })" class="ft-title-m">gatherings</nuxt-link>

            <div class="DefaultHeader_nav">
                C'est quoi Gatherings ?
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DefaultHeader'
}
</script>

<style lang="scss" scoped>
    .DefaultHeader {
        // border-bottom: 1px solid var(--color-border);
        background-color: var(--color-bg-strong);
    }

    .DefaultHeader_wrapper {
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .DefaultHeader_nav {
        font: var(--ft-m-medium);
    }
</style>