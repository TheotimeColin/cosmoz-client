<template>
    <div class="Ripple" @click="ripple">
        
        <div
            class="Ripple_item"
            v-for="ripple in ripples"
            :style="{ ...ripple }"
            :key="ripple.id"
        ></div>
    </div>
</template>

<script>
export default {
    data: () => ({
        ripples: []
    }),
    methods: {
        ripple (e) {
            let id = Math.random()

            this.ripples = [ ...this.ripples, {
                id, left: e.offsetX + 'px', top: e.offsetY + 'px'
            } ]

            setTimeout(() => {
                this.ripples = this.ripples.filter(r => r.id !== id)
            }, 300)
        }
    }
}
</script>

<style lang="scss" scoped>

.Ripple {
    @include absolute-fill;
}

.Ripple_item {
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    position: absolute;
    margin: -50px 0 0 -50px;
    opacity: 1;
    pointer-events: none;
    transform: scale(0);
    animation: ripple 300ms linear;
}
</style>