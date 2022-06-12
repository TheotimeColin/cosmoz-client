<template>
    <div>
        <div class="Nav_cat" v-for="(cat, i) in items.filter(c => !c.disabled)" :key="i">
            <p class="ft-s color-ft-weak mb-5" v-if="cat.label">{{ cat.label }}</p>

            <div v-for="item in cat.children.filter(c => !c.disabled)" :key="item.label">
                <nuxt-link class="Nav_item ellipsis-1 ellipsis-break" :class="{ 'is-parent': item.isParent }" :to="localePath(item.to)">
                    <fa :icon="`far fa-${item.fa}`" fixed-width /> {{ item.label }}
                </nuxt-link>

                <div class="Nav_sub" v-for="sub in (item.children ? item.children : []).filter(c => !c.disabled)" :key="sub.label">
                    <fa icon="far fa-corner" flip="both" />
                    <nuxt-link class="Nav_item Nav_item--sub ellipsis-1 ellipsis-break" :to="localePath(sub.to)">{{ sub.label }}</nuxt-link>
                </div>
            </div>
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

<style lang="scss" scoped>
    .Nav_cat {

        & + & {
            margin-top: 20px;
        }
    }

    .Nav_item {
        font: var(--ft-m);
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

        &.is-active:not(.is-parent),
        &.is-active-exact.is-parent {
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