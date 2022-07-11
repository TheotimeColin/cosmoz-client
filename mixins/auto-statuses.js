export default {
    computed: {
        $gathering () {
            if (!this.gathering) return null

            return this.$store.getters['gathering/findOne']({
                _id: this.gathering
            })
        },
        $autoStatuses () {
            let total = []

            if (this.$gathering) total = [ ...total, ...this.$gatheringStatuses ]

            return total
        },
        $gatheringStatuses () {
            let statuses = []

            if (!this.$gathering) return statuses

            statuses = [ ...statuses,  {
                _id: `gathering-created-${this.$gathering._id}`,
                type: 'status',
                title: this.$gathering.title,
                subtitle: `On espère que tu as hâte de participer !`,
                createdAt: this.$moment(this.$gathering.createdAt),
                actions: this.$gathering.isPast ? [] : [
                    {
                        text: 'Poser une question',
                        modifiers: ['s'],
                        iconBefore: 'comments-question',
                        on: {
                            click: () => {
                                this.openEditor()
                            }
                        }
                    }, { 
                        text: 'Je participe !',
                        modifiers: ['light'],
                        iconBefore: 'arrow-right',
                        on: {
                            click: () => {
                                if (this.$refs.manage) this.$refs.manage.openFull()
                            }
                        }
                    }
                ]
            } ]

            statuses = [ ...statuses,  {
                _id: `gathering-soon-${this.$gathering._id}`,
                type: 'status',
                title: `L'événement commence bientôt 😱`,
                subtitle: `Tu as hâte ? N'oublie pas de te désinscrire si tu as un empêchement !`,
                enableReactions: true,
                createdAt: this.$moment(this.$gathering.date).subtract(1, 'days'),
                actions: this.$gathering.isPast ? [] : [
                    {
                        text: 'Se désinscrire',
                        modifiers: ['xs', 'weak'],
                        on: {
                            click: () => {
                                if (this.$refs.manage) this.$refs.manage.openFull()
                            }
                        }
                    }
                ]
            } ]

            statuses = [ ...statuses,  {
                _id: 'step-start',
                type: 'step',
                title: `Début de l'événement`,
                createdAt: this.$moment(this.$gathering.date),
            } ]

            statuses = [ ...statuses,  {
                _id: `gathering-during-${this.$gathering._id}`,
                type: 'status',
                title: `L'événement bat son plein 🔥`,
                createdAt: this.$moment(this.$gathering.date).add(1, 'seconds'),
                actions: [
                    {
                        text: 'Poster des photos',
                        modifiers: ['cosmoz'],
                        iconBefore: 'images',
                        on: {
                            click: () => {
                                this.openEditor()
                            }
                        }
                    }
                ]
            } ]

            statuses = [ ...statuses,  {
                _id: 'step-end',
                type: 'step',
                title: `Fin de l'événement`,
                createdAt: this.$moment(this.$gathering.date).add(3, 'hours').subtract(1, 'second'),
            } ]

            statuses = [ ...statuses,  {
                _id: `gathering-end-${this.$gathering._id}`,
                type: 'status',
                title: `Tout les bonnes choses ont une fin...`,
                subtitle: `Merci d'avoir participé à l'événement. Prends un moment pour remercier les organisateurs !`,
                enableReactions: true,
                createdAt: this.$moment(this.$gathering.date).add(3, 'hours'),
                actions: [
                    {
                        text: 'Poster un message',
                        modifiers: ['light'],
                        iconBefore: 'heart',
                        on: {
                            click: () => {
                                if (this.$refs.feed) this.$refs.feed.openEditor()
                            }
                        }
                    }
                ]
            } ]

            return statuses
        }
    }
}