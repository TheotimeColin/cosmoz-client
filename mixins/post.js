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
        isForbidden () {
            return !this.user || this.forbidden.includes('content')
        },
        actions () {
            return [
                { fa: 'heart', label: 'Voir les réactions', disabled: !this.reactions.length, action: () => this.isSeeReactions = true },
                { fa: 'copy', label: 'Copier le lien', action: () => this.$copy(this.$config.baseUrl + this.permaLink) },
                { fa: 'trash', label: 'Supprimer', disabled: !this.isOwner, action: () => this.$emit('delete') }
            ]
        },
        gatheringData () {
            return this.gathering ? this.$store.getters['gathering/findOne']({ _id: this.gathering }) : null
        },
        parentData () {
            return this.origin ? this.$store.getters['status/findOne']({ _id: this.origin }) : null
        },
        consteData () {
            return this.constellation || this.gatheringData?.constellation ? this.$store.getters['constellation/findOne']({ _id: (this.gatheringData?.constellation || this.constellation) }) : null
        },
        permaLink () {
            if (this.consteData) {
                return {
                    name: 'c-slug-post-postId',
                    params: { slug: this.consteData.slug, postId: this._id }
                }
            } else {
                return {
                    name: 'post-postId',
                    params: { postId: this._id }
                }
            }
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
            if (!this.user) return false
            
            return this.reactions.find(r => r.type == type && r.owner == this.user._id) ? true : false
        }
    }
}