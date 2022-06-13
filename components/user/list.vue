<template>
    <div class="UserList">
        <div class="UserList_icons" :style="{ maxWidth: (30 * items.slice(0, max).length) + 'px' }">
            <div class="UserList_iconContainer" v-for="(item, i) in items.slice(0, max)" :key="item._id">
                <user-icon class="UserList_icon" v-bind="item" :no-link="true">
                    <div class="UserList_overlay" slot="overlay" v-if="i == items.slice(0, max).length - 1 && items.length > max">+{{ items.length - max }}</div>
                </user-icon>
            </div>
        </div>
        <div class="ft-title-3xs ml-5 fx-no-shrink">
            {{ items.length }} {{ suffix }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: { type: Array, default: () => [] },
        max: { type: Number, default: 10 },
        suffix: { type: String, default: 'participent' }
    }
}
</script>

<style lang="scss" scoped>
    .UserList {
        display: flex;
        align-items: center;
        padding: 5px;
        background-color: var(--color-bg);
        border-radius: 50px;
        padding-right: 15px;
        transition: all 150ms ease;
        cursor: pointer;

        &:hover {
            background-color: var(--color-bg-strong);
            transform: scale(0.99);
        }

        &:active {
            transform: scale(0.96);
        }
    }

    .UserList_icons {
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        padding-right: 35px;
    }

    .UserList_iconContainer {
        position: relative;
        height: 35px;
        width: 1px;
    }

    .UserList_icon {
        position: absolute;
        top: 0;
        left: 0;
    }

    .UserList_overlay {
        @include absolute-fill;
        background-color: rgba(0, 0, 0, 0.5);
        font: var(--ft-title-4xs);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>