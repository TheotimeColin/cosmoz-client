<template>
    <div class="ChartLine">
        <div class="ChartLine_fill" :style="{ width: current + '%' }"></div>
    </div>
</template>

<script>
export default {
    name: 'ChartLine',
    props: {
        current: { type: Number, default: 0 },
        max: { type: Number, default: 100 }
    },
    computed: {
        fill () {
            return (this.current / this.max) * 100
        }
    }
}
</script>

<style lang="scss" scoped>
.ChartLine {
    border-radius: 20px;
    overflow: hidden;
    background: var(--color-bg-2xstrong);
}

.ChartLine_fill {
    height: 5px;
    background: linear-gradient(to right, var(--color-nebula), var(--color-cosmoz-weak), var(--color-nitro));
    border-radius: 20px;
    transition: all 800ms cubic-bezier(0.920, 0.180, 0.385, 1.095);
}
</style>