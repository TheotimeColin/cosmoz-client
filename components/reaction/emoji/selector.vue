<template>
    <div class="EmojiSelector" :class="{ 'is-active': isActive }">
        <div class="EmojiSelector_featured EmojiSelector_grid" v-if="isActive">
            <div class="EmojiSelector_item EmojiSelector_item--l" v-for="emoji in EMOJIS.featured" @click="$emit('input', emoji)" :key="emoji">
                <span>{{ emoji }} </span>
            </div>
        </div>
        
        <div class="EmojiSelector_search" v-if="isActive">
            <div class="EmojiSelector_main">
                <div class="+mt-10" v-for="(value, category) in emojisByCat" :key="category" :ref="category">
                    <div class="EmojiSelector_label">
                        <fa :icon="`fas fa-${EMOJIS.categories.find(c => c.id == category).fa}`" class="mr-5" />

                        <p class="ft-m-medium">{{ category }}</p>
                    </div>

                    <div class="EmojiSelector_grid">
                        <div class="EmojiSelector_item" v-for="emoji in value.items" @click="$emit('input', emoji.value)" :key="emoji.value">
                            <span>{{ emoji.value }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="EmojiSelector_categories">
                <div class="EmojiSelector_cat" v-for="category in EMOJIS.categories" :key="category.id" @click="scrollTo(category.id)">
                    <fa :icon="`fas fa-${category.fa}`" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EMOJIS from '@/utils/emojis'

export default {
    name: 'EmojiSelector',
    props: {
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        EMOJIS
    }),
    computed: {
        emojisByCat () {
            return this.$groupBy(EMOJIS.available, 'cat')
        }
    },
    methods: {
        scrollTo (id) {
            if (this.$refs[id] && this.$refs[id][0]) this.$refs[id][0].scrollIntoView({ block: 'nearest', inline: 'nearest' })
        }
    }
}
</script>

<style lang="scss" scoped>
.EmojiSelector {
    display: flex;
    flex-direction: column;

    &.is-active {
        
        .EmojiSelector_grid,
        .EmojiSelector_search {
            display: flex;
        } 
    }
}

.EmojiSelector_search {
    display: none;
    flex-grow: 1;
    overflow: hidden;
}

.EmojiSelector_main {
    flex-grow: 1;
    overflow: auto;
    @include hide-scrollbars;
}

.EmojiSelector_featured {
    justify-content: center;
}

.EmojiSelector_grid {
    display: none;
    flex-wrap: wrap;
    padding: 10px;
}

.EmojiSelector_item {
    padding: 5px;
    border-radius: 3px;
    margin: 1px;
    height: 45px;
    min-width: 45px;
    max-width: 60px;
    flex-grow: 1;
    cursor: pointer;
    position: relative;
    transition: all 50ms ease-out;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
        line-height: 1;
        font-family: 'Segoe UI Emoji';
        font-size: 27px;
    }

    &:hover {
        background: var(--color-bg-weak);
    }
}

.EmojiSelector_item--l {
    height: 52px;
    min-width: 52px;
    max-width: 52px;
    
    &:hover {
        background: transparent;

        span {
            transform: translate3d(-50%, -50%, 0) scale(1);
        }
    }

    span {
        font-size: 50px;
        transform: translate3d(-50%, -50%, 0) scale(0.60);
        transition: transform 100ms ease-out;
        transform-origin: center;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 10;
    }
}

.EmojiSelector_label {
    display: flex;
    align-items: center;
    position: sticky;
    z-index: 3;
    top: 0;
    padding: 10px 15px;
    background: color-opacity('bg-xstrong', -5%);
    backdrop-filter: blur(5px);
    font: var(--ft-m-medium);
}

.EmojiSelector_categories {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    font-size: 20px;
    width: 50px;
    padding: 5px 0;
    background: var(--color-bg-xstrong);
    overflow: auto;
    @include hide-scrollbars;
}

.EmojiSelector_cat {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--color-ft-xweak);
    padding: 5px;
    cursor: pointer;

    &:hover {
        color: var(--color-ft-light);
        background: var(--color-bg-weak);
    }
}

@include breakpoint-xs {
    .EmojiSelector {
        flex-direction: column-reverse;
    }

    .EmojiSelector_featured {
        min-height: 15vh;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        box-shadow: 0 -3px 8px 0px color-opacity('bg-2xstrong', -60%);
    }

    .EmojiSelector_categories {
        justify-content: flex-end;
    }
}
</style>