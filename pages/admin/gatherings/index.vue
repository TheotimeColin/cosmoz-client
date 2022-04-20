<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="row-s">
                    <div class="col-6 col-12@s mb-40" v-for="gathering in gatherings" :key="gathering._id">
                        <block-gathering
                            v-bind="gathering"
                            :hide-dates="true"
                            :link="localePath({ name: 'gatherings-id', params: { id:  gathering._id } })"
                        />
                    </div>
                </div>
            </div>

            <div class="Page_side">
                <button-base
                    tag="nuxt-link"
                    :modifiers="['light']"
                    icon-before="plus"        
                    :attrs="{
                        to: localePath({ name: 'gatherings-id', params: { id: 'new' } })
                    }"
                >
                    Créer un nouveau Gathering
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GatheringsPage',
    layout: 'admin',
    middleware: 'admin',
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: {}
        })
    },
    computed: {
        gatherings () { return this.$store.getters['gathering/find']() },
    }
}
</script>