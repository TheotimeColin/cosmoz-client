<template>
    <div class="Comment" :class="{ 'is-reacted': isReacted }" v-if="!isDeleted">
        <div class="Comment_head">
            <user-icon class="fx-no-shrink" :modifiers="['s']" v-bind="owner" />
        </div>
        <div class="Comment_main">
            <div class="fx-grow">
                <div class="ft-s line-1">
                    <span class="subtitle">{{ owner.name }}</span>
                    <span class="ft-xs line-1 ft-italic color-ft-weak ml-5">{{ $moment(createdAt).fromNow() }}</span>
                </div>

                <div class="Comment_text" v-html="content"></div>
            </div>
            
            <div class="Comment_actions">
                <button-base :modifiers="['xs', 'weak']" @mouseenter.native="onReactionTooltip" @mouseleave.native="$tClose" @click="onReact">
                    <fa :icon="`${isReacted ? 'fas' : 'far'} fa-heart`"  />

                    <span class="ml-3" v-if="reactions.length > 0">{{ reactions.length }}</span>
                </button-base>

                <quick-menu
                    :items="[
                        { fa: 'heart', label: 'Voir les réactions', disabled: !reactions.length, action: () => isSeeReactions = true },
                        { fa: 'trash', label: 'Supprimer', disabled: !isOwner, action: () => pendingDelete = true }
                    ]"
                />
            </div>
        </div>
        <div class="Comment_delete" v-show="pendingDelete">
            <button-base :modifiers="['s']" class="mr-5" @click="pendingDelete = false">
                Annuler
            </button-base>

            <button-base icon-before="trash" :modifiers="['light', 's']" :loading="isLoading" @click="deleteComment">
                Supprimer mon commentaire
            </button-base>
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
    </div>
</template>

<script>
export default {
    name: 'Comment',
    props: {
        _id: { type: String },
        content: { type: String },
        owner: { type: Object },
        reactions: { type: Array, default: () => [] },
        createdAt: { type: [String, Date] }
    },
    data: () => ({
        isLoading: false,
        isSeeReactions: false,
        reactionsOwners: null,
        pendingDelete: false,
        isDeleted: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        isOwner () { return this.owner._id == this.user._id },
        isReacted () {
            return this.reactions.find(r => r.owner == this.user._id)
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
    watch: {
        isSeeReactions (v) {
            if (v) this.fetchOwners()
        }  
    },
    methods: {
        async deleteComment () {
            this.isLoading = true

            try {
                const response = await this.$store.dispatch('status/delete', this._id)

                this.isDeleted = true
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        },
        async onReact () {
            this.$emit('react', {
                id: this._id,
                action: !this.isReacted
            })
        },
        async onReactionTooltip (e) {
            if (this.reactionsOwners && this.reactionTooltip == '') return

            this.$tLoad(e, { id: this._id })

            await this.fetchOwners()

            this.$tOpen(this.reactionTooltip, e, { id: this._id, load: false })
        },
        async fetchOwners () {
            return new Promise(async (resolve) => {
                this.reactionsOwners = await this.$store.dispatch('user/mapUsers', {
                    items: this.reactions, property: 'owner'
                })
                
                resolve(this.reactionsOwners)
            })
        }
    }
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
        display: flex;
        padding: 10px;
        background: var(--color-bg);
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
        background-color: rgba(0, 0, 0, 0.75);
    }

    .Comment_text {
        font: var(--ft-m);
        margin-top: 10px;
    }

    .Comment_head {
        flex-shrink: 0;
        margin-right: 10px;
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
</style>