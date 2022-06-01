<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="row-xs">
                    <div class="col-4 col-6@s col-12@xs mb-10" v-for="gathering in gatherings.filter(g => !g.isPast)" :key="gathering._id">
                        <block-gathering
                            v-bind="gathering"
                            :modifiers="['square']"
                            :const-only="true"
                            :link="localePath({ name: 'gatherings-id', params: { id:  gathering._id } })"
                        />
                    </div>
                </div>

                <div class="row-xs mt-60">
                    <div class="col-4 col-6@s col-12@xs mb-10" v-for="gathering in gatherings.filter(g => g.isPast)" :key="gathering._id">
                        <block-gathering
                            v-bind="gathering"
                            :modifiers="['square']"
                            :const-only="true"
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
                    :to="{ name: 'gatherings-id', params: { id: 'new' } }"
                >
                    Nouveau
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