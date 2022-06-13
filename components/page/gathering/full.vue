<template>
    <div>
        <popin :is-active="isActive" :modifiers="['panel']" @close="$emit('close')">
            <div class="p-30" slot="content">
                <div class="mb-20">
                    <p class="ft-title-m">{{ gathering.title }}</p>
                </div>
                <transition name="fade">
                    <div v-show="!isManage">
                        <div class="Gathering_section block-r">
                            <div class="d-flex">
                                <fa icon="far fa-calendar" class="mt-5 mr-5 fx-no-shrink" fixed-width /> 
                                
                                <p>{{ $moment(gathering.date).format('ddd D MMMM YYYY à HH:mm') }}</p>
                            </div>
                            <div class="mt-5 d-flex">
                                <fa icon="far fa-map-marker-alt" class="mt-5 mr-5 fx-no-shrink" fixed-width /> 

                                <div>
                                    <p class="ft-bold">{{ gathering.location }}</p>
                                    <p class="color-ft-weak">{{ gathering.address }}</p>
                                </div>
                            </div>
                        </div>

                        <template v-if="user">
                            <div class="Gathering_section" v-if="gathering.description && gathering.description != '<p></p>'">
                                <h2 class="ft-title-xs mb-5">Détails</h2>
                                <text-body :modifiers="['gathering']" :value="gathering.description" />
                            </div>
                            
                            <div class="Gathering_section p-20 bg-bg-weak  br-s" v-if="gathering.important && gathering.important != '<p></p>'">
                                <h2 class="ft-title-2xs mb-15 tape">Important</h2>
                                <text-body :modifiers="['gathering']" :value="gathering.important" />
                            </div>
                        </template>
                        <template v-else>
                            <p class="ft-bold mv-20">Le reste des informations est accessible aux membres.</p>

                            <insert-register />
                        </template>

                        <div class="pv-20 fx-center bg-bg b-top mt-20" style="position: sticky; bottom: 0;" v-if="user && !hasWaitingList && !gathering.isPast">
                            <div></div>

                            <page-gathering-action-button
                                :gathering="gathering"
                                @manage="isManage = true"
                            />
                        </div>
                    </div>
                </transition>
                <transition name="fade">
                    <div v-show="isManage">
                        <template v-if="hasBooked">
                            <p>Ton inscription est confirmée. Rendez-vous {{ $moment(gathering.date).format('dddd DD MMMM YYYY à HH:mm') }} !</p>

                            <link-base class="mv-20" :href="googleCal" target="_blank">Ajouter à Google Calendar</link-base>
                            
                            <p class="p-10 bg-bg-weak br-s">Tu as dû recevoir un email de confirmation. Vérifie tes spam !</p>
                        </template>
                        <template v-else>
                            Attention, pour conserver ton accès aux futures rencontres <span class="text-underline">n'oublie pas de te désincrire</span> si tu as un empêchement !
                        </template>
                    
                        <div class="pv-20 fx-center bg-bg b-top mt-20 fx-reverse@xs" style="position: sticky; bottom: 0;">
                            <div class="mt-5@xs">
                                <link-base @click="isManage = false">
                                    Retour à la description
                                </link-base>
                            </div>

                            <button-base :modifiers="['light']" :loading="isLoading" @click="onBookUpdate('attending')" v-if="!hasBooked">
                                Confirmer mon inscription
                            </button-base>
                            <button-base icon-before="times" :loading="isLoading" @click="onBookUpdate('cancelled')" v-else>
                                Me désinscrire
                            </button-base>
                        </div>
                    </div>
                </transition>
            </div>
        </popin>
    </div>
</template>

<script>
import GatheringMixin from '@/mixins/gathering'

export default {
    name: 'PageGathering',
    mixins: [ GatheringMixin ],
    props: {
        gathering: { type: Object, default: () => {} },
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        isManage: false
    }),
    watch: {
        isActive (v) {
            if (!v) this.isManage = false
        }
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
    }
}
</script>


<style lang="scss" scoped>
.Gathering_section {

    & + & {
        margin-top: 40px;
    }
}
</style>