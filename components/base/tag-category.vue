<template>
    <div class="TagCategory" :style="{ backgroundImage: `url(${tag.background})` }">
        <div class="TagCategory_label">
            {{ tag.label }}
        </div>
    </div>
</template>

<script>
const CATEGORIES = [
    { label: `Pour tous`, value: 'all' },
    { label: `-35 ans`, value: 'young', background: 'https://images.unsplash.com/photo-1550684848-86a5d8727436?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80' },
    { label: `Queer`, value: 'queer', background: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
    { label: `Girls`, value: 'girls', background: 'https://images.unsplash.com/photo-1632905460027-abad5efa8798?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2129&q=80' },
]

export default {
    name: 'TagCategory',
    props: {
        category: { type: Number, default: 0 }
    },
    computed: {
        tag () { return CATEGORIES[this.category] }
    }
}
</script>

<style lang="scss" scoped>
.TagCategory {
    padding: 7px 15px;
    font: var(--ft-title-3xs);
    color: var(--color-ft-light);
    line-height: 1;
    white-space: nowrap;
    flex-shrink: 0;
    text-transform: uppercase;
    text-decoration: none !important;
    border-radius: 30px;
    background-color: grey;
    background-size: cover;
    background-position: center;
}

.TagCategory_label {
    padding: 4px 8px;
    background-color: var(--color-bg-xstrong);

}
</style>