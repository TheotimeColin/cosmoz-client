<template>
    <div class="SliderBlock" :style="{ '--step': step, paddingBottom: offsetV + 'px' }">
        <placeholder :ratio="ratio" :class="[ itemClass ]" style="opacity: 0" />

        <div class="SliderBlock_container" ref="container">
            <div class="SliderBlock_rail" :style="{ paddingLeft: offset + 'px', paddingBottom: offsetV + 'px' }" ref="rail">
                <div class="SliderBlock_item" :class="[ itemClass ]" v-for="i in 5" :key="i" v-show="isLoading">
                    <placeholder :ratio="ratio" />
                </div>

                <div
                    class="SliderBlock_item"
                    v-for="slotId in slots"
                    :class="[ itemClass ]"
                    :key="slotId"
                >
                    <slot :name="slotId"></slot>
                </div>
            </div>

            <button-base class="SliderBlock_left" icon-before="angle-left" :modifiers="['light', 'round']" @click="prev" v-if="step > 0 && !isLoading" />

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
        offset: { type: Number, default: 0 },
        offsetV: { type: Number, default: 0 },
        ratio: { type: Number, default: 0 },
        isLoading: { type: Boolean, default: false }
    },
    // computed: {
    //     dynSlots () {
    //         return Object.keys(this.$slots).filter(key => key != 'submit')
    //     }
    // },
    data: () => ({
        step: 0,
        maxSteps: 0
    }),
    mounted () {
        this.checkDimensions()
    },
    watch: {
        isLoading (v) {
            if (!v) this.$nextTick(() => this.checkDimensions())
        }
    },
    methods: {
        checkDimensions () {
            if (this.$refs.container.scrollWidth == this.$refs.rail.clientWidth) {
                this.maxSteps = 0
            } else {
                this.maxSteps = Math.ceil(this.$refs.container.scrollWidth / this.$refs.rail.clientWidth)
            }
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
        margin-right: 10px;

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
        
        .SliderBlock_container {
            overflow: auto;
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