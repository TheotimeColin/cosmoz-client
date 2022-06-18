<template>
    <div class="Post" :class="{ 'is-current': isCurrent, 'is-reacted': isReacted, 'is-not-current': !isCurrent && gatheringData, 'is-no-link': noLink, 'is-forbidden': isForbidden }" ref="container" v-if="!isLoading">
        <ripples :auto="false" :size="300" :modifiers="['weak']" v-if="!noLink && !isForbidden" ref="ripples"  />

        <div class="Post_head" @click="onClick">
            <div class="d-flex fxa-center fx-grow">
                <div class="Post_icon" @click.stop>
                    <user-icon class="Post_user" :modifiers="['']" v-bind="ownerData"  v-if="ownerData" />
                </div>

                <div class="ml-10 ft-xs line-1" @click.stop>
                    <component :is="titleLink ? 'nuxt-link' : 'div'" :to="titleLink" class="ft-title-2xs subtitle">
                        {{ title }}
                    </component>

                    <template v-if="gatheringData && !isCurrent">
                        <fa icon="far fa-angle-right" class="color-ft-weak mh-3" />
                        <link-base :to="gatheringLink" :modifiers="['l']">
                            {{ gatheringData.title }}
                        </link-base>
                    </template>
                    <template v-else-if="consteData && !isCurrent">
                        <fa icon="far fa-angle-right" class="color-ft-weak mh-3" />
                        <link-base :to="gatheringLink" :modifiers="['l']">
                            {{ consteData.name }}
                        </link-base>
                    </template>

                    <div class="color-ft-weak mt-3 ellipsis-1 ellipsis-break" v-if="!isForbidden">
                        {{ subtitle }}
                    </div>
                </div>
            </div>

            <quick-menu class="Post_menu fx-no-shrink ml-10" :items="actions" />
        </div>
        <div class="Post_main" @click="onClick">
            <div class="Post_text Post_block" v-html="$options.filters.specials(content)" v-if="content"></div>

            <div class="Post_text Post_block" v-if="forbidden">
                {{ placeholderText }}
            </div>

            <content-type-images class="Post_block Post_gallery" :images="images" v-if="images && images.length > 0" />
        </div>
        <div class="Post_footer" @click="onClick">
            <div class="Post_action Post_action--react" @mouseenter="onReactionTooltip" @mouseleave="$tClose">
                <fa class="mr-3" :icon="`${isReacted ? 'fas' : 'far'} fa-heart`" @click.stop="addReaction" /> {{
                reactions.length ? reactions.length : '' }}
            </div>
            <div class="Post_action" @click.stop="onAddComment">
                <fa class="mr-3" icon="far fa-comment-lines" /> {{ children.length ? children.length : '' }}
            </div>
        </div>

        <div class="Post_forbidden" v-if="isForbidden && consteData">
            <nuxt-link :to="localePath({ name: 'c-slug-rejoindre', params: { slug: consteData.slug } })" class="Post_forbiddenMessage fx-center ft-s p-15 br-xs">
                <ripples :size="300" />

                <p class="mr-10">Ce contenu n'est visible que par les membres de {{ consteData.name }}.</p>

                <button-base :modifiers="['round', 'xs', 'light']" icon-before="arrow-right" />
            </nuxt-link>
        </div>
        <div class="Post_forbidden" v-else-if="isForbidden && ownerData">
            <div class="Post_forbiddenMessage Post_forbiddenMessage--user ft-s p-15 br-xs">
                <p>Ce contenu n'est visible que par les amis de {{ ownerData.name }}.</p>
            </div>
        </div>

        <content-reaction-popin
            :is-active="isSeeReactions"
            :reactions="reactionsOwners"
            @close="isSeeReactions = false"
            v-if="!isForbidden"
        />

        <transition name="fade">
            <div class="Post_comments" v-show="displayedComments.length > 0 || isAdd">
                <link-base :invert="true" icon-before="arrow-up" class="Post_comment color-ft-weak d-block n-mt-5 mb-10" @click="max += 3" v-if="displayedComments.length < children.length">Commentaires précédents</link-base>

                <content-comment v-for="post in displayedComments" class="Post_comment" v-bind="post" :key="post._id" />

                <content-editor @submit="onSubmit" class="Post_comment" :tiny="true"
                    placeholder="Ajouter un commentaire..." @blur="() => children.length == 0 ? isAdd = false : ''"
                    v-show="isAdd || (children.length > 0 && $biggerThan('s'))" ref="commentInput" />
            </div>
        </transition>

        <div class="Post_delete" v-show="pendingDelete">
            <div class="max-width-s">
                Veux-tu vraiment supprimer ce message et tout ses commentaires ?

                <div class="mt-20">
                    <button-base :modifiers="['s']" class="mr-5" @click.stop="pendingDelete = false">
                        Annuler
                    </button-base>

                    <button-base icon-before="trash" :modifiers="['light']" :loading="isDeleteLoading"
                        @click.stop="deletePost">
                        Oui, supprimer
                    </button-base>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <placeholder :ratio="40" />
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'

export default {
    name: 'Post',
    async fetch () {
        await this.$store.dispatch('user/softFetch', [ this.owner, ...this.children.map(c => c.owner) ])
    },
    mixins: [ PostMixin ],
    props: {
        _id: { type: String },
        content: { type: String },
        read: { type: String },
        images: { type: Array, default: () => [] },
        isLoading: { type: Boolean, default: false },
        owner: { type: String },
        reactions: { type: Array, default: () => [] },
        children: { type: Array, default: () => [] },
        forbidden: { type: Array, default: () => [] },
        disableCreate: { type: Boolean, default: false },
        createdAt: { type: [String, Date] },
        gathering: { type: String },
        constellation: { type: String },
        activeGathering: { type: String },
        activeConstellation: { type: String },
        noLink: { type: Boolean, default: false }
    },
    data: () => ({
        max: 2,
        isAdd: false,
        reacted: null
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        displayedComments () {
            return this.children ? this.children.slice(Math.max(0, this.children.length - this.max), this.children.length) : []
        },
        gatheringData () {
            return this.gathering ? this.$store.getters['gathering/findOne']({ _id: this.gathering }) : null
        },
        consteData () {
            return this.constellation || this.gatheringData?.constellation ? this.$store.getters['constellation/findOne']({ _id: (this.gatheringData?.constellation || this.constellation) }) : null
        },
        title () {
            return this.ownerData ? this.ownerData.name : ''
        },
        subtitle () {
            let subtitle = this.$moment(this.createdAt).fromNow()
            return subtitle
        },
        titleLink () {
            return this.ownerData ? this.localePath({ name: 'p-userId', params: { userId: this.ownerData.id } }) : null
        },
        gatheringLink () {
            let link = null

            if (this.gatheringData && this.consteData) {
                link = this.localePath({ name: 'c-slug-events-eventId', params: { eventId: this.gatheringData.id, slug: this.consteData.slug } })
            } else if (this.consteData) {
                link = this.localePath({ name: 'c-slug-feed', params: { slug: this.consteData.slug } })
            }

            return link
        },
        isForbidden () {
            return !this.user || this.forbidden.includes('content')
        },
        placeholderText () {
            return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tempor nec justo ac pellentesque. Hé non, ce contenu est vraiment caché, petit malin ! Vestibulum euismod, sapien ultrices blandit scelerisque, risus diam lacinia nisi, id lobortis urna erat a nulla. Curabitur vel cursus risus.`.slice(this.$randomBetween(0, 20), this.$randomBetween(20, 230))
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
        },
        onClick (e) {
            if (!this.noLink && !this.isForbidden) {
                if (this.$refs.ripples && this.$refs.container) {
                    let bounds = this.$refs.container.getBoundingClientRect()

                    this.$refs.ripples.ripple({
                        offsetX: e.clientX - bounds.left,
                        offsetY: e.clientY - bounds.top
                    })
                }

                if (this.consteData) {
                    this.$router.push(this.localePath({
                        name: 'c-slug-post-postId',
                        params: { slug: this.consteData.slug, postId: this._id }
                    }))
                } else {
                    this.$router.push(this.localePath({
                        name: 'post-postId',
                        params: { postId: this._id }
                    }))
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .Post {
        border-radius: 10px;
        background-color: var(--color-bg-weak);
        position: relative;
        cursor: pointer;

        &.is-reacted {

            .Post_action--react {
                
                svg {
                    color: var(--color-love);
                }
            }
        }

        &.is-no-link,
        &.is-forbidden {
            cursor: default;
        }
    }

    .Post_block {
        margin-bottom: 20px;
        
        &:last-child {
            margin-bottom: 0;
        }
    }

    .Post_forbidden {
        padding: 25px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-opacity('bg-2xstrong', -50%);;
        backdrop-filter: blur(5px);
        border-radius: 10px;
    }

    .Post_forbiddenMessage {
        max-width: 400px;
        background-color: var(--color-bg-xweak);
        box-shadow: 0 3px 6px 0 color-opacity('bg-xstrong', -25%);
        overflow: hidden;
        position: relative;
        transition: all 200ms ease;

        &:hover {
            background-color: var(--color-cosmoz);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px 0 color-opacity('bg-xstrong', -10%);
        }
    }

    .Post_forbiddenMessage--user {
        text-align: center;
        pointer-events: none;
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
        font: var(--ft-m);
        text-align: center;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.75);
    }

    .Post_text {
        font: var(--ft-m);
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

        .Post_forbidden {
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