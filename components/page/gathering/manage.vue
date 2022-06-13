<template>
    <div>
        <div class="block bg-bg-weak p-20@xs br-none@xs">
            <h1 class="ft-title-xs d-none mb-15 d-block@xs">{{ gathering.title }}</h1>

            <div class="row">
                <div class="col-6 col-12@xs mt-20@xs">
                    <p class="ellipsis-3">
                        {{ gathering.description|striptags }}
                    </p>

                    <link-base class="mt-5" @click="isFull = true">Voir plus</link-base>

                    <!-- <div class="d-flex@xs mr-5@xs">
                        <user-icon class="mr-5 mb-5" v-for="participant in usersByStatus(['attending', 'confirmed']).slice(0, 4)" :key="participant._id" v-bind="participant" />
                    </div>

                    <link-base @click="isList = true">
                        <template v-if="usersByStatus(['attending', 'confirmed']).length > 3 && !hasBooked">
                            {{ attending }} et {{ usersByStatus(['attending', 'confirmed']).length - 2 }} {{ gathering.isPast ? 'autres ont participé' : 'autres participent' }}
                        </template>
                        <template v-else>
                            {{ usersByStatus(['attending', 'confirmed']).length }} {{ gathering.isPast ? 'ont participé' : 'participent' }}
                        </template>
                    </link-base> -->
                </div>
                <div class="col-6 col-12@xs">
                    <div class="d-flex">
                        <user-icon v-bind="user" class="mr-10 fx-no-shrink" :modifiers="['xs']" />
                        
                        <p>Organisé par {{ user.name }}</p>
                    </div>

                    <div class="mt-10 d-flex">
                        <fa icon="far fa-calendar" class="mt-5 mr-10 fx-no-shrink" fixed-width /> 
                        
                        <p>{{ $moment(gathering.date).format('ddd D MMMM YYYY à HH:mm') }}</p>
                    </div>
                    <div class="mt-10 d-flex">
                        <fa icon="far fa-map-marker-alt" class="mt-5 mr-10 fx-no-shrink" fixed-width /> 

                        <div>
                            <p class="ft-bold">{{ gathering.location }}</p>
                            <p class="color-ft-weak">{{ gathering.address }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="Separator mv-20" v-if="!gathering.isPast">

            <div class="fx-center" v-if="!gathering.isPast">
                <user-list class="fx-grow" :items="users" :itemsz="usersByStatus(['attending', 'confirmed'])" />

                <div class="fx-no-shrink ml-20">
                    <link-base class="mr-5" :to="{ name: 'c-slug-manage-events-id', params: { slug: constellation.slug, id: gathering._id } }">Modifier</link-base>

                    <page-gathering-action-button
                        :gathering="gathering"
                        @manage="isFull = true"
                    />
                </div>
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
        user () { return this.$store.getters['user/self'] },
        users () { return this.$store.getters['user/find']() },
    }
}
</script>

<style>

</style>