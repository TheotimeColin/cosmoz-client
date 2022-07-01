<template>
    <div class="Comment" :class="{ 'is-parent': isParent }" v-if="!isDeleted && ownerData">
        <div class="Comment_parent">
            <div class="Comment_left">
                <user-icon class="fx-no-shrink mr-10" :modifiers="['s']" v-bind="ownerData" />
            </div>
            
            <div class="Comment_main shadow-s">
                <div class="Comment_content fx-grow">
                    <div class="fx-center mt-5">
                        <user-icon class="Comment_profileSecondary fx-no-shrink mr-10" :modifiers="['s']" v-bind="ownerData" />

                        <div class="ft-s-medium color-ft-weak line-1 fx-grow">
                            <span>{{ ownerData.name }}</span>

                            <span class="ft-xs color-ft-xweak ml-5">
                                @{{ ownerData.id }} <span class="d-none@xs">· </span><span class="d-block@xs">{{ $moment(createdAt).fromNow() }}</span>
                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <div class="Comment_text" v-html="content"></div>

                        <content-type-images class="Post_block Post_gallery" :modifiers="['s']" :images="images" v-if="images && images.length > 0" />
                    </div>

                    <content-reactions class="Comment_reactions" v-bind="$props" id="" :status="$props._id" />
                    
                    <div class="Comment_delete" v-show="pendingDelete">
                        <button-base :modifiers="['s']" class="mr-5" @click="pendingDelete = false">
                            Annuler
                        </button-base>

                        <button-base icon-before="trash" :modifiers="['light', 's']" :loading="isLoading" @click="deletePost">
                            Supprimer mon commentaire
                        </button-base>
                    </div>
                </div>

                <div class="Comment_actions fx-no-shrink">
                    <div class="p-relative">
                        <button-base
                            icon-before="face-smile"
                            :modifiers="['2xs', 'round', isShowEmojis ? 'light' : 'xweak']"
                            @click="$smallerThan('s') ? $store.commit('page/popin', { emojis: { action: (v) => addReaction({ type: v, status: _id, action: true }) } }) : isShowEmojis = true"
                        />

                        <div class="Comment_emojiSelector" :class="{ 'is-active': isShowEmojis, 'is-disabled': isShowEmojis === false }" @mouseleave="isShowEmojis = false" v-if="$biggerThan('s')">
                            <div class="Comment_emojiSelectorContainer bg-bg-strong br-s shadow">
                                <reaction-emoji-selector :is-active="isShowEmojis" @input="(v) => {
                                    isShowEmojis = false;
                                    addReaction({ type: v, status: _id, action: true });
                                }" />
                            </div>
                        </div>
                    </div>

                    <quick-menu
                        icon="ellipsis-v"
                        :button="{ modifiers: ['2xs', 'xweak'] }"
                        :items="[
                            { label: 'Répondre', fa: 'reply', action: onAddReply },
                            { label: 'Voir le fil', fa: 'arrow-up-right-from-square', disabled: !isParent, to: permaLink },
                            { fa: 'heart', label: 'Voir les réactions', disabled: !this.reactions.length, action: () => isSeeReactions = true },
                            { fa: 'trash', label: 'Supprimer', disabled: !this.isOwner, action: () => pendingDelete = true }
                        ]"
                    />
                </div>
            </div>
        </div>

        <div class="Comment_replies" v-if="isParent && (children.length > 0 || addReply)">
            <transition name="fade">
                <content-comment-input
                    class="+mt-10"
                    @submit="onSubmit"
                    @cancel="addReply = false"
                    placeholder="Répondre..."
                    ref="commentInput"
                    v-if="!disableCreate && addReply"
                />
            </transition>

            <content-comment
                v-for="reply in displayedReplies"
                class="+mt-10"
                v-bind="reply"
                :is-parent="false"
                :disable-create="true"
                @addReply="onAddReply"
                :key="reply._id"
            />

            <div class="+mt-10 text-right" v-if="displayedReplies.length < children.length">
                <link-base @click="max += 5">Voir les réponses suivantes</link-base>
            </div>
        </div>

        <content-reaction-popin
            :is-active="isSeeReactions"
            :reactions="reactionTypes"
            @close="isSeeReactions = false"
        />
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'
import PostReactionsMixin from '@/mixins/post-reactions'

export default {
    name: 'Comment',
    mixins: [ PostMixin, PostReactionsMixin ],
    props: {
        _id: { type: String },
        parentId: { type: String },
        isParent: { type: Boolean, default: true },
        content: { type: String },
        slug: { type: String },
        owner: { type: String },
        disableCreate: { type: Boolean, default: false },
        images: { type: Array, default: () => [] },
        children: { type: Array, default: () => [] },
        reactions: { type: Array, default: () => [] },
        createdAt: { type: [String, Date] },
        isLoading: { type: Boolean }
    },
    data: () => ({
        isSeeReactions: false,
        isDeleted: false,
        isShowEmojis: false,
        addReply: false,
        max: 3
    }),
    computed: {
        reactionTypes () {
            return this.$groupBy(this.reactions, 'type', { orderBy: true })
        },
        displayedReplies () {
            let children = this.children ? [ ...this.children ] : []

            return children.sort((a, b) => this.$moment(b.createdAt).valueOf() - this.$moment(a.createdAt).valueOf()).slice(0, this.max)
        },
        maxDisplayedReactions () {
            return this.$smallerThan('xs') ? 6 : 10
        },
        permaLink () {
            if (this.slug) {
                return {
                    name: 'c-slug-post-postId-replyId',
                    params: { slug: this.slug, postId: this.parentId, replyId: this._id }
                }
            } else {
                return {
                    name: 'post-postId-replyId',
                    params: { postId: this.parentId, replyId: this._id }
                }
            }
        }
    },
    methods: {
        reset () {
            if (this.$refs.commentInput) this.$refs.commentInput.reset()
            this.addReply = false
        },
        onSubmit (data) {
            this.$emit('submit', {
                ...data,
                origin: this.parentId,
                parent: this._id
            })
        },
        onAddReply () {
            this.addReply = true
            this.$emit('addReply')

            setTimeout(() => {
                if (this.$refs.commentInput) this.$refs.commentInput.focus()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .Comment {

    }

    .Comment_parent {
        display: flex;
        position: relative;
        align-items: flex-start;
    }

    .Comment_main {
        display: flex;
        background: var(--color-bg-weak);
        border-radius: 5px;
        flex-grow: 1;
    }

    .Comment_replies {
        margin: 5px 0 30px 15px;
        padding: 5px 0 0 25px;
    }

    .Comment_content {
        padding: 5px 5px 12px 12px;
    }

    .Comment_actions {
        background-color: color-opacity('bg', -65%);
        padding: 3px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .Comment_left {
        padding-top: 4px;
    }

    .Comment_delete {
        @include absolute-fill;
        font: var(--ft-l);
        text-align: center;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 5;
        background-color: rgba(0, 0, 0, 0.75);
    }

    .Comment_text {
        font: var(--ft-m);
        margin-top: 10px;
    }

    .Comment_reactions {
        margin: 10px -3px -3px -3px;
    }

    .Comment_emojiSelector {
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

    .Comment_emojiSelectorContainer {
        width: 400px;
        overflow: hidden;
        height: 300px;
        display: flex;
    }

    .Comment_profileSecondary {
        display: none !important;
    }

    @include breakpoint-xs {
        .Comment {

            &.is-parent {
                
                .Comment_replies {
                    border-left: 2px solid var(--color-border);
                }
            }
        }

        .Comment_left {
            display: none;
        }

        .Comment_profileSecondary {
            display: flex !important;
        }

        .Comment_replies {
            margin: 10px 0 30px 0px;
            padding: 10px 0 0 20px;
        }
    }
</style>