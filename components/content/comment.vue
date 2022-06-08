<template>
    <div class="Comment" :class="{ 'is-reacted': isReacted }" v-if="!isDeleted">
        <div class="Comment_main">
            <div class="fx-center">
                <div class="d-flex fxa-center ft-s line-1 fx-grow">
                    <user-icon class="fx-no-shrink" :modifiers="['s']" v-bind="owner" />
                    
                    <span class="ft-title-2xs line-1 ml-10">{{ owner.name }}</span>
                    <span class="ft-s line-1 ft-italic color-ft-weak ml-5">{{ $moment(createdAt).fromNow() }}</span>
                </div>

                <div class="Comment_actions">
                    <button-base :modifiers="['xs', 'xweak']" @mouseenter.native="onReactionTooltip" @mouseleave.native="$tClose" @click="addReaction">
                        <fa :icon="`${isReacted ? 'fas' : 'far'} fa-heart`"  />

                        <span class="ml-3" v-if="reactions.length > 0">{{ reactions.length }}</span>
                    </button-base>

                    <quick-menu
                        :items="actions"
                    />
                </div>
            </div>
            
            <div>
                <div class="Comment_text" v-html="content"></div>

                <content-type-images class="Post_block Post_gallery" :modifiers="['s']" :images="images" v-if="images && images.length > 0" />
            </div>
            
        </div>
        <div class="Comment_delete" v-show="pendingDelete">
            <button-base :modifiers="['s']" class="mr-5" @click="pendingDelete = false">
                Annuler
            </button-base>

            <button-base icon-before="trash" :modifiers="['light', 's']" :loading="isLoading" @click="deletePost">
                Supprimer mon commentaire
            </button-base>
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
        owner: { type: Object },
        images: { type: Array, default: () => [] },
        reactions: { type: Array, default: () => [] },
        createdAt: { type: [String, Date] },
        isLoading: { type: Boolean }
    },
    data: () => ({
        isDeleted: false
    })
}
</script>

<style lang="scss" scoped>
    .Comment {
        display: flex;
        position: relative;

        &.is-reacted {

            .Comment_action {
                color: var(--color-love) !important;
            }
        }
    }

    .Comment_main {
        padding: 10px;
        background: var(--color-bg-xweak);
        border-radius: 5px;
        flex-grow: 1;
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

    .Comment_actions {
        display: flex;
        align-items: flex-start;
        flex-shrink: 0;
        margin: -5px -5px 0 0;
    }

    .Comment_action {
        
        & + & {
            margin-left: 20px;
        }
    }

    .Comment_icon {
        display: none !important;
    }

    @include breakpoint-s {

        .Comment_icon {
            display: inline-flex !important;
            margin-right: 3px;
            vertical-align: middle !important;
        }
    }
</style>