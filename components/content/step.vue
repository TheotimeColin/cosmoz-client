<template>
    <div class="fx-center pv-40">
        <hr class="Separator">


        <p class="ft-xs color-ft-weak mh-10 fx-no-shrink"> 
            <fa icon="far fa-angle-up" class="mr-5" />
            {{ title }}
            <fa icon="far fa-angle-up" class="ml-5" />
        </p>

        <hr class="Separator">
    </div>
</template>

<script>
export default {
    name: 'ContentStep',
    props: {
        title: { type: String }
    }
}
</script>

<style>

</style>