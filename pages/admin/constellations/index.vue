<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="row-xs">
                    <div class="col-6 col-6@s col-12@xs mb-10" v-for="constellation in constellations" :key="constellation._id">
                        <block-const
                            v-bind="constellation"
                            :link="localePath({ name: 'constellations-id', params: { id:  constellation._id } })"
                        />
                    </div>
                </div>
            </div>

            <div class="Page_side">
                <button-base
                    tag="nuxt-link"
                    :modifiers="['light']"
                    icon-before="plus"        
                    :to="{ name: 'constellations-id', params: { id: 'new' } }"
                >
                    Nouveau
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstellationPage',
    layout: 'admin',
    middleware: 'admin',
    async fetch () {
        await this.$store.dispatch('constellation/fetch', {
            query: {}
        })
    },
    computed: {
        constellations () { return this.$store.getters['constellation/find']() },
    }
}
</script>