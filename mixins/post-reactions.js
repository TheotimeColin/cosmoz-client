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

            if ((params.id || this._id) && !this.staticId) query._id = params.id ? params.id : this._id

            if (this.staticId) query.id = this.staticId

            await this.$store.dispatch('status/react', {
                ...query, type,
                action: this.reactionAction
            })

            this.isReactionLoading = false
        },
        isReacted (type = '') {
            if (!this.user) return false
            
            return this.reactions.find(r => r.type == type && r.owner == this.user._id) ? true : false
        }
    }
}