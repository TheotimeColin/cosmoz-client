export default {
    data: () => ({
        isDeleted: false,
        isDeleteLoading: false,
        isSeeReactions: false,
        reactionsOwners: null,
        pendingDelete: false
    }),
    watch: {
        isSeeReactions (v) {
            if (v) this.fetchOwners()
        }  
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
        isOwner () { return this.owner._id == this.user._id },
        isCurrent () { return this.activeGathering == this.gathering },
        isReacted () { return this.reactions.find(r => r.owner == this.user._id) },
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
            let response = await this.$store.dispatch('status/react', {
                _id: params.id ? params.id : this._id,
                type: '❤️',
                action: params.action ? params.action : !this.isReacted
            })
        },
    }
}