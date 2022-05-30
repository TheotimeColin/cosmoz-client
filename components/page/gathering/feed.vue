<template>
    <div>
        <content-feed
            placeholder="Une question ? Une information à donner ?"
            read="user"
            :max="3"
            :gathering="gathering._id"
            v-if="user"
        />

        <div class="p-30 bg-bg-xstrong br-s text-center" v-if="!user">
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

            <button-base class="mt-30" :modifiers="['s', 'light']" @click="$store.commit('page/register', 'g-feed')">Je m'inscris gratuitement</button-base>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageGatheringFeed',
    props: {
        gathering: { type: Object, default: () => {} }
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
    }
}
</script>

<style>

</style>