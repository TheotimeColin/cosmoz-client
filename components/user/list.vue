<template>
    <div class="UserList" :class="[ ...$modifiers ]">
        <div class="UserList_icons" :style="{ maxWidth: (spacing * items.slice(0, max).length) + 'px' }">
            <div class="UserList_iconContainer" v-for="(item, i) in items.slice(0, max)" :key="item._id">
                <user-icon class="UserList_icon" :modifiers="modifiers.includes('s') ? ['s'] : []" v-bind="item" :no-link="true">
                    <div class="UserList_overlay" slot="overlay" v-if="i == items.slice(0, max).length - 1 && items.length > max">+{{ items.length - max }}</div>
                </user-icon>
            </div>
        </div>
        <div class="UserList_title ft-title-3xs fx-no-shrink" v-if="!hideText">
            {{ items.length }} {{ suffix }}
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'UserList',
    mixins: [ ModifiersMixin ],
    props: {
        items: { type: Array, default: () => [] },
        max: { type: Number, default: 10 },
        hideText: { type: Boolean, default: false },
        suffix: { type: String, default: 'participent' }
    },
    computed: {
        spacing () {
            return this.modifiers.includes('s') ? 25 : 30
        }
    }
}
</script>

<style lang="scss" scoped>
    .UserList {
        display: flex;
        cursor: pointer;

        &:hover {
            .UserList_icons,
            .UserList_title {
                background-color: var(--color-bg-strong);
            }
        }
    }

    .UserList_icons,
    .UserList_title {
        background-color: var(--color-bg);
        padding: 5px;
        transition: all 150ms ease;
    }

    .UserList_title {
        padding-left: 10px;
        padding-right: 15px;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        display: flex;
        align-items: center;
    }

    .UserList_icons {
        display: flex;
        justify-content: space-between;
        padding-right: 35px;
        flex-grow: 1;
        border-top-left-radius: 50px;
        border-bottom-left-radius: 50px;
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

    .UserList--transparent {
        
        .UserList {
            cursor: default;
        }
        
        .UserList_icons,
        .UserList_title {
            background-color: transparent !important;
            padding-top: 0;
            padding-bottom: 0;
        }

        .UserList_icons {
            padding-left: 0;
        }

        .UserList_title {
            padding-right: 0;
        }
    }
</style>