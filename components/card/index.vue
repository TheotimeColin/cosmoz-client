<template>
    <div
        class="Container"
        :class="{ 'is-reset': panReset }"
        :style=" { transform: `translateY(${totalPosition}px` }"
        v-hammer:pan.vertical="onPan"
        v-hammer:panend="onPanEnd"
        ref="container"
    >
        <card-container
            class="Card"
            :class="[`is-${card.color ? card.color : 'cream'}`]"
            v-for="(card, i) in items"
            v-bind="card"
            :is-active="currentItem == i"
            :key="i"
            @cardLast="nextItem"
            ref="cards"
        />
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        items: { type: Array, default: () => [] }
    },
    data: () => ({
        currentItem: 0,
        position: 0,
        hammer: null,
        pan: 0,
        offsetY: 0,
        panReset: false,
        panAnimation: 'left'
    }),
    computed: {
        totalPosition () {
            return this.pan + this.position - (this.offsetY * Math.min(this.currentItem, 1))
        }
    },
    watch: {
        currentItem () {
            this.position = this.$refs.cards[0] ? -(this.$refs.cards[0].$el.offsetHeight + 20) * this.currentItem : 0
        },
        pan (v) {
            if (!v) this.reset()
        }
    },
    mounted () {
        let bounds = this.$el.getBoundingClientRect()
        this.offsetY = bounds.top * 0.5
    },
    methods: {
        reset () {
            this.panReset = true
            setTimeout(() => {
                this.panReset = false
            }, 350)
        },
        onPan (v) {
            if (this.panReset) return
            
            let max = this.$refs.container.offsetHeight
            let force = Math.max(1 - (Math.abs(v.deltaY * 0.1) / max), 0)

            this.pan += v.velocityY * force
        },
        onPanEnd (v) {
            if (this.panReset) return
            
            this.pan = 0

            if (v.deltaY <= -100) {
                this.nextItem()
            } else if (v.deltaY >= 100) {
                this.prevItem()
            }
        },
        nextItem () {
            this.reset()
            
            this.currentItem = this.currentItem + 1 >= this.items.length - 1 ? this.items.length - 1 : this.currentItem + 1
        },
        prevItem () {
            this.reset()
            
            this.currentItem = this.currentItem - 1 <= 0 ? 0 : this.currentItem - 1
        }
    }
}
</script>

<style lang="scss" scoped>
.Container {
    // touch-action: pan-y !important;
    // transition: height 200ms ease-out;

    &.is-reset {
        transition: all 350ms ease-out;
    }
}

.Card {

    & + & {
        margin-top: 20px;
    }
}
</style>