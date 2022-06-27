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
        
        ownerData () {
            return this.$store.getters['user/findOne']({
                _id: this.owner
            })
        },
        isOwner () { return this.user && this.owner == this.user._id },
        isCurrent () { return (this.activeConstellation && this.activeConstellation == this.constellation) || (this.activeGathering && this.activeGathering == this.gathering) },
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
                { fa: 'copy', label: 'Copier le lien', action: () => this.$copy(this.$config.baseUrl + this.localePath({ name: 'post-postId', params: { postId: this._id }})) },
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
            let type = params.type ? params.type : '❤️'

            this.isReactionLoading = true
            this.reactionAction = params.action ? params.action : !this.isReacted(type)

            await this.$store.dispatch('status/react', {
                _id: params.id ? params.id : this._id, type,
                action: this.reactionAction
            })

            this.isReactionLoading = false
        },
        isReacted (type = '') {
            return this.reactions.find(r => r.type == type && r.owner == this.user._id) ? true : false
        }
    }
}