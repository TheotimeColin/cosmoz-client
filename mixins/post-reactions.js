export default {
    data: () => ({
        isReactionLoading: false,
        reactionAction: false
    }),
    computed: {
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
        }
    },
    methods: {
        async onReactionTooltip (e) {
            if (this.reactionTooltip == '') return

            this.$tOpen(this.reactionTooltip, e, { id: this._id })
        },
        async addReaction (params) {
            let type = params.type ? params.type : '❤️'

            this.isReactionLoading = true
            this.reactionAction = params.action ? params.action : !this.isReacted(type)

            let query = {}

            if (params.status) query.status = params.status
            if (params.id) query.id = params.id

            if (this.reactionAction) {
                await this.$store.dispatch('reaction/create', {
                    ...query, type
                })
            } else {
                await this.$store.dispatch('reaction/delete', {
                    ...query, type
                })
            }
            
            this.isReactionLoading = false
        },
        isReacted (type = '') {
            if (!this.user) return false
            
            return this.reactions.find(r => r.type == type && r.owner == this.user._id) ? true : false
        }
    }
}