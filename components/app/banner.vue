<template>
    <div class="Banner" :style="background ? { '--background': `url(${background})` } : undefined">
        <div class="Wrapper">
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
    created () {
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
    background-color: var(--color-bg-2xstrong);
    display: flex;
    align-items: flex-end;
    min-height: 180px;
    padding: 100px 30px 30px 30px;
    margin-top: -65px;

    &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.4;
        background-size: cover;
        background-position: center;
        background-image: var(--background);
    }

    & > * {
        position: relative;
    }
}

@include breakpoint-s {

    .Banner {
        margin-top: -70px;
        min-height: 0vh;
        padding: 140px 40px 30px;
        text-align: left;
    }
}

@include breakpoint-xs {

    .Banner {
        padding-left: 30px;
        padding-right: 30px;
    }
}
</style>