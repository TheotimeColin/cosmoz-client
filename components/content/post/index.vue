<template>
    <div>
        <div v-if="!isLoading && ownerData">
            <div class="Post" :class="{ 'is-current': isCurrent, 'is-not-current': !isCurrent && gatheringData, 'is-no-link': noLink, 'is-forbidden': isForbidden }" ref="container" >
                <ripples :auto="false" :size="300" :modifiers="['weak']" v-if="!noLink && !isForbidden" ref="ripples"  />

                <content-post-head
                    v-bind="$props"
                    @seeReactions="isSeeReactions = true"
                    @delete="pendingDelete = true"
                />

                <div class="Post_main">
                    <content-type-images class="Post_block Post_gallery" :images="images" v-if="images && images.length > 0" />


                    <div class="Post_text Post_block" v-if="parsedContent">
                        <div :class="{ 'ellipsis-4': !showAll }" v-html="$options.filters.specials(parsedContent)" ref="text"></div>

                        <link-base class="mt-20" v-if="isOverflow && !showAll" @click.native.stop="showAll = true">Voir plus</link-base>
                    </div>

                    <div class="Post_text Post_block" v-if="isForbidden">
                        {{ placeholderText }}
                    </div>

                    <div class="Post_tags Post_block" v-if="tags.length > 0 && consteData">
                        <!-- <button-base
                            :modifiers="['2xs']"
                            class="m-3"
                            icon-before="hashtag"
                            v-for="tag in tags"
                            :text="tag"
                            @click.stop="() => $router.push(localePath({ name: 'c-slug-discussions-tag-tagId', params: { slug: consteData.slug, tagId: tag } }))"
                            :key="tag"
                        /> -->
                        
                        <span
                            class="Post_tag ft-s-medium color-ft-weak m-3"
                            icon-before="hashtag"
                            v-for="tag in tags"
                            :text="tag"
                            @click.stop="() => $router.push(localePath({ name: 'c-slug-discussions-tag-tagId', params: { slug: consteData.slug, tagId: tag } }))"
                            :key="tag"
                        >
                            #{{ tag }}
                        </span>
                    </div>
                    <content-type-embed class="Post_block Post_embed" v-bind="embed" v-if="embed && embed.title && embed.href" />

                    <content-reactions
                        class="Post_block Post_reactions"
                        :class="{ 'is-reactions': reactions.length > 0 }"
                        v-bind="$props"
                        @seeReactions="isSeeReactions = true"
                        id="" :status="$props._id"
                        v-if="reactions.length > 0"
                    />
                </div>

                <content-post-footer
                    v-bind="$props"
                />

                <content-post-forbidden v-bind="$props" />

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

            <content-reaction-popin
                :is-active="isSeeReactions"
                :reactions="reactionTypes"
                @close="isSeeReactions = false"
                v-if="!isForbidden"
            />
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
        embed: { type: [Object, Boolean], default: false },
        images: { type: Array, default: () => [] },
        owner: { type: String },
        reactions: { type: Array, default: () => [] },
        children: { type: Array, default: () => [] },
        forbidden: { type: Array, default: () => [] },
        tags: { type: Array, default: () => [] },
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
        isSeeReactions: false,
        isLoading: false,
        isAdd: false,
        isOverflow: false,
        showAll: false
    }),
    mounted () {
        this.checkOverflow()
    },
    computed: {
        parsedContent () {
            
            return this.content
        },
        reactionTypes () {
            return this.$groupBy(this.reactions, 'type', { orderBy: true })
        },
        maxDisplayedReactions () {
            return this.$smallerThan('xs') ? 8 : 12
        },
        displayedComments () {
            let children = this.children ? [ ...this.children ] : []

            return children.sort((a, b) => this.$moment(b.createdAt).valueOf() - this.$moment(a.createdAt).valueOf()).slice(0, this.max)
        },
        placeholderText () {
            return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tempor nec justo ac pellentesque. Hé non, ce contenu est vraiment caché, petit malin ! Vestibulum euismod, sapien ultrices blandit scelerisque, risus diam lacinia nisi, id lobortis urna erat a nulla. Curabitur vel cursus risus.`.slice(this.$randomBetween(0, 20), this.$randomBetween(20, 230))
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

<style lang="scss">
    .Post {
        border-radius: 10px;
        background-color: var(--color-bg-weak);
        position: relative;
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
    }

    .Post_block.Post_reactions {
        position: relative;
        z-index: 5;
        margin: 0;
        padding: 0 20% 0 15px;
        background-color: var(--color-bg-weak);
        margin-top: 20px;
    }

    .Post_text {
        font: var(--ft-m);
        padding: 0 20px;

        a {
            text-decoration: underline;

            &:hover {
                text-decoration: none;
            }
        }
    }

    .Post_tags {
        padding: 0 15px;
    }

    .Post_embed {
        margin-left: 20px;
        margin-right: 20px;
    }

    .Post_tag {

        &:hover {
            color: var(--color-ft-light);
            text-decoration: underline;
        }
    }

    .Post_block {
        margin-top: 20px;

        &:first-child {
            margin-top: 0;
        }
    }

    .Post_text + .Post_tags {
        margin-top: 5px;
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

        .Post_comments {
            margin: 20px -15px 0;
            padding: 0 10px 10px;
            border: none;
        }

        .Post_gallery {
            margin-left: -15px;
            margin-right: -15px;
        }

        .Post_text {
            padding-left: 0;
            padding-right: 0;
        }

        .Post_embed {
            margin-left: 0;
            margin-right: 0;
        }

        .Post_tags {
            padding-left: 0;
            padding-right: 0;
            margin-left: -5px;
            margin-right: -5px;
        }

        .Post_block.Post_reactions {
            padding: 0 10% 0 0;
            margin: 15px -5px 0;
        }
    }

</style>