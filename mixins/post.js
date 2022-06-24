export default {
    data: () => ({
        isDeleted: false,
        isDeleteLoading: false,
        isSeeReactions: false,
        pendingDelete: false,
        isReactionLoading: false,
        reactionAction: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        ownerData () {
            return this.$store.getters['user/findOne']({
                _id: this.owner
            })
        },
        isOwner () { return this.user && this.owner == this.user._id },
        isCurrent () { return (this.activeConstellation && this.activeConstellation == this.constellation) || (this.activeGathering && this.activeGathering == this.gathering) },
        isReacted () {
            return this.isReactionLoading ? this.reactionAction : this.user && this.reactions.find(r => r.owner == this.user._id)
        },
        reactionsOwners () {
            return this.$store.getters['user/find']({
                _id: { $in: this.reactions.map(r => r.owner) }
            })
        },
        reactionTooltip () {
            let owners = this.reactionsOwners.map(m => m.name)

            if (owners.length == 1) {
                return owners[0] + ' a réagi.'
            } else if (owners.length > 1) {
                return this.$pluralize(owners) + ' ont réagi.'
            }

            return ''
        },
        actions () {
            return [
                { fa: 'heart', label: 'Voir les réactions', disabled: !this.reactions.length, action: () => this.isSeeReactions = true },
                { fa: 'trash', label: 'Supprimer', disabled: !this.isOwner, action: () => this.pendingDelete = true }
            ]
        }
    },
    methods: {
        async onReactionTooltip (e) {
            if (this.reactionTooltip == '') return

            this.$tOpen(this.reactionTooltip, e, { id: this._id })
        },
        async deletePost () {
            this.isDeleteLoading = true

            try {
                const response = await this.$store.dispatch('status/delete', this._id)

                this.isDeleted = true
            } catch (e) {
                console.error(e)
            }
            
            this.isDeleteLoading = false
        },
        async addReaction (params) {
            this.isReactionLoading = true
            this.reactionAction = params.action ? params.action : !this.isReacted

            let response = await this.$store.dispatch('status/react', {
                _id: params.id ? params.id : this._id,
                type: '❤️',
                action: this.reactionAction
            })

            this.isReactionLoading = false
        },
    }
}