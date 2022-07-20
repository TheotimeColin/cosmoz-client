<template>
    <div class="GatheringEnd">
        <div class="fx-center ph-20 pt-20">
            <div class="GatheringEnd_icon" @click="() => noLink ? {} : $store.commit('page/popin', { event: id })" :style="{ backgroundImage: `url(${hero})` }"></div>

            <div class="fx-grow">
                <link-base class="ft-title-xs mb-3" :modifiers="['l']" @click="() => noLink ? {} : $store.commit('page/popin', { event: id })">{{ $ellipsis(title, 30) }}</link-base>
                <p class="ft-xs color-ft-weak">{{ $moment(date).fromNow() }}</p>
            </div>
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
        hero: { type: String },
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

.GatheringEnd_icon {
    width: 45px;
    height: 45px;
    cursor: pointer;
    flex-shrink: 0;
    border-radius: 5px;
    margin-right: 12px;
    background-size: cover;
    background-position: center;
    background-color: var(--color-bg-strong);
}

@include breakpoint-xs {

    .GatheringEnd {
        margin-left: -20px;
        margin-right: -20px;
        border-radius: 0;
    }
}
</style>