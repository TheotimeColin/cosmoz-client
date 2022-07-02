<template>
    <popin :is-active="isActive" :modifiers="['s']" @close="$emit('close')">
        <template slot="content">
            <div class="p-30 text-left">
                <div class="mb-20 bg-bg-strong p-15 br-xs">
                    <input-user-select class="+mt-40" placeholder="Ajouter un participant..." @input="(v) => onManage({ status: 'attending', _id: v })" :query="{ constellations: constellation._id }" :exclude="usersByStatus().map(u => u._id)" />
                </div>

                <div class="+mt-40" v-if="usersByStatus(['attending']).length > 0">
                    <div class="ft-title-xs mb-20">
                        <span class="round-s mr-5 bg-bg-strong">{{ usersByStatus(['attending']).length }}</span> Inscrits
                    </div>
                    <div class="+mt-10 fx-center" v-for="participant in usersByStatus(['attending'])" :key="participant._id">
                        <user-icon :display-name="true" :display-id="true" v-bind="participant" />

                        <button-base :modifiers="['xs']" @click="() => onManage({ status: 'confirmed', _id: participant._id })" :loading="usersLoading.includes(participant._id)">
                            Confirmer la présence
                        </button-base>
                    </div>
                </div>

                <div class="+mt-40" v-if="usersByStatus(['confirmed']).length > 0">
                    <div class="ft-title-xs mb-20">
                        <span class="round-s mr-5 bg-bg-strong">{{ usersByStatus(['confirmed']).length }}</span> Participations confirmées
                    </div>
                    <div class="+mt-10 fx-center" v-for="participant in usersByStatus(['confirmed'])" :key="participant._id">
                        <user-icon :display-name="true" :display-id="true" v-bind="participant" />

                        <button-base :modifiers="['xs']" @click="() => onManage({ status: 'attending', _id: participant._id })" :loading="usersLoading.includes(participant._id)">
                            Annuler
                        </button-base>
                    </div>
                </div>
            </div>
        </template>
    </popin>
</template>

<script>
import GatheringMixin from '@/mixins/gathering'

export default {
    mixins: [ GatheringMixin ],
    props: {
        isActive: { type: Boolean, default: false },
        gathering: { type: Object, default: () => {} }
    },
    data: () => ({
        usersLoading: []
    }),
    methods: {
        async onManage (status) {
            this.usersLoading = [ ...this.usersLoading, status._id ]

            await this.onBookManage(status)

            this.usersLoading = this.usersLoading.filter(u => u != status._id)
        }

    }
}
</script>

<style>

</style>