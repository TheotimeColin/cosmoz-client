<template>
    <div class="NavList" :class="[ ...$modifiers ]">
        <div class="Nav_cat" :class="{ 'is-open-parent': cat.children && cat.children.length > 0 }" v-for="(cat, i) in items.filter(c => !c.disabled)" :key="i">
            <component :is="cat.to ? 'nuxt-link' : 'div'" :to="localePath(cat.to)" class="Nav_item" v-if="cat.label" @click.native="$emit('nav')">
                <ripples :size="300" :modifiers="['weak']" />
                <div class="G_cosmoz"></div>

                <div class="Nav_itemMain">
                    <fa :icon="`far fa-${cat.fa}`" fixed-width v-if="cat.fa" />

                    <div class="ellipsis-1 ellipsis-break">
                        {{ cat.label }}
                    </div>
                </div>

                <span class="round-xs bg-bg-xstrong ml-10" :style="{ opacity: cat.number ? 1 : 0 }">{{ cat.number ? cat.number : 0 }}</span>
            </component>

            <template v-if="cat.children && cat.children.length > 0">
                <div v-for="item in cat.children.filter(c => !c.disabled).slice(0, cat.showMore ? cat.max + (cat.showMore * showMore.reduce((t, id) => t + (id == i ? 1 : 0), 0)) : 9999)" :key="item.label">
                    <nuxt-link class="Nav_item Nav_item--sub" :class="{ 'is-parent': item.isParent }" :to="localePath(item.to)" @click.native="$emit('nav')">
                        <ripples :size="300" :modifiers="['weak']" />

                        <div class="Nav_itemMain">
                            <fa class="Nav_corner" icon="far fa-corner" flip="both" />
                            <fa :icon="`far fa-${item.fa}`" v-if="item.fa" />
                            
                            <span class="round-xs bg-bg-xstrong" style="margin: -5px 3px 0 2px;" v-if="item.number">{{ item.number }}</span>

                            <div class="ellipsis-1 ellipsis-break">
                                {{ item.label }}
                            </div>
                        </div>
                    </nuxt-link>
                </div>
                <div class="Nav_showMore" v-if="cat.showMore && cat.children.length > cat.max + (cat.showMore * showMore.reduce((t, id) => t + (id == i ? 1 : 0), 0))" @click="showMore = [ ...showMore, i]">
                    Montrer plus...
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'NavList',
    mixins: [ ModifiersMixin ],
    props: {
        items: { type: Array, default: () => ([]) }
    },
    data: () => ({
        showMore: []
    })
}
</script>

<style lang="scss" scoped>
    .Nav_cat {

        &.is-open-parent + & {
            margin-top: 10px;
        }

        &:not(.is-open-parent) + &.is-open-parent {
            margin-top: 10px;
        }
    }

    .Nav_item {
        font: var(--ft-m-medium);
        cursor: pointer;
        color: var(--color-ft-weak);
        text-decoration-color: var(--color-ft-xweak);
        border-radius: 5px;
        transition: all 100ms ease;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        height: 36px;
        overflow: hidden;
        position: relative;

        svg {
            margin-right: 8px;
            margin-top: -4px;
            flex-shrink: 0;
        }

        &:hover {
            background-color: var(--color-bg);
        }

        // &.is-active:not(.is-parent),
        // &.is-active-exact.is-parent {
        //     color: var(--color-ft-light);
        //     background-color: var(--color-bg-weak);
        // }

        &.is-active-exact {
            color: var(--color-ft-light);
            background-color: var(--color-bg-weak);

            .G_cosmoz {
                opacity: 0.15;
            }
        }
    }

    .G_cosmoz {
        opacity: 0;
        width: 50%;
    }

    .Nav_itemMain {
        flex-grow: 1;
        display: flex;
        align-items: center;
        white-space: normal;
    }

    .Nav_item--label {
        display: flex;
        padding: 6px 10px;
        color: var(--color-ft-xweak);
        font: var(--ft-s-medium);
        cursor: default;

        &:hover {
            background-color: transparent;
        }
    }

    .Nav_item--sub {
        margin-left: 10px;
        padding-left: 10px;
        // font: var(--ft-s-medium);

        svg {
            color: var(--color-ft-xweak);
        }
    }

    svg.Nav_corner {
        color: var(--color-bg-xweak);
    }

    .Nav_showMore {
        cursor: pointer;
        color: var(--color-ft-weak);
        height: 36px;
        margin-left: 10px;
        padding-left: 10px;
        font: var(--ft-s-medium);
        display: flex;
        align-items: center;

        &:hover {
            text-decoration: underline;
        }
    }

    a.Nav_item--label {
        transition: all 100ms ease;
        color: var(--color-ft-xweak);
        cursor: pointer;

        &:hover {
            color: var(--color-ft-light);
            background-color: var(--color-bg);
        }

        &.is-active-exact {
            color: var(--color-ft-light);
            background-color: var(--color-bg-weak);
        }
    }

    .NavList--light {

        .Nav_item {
            color: var(--color-ft-light);
        }

        .Nav_cat {
            margin-top: 2px;

            &:first-child {
                margin-top: 0;
            }
        }
    }
</style>