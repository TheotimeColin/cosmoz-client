<template>
    <div>
        <div class="block bg-bg-weak p-0 br-none@xs">
            <div class="p-15">
                <h1 class="ft-title-s d-none mb-15 d-block@xs">{{ gathering.title }}</h1>

                <div class="d-flex fxa-center">
                    <fa icon="fal fa-calendar-lines" size="xl" class="mt-5 mr-10 fx-no-shrink" fixed-width />

                    <div>
                        <p class="ft-l-bold">{{ $moment(gathering.date).format('dddd D MMMM YYYY') }}</p>
                        <p>à partir de {{ $moment(gathering.date).format('HH:mm') }}</p>
                    </div>
                </div>

                <div class="d-flex fxa-center mt-15">
                    <fa icon="fal fa-map-marker-alt" size="xl" class="mt-5 mr-10 fx-no-shrink" fixed-width />

                    <div>
                        <p class="ft-l-bold">{{ gathering.location }}</p>
                        <p>{{ gathering.address }}</p>
                    </div>
                </div>

                <hr class="Separator mv-15">

                <div>
                    <div class="ellipsis-3">
                        {{ gathering.description|striptags }}
                    </div>

                    <link-base class="mt-5" @click="isFull = true">Voir plus</link-base>
                </div>

                <hr class="Separator mt-15">
            </div>
            <div class="fx-center ph-20 pb-20 d-block@xs"
                v-if="!gathering.isPast || (gathering.isPast && !hasConfirmed)">
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
            <div v-else-if="hasConfirmed">
                <p class="ft-title-xs mb-20 ph-20">
                    Tu les as rencontrés
                </p>

                <slider-block
                    :slots="usersByStatus(['confirmed', 'attending']).filter(u => u._id != user._id).map(u => u._id)"
                    :ratio="150" item-class="width-2xss" :margin="8" :offset="$smallerThan('xs') ? 15 : 20"
                    :offset-v="20">
                    <div v-for="user in usersByStatus(['confirmed', 'attending']).filter(u => u._id != user._id)"
                        :slot="user._id" :key="user._id">
                        <user-profile v-bind="user" :no-link="true" :gathering="gathering._id"
                            @click.native="() => selectedUser = user" />
                    </div>
                </slider-block>

                <user-popin-mention :selected-user="selectedUser" :gathering="gathering._id"
                    @close="selectedUser = null" />
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
        isFull: false,
        isList: false,
        selectedUser: null,
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        organizers () {
            return this.$store.getters['user/find']({
                _id: { $in: this.gathering.organizers }
            })
        }
    }
}
</script>

<style>

</style>