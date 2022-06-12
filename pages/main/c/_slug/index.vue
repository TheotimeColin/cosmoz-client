<template>
    <div class="Page_wrapper d-flex Wrapper d-block@s">
        <div class="fx-grow">
            <div class="block mb-40 o-hidden" v-if="constellation.description">
                <h1 class="ft-title-xs mb-15">
                    À propos du groupe
                </h1>

                <div class="TextBody" :class="{ 'ellipsis-2': !showFull }"  v-html="constellation.description"></div>

                <link-base class="mt-20" @click="showFull = true" v-show="!showFull">En savoir plus</link-base>
            </div>

            <div v-if="upcomingEvents.length > 0">
                <div class="fx-center mb-20">
                    <h2 class="ft-title-s">
                        <span class="round bg-bg-strong mr-5">{{ upcomingEvents.length }}</span> Prochaines rencontres
                    </h2>

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

        <div class="width-s ml-30 fx-no-shrink ml-0@s width-100@s">
            <div class="block-r p-15" v-if="users.length > 5">
                <div class="fx-center">
                    <h2 class="ft-title-2xs">
                        <span class="round-s bg-bg-strong mr-10">{{ users.filter(u => !admins.includes(u)).length }}</span>Membres
                    </h2>

                    <link-base :to="{ name: 'c-slug-members', params: { slug: constellation.slug }}">Voir tout</link-base>
                </div>

                <div class="n-mh-3 mt-10">
                    <div class="p-3 d-inline-block" v-for="user in users.filter(u => !admins.includes(u))" :key="user._id">
                        <user-icon v-bind="user" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: { constellation: this.constellation._id, status: 'active' }
        })

        await this.$store.dispatch('user/softFetch', this.constellation.members)
    },
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false,
        showFull: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        admins () {
            return this.$store.getters['user/find']({
                _id: { $in: [ ...this.constellation.admins, ...this.constellation.organizers ] }
            })
        },
        users () {
            return this.$store.getters['user/find']({
                _id: { $in: this.constellation.members }
            })
        },
        gatherings () {
            return this.$store.getters['gathering/find']({
                status: 'active',
                constellation: this.constellation._id
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
        this.$store.commit('page/set', { subtitle: this.constellation.name, fa: '' })
        
        this.$emit('page', { subtitle: this.constellation.name, fa: '' })

        let meta = {
            title: `${this.constellation.name} organise ses événements sur Cosmoz ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>