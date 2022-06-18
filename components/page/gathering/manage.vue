<template>
    <div>
        <div class="block bg-bg-weak p-0 br-none@xs">
            <div class="p-20">
                <h1 class="ft-title-xs d-none mb-15 d-block@xs">{{ gathering.title }}</h1>

                <div class="row">
                    <div class="col-6 col-12@xs mb-20@xs">
                        <p class="ellipsis-3">
                            {{ gathering.description|striptags }}
                        </p>

                        <link-base class="mt-5" @click="isFull = true">Voir plus</link-base>
                    </div>
                    <div class="col-6 col-12@xs">
                        <div class="+mt-10 d-flex" v-if="organizers && organizers.length > 0">
                            <user-icon v-bind="organizers[0]" class="mr-10 fx-no-shrink" :modifiers="['xs']" />

                            <p>Organisé par {{ $pluralize(organizers.map(o => o.name)) }}</p>
                        </div>
                        <div class="+mt-10 d-flex">
                            <fa icon="far fa-calendar" class="mt-5 mr-10 fx-no-shrink" fixed-width />

                            <p>{{ $moment(gathering.date).format('ddd D MMMM YYYY à HH:mm') }}</p>
                        </div>
                        <div class="+mt-10 d-flex">
                            <fa icon="far fa-map-marker-alt" class="mt-5 mr-10 fx-no-shrink" fixed-width />

                            <div>
                                <p class="ft-bold">{{ gathering.location }}</p>
                                <p class="color-ft-weak">{{ gathering.address }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="Separator mt-20">
            </div>
            <div class="fx-center ph-20 pb-20 d-block@xs"
                v-if="!gathering.isPast || (gathering.isPast && !hasConfirmed)">
                <user-list class="fx-grow fxj-center@xs" :max="5" :items="usersByStatus(['attending', 'confirmed'])"
                    :suffix="gathering.isPast ? 'ont participé' : 'participent'" @click.native="isList = true" />

                <client-only>
                    <div class="fx-no-shrink ml-20 ml-0@xs mt-5@xs text-center@xs">
                        <template v-if="gathering.isPast">
                            <button-base :modifiers="['light']" disabled>Événement terminé</button-base>
                        </template>
                        <template v-else>
                            <span v-if="$isConsteOrga">
                                <link-base class="mr-5"
                                    :to="{ name: 'c-slug-manage-events-id', params: { slug: constellation.slug, id: gathering._id } }">
                                    Modifier</link-base>
                            </span>

                            <page-gathering-action-button :gathering="gathering" @manage="isFull = true" />
                        </template>
                    </div>
                </client-only>
            </div>
            <div v-else-if="hasConfirmed">
                <p class="ft-title-xs mb-20 ph-20">
                    Tu les as rencontrés
                </p>

                <slider-block
                    :slots="usersByStatus(['confirmed', 'attending']).filter(u => u._id != user._id).map(u => u._id)"
                    :ratio="150" item-class="width-2xss" :offset="$smallerThan('xs') ? 15 : 20" :offset-v="20">
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
                    <p class="ft-title-s mb-15">Participations</p>

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