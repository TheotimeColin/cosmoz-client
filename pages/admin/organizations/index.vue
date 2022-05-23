<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="row-xs">
                    <div class="col-6 col-6@s col-12@xs mb-10" v-for="organization in organizations" :key="organization._id">
                        <block-orga
                            v-bind="organization"
                            :link="localePath({ name: 'organizations-id', params: { id:  organization._id } })"
                        />
                    </div>
                </div>
            </div>

            <div class="Page_side">
                <button-base
                    tag="nuxt-link"
                    :modifiers="['light']"
                    icon-before="plus"        
                    :to="{ name: 'organizations-id', params: { id: 'new' } }"
                >
                    Nouveau
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrganizationsPage',
    layout: 'admin',
    middleware: 'admin',
    async fetch () {
        await this.$store.dispatch('organization/fetch', {
            query: {}
        })
    },
    computed: {
        organizations () { return this.$store.getters['organization/find']() },
    }
}
</script>