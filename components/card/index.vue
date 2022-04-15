<template>
    <div>
        <card-container
            class="Card"
            v-for="(card, i) in items"
            v-bind="card"
            :key="i"
        />
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        items: { type: Array, default: () => [] }
    },
    data: () => ({
        currentItem: null
    }),
    created () {
        this.currentItem = this.items[0]
    }
}
</script>

<style lang="scss" scoped>
.Card {

    & + & {
        margin-top: 20px;
    }
}
</style>