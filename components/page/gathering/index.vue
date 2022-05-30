<template>
    <div>
        <div class="mb-20" v-if="$smallerThan('s')">
            <page-gathering-manage :gathering="gathering" />
        </div>

        <template v-if="user">
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
        </template>
        <template v-else>
            <div class="ellipsis-3" v-html="gathering.intro || gatering.description"></div>

            <p class="ft-bold mv-20">Le reste des informations est accessible aux membres.</p>

            <div class="p-30 bg-bg-xstrong br-s text-center">
                <div class="row-s">
                    <div class="col-4 col-12@s">
                        <h3 class="ft-title-2xs">
                            <fa icon="far fa-heart" class="color-ft-weak" />
                            <p class="mt-5">Des rencontres conviviales</p>
                        </h3>
                    </div>
                    <div class="col-4 col-12@s mt-30@s">
                        <h3 class="ft-title-2xs">
                            <fa icon="far fa-hand-wave" class="color-ft-weak" />
                            <p class="mt-5">De nouveaux potes près de chez toi</p>
                        </h3>
                    </div>
                    <div class="col-4 col-12@s mt-30@s">
                        <h3 class="ft-title-2xs">
                            <fa icon="far fa-beer-mug" class="color-ft-weak" />
                            <p class="mt-5">Organise tes propres sorties</p>
                        </h3>
                    </div>
                </div>

                <button-base class="mt-30" :modifiers="['s', 'light']" @click="$store.commit('page/register', 'g-index')">Je m'inscris gratuitement</button-base>
            </div>
        </template>
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