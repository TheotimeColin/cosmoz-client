<template>
    <div class="Comment" :class="{ 'is-reacted': isReacted }" v-if="!isDeleted && ownerData">
        <div class="Comment_left">
            <user-icon class="fx-no-shrink mr-10" :modifiers="['s']" v-bind="ownerData" />
        </div>
        
        <div class="Comment_main shadow-s">
            <div class="fx-grow">
                <div class="fx-center mt-5">
                    <div class="ft-s-medium line-1 fx-grow">
                        {{ ownerData.name }}

                        <span class="ft-xs color-ft-weak ml-5">
                            @{{ ownerData.id }} · {{ $moment(createdAt).fromNow() }}
                        </span>
                    </div>
                </div>
                
                <div>
                    <div class="Comment_text" v-html="content"></div>

                    <content-type-images class="Post_block Post_gallery" :modifiers="['s']" :images="images" v-if="images && images.length > 0" />
                </div>

                <transition-group name="transition-list" tag="div" class="Comment_reactions">
                    <button-base
                        :modifiers="['2xs', 'no-s', isReacted(reactionType) ? (images && images.length > 0 ? 'light' : 'highlight') : '']"
                        class="m-3"
                        :emoji-before="reactionType"
                        v-for="(reaction, reactionType) in reactionTypes" :key="reactionType"
                        @click.stop="addReaction({ type: reactionType })"
                    >
                        {{ reaction.length }}
                    </button-base>
                </transition-group>
                
                <div class="Comment_delete" v-show="pendingDelete">
                    <button-base :modifiers="['s']" class="mr-5" @click="pendingDelete = false">
                        Annuler
                    </button-base>

                    <button-base icon-before="trash" :modifiers="['light', 's']" :loading="isLoading" @click="deletePost">
                        Supprimer mon commentaire
                    </button-base>
                </div>
            </div>

            <div class="fx-no-shrink">
                <quick-menu
                    icon="ellipsis-v"
                    :button="{ modifiers: ['2xs', 'xweak'] }"
                    :items="actions"
                />

                <div class="p-relative">
                    <button-base
                        icon-before="face-smile"
                        :modifiers="['2xs', 'round', isShowEmojis ? 'light' : 'xweak']"
                        @click="$smallerThan('s') ? $store.commit('page/popin', { emojis: { action: (v) => addReaction({ type: v, action: true }) } }) : isShowEmojis = true"
                    />

                    <div class="Comment_emojiSelector" :class="{ 'is-active': isShowEmojis, 'is-disabled': isShowEmojis === false }" @mouseleave="isShowEmojis = false" v-if="$biggerThan('s')">
                        <div class="Comment_emojiSelectorContainer bg-bg-strong br-s shadow">
                            <reaction-emoji-selector :is-active="isShowEmojis" @input="(v) => {
                                isShowEmojis = false;
                                addReaction({ type: v, action: true });
                            }" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <content-reaction-popin
            :is-active="isSeeReactions"
            :reactions="reactionsOwners"
            @close="isSeeReactions = false"
        />
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'

export default {
    name: 'Comment',
    mixins: [ PostMixin ],
    props: {
        _id: { type: String },
        content: { type: String },
        owner: { type: String },
        images: { type: Array, default: () => [] },
        reactions: { type: Array, default: () => [] },
        createdAt: { type: [String, Date] },
        isLoading: { type: Boolean }
    },
    data: () => ({
        isDeleted: false,
        isShowEmojis: false
    }),
    computed: {
        reactionTypes () {
            return this.$groupBy(this.reactions, 'type')
        }
    }
}
</script>

<style lang="scss" scoped>
    .Comment {
        display: flex;
        position: relative;
        align-items: flex-start;

        &.is-reacted {

            .Comment_action {
                color: var(--color-love) !important;
            }
        }
    }

    .Comment_main {
        display: flex;
        padding: 5px 5px 12px 12px;
        background: var(--color-bg-weak);
        border-radius: 5px;
        flex-grow: 1;
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
</style>