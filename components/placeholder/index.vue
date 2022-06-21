<template>
    <div class="Placeholder">
        <div class="Placeholder_content" :style="height ? { height: height + 'px' } : { paddingBottom: ratio + '%' }"></div>
    </div>
</template>

<script>
export default {
    name: 'Placeholder',
    props: {
        ratio: { type: Number, default: 50 },
        height: { type: Number, default: 50 }
    }
}
</script>

<style lang="scss" scoped>
.Placeholder {
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;

    &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #5959655e 50%, rgba(0, 0, 0, 0) 100%);
        animation: placeholder 1000ms cubic-bezier(0.4, 0, 1, 1) 0ms infinite;
    }
}

.Placeholder_content {
    // padding-bottom: 100%;
}

@keyframes placeholder {
    0% {
        transform: translateX(-100%) scaleX(50%);
        opacity: 0;
    }

    50% {
        opacity: 0.25;
    }

    100% {
        opacity: 0;
        transform: translateX(200%) scaleX(100%);
    }
}
</style>