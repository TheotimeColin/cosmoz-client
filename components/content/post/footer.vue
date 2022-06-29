<template>
    <div>
        <div class="Post_footer">
            <div class="Post_action">
                <button-base
                    icon-before="comments"
                    :modifiers="['s', 'xweak']"
                    :to="permaLink"
                    class="mr-3"
                    :text="replyCount ? replyCount + ' commentaires': 'Commenter'"
                />

                <button-base
                    icon-before="face-smile"
                    :modifiers="['s', isShowEmojis ? 'light' : 'xweak']"
                    @click="$smallerThan('s') ? $store.commit('page/popin', { emojis: { action: (v) => addReaction({ type: v, action: true }) } }) : {}"
                    text="Réagir"
                    @mouseenter="isShowEmojis = true"
                    @mouseleave="isShowEmojis = null"
                />

                <div class="Post_emojiSelector" :class="{ 'is-active': isShowEmojis, 'is-disabled': isShowEmojis === false }" @mouseenter="isShowEmojis = true" @mouseleave="isShowEmojis = null" v-if="$biggerThan('s')">
                    <div class="Post_emojiSelectorContainer bg-bg-strong br-s shadow">
                        <reaction-emoji-selector :is-active="isShowEmojis" @input="(v) => {
                            isShowEmojis = false;
                            addReaction({ type: v, action: true });
                        }" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'

export default {
    name: 'PostFooter',
    mixins: [ PostMixin ],
    props: {
        reactions: { type: Array, default: () => [] },
        children: { type: Array, default: () => [] },
        forbidden: { type: Array, default: () => [] },
    },
    data: () => ({
        isShowEmojis: false
    }),
    computed: {
        replyCount () {
            return this.children.length + this.children.reduce((total, c) => total += c.children.length, 0)
        }
    }
}
</script>

<style lang="scss" scoped>
    .Post_footer {
        background-color: var(--color-bg);
        background-color: color-opacity('bg', -65%);
        display: flex;
        justify-content: flex-end;
        padding: 5px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    .Post_action {
        font: var(--ft-title-3xs);
        position: relative;
        
        svg {
            font-size: 17px;
            cursor: pointer;
        }
        
        & + & {
            margin-left: 20px;
        }
    }

    .Post_emojiSelector {
        pointer-events: none;
        opacity: 0;

        position: absolute;
        box-sizing: content-box;
        border: 20px solid transparent;
        z-index: 50;
        bottom: 20px;
        right: 0;
        transform: translateY(calc(100% + 5px));
        transition: all 100ms ease;

        &.is-active,
        &:hover:not(.is-disabled) {
            opacity: 1;
            pointer-events: all;
            transform: translateY(100%);
        }
    }

    .Post_emojiSelectorContainer {
        width: 400px;
        overflow: hidden;
        height: 350px;
        display: flex;
    }

    .Post_comments {
        margin-top: 30px;
    }

    .Post_comment {

        & + & {
            margin-top: 15px;
        }
    }

    @include breakpoint-xs {

        .Post_comments {
            margin: 20px -15px 0;
            padding: 0 10px 10px;
            border: none;
        }

        .Post_footer {
            margin: 0 -15px 0;
        }

        .Post_block.Post_reactions {
            padding: 0 10% 0 0;
            margin: 0 -5px;

            &.is-reactions {
                padding-bottom: 20px;
            }
        }
    }

</style>