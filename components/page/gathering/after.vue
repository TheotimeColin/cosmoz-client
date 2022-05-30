<template>
    <div>
        <div class="Gathering_section" v-if="hasConfirmed">
            <div class="p-20 mb-30 bg-bg br-s">
                <p class="ft-title-s mb-10">
                    Tu les as rencontrés <span class="ft-m color-ft-weak ml-5">{{ usersByStatus(['confirmed']).length }} participants</span>
                </p>
                
                <div class="row-xs" v-if="!displayAll">
                    <div class="col-3 mt-10" v-for="(user, i) in usersByStatus(['confirmed']).filter(u => u._id != user._id).slice(0, 4)" :key="user._id">
                        <user-profile v-bind="user" :no-link="true"  :gathering="gathering._id" :overlay=" i == 3 ? 'Afficher tout le monde' : ''" @click.native="() => i == 3 ? displayAll = true : selectedUser = user" />
                    </div>
                </div>
                <div class="row-xs" v-else>
                    <div class="col-4 mt-10" v-for="user in usersByStatus(['confirmed']).filter(u => u._id != user._id)" :key="user._id">
                        <user-icon
                            v-bind="user"
                            :display-name="true"
                            :modifiers="['m']"
                            :no-link="true"
                            class="c-pointer"
                            @click.native.prevent="selectedUser = user"
                            :gathering="gathering._id"
                        />
                    </div>
                </div>
            </div>

            <user-popin-mention :selected-user="selectedUser" :gathering="gathering._id" @close="selectedUser = null" v-if="hasConfirmed" />
        </div>
        <div class="Gathering_section" v-else-if="usersByStatus(['attending', 'waiting']).find(u => u._id == user._id)">
            <div class="p-20 mb-30 bg-bg-xstrong br-s">
                <p class="ft-title-xs">
                    <fa icon="far fa-circle-question" class="mr-5" /> Présence non-confirmée
                </p>

                <p class="mt-10">Tu étais inscrit à cet événement mais ton QR code n'a pas été scanné sur place. As-tu bien participé ?</p>
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