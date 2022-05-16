<template>
    <div class="Post" :class="{ 'is-current': isCurrent, 'is-reacted': isReacted }" v-if="owner.name && gatheringData">
        <div class="Post_head">
            <div class="d-flex fxa-center fx-grow">
                <nuxt-link class="Post_icon" :to="titleLink" :style="isCurrent ? {} : { backgroundImage: `url(${gatheringData.thumbnail})` }">
                    <user-icon class="Post_user" :modifiers="isCurrent ? ['s'] : ['xs']" v-bind="owner" />
                </nuxt-link>

                <div class="ml-10 ft-s line-1">
                    <nuxt-link :to="titleLink" class="ft-title-2xs subtitle">{{ title }}</nuxt-link>
                    <p class="ft-italic color-ft-weak mt-5">{{ subtitle }}</p>
                </div>
            </div>

            <quick-menu
                class="Post_menu"
                :items="[
                    { fa: 'trash', label: 'Supprimer', disabled: !isOwner, action: () => pendingDelete = true }
                ]"
            />
        </div>
        <div class="Post_main">
            <div class="Post_text" v-html="content"></div>
        </div>
        <div class="Post_footer">
            <div class="Post_action Post_action--react" @mouseenter="onReactionTooltip" @mouseleave="$tClose">
                <fa class="mr-3" :icon="`${isReacted ? 'fas' : 'far'} fa-heart`" @click="onReact" /> <link-base :invert="true" @click="isSeeReactions = true">{{ reactions.length ? reactions.length + ' réactions' : '' }}</link-base>
            </div>
            <div class="Post_action" @click="onAddComment">
                <fa class="mr-3" icon="far fa-comment-lines" /> <link-base :invert="true">{{ comments.length ? comments.length + ' commentaires' : '' }}</link-base>
            </div>
        </div>

        <popin-base :is-active="isSeeReactions" :modifiers="['xs']" @close="isSeeReactions = false">
            <template slot="content">
                <div class="p-30">
                    <p class="ft-title-xs mb-20">Réactions <span class="ml-5 round-s bg-bg">{{ reactions.length }}</span></p>
                    <div class="mt-10" v-for="reaction in reactionsOwners" :key="reaction._id"> 
                        <user-icon v-bind="reaction.owner" :display-name="true" />
                    </div>
                </div>
            </template>
        </popin-base>

        <transition name="fade">
            <div class="Post_comments" v-show="displayedComments.length > 0 || isAdd">
                <link-base :invert="true" icon-before="arrow-up" class="Post_comment color-ft-weak d-block n-mt-5 mb-20" @click="max += 3" v-if="displayedComments.length < comments.length">Commentaires précédents</link-base>
               
                <content-comment
                    v-for="post in displayedComments"
                    class="Post_comment"
                    @react="onReact"
                    v-bind="post"
                    :key="post._id"
                />

                <content-editor
                    @submit="onSubmit"
                    class="Post_comment"
                    :tiny="true"
                    placeholder="Ajouter un commentaire..."
                    @blur="() => comments.length == 0 ? isAdd = false : ''"
                    v-show="isAdd || comments.length > 0"
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

                    <button-base icon-before="trash" :modifiers="['light']" :loading="isLoading" @click="deletePost">
                        Oui, supprimer
                    </button-base>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Post',
    props: {
        _id: { type: String },
        content: { type: String },
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
        reacted: null,
        isLoading: false,
        isSeeReactions: false,
        localComments: [],
        reactionsOwners: null,
        pendingDelete: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        isOwner () { return this.owner._id == this.user._id },
        displayedComments () {
            return this.comments.slice(Math.max(0, this.comments.length - this.max), this.comments.length)
        },
        comments () {
            return [ ...this.children , ...this.localComments ]
        },
        isCurrent () {
            return this.activeGathering == this.gathering
        },
        gatheringData () {
            return this.$store.getters['gathering/findOne']({ _id: this.gathering })
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
                return this.localePath({ name: 'g-id', params: { id: this.gatheringData.id } })
            }
        },
        isReacted () {
            return (this.reacted !== null && this.reacted == true) || this.reactions.find(r => r.owner == this.user._id)
        },
        reactionTooltip () {
            let reaction = ''
            let owners = this.reactionsOwners ? this.reactionsOwners.filter(m => m.owner.name).map(m => m.owner.name) : []

            if (owners.length == 1) {
                reaction = owners[0] + ' a réagi.'
            } else if (owners.length > 1 && owners.length <= 3) {
                reaction = owners.slice(0, 3).join(', ') + ' ont réagi.'
            } else if (owners.length > 3) {
                reaction = owners.slice(0, 3).join(', ') + ` et ${owners.length - 3} autres ont réagi.`
            }

            return reaction
        }
    },
    methods: {
        reset () {
            this.$refs.commentInput.reset()
        },
        pushComment (v) {
            this.localComments = [ ...this.localComments, v ]
        },
        async deletePost () {
            this.isLoading = true

            try {
                const response = await this.$store.dispatch('status/delete', this._id)
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        },
        onAddComment () {
            if (this.disableCreate) return

            this.isAdd = true
            setTimeout(() => this.$refs.commentInput.focus(), 10)
        },
        async onReact (params) {
            this.reacted = !this.isReacted

            let response = await this.$store.dispatch('status/react', {
                _id: params.id ? params.id : this._id,
                type: '❤️',
                action: params.action ? params.action : this.reacted
            })

            this.reacted = null
        },
        async onReactionTooltip (e) {
            if (this.reactionsOwners && this.reactionTooltip == '') return

            this.$tLoad(e, { id: this._id })

            this.reactionsOwners = await this.$store.dispatch('user/mapUsers', {
                items: this.reactions, property: 'owner'
            })

            this.$tOpen(this.reactionTooltip, e, { id: this._id, load: false })
        },
        onSubmit (data) {
            if (this.disableCreate) return
            
            this.$emit('submit', {
                ...data,
                parent: this._id
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .Post {
        border-radius: 5px;
        background-color: var(--color-bg-strong);
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
        background-color: var(--color-bg);
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

</style>