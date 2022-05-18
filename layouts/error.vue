<template>
    <div class="Error">
        <div class="bg-cover bg-night pv-60">
            <div class="Wrapper">
                <p class="ft-title-xl ft-title-l@s">Oups, c'est une erreur {{ error ? error.statusCode : '' }}</p>
                <p class="ft-italic">{{ error && error.message ? error.message : `Erreur non-spécifiée` }}</p>

                <div class="mt-20">
                    <button-base :modifiers="['light']" tag="a" :href="user ? $config.baseUrl : $config.baseUrl">
                        Revenir en lieu sûr
                    </button-base>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'nuxtError',
    layout: 'default',
    props: {
        error: { type: Object, default: () => {} }
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
    }
}
</script>