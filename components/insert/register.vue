<template>
    <div class="p-30 bg-bg-strong br-s text-center">
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

<script>
export default {

}
</script>
