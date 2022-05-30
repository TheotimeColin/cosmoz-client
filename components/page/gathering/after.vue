<template>
    <div>
        <div class="Gathering_section" v-if="hasConfirmed">
            <div class="pt-20 mb-30 bg-bg br-s">
                <p class="ft-title-s mb-20 ph-20">
                    Tu les as rencontrés <span class="ft-m color-ft-weak ml-5">{{ usersByStatus(['confirmed']).length }} participants</span>
                </p>

                <slider-block
                    :slots="usersByStatus(['confirmed']).filter(u => u._id != user._id).map(u => u._id)"
                    :ratio="150"
                    item-class="width-2xss"
                    :offset="$smallerThan('xs') ? 15 : 20"
                    :offset-v="20"
                >
                    <div v-for="user in usersByStatus(['confirmed']).filter(u => u._id != user._id)" :slot="user._id" :key="user._id">
                        <user-profile v-bind="user" :no-link="true"  :gathering="gathering._id" @click.native="() => selectedUser = user" />
                    </div>
                </slider-block>
            </div>

            <user-popin-mention :selected-user="selectedUser" :gathering="gathering._id" @close="selectedUser = null" v-if="hasConfirmed" />
        </div>
        <div class="Gathering_section" v-else-if="usersByStatus(['attending', 'waiting']).find(u => u._id == user._id)">
            <div class="p-20 mb-30 bg-bg-xstrong br-s">
                <p class="ft-title-xs">
                    <fa icon="far fa-circle-question" class="mr-5" /> Présence non-confirmée
                </p>

                <p class="mt-10">Tu étais inscrit à cette rencontrée mais tu n'as pas scanné le QR code sur place.</p>
            </div>
        </div>
        <div class="Gathering_section" v-else>
            <div class="p-20 bg-bg-xstrong br-s text-center">
                <fa icon="far fa-hand-wave" class="ft-xl color-ft-xweak line-1 mb-10"></fa>

                <p>Cet espace est réservé aux personnes qui ont participé à la rencontre.</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageGatheringAfter',
    props: {
        gathering: { type: Object, default: () => {} }
    },
    data: () => ({
        selectedUser: null,
        displayAll: false,
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        hasConfirmed () {
            return this.user && this.usersByStatus(['confirmed']).find(u => u._id == this.user._id) ? true : false
        }
    },
    methods: {
        usersByStatus (statuses) {
            let users = Object.values(this.gathering.users.reduce((all, current) => ({
                ...all, [current._id]: current 
            }), {}))

            return users.filter(u => statuses.includes(u.status))
        }
    }
}
</script>