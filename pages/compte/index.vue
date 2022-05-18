<template>
    <div>
        <div class="Wrapper pv-60">
            <p class="ft-2xl-bold">Hey {{ user.name }} !</p> {{ user.email }}

            <div class="mt-30">
                <button-base :to="{ name: 'compte-logout' }">
                    Se déconnecter
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AccountPage',
    middleware: 'loggedUser',
    
    data: () => ({
        
    }),
    computed: {  
        user () { return this.$store.getters['user/self'] },
    },
    async mounted () {

    }
}
</script>