<template>
    <div class="UserIcon" :class="[ theme ]">
        {{ name.slice(0, 1) }}
    </div>
</template>

<script>
export default {
    props: {
        name: { type: String }
    },
    data: () => ({
        theme: 'is-cream'
    }),
    created () {
        this.theme = 'is-' + this.$randomColor()
    }
}
</script>

<style lang="scss" scoped>
.UserIcon {
    width: 35px;
    height: 35px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 50%;
    font: var(--ft-title-s);
    text-transform: lowercase;
    background-color: var(--color-current-weak);
    color: var(--color-current-strong);
}
</style>