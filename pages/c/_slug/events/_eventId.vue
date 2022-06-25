<template>
    <div class="Page page pb-150">
        <template v-if="!isLoading && gathering">
            <div class="bg-cover-50 bg-bg-xstrong bg-cover-100@xs" :style="{ '--background': `url(${gathering.hero})` }">
                <div class="Wrapper Wrapper--xs text-center pv-60 ratio-25@xs">
                    <h1 class="ft-title-m d-none@xs">{{ gathering.title }}</h1>
                </div>
            </div>
            <div class="Wrapper Wrapper--xs n-mt-20 p-relative n-mt-0@xs">
                <page-gathering-manage :gathering="gathering" />
            
                <content-feed
                    class="mt-20 mt-10@xs"
                    read="user"
                    :max="3"
                    :gathering="gathering._id"
                    v-if="user"
                />
            </div>
        </template>
        <template v-else-if="isLoading">
            <app-banner class="bg-bg-xstrong">
                <placeholder :ratio="10" />
                <placeholder class="mt-10" :ratio="10" />
                <placeholder class="mt-20" :ratio="5" />
            </app-banner>

            <div class="Wrapper n-mt-20">
                <placeholder class="mt-10 bg-bg" :ratio="30" />
                <placeholder class="mt-10 bg-bg" :ratio="30" />
                <placeholder class="mt-10 bg-bg" :ratio="50" />
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
export default {
    name: 'GatheringPage',
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

        let result = this.$store.getters['gathering/findOne']({
            id: this.$route.params.eventId,
            status: 'active'
        })

        if (!result) {
            await this.$store.dispatch('gathering/get', { query: { id: this.$route.params.eventId, status: 'active' }})
        }

        this.isLoading = false 
    },
    data: () => ({
        isLoading: false,
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gathering () {
            return this.$store.getters['gathering/findOne']({
                id: this.$route.params.eventId,
                status: 'active'
            })
        },
        constellation () {
            return this.$store.getters['constellation/findOne']({
                _id: this.gathering.constellation
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
        if (!this.gathering || !this.constellation) return {}

        let meta = {
            meta: [
                { hid: 'description', name: 'description', content: this.gathering.intro },
                { property: 'og:title', content: `${this.gathering.title} organisé par ${this.constellation ? this.constellation.name : ''} ${this.$t('meta.append')}` },
                { property: 'og:url', content: this.$config.baseUrl + '/c/' + (this.constellation.slug) + '/events/' + this.gathering.id },
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
