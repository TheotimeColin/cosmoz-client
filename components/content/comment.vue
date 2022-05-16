<template>
    <div class="Comment" :class="{ 'is-reacted': isReacted }">
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
                <div class="Comment_action" @mouseenter="onReactionTooltip" @mouseleave="$tClose">
                    <link-base :invert="true" @click="isSeeReactions = true">{{ reactions.length ? reactions.length + ' réactions' : '' }}</link-base>
                     
                    <fa class="ml-3" :icon="`${isReacted ? 'fas' : 'far'} fa-heart`" @click="onReact" />
                </div>
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
        isSeeReactions: false,
        reactionsOwners: null
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
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
    methods: {
        async onReact () {
            this.$emit('react', {
                id: this._id,
                action: !this.isReacted
            })
        },
        async onReactionTooltip (e) {
            this.$tLoad(e, { id: this._id })

            this.reactionsOwners = await this.$store.dispatch('user/mapUsers', {
                items: this.reactions, property: 'owner'
            })

            this.$tOpen(this.reactionTooltip, e, { id: this._id, load: false })
        }
    }
}
</script>

<style lang="scss" scoped>
    .Comment {
        display: flex;

        &.is-reacted {

            .Comment_action svg {
                color: var(--color-love);
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

    .Comment_text {
        font: var(--ft-m);
        margin-top: 10px;
    }

    .Comment_head {
        flex-shrink: 0;
        margin-right: 10px;
    }

    .Comment_actions {
        flex-shrink: 0;
    }

    .Comment_action {
        font: var(--ft-s);
        font-weight: bold;
        cursor: pointer;
        
        & + & {
            margin-left: 20px;
        }
    }
</style>