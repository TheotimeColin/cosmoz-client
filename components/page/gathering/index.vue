<template>
    <div>
        <div class="mb-20" v-if="$smallerThan('s')">
            <page-gathering-manage :gathering="gathering" />
        </div>

        <div class="Gathering_section" v-if="gathering.intro">
            <h2 class="ft-title-m mb-15">Intro</h2>
            <text-body :modifiers="['gathering']" :value="gathering.intro" />
        </div>

        <div class="Gathering_section" v-if="gathering.description && gathering.description != '<p></p>'">
            <h2 class="ft-title-m mb-15">Détails</h2>
            <text-body :modifiers="['gathering']" :value="gathering.description" />
        </div>

        <div class="Gathering_section" v-if="gathering.venue && gathering.venue != '<p></p>'">
            <h2 class="ft-title-m mb-15">À propos du lieu</h2>
            <text-body :modifiers="['gathering']" :value="gathering.venue" />
        </div>

        <div class="Gathering_section p-20 bg-bg-weak br-s" v-if="gathering.important && gathering.important != '<p></p>'">
            <h2 class="ft-title-2xs mb-15 tape">Important</h2>
            <text-body :modifiers="['gathering']" :value="gathering.important" />
        </div>

        <div class="Gathering_section" v-if="gathering.information && gathering.information != '<p></p>'">
            <h2 class="ft-title-m mb-15">Informations pratiques</h2>
            <text-body :modifiers="['gathering']" :value="gathering.information" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageGathering',
    props: {
        gathering: { type: Object, default: () => {} }
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
    }
}
</script>


<style lang="scss" scoped>
.Gathering_section {

    & + & {
        margin-top: 40px;
    }
}
</style>