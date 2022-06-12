<template>
    <div>
        <popin :is-active="isActive" :modifiers="['panel']" @close="$emit('close')">
            <div class="p-30" slot="content">
                <div class="mb-20">
                    <p class="ft-title-l">{{ gathering.title }}</p>
                    <div class="mt-5" v-if="gathering.intro">
                        <text-body :modifiers="['gathering']" :value="gathering.intro" />
                    </div>
                </div>
                <transition name="fade">
                    <div v-show="!isManage">
                        <div class="Gathering_section block-r">
                            <p>
                                <fa icon="far fa-calendar" class="mr-5" fixed-width /> {{ $moment(gathering.date).format('ddd D MMMM YYYY à HH:mm') }}
                            </p>
                            <p class="mt-3">
                                <fa icon="far fa-map-marker-alt" class="mr-5" fixed-width /> {{ user ? gathering.location : `Information réservée aux membres` }}
                            </p>
                        </div>

                        <template v-if="user">
                            <div class="Gathering_section" v-if="gathering.description && gathering.description != '<p></p>'">
                                <h2 class="ft-title-m mb-15">Détails</h2>
                                <text-body :modifiers="['gathering']" :value="gathering.description" />
                            </div>
                            
                            <div class="Gathering_section" v-if="gathering.venue && gathering.venue != '<p></p>'">
                                <h2 class="ft-title-m mb-15">À propos du lieu</h2>
                                <text-body :modifiers="['gathering']" :value="gathering.venue" />
                            </div>

                            <div class="Gathering_section p-20 bg-bg-weak  br-s" v-if="gathering.important && gathering.important != '<p></p>'">
                                <h2 class="ft-title-2xs mb-15 tape">Important</h2>
                                <text-body :modifiers="['gathering']" :value="gathering.important" />
                            </div>

                            <div class="Gathering_section" v-if="gathering.information && gathering.information != '<p></p>'">
                                <h2 class="ft-title-m mb-15">Informations pratiques</h2>
                                <text-body :modifiers="['gathering']" :value="gathering.information" />
                            </div>
                        </template>
                        <template v-else>
                            <div class="ellipsis-3" v-html="gathering.intro || gatering.description"></div>

                            <p class="ft-bold mv-20">Le reste des informations est accessible aux membres.</p>

                            <div class="p-30 bg-bg-strong br-s text-center">
                                <div class="row-s">
                                    <div class="col-4 col-12@s">
                                        <h3 class="ft-title-2xs">
                                            <fa icon="far fa-heart" class="color-ft-weak" />
                                            <p class="mt-5">Des rencontres conviviales</p>
                                        </h3>
                                    </div>
                                    <div class="col-4 col-12@s mt-30@s">
                                        <h3 class="ft-title-2xs">
                                            <fa icon="far fa-hand-wave" class="color-ft-weak" />
                                            <p class="mt-5">De nouveaux potes près de chez toi</p>
                                        </h3>
                                    </div>
                                    <div class="col-4 col-12@s mt-30@s">
                                        <h3 class="ft-title-2xs">
                                            <fa icon="far fa-beer-mug" class="color-ft-weak" />
                                            <p class="mt-5">Organise tes propres sorties</p>
                                        </h3>
                                    </div>
                                </div>

                                <button-base class="mt-30" :modifiers="['s', 'light']" @click="$store.commit('page/register', 'g-index')">Je m'inscris gratuitement</button-base>
                            </div>
                        </template>

                        <div class="pv-20 fx-center bg-bg b-top mt-20" style="position: sticky; bottom: 0;" v-if="!hasWaitingList">
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
                    
                        <div class="pv-20 fx-center bg-bg b-top mt-20" style="position: sticky; bottom: 0;">
                            <div>
                                <link-base @click="isManage = false">
                                    Retour à la description
                                </link-base>
                            </div>

                            <button-base :modifiers="['light']" :loading="isLoading" @click="onBookUpdate('attending')" v-if="!hasBooked">
                                Confirmer mon inscription
                            </button-base>
                            <button-base icon-before="times" v-else>
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