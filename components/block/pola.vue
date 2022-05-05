<template>
    <div class="BlockPola">
        <div class="BlockPola_picture" :style="{ backgroundImage: `url(${background})` }"></div>
        <div class="BlockPola_content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BlockPola',
    props: {
        background: { type: String }
    },
}
</script>

<style lang="scss" scoped>
.BlockPola {
    padding: 20px;
    background-color: var(--color-bg-light);
    font: var(--ft-s);
    line-height: 1.2;
    color: var(--color-ft);
    text-align: left;
    background-image: url('@/assets/img/texture/paper-s.webp');
    background-size: 100% 100%;
}

.BlockPola_content {
    margin-top: 10px;
}

.BlockPola_picture {
    position: relative;
    background-size: cover;
    background-position: center;

    &::before {
        content: "";
        display: block;
        @include ratio(100);
    }

    &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.4;
        background-image: url('@/assets/img/texture/plastic-s.webp');
        background-size: 100% 100%;
    }
}

@include breakpoint-xs {
    .BlockPola {
        padding: 15px;
    }
}
</style>