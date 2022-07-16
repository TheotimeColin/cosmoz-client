<template>
    <div class="StickyAdd">
        <button-base :modifiers="['l', 'round', isActive ? 'light' : 'cosmoz']" :icon-before="isActive ? 'times': 'plus'" @click="() => isActive ? onClose() : $store.commit('page/popin', { create: true })" />
    </div>
</template>

<script>
export default {
    computed: {
        isActive () {
            return this.$store.state.page.popins.create ? true : false
        }
    },
    methods: {
        onClose () {
            this.$store.commit('page/popin', { create: false })
        }
    }
}
</script>

<style lang="scss" scoped>
    .StickyAdd {
        margin-top: -12px;
    }
</style>