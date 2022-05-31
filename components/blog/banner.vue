<template>
    <div class="Banner" :style="background ? { '--background': `url(${background})` } : undefined">
        <div class="Wrapper Wrapper--xs">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Banner',
    props: {
        background: { type: String }
    }
}
</script>

<style lang="scss" scoped>
.Banner {
    text-align: center;
    position: relative;
    color: var(--color-ft-light);
    background-color: var(--color-bg-weak);
    display: flex;
    align-items: center;
    min-height: 50vh;
    padding: 100px 0;

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

@include breakpoint-xs {

    .Banner {
        min-height: 0vh;
        padding: 100px 0 30px;
        text-align: left;
    }
}
</style>