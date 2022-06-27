<template>
    <div class="Error bg-cover bg-night">
        <div class="Wrapper">
            <p class="ft-title-2xl ft-title-l@s">Oups, c'est une erreur {{ error ? error.statusCode : '' }}</p>
            <p class="ft-italic">{{ error && error.message ? error.message : `Erreur non-spécifiée` }}</p>

            <div class="mt-20">
                <button-base :modifiers="['light']" tag="a" :href="user ? $config.baseUrl : $config.baseUrl">
                    Revenir en lieu sûr
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'nuxtError',
    layout: 'full',
    props: {
        error: { type: Object, default: () => {} }
    },
    computed: {
        
    }
}
</script>

<style lang="scss" scoped>
.Error {
    min-height: 100vh;
    padding: 100px 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
</style>