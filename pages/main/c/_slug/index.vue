<template>
    <div class="d-flex Wrapper pv-40">
        <div class="fx-grow">
            <div v-if="upcomingEvents.length > 0">
                <div class="fx-center mb-20">
                    <h1 class="ft-title-s">Prochaine rencontre</h1>

                    <button-base :modifiers="['s']" :to="{ name: 'c-slug-events', params: { slug: constellation.slug } }">Voir tout</button-base>
                </div>
                <block-gathering
                    class="mb-20"
                    :status-only="true"
                    v-bind="upcomingEvents[0]"
                    :key="upcomingEvents[0]._id"
                />
            </div>

            <div class="pt-20 br-s bg-bg-weak mv-40" v-if="pastEvents.length > 0">
                <p class="ft-title-xs mb-20 ph-20">
                    <span class="round-s bg-bg-xstrong mr-5">{{ pastEvents.length }}</span> Rencontres passés
                </p>

                <slider-block
                    :slots="pastEvents.map(g => g._id)"
                    :ratio="100"
                    item-class="width-2xs"
                    :offset="$smallerThan('xs') ? 15 : 20"
                    :offset-v="20"
                >
                    <div v-for="gathering in pastEvents" :slot="gathering._id" :key="gathering._id">
                        <block-gathering
                            :modifiers="['square']"
                            :status-only="true"
                            v-bind="gathering"
                        />
                    </div>
                </slider-block>
            </div>
        </div>
        <div class="width-xs ml-40 fx-no-shrink d-none@s">

        </div>
    </div>
</template>

<script>
export default {
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: { constellation: this.constellation._id, status: 'active' }
        })
    },
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gatherings () {
            return this.$store.getters['gathering/find']({
                status: 'active',
                constellation: { '$id': this.constellation._id }
            })
        },
        isFollowed () {
            return this.user ? this.user.followed.includes(this.constellation._id) : false
        },
        pastEvents () {
            return this.gatherings.filter(g => g.isPast)
        },
        upcomingEvents () {
            return this.gatherings.filter(g => !g.isPast)
        }
    },
    head () {
        this.$emit('page', { subtitle: this.constellation.name, fa: '' })

        let meta = {
            title: `${this.constellation.name} organise ses événements sur Cosmoz ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>