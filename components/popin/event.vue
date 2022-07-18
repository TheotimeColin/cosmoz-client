<template>
    <popin :is-active="eventId ? true : false" :modifiers="['m']" @close="onClose">
        <template slot="content" slot-scope="{ isPopinVisible }">
            <div v-show="!isPopinVisible">
                <placeholder :ratio="35" />

                <div class="p-20">
                    <placeholder class="+mt-10" :ratio="5" />
                    <placeholder class="+mt-10" :ratio="12" />
                    <placeholder class="+mt-10" :ratio="25" />
                    <placeholder class="+mt-10" :ratio="15" />
                </div>
            </div>
            <div v-show="isPopinVisible" v-if="gathering">
                <div class="bg-cover-100 ratio-35 ratio-35@xs fx-no-shrink" :style="{ '--background': `url(${gathering.hero})` }"></div>

                <nav-bar class="pv-10 bg-bg-weak" style="position: sticky; top: 0; z-index: 20" :ph="10" v-model="type" :items="[
                    { id: 'index', label: `Détails` },
                    { id: 'feed', label: `Fil d'actualité` },
                    { id: 'settings', label: `Paramètres`, disabled: !user || !(user && (gathering.owner == user._id || $isConsteOrga)) }
                ]" />
                
                <div class="p-20">
                    <template v-if="type == 'index'">
                        <page-gathering-manage
                            class="+mt-30"
                            :gathering="gathering"
                            isMin
                        />
                        
                        <div class="+mt-30 block-r">
                            <text-body
                                :modifiers="['gathering']"
                                :value="gathering.description"
                                :truncate="100"
                            />

                            <div class="mt-20" v-if="gathering.important && gathering.important !== '<p></p>'">
                                <p class="ft-title-2xs tape mb-15 ph-15">Important</p>
                                <text-body
                                    :modifiers="['gathering']"
                                    :value="gathering.important"
                                    :truncate="220"
                                />
                            </div>
                        </div>
                    </template>

                    <content-feed
                        read="public"
                        :max="8"
                        :is-loading="isFeedLoading"
                        :gathering="gathering._id"
                        :disable-create="!user"
                        v-else-if="type == 'feed'"
                        ref="feed"
                    />

                    <template v-else-if="type == 'settings'">
                        <button-base icon-before="pen" :modifiers="['light']" @click="$store.commit('page/popin', { eventCreate: gathering.id, reset: true })">
                            Modifier l'événement
                        </button-base>
                    </template>
                </div>
            </div>
        </template>
        <template slot="footer">
            <div class="p-15 text-right fx-grow" v-if="gathering && !gathering.isPast">
                <page-gathering-action-button :gathering="gathering" />
            </div>
        </template>
    </popin>
</template>

<script>
import PermissionsMixin from '@/mixins/permissions'

export default {
    name: 'EventPopin',
    mixins: [ PermissionsMixin ],
    data: () => ({
        type: 'index',
        isFeedLoading: false
    }),
    computed: {
        eventId () {
            return this.$store.state.page.popins.event
        },
        gathering () {
            if (!this.eventId) return null

            return this.$store.getters['gathering/findOne']({ id: this.eventId })
        }
    },
    watch: {
        type (v) {
            if (v == 'feed') {
                this.isFeedLoading = true
                setTimeout(() => this.isFeedLoading = false, 500)
            } else {
                this.isFeedLoading = false
            }
        },
        ['$route.query.eventId']: {
            immediate: true,
            handler (v) {
                if (v && v != this.eventId) {
                    this.$store.commit('page/popin', { event: v })
                } else if (!v && this.eventId) {
                    this.$store.commit('page/popin', { event: null })
                }
            }
        },
        eventId (v) {
            if (v) {
                this.$router.push({ query: { ...this.$route.query, ['eventId']: v } })
            } else {
                this.$router.replace({ query: { ...this.$route.query, ['eventId']: undefined } })
            }
        },
        eventId (v) {
            if (!v) {
                this.type = 'index'
            }
        }
    },
    methods: {
        onClose () {
            this.$store.commit('page/popin', { event: null })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>