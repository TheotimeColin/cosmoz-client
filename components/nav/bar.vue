<template>
    <div class="NavBar" :class="{ 'is-start': this.scroll <= 20, 'is-scroll': hasScroll }">
        <div class="NavBar_container" :style="{ paddingLeft: ph + 'px', paddingRight: ph + 'px' }" ref="container">
            <button-base
                :id="`navbar-${item.id}`"
                class="NavBar_item"
                v-for="(item, i) in items.filter(item => !item.disabled)"
                :modifiers="activeItem == item.id ? ['s', weak ? 'light' : 'cosmoz', 'no-s'] : ['s', weak ? 'xweak' : 'weak', 'no-s']"
                :href="item.href"
                :to="item.to"
                @click="() => onClick(item)"
                :key="i"
                :ref="item.id"
            >
                {{ item.label }}
            </button-base>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NavBar',
    data: () => ({
        scroll: 0,
        hasScroll: false,
    }),
    props: {
        value: { type: String },
        weak: { type: Boolean, default: false },
        ph: { type: Number, default: 0 },
        items: { type: Array, default: () => [] }
    },
    computed: {
        activeItem () {
            let active = 'index'

            this.items.forEach(item => {
                if (item.to && this.$route && this.$route.name.includes(item.to.name)) {
                    active = item.id
                } else if (this.value == item.id) {
                    active = item.id
                }
            })
        
            return active
        },
        availableItems () {
            return this.items.filter(i => !i.disabled && !i.checked)
        },
        navigableItems () {
            return this.items.filter(i => !i.disabled)
        },
        currentIndex () {
            let i = 0
            
            this.navigableItems.forEach((item, index) => {
                if (item.id == this.value || !this.value && item.id == 'index') i = index
            })

            return i
        }
    },
    mounted () {
        this.checkScroll()

        if (this.$refs.container) {
            new ResizeObserver(() => {
                this.checkScroll()
            }).observe(this.$el)
        
        
            this.$refs.container.addEventListener('scroll', () => {
                this.scroll = this.$refs.container.scrollLeft
            })
        }
    },
    methods: {
        checkScroll () {
            if (!this.$refs.container) return 
            
            this.hasScroll = this.$refs.container.scrollWidth > this.$refs.container.clientWidth

            if (this.hasScroll) this.$nextTick(() => this.updateScroll())
        },
        onClick (item) {
            item.onClick ? item.onClick() : this.$emit('input', item.id)
            this.$nextTick(() => this.updateScroll())
        },
        updateScroll () {
            let element = this.$refs[this.value ? this.value : 'index'][0]

            if (this.$refs.container) {
                this.$refs.container.scrollTo({
                    left: element.offsetLeft - 40,
                    behavior: 'smooth'
                })
            }
        },
        next () {
            if (this.navigableItems[this.currentIndex + 1]) this.$emit('input', this.navigableItems[this.currentIndex + 1].id)

            this.$nextTick(() => this.updateScroll())
        },
        prev () {
            if (this.navigableItems[this.currentIndex - 1]) this.$emit('input', this.navigableItems[this.currentIndex - 1].id)

            this.$nextTick(() => this.updateScroll())
        }
    }
}
</script>

<style lang="scss" scoped>
.NavBar {
    position: relative;
    overflow: hidden;
}

.NavBar_container {

}

.NavBar_item {
    margin: 1px 0;

    & + & {
        margin-left: 5px;
    }
}

@include breakpoint-xs {
    
    .NavBar_container {
        display: flex;
        overflow: auto;
    }

    .NavBar {

        &.is-scroll {

            &::after,
            &::before {
                content: "";
                display: block;
                position: absolute;
                top: 0;
                width: 30px;
                height: 100%;
                z-index: 2;
                pointer-events: none;
                transition: all 100ms ease;
            }

            &::after {
                right: -2px;
                background: linear-gradient(to right, color-opacity('bg', -100%), color-opacity('bg', -20%));
            }

            &::before {
                left: -2px;
                background: linear-gradient(to left, color-opacity('bg', -100%), color-opacity('bg', -20%));
            }
        }

        &.is-start {

            &::before {
                opacity: 0;
            }
        }

        .NavBar_container {
            @include hide-scrollbars;

            &::after {
                content: "";
                display: block;
                width: 75%;
                height: 10px;
                flex-shrink: 0;
            }
        }
    }
}
</style>