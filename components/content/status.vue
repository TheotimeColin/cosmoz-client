<template>
    <div class="Status">
        <div class="Status_content">
            <p class="ft-xs color-ft-weak mb-10">Il y a 2 heures</p>

            <p class="ft-title-xs">
                C'est terminé !
            </p>
            <p class="ft-m-medium mt-5">Merci d'avoir participé à l'événement.</p>

            <content-reactions
                :size="'m'"
                :static-id="_id"
                :default-reactions="[
                    { type: '❤️', default: true },
                    { type: '👏', default: true },
                    { type: '🍻', default: true }
                ]"
            />
        </div>

        <div class="fx-center mt-60">
            <hr class="Separator">
            <p class="ft-xs color-ft-weak mh-10 fx-no-shrink">Fin de l'événement.</p>
            <hr class="Separator">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        _id: { type: String },
        content: { type: String },
    },
    data: () => ({
      
    }),
    computed: {

    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
    .Status {
        text-align: center;
    }

    .Status_content {
        padding: 20px;
        border-radius: 10px;
        background-color: color-opacity('bg-strong', -50%);
    }
</style>