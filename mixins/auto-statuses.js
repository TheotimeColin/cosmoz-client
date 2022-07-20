export default {
    computed: {
        $constellation () {
            if (!this.constellation && !this.$gathering.constellation) return null

            return this.$store.getters['constellation/findOne']({
                _id: this.constellation || this.$gathering.constellation
            })
        },
        $gathering () {
            if (!this.gathering) return null

            return this.$store.getters['gathering/findOne']({
                _id: this.gathering
            })
        },
        $events () {
            if (!this.user) return []

            return this.$store.getters['gathering/find']({
                constellation: this.constellation ? this.constellation : { $in: this.user.constellations }
            })
        },
        $autoStatuses () {
            let total = []
            
            if (this.$gathering) total = [ ...total, ...this.$gatheringStatuses ]
            if (!this.$gathering) total = [ ...total, ...this.$eventFeed ]

            return total
        },
        $eventFeed () {
            let statuses = []

            return this.$events.map(event => ({
                ...event,
                blockType: event.isPast ? 'gathering-end' : 'gathering-created',
                createdAt: event.isPast ? event.date : event.createdAt
            }))
        },
        $gatheringStatuses () {
            let statuses = []

            if (!this.$gathering) return statuses

            statuses = [ ...statuses,  {
                _id: `gathering-created-${this.$gathering._id}`,
                blockType: 'status',
                title: this.$gathering.title,
                subtitle: `On espère que tu as hâte de participer !`,
                createdAt: this.$moment(this.$gathering.createdAt),
                actions: this.$gathering.isPast ? [] : [
                    {
                        text: 'Poser une question',
                        modifiers: ['s'],
                        iconBefore: 'comments-question',
                        isHidden: this.$gathering.isAttending || (this.$constellation && !this.$constellation.isMember),
                        on: {
                            click: () => {
                                this.$store.commit('page/popin', { editor: {
                                    gathering: this.gathering
                                } })
                            }
                        }
                    }, { 
                        text: 'Je participe !',
                        modifiers: ['light'],
                        iconBefore: 'arrow-right',
                        isHidden: this.$gathering.isAttending || (this.$constellation && !this.$constellation.isMember),
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
                blockType: 'status',
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
                blockType: 'step',
                title: `Début de l'événement`,
                createdAt: this.$moment(this.$gathering.date),
            } ]

            statuses = [ ...statuses,  {
                _id: `gathering-during-${this.$gathering._id}`,
                blockType: 'status',
                title: `L'événement bat son plein 🔥`,
                createdAt: this.$moment(this.$gathering.date).add(1, 'seconds'),
                actions: [
                    {
                        text: 'Poster des photos',
                        modifiers: ['cosmoz'],
                        iconBefore: 'images',
                        on: {
                            click: () => {
                                this.$store.commit('page/popin', { editor: {
                                    gathering: this.gathering
                                } })
                            }
                        }
                    }
                ]
            } ]

            statuses = [ ...statuses,  {
                _id: 'step-end',
                blockType: 'step',
                title: `Fin de l'événement`,
                createdAt: this.$moment(this.$gathering.date).add(3, 'hours').subtract(1, 'second'),
            } ]

            statuses = [ ...statuses,  {
                _id: `gathering-end-${this.$gathering._id}`,
                blockType: 'status',
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
                                this.$store.commit('page/popin', { editor: {
                                    gathering: this.gathering
                                } })
                            }
                        }
                    }
                ]
            } ]

            return statuses
        }
    }
}