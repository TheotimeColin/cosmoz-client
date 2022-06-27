<template>
    <div>
        <popin :is-active="isActive" :modifiers="['panel']" :title="'Détails de : ' + gathering.title" query="full"
            @close="$emit('close')" @open="$emit('open')">
            <div class="p-30 p-20@s" slot="content" v-if="constellation">
                <transition name="fade">
                    <div v-show="!isManage">
                        <div class="+mt-30">
                            <div class="d-flex fxa-center">
                                <fa icon="fal fa-calendar-lines" size="lg" class="mt-5 mr-15 fx-no-shrink" fixed-width />

                                <div>
                                    <p class="ft-l-bold">{{ $moment(gathering.date).format('dddd D MMMM YYYY') }}</p>
                                    <p>à partir de {{ $moment(gathering.date).format('HH:mm') }}</p>
                                </div>
                            </div>

                            <div class="d-flex fxa-center mt-15">
                                <fa icon="fal fa-map-marker-alt" size="lg" class="mt-5 mr-15 fx-no-shrink" fixed-width />

                                <div>
                                    <p class="ft-l-bold">{{ gathering.location }}</p>
                                    <p>{{ gathering.address }}</p>
                                </div>
                            </div>
                        </div>

                        <hr class="Separator mv-30">

                        <template v-if="user">
                            <div class="+mt-30" v-if="gathering.description && gathering.description != '<p></p>'">
                                <h2 class="ft-title-xs mb-5">Détails</h2>
                                <text-body :modifiers="['gathering']" :value="gathering.description" />
                            </div>

                            <div class="+mt-30 p-20 bg-bg-weak br-s"
                                v-if="gathering.important && gathering.important != '<p></p>'">
                                <h2 class="ft-title-2xs mb-15 tape">Important</h2>
                                <text-body :modifiers="['gathering']" :value="gathering.important" />
                            </div>

                            <div class="+mt-30 block-r" v-if="organizers && organizers.length > 0">
                                <h2 class="ft-title-xs mb-10">Équipe d'organisation</h2>

                                <div class="row-xs">
                                    <div class="col-6 col-12@xs mt-10" v-for="user in organizers" :key="user._id">
                                        <user-icon v-bind="user" :display-name="true" class="mr-10 fx-no-shrink"
                                            :modifiers="['m']" />
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <p class="ft-bold mv-20">Le reste des informations est accessible aux membres.</p>

                            <insert-register />
                        </template>

                        <div class="+mt-30 pv-20 fx-center bg-bg b-top" style="position: sticky; bottom: 0;"
                            v-if="user && !hasWaitingList && !gathering.isPast">
                            <div></div>

                            <page-gathering-action-button :gathering="gathering" @manage="isManage = true" />
                        </div>
                    </div>
                </transition>
                <transition name="fade">
                    <div v-show="isManage">
                        <template v-if="hasBooked">
                            <p>Ton inscription est confirmée. Rendez-vous {{ $moment(gathering.date).format('dddd DD MMMM YYYY à HH:mm') }} !</p>

                            <div class="block mt-20">
                                <p>Tu as dû recevoir un email de confirmation avec un récapitulatif des informations.
                                    Vérifie tes spam !</p>

                                <link-base class="mt-15" :href="googleCal" icon-before="calendar" target="_blank">
                                    Ajouter à Google Calendar</link-base>
                            </div>

                            <div class="block-r bg-bg-strong mt-20">
                                <h2 class="ft-title-xs mb-10">
                                    Organisé avec 💖
                                </h2>

                                <div>
                                    <b>L'équipe de {{ constellation.name }}</b> se donne beaucoup de mal pour organiser
                                    ces sorties gratuites !

                                    <p class="mt-15">
                                        Donc si tu ne peux plus venir, <u>pense bien à te désinscrire à l'avance.</u>
                                    </p>
                                </div>

                                <button-base class="mt-15" icon-before="times" :loading="isLoading"
                                    @click="onBookUpdate('cancelled')">
                                    Me désinscrire
                                </button-base>
                            </div>
                        </template>
                        <template v-else>
                            <div class="block">
                                <p class="ft-title-xs mb-10">Avant de confirmer...</p>

                                <b>L'équipe de {{ constellation.name }}</b> comptent sur ta venue le jour J ! Les
                                membres qui ne viennent pas, sans prévenir ou se désinscrire, peuvent être exclus du
                                groupe ou même de la plateforme.
                            </div>
                        </template>

                        <div class="pv-20 fx-center bg-bg b-top mt-20 fx-reverse@xs"
                            style="position: sticky; bottom: 0;">
                            <div class="mt-5@xs">
                                <link-base icon-before="arrow-left" @click="isManage = false">
                                    Retour à la description
                                </link-base>
                            </div>

                            <button-base :modifiers="['light']" :loading="isLoading" @click="onBookUpdate('attending')"
                                icon-before="check" v-if="!hasBooked">
                                Confirmer mon inscription
                            </button-base>
                            <button-base :modifiers="['light']" @click="$emit('close')" v-else>
                                Fermer
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
        
        organizers () {
            return this.$store.getters['user/find']({
                _id: { $in: this.gathering.organizers }
            })
        }
    }
}
</script>