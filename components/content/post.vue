<template>
    <div>
        <div v-if="!isLoading && ownerData">
            <div class="Post" :class="{ 'is-current': isCurrent, 'is-not-current': !isCurrent && gatheringData, 'is-no-link': noLink, 'is-forbidden': isForbidden }" ref="container" >
                <ripples :auto="false" :size="300" :modifiers="['weak']" v-if="!noLink && !isForbidden" ref="ripples"  />

                <div class="Post_head" @click="onClick">
                    <div class="d-flex fxa-center fx-grow">
                        <div class="Post_icon fx-no-shrink" @click.stop>
                            <user-icon class="Post_user" :modifiers="['m']" v-bind="ownerData"  v-if="ownerData" />
                        </div>

                        <div class="ml-10 ft-xs line-1" @click.stop>
                            <component :is="titleLink ? 'nuxt-link' : 'div'" :to="titleLink" class="ft-title-2xs subtitle">
                                {{ title }}
                            </component>

                            <template v-if="parentData">
                                <fa icon="far fa-angle-right" class="color-ft-weak mh-3" />
                                <link-base :to="consteData ? { name: 'c-slug-,postId', params: { slug: consteData.slug, postId: parentData._id } } : { name: 'post-postId', params: { postId: parentData._id } }" :modifiers="['l']">
                                    {{ $ellipsis(parentData.content, 40) }}
                                </link-base>
                            </template>
                            <template v-else-if="gatheringData && !isCurrent">
                                <fa icon="far fa-angle-right" class="color-ft-weak mh-3" />
                                <link-base :to="gatheringLink" :modifiers="['l']">
                                    {{ $ellipsis(gatheringData.title, 40) }}
                                </link-base>
                            </template>
                            <template v-else-if="consteData && !isCurrent">
                                <fa icon="far fa-angle-right" class="color-ft-weak mh-3" />
                                <link-base :to="gatheringLink" :modifiers="['l']">
                                    {{ $ellipsis(consteData.name, 40) }}
                                </link-base>
                            </template>

                            <div class="color-ft-weak mt-5 ellipsis-1 ellipsis-break" v-if="!isForbidden">
                                @{{ ownerData.id }} · {{ subtitle }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="Post_main" @click="onClick">
                    <div class="Post_text Post_block" v-if="content">
                        <div :class="{ 'ellipsis-4': !showAll }" v-html="$options.filters.specials(content)" ref="text"></div>

                        <link-base class="mt-20" v-if="isOverflow && !showAll" @click.native.stop="showAll = true">Voir plus</link-base>
                    </div>

                    <div class="Post_text Post_block" v-if="isForbidden">
                        {{ placeholderText }}
                    </div>

                    <content-type-images class="Post_block Post_gallery" :images="images" v-if="images && images.length > 0" />

                    <transition-group name="transition-list" tag="div" class="Post_block Post_reactions p-relative" :class="{ 'is-reactions': reactions.length }">
                        <button-base
                            :modifiers="['2xs', 'no-s', isReacted(reaction[0]) ? (images && images.length > 0 ? 'highlight-strong' : 'highlight') : '']"
                            class="m-3"
                            :emoji-before="reaction[0]"
                            v-for="reaction in reactionTypes.slice(0, maxDisplayedReactions)" :key="reaction[0]"
                            @mouseenter="(e) => $tOpen(reaction[0] + ' : ' + $pluralize(reaction[1].map(r => $getUser(r.owner) ? $getUser(r.owner).name : null).filter(v => v)), e)"
                            @mouseleave="$tClose"
                            @click.stop="addReaction({ type: reaction[0] })"
                        >
                            {{ reaction[1].length }}
                        </button-base>

                        <button-base
                            icon-before="plus"
                            class="m-3"
                            :modifiers="['2xs']"
                            key="plus"
                            type="button"
                            @click.stop="isSeeReactions = true"
                            v-if="reactionTypes.length - maxDisplayedReactions > 0"
                        >
                            {{ reactionTypes.length - maxDisplayedReactions }}
                        </button-base>
                    </transition-group>
                </div>

                <div class="Post_footer" @click="onClick">
                    <div class="Post_action" @click.stop>
                        <quick-menu
                            :modifiers="['right']"
                            :button="{ modifiers: ['s', 'xweak'] }"
                            :items="actions"
                        />
                    </div>
                    <div class="Post_action" @click.stop>
                        <button-base
                            icon-before="comments"
                            :modifiers="['s', 'xweak']"
                            :to="permaLink"
                            class="mr-3"
                            :text="replyCount ? replyCount : ''"
                        />

                        <button-base
                            icon-before="face-smile"
                            :modifiers="['s', 'round', isShowEmojis ? 'light' : 'xweak']"
                            @click="$smallerThan('s') ? $store.commit('page/popin', { emojis: { action: (v) => addReaction({ type: v, action: true }) } }) : {}"
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
                    :reactions="reactionTypes"
                    @close="isSeeReactions = false"
                    v-if="!isForbidden"
                />

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

            <div class="Post_comments" v-if="displayComments">
                <div class="fx-center mb-15">
                    <p class="ft-title-2xs">
                        <span class="round-s bg-bg-strong mr-3">{{ children.length }}</span> Commentaires
                    </p>

                    <div class="ft-xs-medium color-ft-weak">Les plus récents</div>
                </div>

                <content-comment-input @submit="onSubmit" class="Post_comment" placeholder="Ajouter un commentaire..." ref="commentInput" />

                <content-comment
                    v-for="post in displayedComments"
                    class="Post_comment" @submit="(v) => $emit('submit', v)" v-bind="post"
                    :parent-id="_id"
                    :is-parent="!isChild"
                    :slug="consteData ? consteData.slug : ''"
                    :key="post._id"
                    ref="comment"
                />

                <div class="text-center mv-20">
                    <button-base icon-before="arrow-down" :modifiers="['light']" class=" d-block n-mt-5 mb-10" @click="max += 3" v-if="displayedComments.length < children.length">Commentaires suivants</button-base>
                </div>
            </div>
        </div>
        <div v-else>
            <placeholder class="Post_placeholder" :ratio="$randomBetween(40, 60)" />
        </div>
    </div>
</template>

<script>
import PostMixin from '@/mixins/post'

export default {
    name: 'Post',
    mixins: [ PostMixin ],
    async fetch () {
        await this.$store.dispatch('user/softFetch', [
            this.owner,
            ...this.reactions.map(r => r.owner),
            ...this.children.reduce((all, c) => [ ...all, c.owner, ...c.reactions.map(r => r.owner)], [])
        ])

        this.isLoading = false
    },
    props: {
        _id: { type: String },
        content: { type: String },
        read: { type: String },
        images: { type: Array, default: () => [] },
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
        origin: { type: String },
        maxComments: { type: Number, default: 2 },
        noLink: { type: Boolean, default: false },
        isChild: { type: Boolean, default: false },
        displayComments: { type: Boolean, default: false },
    },
    data: () => ({
        isLoading: false,
        max: 2,
        isAdd: false,
        reacted: null,
        isOverflow: false,
        showAll: false,
        isShowEmojis: false
    }),
    mounted () {
        this.max = this.maxComments

        this.checkOverflow()
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
        reactionTypes () {
            console.log(this.$groupBy(this.reactions, 'type', { orderBy: true }))
            return this.$groupBy(this.reactions, 'type', { orderBy: true })
        },
        maxDisplayedReactions () {
            return this.$smallerThan('xs') ? 8 : 12
        },
        displayedComments () {
            let children = this.children ? [ ...this.children ] : []

            return children.sort((a, b) => this.$moment(b.createdAt).valueOf() - this.$moment(a.createdAt).valueOf()).slice(0, this.max)
        },
        gatheringData () {
            return this.gathering ? this.$store.getters['gathering/findOne']({ _id: this.gathering }) : null
        },
        parentData () {
            return this.origin ? this.$store.getters['status/findOne']({ _id: this.origin }) : null
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
        replyCount () {
            return this.children.length + this.children.reduce((total, c) => total += c.children.length, 0)
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
        },
        permaLink () {
            if (this.consteData) {
                return {
                    name: 'c-slug-post-postId',
                    params: { slug: this.consteData.slug, postId: this._id }
                }
            } else {
                return {
                    name: 'post-postId',
                    params: { postId: this._id }
                }
            }
        }
    },
    watch: {
        isLoading (v) {
            if (!v) this.$nextTick(() => this.checkOverflow())
        }
    },
    methods: {
        checkOverflow () {
            this.isOverflow = this.$refs.text ? (this.$refs.text.scrollHeight > this.$refs.text.offsetHeight) : false
        },
        reset () {
            this.$refs.commentInput.reset()

            this.$refs.comment.forEach(c => c.reset())
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
                origin: this._id,
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

                this.$router.push(this.localePath(this.permaLink))
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
        @include shadow-s;

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

    .Post_main {
        position: relative;
        background-color: color-opacity('bg', -65%);
    }

    .Post_block.Post_reactions {
        position: relative;
        z-index: 5;
        margin: 0;
        padding: 0 20% 0 15px;
        background-color: var(--color-bg-weak);

        &.is-reactions {
            padding-bottom: 20px;
        }
    }

    .Post_block.Post_gallery {
        padding-bottom: 0;

        // & + .Post_reactions.is-reactions {
        //     position: absolute;
        //     bottom: 6px;
        //     left: 3px;
        //     margin: 0;
        //     padding: 0;
        // }
        
        & + .Post_reactions.is-reactions {
            margin: -18px 0 0px 0;
            padding: 0 20% 0px 10px;
            background-color: transparent;
        }
    }

    .Post_text {
        font: var(--ft-m);
        padding: 0 20px;
        background-color: var(--color-bg-weak);
    }

    .Post_block {
        padding-bottom: 20px;
    }

    .Post_forbidden {
        padding: 25px;
        position: absolute;
        z-index: 15;
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
        background-color: var(--color-bg);
        background-color: color-opacity('bg', -65%);
        display: flex;
        justify-content: space-between;
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

        .Post {
            margin: 0 -20px;
            padding: 15px 15px 0;
            border-radius: 0;
        }

        .Post_placeholder.Placeholder {
            margin: 0 -20px;
            border-radius: 0;
        }

        .Post_forbidden {
            border-radius: 0;
        }

        .Post_comments {
            margin: 20px -15px 0;
            padding: 0 10px 10px;
            border: none;
        }

        .Post_footer {
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

        .Post_block.Post_reactions {
            padding: 0 10% 0 0;
            margin: 0 -5px;

            &.is-reactions {
                padding-bottom: 20px;
            }
        }

        .Post_block.Post_gallery {
            padding-bottom: 0;
            
            & + .Post_reactions.is-reactions {
                margin: -18px 0 0px -10px;
                padding: 0 10% 0px 0;
                background-color: transparent;
            }
        }

        .Post_head {
            padding-top: 0;
            padding-bottom: 20px;
            display: flex;
        }

        .Post_menu  {
            position: relative;
            top: auto;
            left: auto;
        }
    }

</style>