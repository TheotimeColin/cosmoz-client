<template>
    <div class="Post" :class="{ 'is-current': isCurrent, 'is-reacted': isReacted }" v-show="content || forbidden">
        <template v-if="owner.name && (this.gathering ? gatheringData : true)">
            <div class="Post_head">
                <div class="d-flex fxa-center fx-grow">
                    <nuxt-link class="Post_icon" :to="titleLink" :style="isCurrent ? {} : { backgroundImage: `url(${gatheringData.thumbnail})` }">
                        <user-icon class="Post_user" :modifiers="isCurrent ? ['s'] : ['xs']" v-bind="owner" />
                    </nuxt-link>

                    <div class="ml-10 ft-s line-1">
                        <nuxt-link :to="titleLink" class="ft-title-2xs subtitle">{{ title }}</nuxt-link>
                        <p class="ft-italic color-ft-weak mt-5 ellipsis-1 ellipsis-break">
                            {{ subtitle }}

                            · <fa :icon="$t(`permissions.${read}.icon`)" class="ml-3" /> {{ this.$t(`permissions.${this.read}.title`) }}
                        </p>
                    </div>
                </div>

                <quick-menu
                    class="Post_menu fx-no-shrink ml-10"
                    :items="actions"
                />
            </div>
            <div class="Post_main">
                <div class="ft-l color-ft-xweak pb-20 ph-20" v-if="forbidden">
                    <i>{{ this.$t(`permissions.${this.read}.error`) }}</i>
                </div>
                <div class="Post_text" v-html="$options.filters.specials(content)" v-else></div>
            </div>
            <div class="Post_footer" v-if="!forbidden">
                <div class="Post_action Post_action--react" @mouseenter="onReactionTooltip" @mouseleave="$tClose">
                    <fa class="mr-3" :icon="`${isReacted ? 'fas' : 'far'} fa-heart`" @click="addReaction" /> {{ reactions.length ? reactions.length : '' }}
                </div>
                <div class="Post_action" @click="onAddComment">
                    <fa class="mr-3" icon="far fa-comment-lines" /> {{ children.length ? children.length : '' }}
                </div>
            </div>

            <content-reaction-popin
                :is-active="isSeeReactions"
                :reactions="reactionsOwners"
                @close="isSeeReactions = false"
                v-if="!forbidden"
            />

            <transition name="fade">
                <div class="Post_comments" v-show="displayedComments.length > 0 || isAdd">
                    <link-base :invert="true" icon-before="arrow-up" class="Post_comment color-ft-weak d-block n-mt-5 mb-20" @click="max += 3" v-if="displayedComments.length < children.length">Commentaires précédents</link-base>
                
                    <content-comment
                        v-for="post in displayedComments"
                        class="Post_comment"
                        v-bind="post"
                        :key="post._id"
                    />

                    <content-editor
                        @submit="onSubmit"
                        class="Post_comment"
                        :tiny="true"
                        placeholder="Ajouter un commentaire..."
                        @blur="() => children.length == 0 ? isAdd = false : ''"
                        v-show="isAdd || children.length > 0"
                        ref="commentInput"
                    />
                </div>
            </transition>

            <div class="Post_delete" v-show="pendingDelete">
                <div class="max-width-s">
                    Veux-tu vraiment supprimer ce message et tout ses commentaires ?

                    <div class="mt-20">
                        <button-base :modifiers="['s']" class="mr-5" @click="pendingDelete = false">
                            Annuler
                        </button-base>

                        <button-base icon-before="trash" :modifiers="['light']" :loading="isDeleteLoading" @click="deletePost">
                            Oui, supprimer
                        </button-base>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'

export default {
    name: 'Post',
    mixins: [ PostMixin ],
    props: {
        _id: { type: String },
        content: { type: String },
        read: { type: String },
        isLoading: { type: Boolean, default: false },
        owner: { type: Object },
        reactions: { type: Array, default: () => [] },
        children: { type: Array, default: () => [] },
        disableCreate: { type: Boolean, default: false },
        createdAt: { type: [String, Date] },
        gathering: { type: String },
        activeGathering: { type: String }
    },
    data: () => ({
        max: 2,
        isAdd: false,
        reacted: null
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        forbidden () {
            return (this.read == 'affinity' && !this.owner.isAffinity) && this.owner._id != this.user._id
        },
        displayedComments () {
            return this.children ? this.children.slice(Math.max(0, this.children.length - this.max), this.children.length) : []
        },
        gatheringData () {
            return this.gathering ? this.$store.getters['gathering/findOne']({ _id: this.gathering }) : null
        },
        title () {
            if (this.isCurrent) {
                return this.owner.name
            } else {
                return this.gatheringData.title
            }
        },
        subtitle () {
            let subtitle = this.$moment(this.createdAt).fromNow()

            if (!this.isCurrent) subtitle = this.owner.name + ' · ' + subtitle

            return subtitle
        },
        titleLink () {
            if (this.isCurrent) {
                return this.localePath({ name: 'p-id', params: { id: this.owner.id } })
            } else {
                return this.localePath({ name: 'c-slug-events-id', params: { id: this.gatheringData.id, slug: this.gatheringData.organization ? this.gatheringData.organization._id : 'event' } })
            }
        }
    },
    methods: {
        reset () {
            this.$refs.commentInput.reset()
        },
        onAddComment () {
            if (this.disableCreate) return

            this.isAdd = true
            setTimeout(() => this.$refs.commentInput.focus(), 10)
        },
        onSubmit (data) {
            if (this.disableCreate) return
            
            this.$emit('submit', {
                ...data,
                read: this.read,
                parent: this._id
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .Post {
        border-radius: 10px;
        background-color: var(--color-bg-weak);
        position: relative;

        &.is-current {

            .Post_icon {
                background-color: transparent;
            }

            .Post_user {
                position: relative !important;
                bottom: auto;
                right: auto;
                width: 100% !important;
                height: 100% !important;
            }
        }

        &.is-reacted {

            .Post_action--react {
                
                svg {
                    color: var(--color-love);
                }
            }
        }
    }

    .Post_icon {
        display: block;
        flex-shrink: 0;
        flex-grow: 0;
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-size: cover;
        background-position: center;
        background-color: var(--color-bg-weak);
        position: relative;
    }

    .Post_delete {
        @include absolute-fill;
        font: var(--ft-l);
        text-align: center;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.75);
    }

    .Post_user {
        position: absolute !important;
        bottom: -3px;
        right: -3px;
    }

    .Post_text {
        font: var(--ft-l);
        padding: 0 20px;
    }

    .Post_head {
        padding: 20px;
        position: relative;
    }

    .Post_menu {
        position: absolute;
        top: 5px;
        right: 5px;
    }

    .Post_footer {
        display: flex;
        padding: 15px 20px 20px;
    }

    .Post_action {
        font: var(--ft-title-3xs);
        
        svg {
            cursor: pointer;
        }
        
        & + & {
            margin-left: 20px;
        }
    }

    .Post_comments {
        border-top: 1px solid var(--color-border);
        margin: 0 20px;
        padding: 20px 0;
    }

    .Post_comment {

        & + & {
            margin-top: 10px;
        }
    }

    @include breakpoint-xs {

        .Post {
            margin: 0 -20px;
            padding: 15px 20px;
            border-bottom: 1px solid var(--color-border);
            border-radius: 0;
            background: transparent;
        }

        .Post_comments {
            margin: 0;
            border: none;
            padding-top: 0;
        }

        .Post_text,
        .Post_head,
        .Post_footer {
            padding-left: 0;
            padding-right: 0;
        }

        .Post_head {
            padding-top: 0;
            display: flex;
        }

        .Post_menu  {
            position: relative;
            top: auto;
            left: auto;
        }
    }

</style>