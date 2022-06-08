<template>
    <div class="Post" :class="{ 'is-current': isCurrent, 'is-reacted': isReacted, 'is-not-current': !isCurrent && gatheringData }">
        <div class="Post_head">
            <div class="d-flex fxa-center fx-grow">
                <div class="Post_icon">
                    <user-icon class="Post_user" :modifiers="['']" v-bind="owner" />

                    <!-- <nuxt-link :to="gatheringLink" class="Post_gathering" :style="{ backgroundImage: `url(${gatheringData.thumbnail})` }" v-if="gatheringData && !isCurrent">
                    </nuxt-link> -->
                </div>

                <div class="ml-10 ft-s line-1">
                    <nuxt-link :to="titleLink" class="ft-title-2xs subtitle">{{ title }}</nuxt-link>

                    <template v-if="gatheringData && !isCurrent">
                        <span class="ft-title-2xs color-ft-weak mh-3">dans</span>
                        <link-base :modifiers="['l']" :to="gatheringLink">
                                {{ gatheringData.title }}
                        </link-base>
                    </template>
                    <template v-else-if="constellationData && !isCurrent">
                        <span class="ft-title-2xs color-ft-weak mh-3">dans</span>
                        <link-base :modifiers="['l']" :to="gatheringLink">
                                {{ constellationData.name }}
                        </link-base>
                    </template>

                    <div class="color-ft-weak mt-3 ellipsis-1 ellipsis-break">
                        {{ subtitle }}
                    </div>
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
            <div class="Post_text Post_block" v-html="$options.filters.specials(content)" v-else-if="content"></div>

            <content-type-images class="Post_block Post_gallery" :images="images" v-if="images && images.length > 0" />
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
                    v-show="isAdd || (children.length > 0 && $biggerThan('s'))"
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
        images: { type: Array, default: () => [] },
        isLoading: { type: Boolean, default: false },
        owner: { type: Object },
        reactions: { type: Array, default: () => [] },
        children: { type: Array, default: () => [] },
        disableCreate: { type: Boolean, default: false },
        createdAt: { type: [String, Date] },
        gathering: { type: String },
        constellation: { type: String },
        activeGathering: { type: String },
        activeConstellation: { type: String }
    },
    data: () => ({
        max: 2,
        isAdd: false,
        reacted: null
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        forbidden () {
            return (this.read == 'friends' && !this.owner.isFriend) && this.owner._id != this.user._id
        },
        displayedComments () {
            return this.children ? this.children.slice(Math.max(0, this.children.length - this.max), this.children.length) : []
        },
        gatheringData () {
            return this.gathering ? this.$store.getters['gathering/findOne']({ _id: this.gathering }) : null
        },
        constellationData () {
            return this.constellation ? this.$store.getters['constellation/findOne']({ _id: this.constellation }) : null
        },
        title () {
            return this.owner.name
        },
        subtitle () {
            let subtitle = this.$moment(this.createdAt).fromNow()
            return subtitle
        },
        titleLink () {
            return this.localePath({ name: 'p-id', params: { id: this.owner.id } })
        },
        gatheringLink () {
            let link = null

            if (this.gatheringData) {
                link = this.localePath({ name: 'c-slug-events-id', params: { id: this.gatheringData.id, slug: this.gatheringData.constellation ? this.gatheringData.constellation.slug : 'event' } })
            } else if (this.constellationData) {
                link = this.localePath({ name: 'c-slug-channel-id', params: { slug: this.constellationData.slug } })
            }

            return link
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

        &.is-reacted {

            .Post_action--react {
                
                svg {
                    color: var(--color-love);
                }
            }
        }
    }

    .Post_block {
        margin-bottom: 20px;
        
        &:last-child {
            margin-bottom: 0;
        }
    }

    .Post_icon {
        display: block;
        flex-shrink: 0;
        flex-grow: 0;
        width: 35px;
        height: 35px;
        position: relative;
    }

    .Post_gathering {
        width: 25px;
        height: 25px;
        position: absolute;
        bottom: -8px;
        right: -5px;
        border-radius: 4px;
        background-size: cover;
        background-position: center;
    }

    .Post_delete {
        @include absolute-fill;
        font: var(--ft-l);
        text-align: center;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.75);
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
            padding: 15px 15px 0;
            border-radius: 0;
        }

        .Post_comments {
            margin: 0 -15px;
            padding: 0 20px 20px;
            border: none;
        }

        .Post_footer {
            padding: 15px 20px;
            margin: 0 -15px 0;
        }

        .Post_gallery {
            margin-left: -15px;
            margin-right: -15px;
        }

        .Post_text,
        .Post_head {
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