<template>
    <div class="Orga page" v-if="orga">
        <!-- <div class="pv-15 bg-bg">
            <div class="Wrapper ft-title-2xs">
                antiswipe
            </div>
        </div> -->

        <div class="Wrapper">
            <div class="d-flex d-block@s pt-30@xs">
                <div class="width-xs fx-no-shrink mr-40 width-100@s ml-0@s mb-40@s">
                    <page-const-banner v-bind="orga" class="mb-20" :min="true" />

                    <page-const-nav :slug="orga.slug" />
                </div>

                <div class="fx-grow o-hidden pv-30">
                    <content-feed />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async fetch () {
        const response = await this.$store.dispatch('organization/get', {
            query: { slug: this.$route.params.slug }
        })
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        orga () {
            return this.$store.getters['organization/findOne']({
                slug: this.$route.params.slug
            })
        }
    },
}
</script>