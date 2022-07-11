<template>
    <div class="d-inline-block">
        <template v-if="user && gathering.visibility == 'group' && constellation && !constellation.isMember">
            <button-base class="fx-grow" icon-before="star" :modifiers="['cosmoz']" :to="{ name: 'c-slug-rejoindre', params: { slug: constellation.slug }}">
                Réservé aux membres
            </button-base>
        </template>
        <template v-else-if="user">
            <button-base class="fx-grow" :disabled="true" :modifiers="['light']" v-if="hasWaitingList">
                Événement complet
            </button-base>

            <div v-else-if="hasBooked || isWaiting">
                <link-base class="mr-5" @click="$emit('cancel')">Me désinscrire</link-base>

                <button-base :modifiers="['light', 'l', 'no-click']" :icon-before="hasBooked ? 'check' : 'clock'" @click="$emit('manage')">
                    {{ hasBooked ? `Tu y participes` : `En liste d'attente` }}
                </button-base>
            </div>

            <button-base class="fx-grow" :modifiers="['light', 'l']" icon-before="arrow-right" @click="$emit('manage')" v-else>
                {{ (hasWaitingList ? `Entrer en liste d'attente` : `Je participe !`) }}
            </button-base>
        </template>
        <template v-else>
            <button-base class="fx-grow" :modifiers="['cosmoz', 'l']" icon-before="arrow-right" @click="$store.commit('page/register', `sub-${gathering._id}`)">
                Je participe !
            </button-base>

            <p class="ft-s-medium color-ft-weak mt-5">2 places restantes</p>
        </template>
    </div>
</template>

<script>
import GatheringMixin from '@/mixins/gathering'

export default {
    name: 'PageGatheringAtionButton',
    mixins: [ GatheringMixin ],
    props: {
        gathering: { type: Object, default: () => {} }
    },
    data: () => ({
        isManage: false
    }),
    computed: {
        
    }
}
</script>

<style>

</style>