<template>
    <div class="FormSticky" :class="{ 'is-active': isActive }">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'FormSticky',
    props: {
        isActive: { type: Boolean, default: false }
    }
}
</script>

<style lang="scss" scoped>
    .FormSticky {
        position: sticky;
        width: 100%;
        bottom: 0px;
        padding: 25px 20px;
        z-index: 15;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(to bottom, color-opacity('bg-xstrong', -100%), color-opacity('bg-xstrong', -15%))
    }
</style>