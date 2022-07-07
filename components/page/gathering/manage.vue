<template>
    <div>
        <div class="block bg-bg-weak p-0 br-none@xs">
            <div class="p-20" v-if="!gathering.isPast || (gathering.isPast && !hasConfirmed)">
                <h1 class="ft-title-s d-none mb-20 mt-5 d-block@xs">{{ gathering.title }}</h1>

                <div class="d-flex fxa-start" v-if="gathering.date">
                    <fa icon="fal fa-calendar-lines" size="lg" class="mt-5 mr-15 fx-no-shrink" fixed-width />

                    <div>
                        <p class="ft-l-bold">{{ $moment(gathering.date).format('dddd D MMMM YYYY') }}</p>
                        <p>à partir de {{ $moment(gathering.date).format('HH:mm') }}</p>
                    </div>
                </div>

                <div class="d-flex fxa-start mt-10" v-if="gathering.location">
                    <fa icon="fal fa-map-marker-alt" size="lg" class="mt-3 mr-15 fx-no-shrink" fixed-width />

                    <div>
                        <p class="ft-l-bold">{{ gathering.location }}</p>
                        <p v-if="gathering.address">{{ gathering.address }}</p>
                    </div>
                </div>

                <template v-if="gathering.description && gathering.description !== '<p></p>'">
                    <hr class="Separator mv-20">

                    <div>
                        <div class="ellipsis-3">
                            {{ gathering.description|striptags }}
                        </div>

                        <link-base class="mt-5" @click="isFull = true">Voir plus</link-base>
                    </div>
                </template>

                <hr class="Separator mv-20">

                <div class="fx-center d-block@xs">
                    <user-list class="fx-grow fxj-center@xs" :max="5" :items="usersByStatus(['attending', 'confirmed'])"
                        :suffix="gathering.isPast ? 'ont participé' : 'participent'" @click.native="isList = true" />

                    <div class="fx-no-shrink ml-20 ml-0@xs mt-5@xs text-center@xs">
                        <template v-if="gathering.isPast">
                            <link-base class="mr-5" @click="isFull = true">Détails</link-base>
                            <button-base :modifiers="['light']" disabled>Événement terminé</button-base>
                        </template>
                        <template v-else>
                            <link-base class="mr-5"
                                :to="{ name: 'c-slug-manage-events-id', params: { slug: constellation.slug, id: gathering._id } }"
                                v-if="$isConsteOrga">Modifier</link-base>
                            <link-base class="mr-5" @click="isFull = true">Détails</link-base>

                            <page-gathering-action-button :gathering="gathering" @manage="isFull = true" />
                        </template>
                    </div>
                </div>
            </div>
            <div v-else-if="hasConfirmed">
                <div class="pt-20 ph-20">
                    <p class="ft-title-xs">
                        Tu les as rencontrés
                    </p>

                    <p class="mt-5">
                        Clique sur les profils si tu veux les remercier et garder le contact.
                    </p>
                </div>

                <slider-block
                    :slots="usersByStatus(['confirmed', 'attending']).filter(u => u._id != user._id).map(u => u._id)"
                    :ratio="150" item-class="width-2xss" :margin="8" :offset="$smallerThan('xs') ? 15 : 20"
                    :offset-v="20"
                    :padding-t="20"
                >
                    <div class="p-relative" v-for="(user, i) in usersByStatus(['confirmed', 'attending']).filter(u => u._id != user._id)" :slot="user._id" :key="user._id" @click="$store.dispatch('user/updateNotification', { id: 'affinity-popin', type: 'onboarding' })">
                        <user-profile v-bind="user" :no-link="true" @click.native="() => selectedUser = user" />

                        <div class="Att_abs" v-if="i == 0 && !$store.getters['user/notif']('affinity-popin', 'onboarding')"></div>
                    </div>
                </slider-block>

                <div class="+mt-20 mh-20 block-cosmoz" v-if="user && !user.picture">
                    <p class="ft-title-xs mb-10">
                        Ne rate pas une belle amitié... 😥
                    </p>

                    <div>Ajoute une photo de profil pour que les autres puissent te reconnaître !</div>

                    <button-base class="mt-10" :to="{ name: 'p-userId', params: { userId: user.id }, query: { edit: 'true' }}" :modifiers="['s', 'cosmoz']" icon-before="image">
                        Ajouter une photo
                    </button-base>
                </div>

                <div class="+mt-20 p-20 bg-bg-xstrong br-s br-none@xs" v-if="mentions.length > 0">
                    <p class="ft-title-2xs mb-15">
                        Tu as reçu des remerciements ! 
                    </p>

                    <div class="ft-title-3xs subtitle tape tape-s m-3" v-for="mentionType in Object.entries($groupBy(mentions, 'type', { sortBy: true })).sort((a, b) => b[1].items.length - a[1].items.length)" :key="mentionType[0]">
                        {{ $const.mentions.find(m => m.value == mentionType[0]).emoji }} 
                        
                        {{ mentionType[1].items.length }} x {{ $t('mentions.' + (mentionType[0])) }}
                    </div>
                </div>

                <user-popin-mention :selected-user="selectedUser" :gathering="gathering._id" @close="selectedUser = null" />
            </div>

            
            <div class="p-20 text-center bg-bg-xweak" v-if="$isConsteOrga">
                <button-base @click="isManage = true">Gérer les participants</button-base>

                <page-gathering-manage-users :is-active="isManage" :gathering="gathering" @close="isManage = false" />
            </div>
        </div>

        <page-gathering-full :is-active="isFull" :gathering="gathering" @close="isFull = false" @open="isFull = true" />

        <popin :is-active="isList" :modifiers="['s']" @close="isList = false">
            <template slot="content">
                <div class="p-30">
                    <div class="+mt-30" v-if="organizers && organizers.length > 0">
                        <h2 class="ft-title-xs mb-10">Équipe d'organisation</h2>

                        <div class="row-xs">
                            <div class="col-6 col-12@xs mt-10" v-for="user in organizers" :key="user._id">
                                <user-icon v-bind="user" :display-name="true" class="mr-10 fx-no-shrink"
                                    :modifiers="['m']" />
                            </div>
                        </div>
                    </div>

                    <p class="+mt-30 ft-title-xs mb-5">Participations</p>

                    <div class="row-xs">
                        <div class="col-6 pt-10 col-12@xs"
                            v-for="participant in usersByStatus(['attending', 'confirmed'])" :key="participant._id">
                                <user-icon :display-name="true" :modifiers="['m']" v-bind="participant" />
                        </div>
                    </div>
                </div>
            </template>
        </popin>
    </div>
</template>

<script>
import GatheringMixin from '@/mixins/gathering'
import PermissionsMixin from '@/mixins/permissions'

export default {
    name: 'PageGatheringManage',
    mixins: [ GatheringMixin, PermissionsMixin ],
    props: {
        gathering: { type: Object, default: () => {} }
    },
    data: () => ({
        isInit: false,
        isFull: false,
        isList: false,
        isManage: false,
        selectedUser: null,
        random: Math.random()
    }),
    computed: {
        organizers () {
            return this.$store.getters['user/find']({
                _id: { $in: this.gathering.organizers }
            })
        },
        mentions () {
            if (!this.user) return []

            return this.$store.getters['mention/find']({
                target: this.user._id,
                gathering: this.gathering._id
            })
        }
    },
    mounted () {
        this.isInit = true
    },
    methods: {
        openFull () {
            this.isFull = true
        }
    }
}
</script>

<style>

</style>