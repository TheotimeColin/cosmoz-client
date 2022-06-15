<template>
    <div>
        <div class="Nav_cat" v-for="(cat, i) in items.filter(c => !c.disabled)" :key="i">
            <component :is="cat.to ? 'nuxt-link' : 'div'" :to="localePath(cat.to)" class="Nav_item Nav_item--label fx-center" v-if="cat.label">
                <p>
                    {{ cat.label }}
                </p>

                <span class="round-xs bg-bg-xstrong ml-10" :style="{ opacity: cat.number ? 1 : 0 }">{{ cat.number ? cat.number : 0 }}</span>
            </component>

            <template v-if="cat.children && cat.children.length > 0">
                <div v-for="item in cat.children.filter(c => !c.disabled)" :key="item.label">
                    <nuxt-link class="Nav_item ellipsis-1 ellipsis-break" :class="{ 'is-parent': item.isParent }" :to="localePath(item.to)">
                        <fa :icon="`far fa-${item.fa}`" fixed-width v-if="item.fa" />
                        
                        <span class="round-xs bg-bg-xstrong" style="margin: -5px 3px 0 2px;" v-if="item.number">{{ item.number }}</span>
                        {{ item.label }}
                    </nuxt-link>

                    <div class="Nav_sub" v-for="sub in (item.children ? item.children : []).filter(c => !c.disabled)" :key="sub.label">
                        <fa icon="far fa-corner" flip="both" />
                        <nuxt-link class="Nav_item Nav_item--sub ellipsis-1 ellipsis-break" :to="localePath(sub.to)">{{ sub.label }}</nuxt-link>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: { type: Array, default: () => ([]) }
    }
}
</script>

<style lang="scss">
    .Nav_cat {

        & + & {
            margin-top: 15px;
        }
    }

    .Nav_item {
        font: var(--ft-m-medium);
        line-height: 0.6;
        cursor: pointer;
        color: var(--color-ft-weak);
        text-decoration-color: var(--color-ft-xweak);
        border-radius: 5px;
        transition: all 100ms ease;
        overflow: hidden;
        white-space: nowrap;
        display: block;
        padding: 14px 10px 10px 8px;

        svg {
            margin-right: 3px;
            margin-top: -4px;
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
        }
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

    .Nav_sub {
        display: flex;
        align-items: center;
        margin-left: 20px;
        color: var(--color-ft-xweak);
    }

    .Nav_item--sub {
        flex-grow: 1;
        padding: 10px;
        margin-left: 5px;
        line-height: 1;
    }
</style>