<template>
    <div>
        <div class="Post" :class="{ 'is-current': isCurrent, 'is-not-current': !isCurrent && gatheringData, 'is-no-link': noLink }" ref="container" >
            <ripples :auto="false" :size="300" :modifiers="['weak']" v-if="!noLink && !isForbidden" ref="ripples"  />

            <content-post-head
                v-bind="$props"
                @delete="pendingDelete = true"
            />

            <div class="Post_main" @click="onClick">
                <div class="Post_text Post_block" v-if="content">
                    {{ content }}
                </div>

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

            <content-post-footer
                v-bind="$props"
            />
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
        isAdd: false,
        showAll: false
    }),
    computed: {
        reactionTypes () {
            return this.$groupBy(this.reactions, 'type', { orderBy: true })
        },
        maxDisplayedReactions () {
            return this.$smallerThan('xs') ? 8 : 12
        },
        displayedComments () {
            let children = this.children ? [ ...this.children ] : []

            return children.sort((a, b) => this.$moment(b.createdAt).valueOf() - this.$moment(a.createdAt).valueOf()).slice(0, this.max)
        }
    },
    methods: {
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
    
</style>