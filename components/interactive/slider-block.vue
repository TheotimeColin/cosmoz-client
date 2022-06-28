<template>
    <div class="SliderBlock" :class="{ 'is-slideable': maxSteps > 0 }" :style="{ '--step': step, paddingBottom: offsetV + 'px', '--margin': margin + 'px', '--height': (offsetV + height) + 'px' }">
        <placeholder :ratio="ratio" :class="[ itemClass ]" style="opacity: 0" />

        <div class="SliderBlock_container" ref="container">
            <div class="SliderBlock_rail" :style="{ paddingLeft: offset + 'px', paddingBottom: offsetV + 'px' }" ref="rail">
                <div class="SliderBlock_item" :class="[ itemClass ]" v-for="i in 5" :key="i" v-show="isLoading">
                    <placeholder :height="height" :ratio="ratio" />
                </div>

                <transition-group name="fade">
                    <div
                        class="SliderBlock_item"
                        v-for="slotId in slots"
                        :class="[ itemClass ]"
                        :style="isInit && autoHeight ? { height: height + 'px' } : {}"
                        :key="slotId"
                        ref="item"
                    >
                        <slot :name="slotId"></slot>
                    </div>
                </transition-group>
            </div>

            <button-base class="SliderBlock_left" icon-before="angle-left" :modifiers="['light', 'round', 'xs']" @click="prev" v-if="step > 0 && !isLoading" />

            <button-base class="SliderBlock_right" icon-before="angle-right" :modifiers="['light', 'round']" @click="next" v-if="step < maxSteps && !isLoading" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SliderBlocks',
    props: {
        slots: { type: Array, default: () => [] },
        itemClass: { type: String, default: '' },
        margin: { type: Number, default: 15 },
        offset: { type: Number, default: 0 },
        offsetV: { type: Number, default: 20 },
        ratio: { type: Number, default: 0 },
        autoHeight: { type: Boolean, default: false },
        isLoading: { type: Boolean, default: false },
    },
    computed: {
        breakpoint () {
            return this.$store.state.page.breakpoint
        }
    },
    data: () => ({
        step: 0,
        maxSteps: 0,
        height: 0,
        isInit: false,
        isSlidable: true
    }),
    mounted () {
        this.checkDimensions()
    },
    watch: {
        slots () {
            this.$nextTick(() => this.checkDimensions())
        },
        isLoading (v) {
            if (!v) this.$nextTick(() => this.checkDimensions())
        },
        breakpoint () {
            this.$nextTick(() => this.checkDimensions())
        }
    },
    methods: {
        checkDimensions () {
            this.isInit = false

            this.$nextTick(() => {
                if (this.$refs.container) {
                    if (this.$refs.container.scrollWidth == this.$refs.rail.clientWidth) {
                        this.maxSteps = 0
                    } else {
                        this.maxSteps = Math.ceil(this.$refs.container.scrollWidth / (this.$refs.rail.clientWidth * 0.5))
                    }
                }

                if (this.$refs.item) {
                    this.$refs.item.forEach(item => {
                        this.height = this.height < item.offsetHeight ? item.offsetHeight : this.height
                    })
                }

                this.isInit = true
            })
        },
        next () {
            this.step += 1
        },
        prev () {
            this.step -= 1
        }
    }
}
</script>

<style lang="scss" scoped>
    .SliderBlock {
        position: relative;
        height: var(--height, 0px);
    }

    .SliderBlock_container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
    }

    .SliderBlock_rail {
        white-space: nowrap;
        transition: all 300ms ease;
        transform: translateX(calc(-50% * var(--step)));
    }

    .SliderBlock_item {
        white-space: normal;
        display: inline-block;
        vertical-align: top;
        margin-right: var(--margin, 10px);

        &:last-child {
            margin-right: 0;
        }
    }

    .SliderBlock_left,
    .SliderBlock_right {
        position: absolute;
        z-index: 5;
        top: 50%;
        margin-top: -34px;
    }

    .SliderBlock_left {
        left: 15px;
    }

    .SliderBlock_right {
        right: 15px;
    }

    @include breakpoint-xs {
        
        .SliderBlock.is-slideable {
        
            .SliderBlock_container {
                overflow: auto;
            }
        }

        .SliderBlock_left,
        .SliderBlock_right {
            display: none;
        }

        .SliderBlock_rail {

            &::after {
                content: "";
                display: inline-block;
                width: 50%;
            }
        }
    }
</style>