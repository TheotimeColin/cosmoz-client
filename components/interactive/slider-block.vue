<template>
    <div class="SliderBlock" :style="{ '--step': step }" ref="container">
        <div class="SliderBlock_rail" ref="rail">
            <div
                class="SliderBlock_item"
                v-for="slot in dynSlots"
                :class="[ itemClass ]"
                :key="slot"
            >
                <slot :name="slot">
                    {{ slot }}
                </slot>
            </div>
        </div>
        
        <button-base class="SliderBlock_left" icon-before="angle-left" :modifiers="['light', 'round']" @click="prev" v-if="step > 0" />

        <button-base class="SliderBlock_right" icon-before="angle-right" :modifiers="['light', 'round']" @click="next" v-if="step < maxSteps" />
    </div>
</template>

<script>
export default {
    name: 'SliderBlocks',
    props: {
        itemClass: { type: String, default: '' }
    },
    computed: {
        dynSlots () {
            return Object.keys(this.$slots).filter(key => key != 'submit')
        }
    },
    data: () => ({
        step: 0,
        maxSteps: 0
    }),
    mounted () {
        this.checkDimensions()
    },
    methods: {
        checkDimensions () {
            this.maxSteps = Math.ceil(this.$refs.container.scrollWidth / this.$refs.rail.clientWidth)
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
        overflow: hidden;
        position: relative;
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

        & + & {
            margin-left: 10px;
        }
    }

    .SliderBlock_left,
    .SliderBlock_right {
        position: absolute;
        z-index: 5;
        top: 50%;
        margin-top: -24px;
    }

    .SliderBlock_left {
        left: 10px;
    }

    .SliderBlock_right {
        right: 10px;
    }
</style>