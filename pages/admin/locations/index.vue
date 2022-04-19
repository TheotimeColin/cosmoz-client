<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="row-s">
                    <div class="col-4 mb-40" v-for="location in locations" :key="location._id">
                        <nuxt-link :to="localePath({ name: 'locations-id', params: { id: location._id } })">{{ location.title }}</nuxt-link>
                    </div>
                </div>
            </div>

            <div class="Page_side">
                <button-base
                    tag="nuxt-link"
                    :modifiers="['light']"
                    icon-before="plus"        
                    :attrs="{
                        to: localePath({ name: 'locations-id', params: { id: 'new' } })
                    }"
                >
                    Créer un nouveau lieu
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LocationsPage',
    layout: 'admin',
    middleware: 'admin',
    async fetch () {
        await this.$store.dispatch('location/fetch', {
            query: {}
        })
    },
    computed: {
        locations () { return this.$store.getters['location/find']() },
    }
}
</script>