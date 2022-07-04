<template>
    <div class="Message" :class="{ 'is-right': isSelf }">
        <div class="Message_container">
            <div class="Message_author" v-if="author">
                <user-icon v-bind="author" />
            </div>
            <transition-group tag="div" class="Message_content">
                <div class="Message_itemContainer" v-for="message in items" :key="message._id">
                    <div class="Message_item">
                        <p class="ft-xs-medium mb-3" v-if="isGroup && !isSelf">{{ author.name }}</p>
                        <div v-html="message.content"></div>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Message',
    props: {
        items: { type: Array, default: () => [] },
        isGroup: { type: Boolean, default: false }
    },
    computed: {
        isSelf () {
            return this.user && this.user._id == this.author._id
        },
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
    transition: all 150ms ease;

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
    overflow-wrap: break-word;

    a {
        text-decoration: underline;

        &:hover {
            text-decoration: none;
        }
    }
}

.Message_itemContainer {
    transition: all 150ms ease;

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

    .Message_author {
        display: none;
    }
}

</style>