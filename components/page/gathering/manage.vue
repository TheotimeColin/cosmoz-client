<template>
    <div>
        <div class="ManageEvent" :class="{ 'ManageEvent--min': isMin }">

            <div class="ManageEvent_container">
                <div class="ManageEvent_cover bg-cover-100 ratio-50 ratio-75@xs fx-no-shrink" :style="{ '--background': `url(${gathering.hero})` }"></div>

                <div class="ManageEvent_info">
                    <div class="+mt-20">
                        <h1 class="ft-title-m ft-title-s@xs">{{ gathering.title }}</h1>

                        <p class="ft-s color-ft-weak" v-if="gathering.isPast">{{ $moment(gathering.date).fromNow() }}</p>
                    </div>
                    
                    <div class="+mt-20">
                        <div class="+mt-20 d-flex fxa-start" v-if="gathering.date">
                            <fa icon="fal fa-calendar-lines" size="lg" class="mt-5 mr-10 fx-no-shrink" fixed-width />

                            <div>
                                <p class="ft-l-bold">{{ $moment(gathering.date).format('dddd D MMMM YYYY') }}</p>
                                <p>à partir de {{ $moment(gathering.date).format('HH:mm') }}</p>
                            </div>
                        </div>

                        <div class="+mt-20 d-flex fxa-start" v-if="gathering.location">
                            <fa icon="fal fa-map-marker-alt" size="lg" class="mt-3 mr-10 fx-no-shrink" fixed-width />

                            <div>
                                <p class="ft-l-bold">{{ gathering.location }}</p>
                                <p v-if="gathering.address">{{ gathering.address }}</p>
                            </div>
                        </div>

                        <user-list class="+mt-20" :max="5" :items="usersByStatus(['attending', 'confirmed'])" :suffix="gathering.isPast ? 'ont participé' : 'participent'" @click.native="isList = true" />
                    </div>
                </div>
            </div>

            <div class="p-20 bg-bg-xweak text-center" v-if="!gathering.isPast && !isMin">
                <page-gathering-action-button :gathering="gathering" />
            </div>

            <!-- <div v-if="hasConfirmed && usersByStatus(['confirmed', 'attending']).length > 1">
                <div class="ph-20">
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

                <hr class="Separator">
            </div> -->
        
        </div>


        <!-- <div class="+mt-20 block text-center" v-if="gathering && !gathering.isPast">
            <page-gathering-action-button :gathering="gathering" />
        </div> -->
        
        <!-- <page-gathering-full :is-active="isFull" :gathering="gathering" @close="isFull = false" @open="isFull = true" /> -->

        <popin :is-active="isList" :modifiers="['s']" @close="isList = false">
            <template slot="content">
                <div class="p-20">
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
        gathering: { type: Object, default: () => {} },
        isMin: { type: Boolean, default: false }
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

<style lang="scss" scoped>
.ManageEvent {
    overflow: hidden;
    border-radius: 10px;
    background: var(--color-bg-weak);
    
    @include shadow-xs;
}

.ManageEvent_container {
    display: flex;
}

.ManageEvent_info {
    padding: 20px;
}

.ManageEvent_cover {
    width: 50%;
    background: var(--color-bg-strong);
}

.ManageEvent--min {
    border-radius: 0;

    .ManageEvent_container {
        display: block;
    }
    
    .ManageEvent_cover {
        width: 100%;

        &::after {
            padding-bottom: 33%;
        }
    }
}

@include breakpoint-xs {

    .ManageEvent {
        display: block;
        border-radius: 0;
        box-shadow: none;

        &:not(.ManageEvent--min) {
            margin-left: -20px;
            margin-right: -20px;
        }
    }

    .ManageEvent_cover {
        width: 100%;
    }
}
</style>