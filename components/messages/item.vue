<template>
    <div class="Message" :class="{ 'is-right': author._id == user._id }">
        <div class="Message_container">
            <div class="Message_author" v-if="author">
                <user-icon v-bind="author" />
            </div>
            <div class="Message_content">
                <div class="Message_itemContainer" v-for="message in items" :key="message._id">
                    <div class="Message_item">
                        {{ message.content }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Message',
    props: {
        items: { type: Array, default: () => [] }
    },
    computed: {
        author () {
            if (!this.items[0]) return null

            return this.$getUser(this.items[0].owner)
        }
    }
}
</script>

<style lang="scss">
.Message {
    display: flex;

    &.is-right {
        justify-content: flex-end;

        .Message_author {
            display: none;
        }

        .Message_item {
            background: var(--color-cosmoz);
            border-radius: 4px;
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
        }

        .Message_itemContainer {
            text-align: right;

            &:first-child .Message_item {
                border-top-right-radius: 12px;
            }

            &:last-child .Message_item {
                border-bottom-right-radius: 12px;
            }
        }
    }
}

.Message_container {
    max-width: 60%;
    display: flex;
}

.Message_author {
    margin-right: 8px;
    display: flex;
    align-items: flex-end;
}

.Message_item {
    font: var(--ft-m);
    display: inline-block;
    background: var(--color-bg-xweak);
    padding: 10px 15px;
    border-radius: 4px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
}

.Message_itemContainer {

    & + & {
        margin-top: 3px;
    }

    &:first-child .Message_item {
        border-top-left-radius: 12px;
    }

    &:last-child .Message_item {
        border-bottom-left-radius: 12px;
    }
}

@include breakpoint-xs {

    .Message_container {
        max-width: calc(100% - 20px);
    }

    .Message_item {
        word-break: break-all;
    }

    .Message_author {
        display: none;
    }
}

</style>