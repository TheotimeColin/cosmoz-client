<template>
    <div class="d-inline-block">
        <template v-if="user">
            <button-base class="fx-grow is-disabled" :modifiers="['light', 's']" v-if="hasWaitingList">
                événement complet
            </button-base>
            <button-base class="fx-grow" :modifiers="['light', size]" :icon-before="hasBooked ? 'check' : 'clock'" @click="$emit('manage')" v-else-if="hasBooked || isWaiting">
                {{ hasBooked ? `Tu participes` : `En liste d'attente` }}
            </button-base>
            <button-base class="fx-grow" :modifiers="['light', size]" icon-before="arrow-right" @click="$emit('manage')" v-else>
                {{ (hasWaitingList ? `Entrer en liste d'attente` : `Je participe !`) }}
            </button-base>
        </template>
        <template v-else>
            <button-base class="fx-grow" :modifiers="['light', size]" icon-before="arrow-right" @click="$store.commit('page/register', `sub-${gathering._id}`)">
                Je participe !
            </button-base>
        </template>
    </div>
</template>

<script>
import GatheringMixin from '@/mixins/gathering'

export default {
    name: 'PageGatheringAtionButton',
    mixins: [ GatheringMixin ],
    props: {
        gathering: { type: Object, default: () => {} },
        size: { type: String, default: 'm' }
    },
    data: () => ({
        isManage: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
    }
}
</script>

<style>

</style>