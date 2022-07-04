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

                <emoji-button
                    @input="(v) => addReaction({ type: v, status: _id, action: true })"
                    text="Réagir"
                />
            </div>
        </div>
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'
import PostReactionsMixin from '@/mixins/post-reactions'

export default {
    name: 'PostFooter',
    mixins: [ PostMixin, PostReactionsMixin ],
    props: {
        _id: { type: String },
        constellation: { type: String },
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
        margin-top: 20px;
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
            margin: 15px -15px 0;
        }
    }

</style>