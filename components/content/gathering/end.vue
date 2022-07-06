<template>
    <div class="GatheringEnd">
        <div class="fx-center ph-20 pt-20">
            <div>
                <p class="ft-title-xs ellipsis-1 ellipsis-break">{{ title }}</p>
                <p class="ft-xs color-ft-weak">{{ $moment(date).fromNow() }}</p>
            </div>

            <button-base :modifiers="$smallerThan('xs') ? ['round'] : ['s']" class="ml-15" icon-after="arrow-right" :to="{ name: 'c-slug-events-eventId', params: { slug: constellationData.slug, eventId: id } }" 
            :text="$smallerThan('xs') ? '' : 'Voir la page'" v-if="constellationData" />
        </div>

        <div class="ph-20 mt-20">Merci d'avoir participé à cet événement ! Et si tu gardais le contact avec les personnes que tu as rencontrées ? ✨</div>
        
        <slider-block
            :slots="attendedUsers.map(u => u._id)"
            :ratio="150" item-class="width-2xss" :margin="8" :offset="$smallerThan('xs') ? 15 : 20"
            :offset-v="20"
            :padding-t="20"
        >
            <div class="p-relative" v-for="profile in attendedUsers" :slot="profile._id" :key="profile._id">
                <user-profile v-bind="profile" :no-link="true" @click.native="() => selectedUser = profile" />
            </div>
        </slider-block>

        
        <user-popin-mention :selected-user="selectedUser" :gathering="_id" @close="selectedUser = null" />
    </div>
</template>

<script>
export default {
    name: 'ContentGatheringEnd',
    props: {
        _id: { type: String },
        id: { type: String },
        title: { type: String },
        date: { type: String },
        constellation: { type: String },
        users: { type: Array, default: () => [] }
    },
    data: () => ({
        selectedUser: null
    }),
    computed: {
        constellationData () {
            return this.$store.getters['constellation/findOne']({
                _id: this.constellation
            })
        },
        attendedUsers () {
            return this.$store.getters['user/find']({
                _id: { $in: this.users.filter(u => u.status == 'confirmed' || u.status == 'attending').map(u => u._id) }
            }).filter(u => u && u._id != this.user._id)
        }
    }
}
</script>

<style lang="scss" scoped>
.GatheringEnd {
    border-radius: 10px;
    background-color: var(--color-bg-weak);
    position: relative;
    @include shadow-s;
}


@include breakpoint-xs {

    .GatheringEnd {
        margin-left: -20px;
        margin-right: -20px;
        border-radius: 0;
    }
}
</style>