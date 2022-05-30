<template>
    <div class="Banner" :style="background ? { '--background': `url(${background})` } : undefined">
        <div class="Banner_wrapper Wrapper">
            <div class="mb-20">
                <slot name="return"></slot>
            </div>

            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Banner',
    props: {
        background: { type: String }
    },
    beforeCreate () {
        this.$store.commit('page/setHeader', { transparent: true })
    },
    beforeDestroy () {
        this.$store.commit('page/setHeader', { transparent: false })
    }
}
</script>

<style lang="scss" scoped>
.Banner {
    position: relative;
    font: var(--ft-title-l);
    color: var(--color-ft-light);
    background-color: var(--color-black);

    &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.25;
        background-size: cover;
        background-position: center;
        background-image: var(--background);
    }

    & > * {
        position: relative;
    }
}

.Banner_wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 33vh;
    padding: 65px 0 30px 0;
}

@include breakpoint-s {

    .Banner {
        margin-top: -70px;
    }

    .Banner_wrapper {
        min-height: 0vh;
        padding: 140px 40px 30px;
        text-align: left;
    }
}

@include breakpoint-xs {

    .Banner {
        padding-left: 0;
        padding-right: 0;
    }
}
</style>