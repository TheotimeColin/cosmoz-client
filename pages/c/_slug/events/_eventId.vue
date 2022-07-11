<template>
    <div class="">
        <template v-if="!isLoading && gathering">
            <div class="bg-admin-weak p-10 text-right" v-if="$isConsteOrga">
                <button-base @click="isManage = true" :modifiers="['s']">
                    Gérer les participants
                </button-base>

                <button-base icon-before="pen" :modifiers="['light', 's']" @click="$store.commit('page/popin', { eventCreate: gathering.id })">
                    Modifier
                </button-base>

                <page-gathering-manage-users :is-active="isManage" :gathering="gathering" @close="isManage = false" />
            </div>

            <div class="bg-cover-25 bg-cover-blur bg-bg-xstrong pv-100 d-none@xs" :style="{ '--background': `url(${gathering.hero})` }"></div>

            <div class="Wrapper Wrapper--s n-mt-150 p-relative n-mt0@xs">
                <page-gathering-manage
                    :gathering="gathering"
                    ref="manage"
                />
            </div>

            <div class="Wrapper Wrapper--xs p-relative">
                <div class="mv-40" v-if="(gathering.description && gathering.description !== '<p></p>') || (gathering.important && gathering.important !== '<p></p>')">
                    <div class="+mt-40">
                        <p class="ft-title-s mb-15">Détails</p>
                        <text-body
                            :modifiers="['gathering']"
                            :value="gathering.description"
                            :truncate="100"
                        />
                    </div>

                    <div class="+mt-40" v-if="gathering.important && gathering.important !== '<p></p>'">
                        <p class="ft-title-xs tape mb-15 ph-15">Important</p>
                        <text-body
                            :modifiers="['gathering']"
                            :value="gathering.important"
                            :truncate="220"
                        />
                    </div>
                </div>
                
                <div class="mt-40 mt-10@xs">
                    <p class="ft-title-s mb-20">Fil d'actualité</p>

                    <content-feed
                        class=""
                        read="public"
                        :max="8"
                        :gathering="gathering._id"
                        ref="feed"
                    />
                </div>
            </div>
        </template>
        <template v-else-if="isLoading">
            <placeholder :ratio="15" />

            <div class="Wrapper Wrapper--xs">
                <placeholder class="mt-15" :ratio="40" />
                <placeholder class="mt-15" :ratio="10" />

                <placeholder class="mt-15 bg-bg" :ratio="30" />
                <placeholder class="mt-15 bg-bg" :ratio="30" />
                <placeholder class="mt-15 bg-bg" :ratio="50" />
            </div>
        </template>
        <template v-else-if="!isLoading && !gathering">
            <div class="Wrapper">
                <div class="p-20 mv-20 bg-bg-strong text-center">Cet événement n'existe pas (ou plus).</div>
            </div>
        </template>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'

export default {
    name: 'GatheringPage',
    mixins: [ ConstellationMixin ],
    layout: 'app',
    transition (to, from) {
        if (to.name.includes('eventId')) {
            return { name: 'slide-in', mode: 'in-out' }
        } else if (from) {
            return { name: 'slide-out', mode: 'in-out' }
        }
    },
    async fetch () {
        this.isLoading = true

        await this.$preFetch()

        let result = this.$store.getters['gathering/findOne']({
            id: this.$route.params.eventId,
            status: 'active'
        })

        if (!result) {
            await this.$store.dispatch('gathering/get', { query: { id: this.$route.params.eventId, status: 'active' }})
        }

        if (this.gathering) {
            await this.$store.dispatch('user/softFetch', this.gathering.users.map(u => u._id))

            if (this.user && this.gathering.isPast) {
                await this.$store.dispatch('mention/fetch', { query: {
                    target: this.user._id,
                    gathering: this.gathering._id
                }})
            }

            await this.$store.dispatch('reaction/fetch', {
                query: { id: { '$includes': this.gathering._id } }
            })
        }

        this.isLoading = false 
    },
    data: () => ({
        isLoading: false,
    }),
    computed: {
        gathering () {
            return this.$store.getters['gathering/findOne']({
                id: this.$route.params.eventId,
                status: 'active'
            })
        },
        isOrga () {
            return this.user && this.user.role == 'admin'
        },
        hasBooked () {
            return this.gathering.users.find(s => s.status == 'confirmed' && s._id == this.user._id)
        }
    },
    head () {
        if (!this.gathering || !this.$constellation) return {}

        let meta = {
            meta: [
                { hid: 'description', name: 'description', content: this.gathering.intro },
                { property: 'og:title', content: `${this.gathering.title} organisé par ${this.$constellation ? this.$constellation.name : ''} ${this.$t('meta.append')}` },
                { property: 'og:url', content: this.$config.baseUrl + '/c/' + (this.$constellation.slug) + '/events/' + this.gathering.id },
                { property: 'og:image', content: this.gathering.hero },
                { property: 'og:description', content: this.gathering.intro },
                { property: 'og:site_name', content: 'Cosmoz, rencontres hors-ligne.' },
                { property: 'twitter:card', content: 'summary_large_image' },
            ]
        }

        return meta
    }
}
</script>

<style lang="scss" scoped>
    .Page {
        background-color: var(--color-bg);
    }
</style>
