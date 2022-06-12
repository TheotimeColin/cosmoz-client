<template>
    <div>
        <div class="block bg-bg-weak p-20@xs br-none@xs">
            <h1 class="ft-title-xs d-none mb-15 d-block@xs">{{ gathering.title }}</h1>

            <div class="row-s">
                <div class="col-6 col-12@xs">
                    <p>
                        <fa icon="far fa-calendar" class="mr-5" fixed-width /> {{ $moment(gathering.date).format('ddd D MMMM YYYY à HH:mm') }}
                    </p>
                    <p class="mt-3">
                        <fa icon="far fa-map-marker-alt" class="mr-5" fixed-width /> {{ user ? gathering.location : `Information réservée aux membres` }}
                    </p>
                    
                    <link-base class="mr-10" @click="isFull = true">Plus d'infos</link-base>
                </div>

                <div class="col-6 col-12@xs mt-20@xs d-flex@xs fxa-center@xs" v-if="usersByStatus(['attending', 'confirmed']).length > 0">
                    <div class="d-flex@xs mr-5@xs">
                        <user-icon class="mr-5 mb-5" v-for="participant in usersByStatus(['attending', 'confirmed']).slice(0, 4)" :key="participant._id" v-bind="participant" />
                    </div>

                    <link-base @click="isList = true">
                        <template v-if="usersByStatus(['attending', 'confirmed']).length > 3 && !hasBooked">
                            {{ attending }} et {{ usersByStatus(['attending', 'confirmed']).length - 2 }} {{ gathering.isPast ? 'autres ont participé' : 'autres participent' }}
                        </template>
                        <template v-else>
                            {{ usersByStatus(['attending', 'confirmed']).length }} {{ gathering.isPast ? 'ont participé' : 'participent' }}
                        </template>
                    </link-base>
                </div>
            </div>

            <hr class="Separator mv-20" v-if="!gathering.isPast">

            <div class="text-center" v-if="!gathering.isPast">
                <link-base class="mr-10" @click="isFull = true">Plus d'infos</link-base>

                <page-gathering-action-button
                    :gathering="gathering"
                    @manage="isFull = true"
                />
            </div>
        </div>

        <page-gathering-full :is-active="isFull" :gathering="gathering" @close="isFull = false" />

        <popin :is-active="isList" :modifiers="['s']" @close="isList = false">
            <template slot="content">
                <div class="p-30">
                    <p class="ft-title-s mb-15">Participations</p>

                    <div class="row-xs">
                        <div class="col-6 pt-10 col-12@xs" v-for="participant in usersByStatus(['attending', 'confirmed'])" :key="participant._id">
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

export default {
    name: 'PageGatheringManage',
    mixins: [ GatheringMixin ],
    props: {
        gathering: { type: Object, default: () => {} }
    },
    data: () => ({
        isFull: false,
        isList: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    }
}
</script>

<style>

</style>