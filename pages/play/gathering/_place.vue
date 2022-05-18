<template>
    <div class="Page bg-bg">
        <p class="ft-title-m mb-30">#01 : Introduction</p>

        <card class="bg-bg" :items="items" />
    </div>
</template>

<script>
import Kawaa from '@/utils/gatherings/kawaa'

export default {
    name: 'GatheringPlace',
    
    data: () => ({
        placeId: '',
        items: []
    }),
    created () {
        this.placeId = this.$route.params.place

        this.items = Kawaa
    },
}
</script>

<style lang="scss" scoped>
.Page {
    padding: 30px;
    height: 100vh;
    overflow: hidden;
}
</style>