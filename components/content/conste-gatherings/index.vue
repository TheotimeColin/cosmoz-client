<template>
    <div class="ConsteGatherings" v-if="constellation">
        <div class="pt-20 ph-20 fx-center">
            <const-icon v-bind="constellation" :display-name="true" :modifiers="['m']" />

            <button-base :modifiers="['s']" class="ml-15" icon-after="arrow-right" :to="{ name: 'c-slug-events', params: { slug: constellation.slug } }">
                Voir l'agenda
            </button-base>
        </div>

        
        <p class="ph-20 mt-15 ft-m">
            {{ gatherings.length }} événements dans les 10 prochains jours
        </p>
        
        <slider-block class="mt-20" :slots="gatherings.map(g => g._id).slice(0, 6)" :offset="20" :offset-v="20" :ratio="130" item-class="width-2xs" :margin="10">
            <block-gathering
                v-for="gathering in gatherings.slice(0, 6)"
                :slot="gathering._id"
                :modifiers="['square']"
                :key="gathering._id"
                v-bind="gathering"
            />
        </slider-block>
    </div>
</template>

<script>
export default {
    name: 'ContentConsteGatherings',
    props: {
        constellation: { type: Object },
        gatherings: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss" scoped>
.ConsteGatherings {
    border-radius: 10px;
    background-color: var(--color-bg-weak);
    position: relative;
    @include shadow-s;
}


@include breakpoint-xs {

    .ConsteGatherings {
        margin-left: -20px;
        margin-right: -20px;
        border-radius: 0;
    }
}
</style>