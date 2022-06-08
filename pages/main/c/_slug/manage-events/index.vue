<template>
    <div class="Wrapper pv-40">
        <div class="Section">
            <h1 class="ft-title-m">Rencontres à venir</h1>

            <div class="row-s">
                <div class="col-3 col-12@xs pt-20">
                    <div class="d-flex fxj-center fxa-center height-100 p-20 bg-bg-strong text-center br-s">
                        <button-base :modifiers="['light', 's']" :to="{ name: 'c-slug-manage-events-id', params: { id: 'new', slug: constellation.slug } }" icon-before="plus">Organiser</button-base>
                    </div>
                </div>
                <div class="col-3 col-12@xs" v-for="gathering in gatherings.filter(g => g.status == 'active' && !g.isPast)" :key="gathering._id">
                    <block-gathering
                        class="mt-20"
                        :modifiers="['square']"
                        :link="localePath({ name: `c-slug-manage-events-id`, params: { slug: constellation.slug, id: gathering._id } })"
                        :status-only="true"
                        v-bind="gathering"
                    />
                </div>
            </div>
        </div>

        <div class="Section" v-if="gatherings.filter(g => g.status == 'draft' && !g.isPast).length > 0">
            <h1 class="ft-title-m">Brouillons</h1>

            <div class="row-s">
                <div class="col-3 col-6@s col-12@xs" v-for="gathering in gatherings.filter(g => g.status == 'draft')" :key="gathering._id">
                    <block-gathering
                        class="mt-20"
                        :modifiers="['square']"
                        :link="localePath({ name: `c-slug-manage-events-id`, params: { slug: constellation.slug, id: gathering._id } })"
                        :status-only="true"
                        v-bind="gathering"
                    />
                </div>
            </div>
        </div>

        <div class="Section" v-if="gatherings.filter(g => g.isPast && g.status == 'active').length > 0">
            <h1 class="ft-title-m">Passées</h1>

            <div class="row-s">
                <div class="col-3 col-6@s col-12@xs" v-for="gathering in gatherings.filter(g => g.isPast && g.status == 'active')" :key="gathering._id">
                    <block-gathering
                        class="mt-20"
                        :modifiers="['square']"
                        :link="localePath({ name: `c-slug-manage-events-id`, params: { slug: constellation.slug, id: gathering._id } })"
                        :status-only="true"
                        v-bind="gathering"
                    />
                </div>
            </div>
        </div>

        <div class="Section" v-if="gatherings.filter(g => g.isPast && g.status == 'disabled').length > 0">
            <h1 class="ft-title-m">Désactivés</h1>

            <div class="row-s">
                <div class="col-3 col-6@s col-12@xs" v-for="gathering in gatherings.filter(g => g.isPast && g.status == 'disabled')" :key="gathering._id">
                    <block-gathering
                        class="mt-20"
                        :modifiers="['square']"
                        :link="localePath({ name: `c-slug-manage-events-id`, params: { slug: constellation.slug, id: gathering._id } })"
                        :status-only="true"
                        v-bind="gathering"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: { constellation: this.constellation._id }
        })
    },
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gatherings () {
            return this.$store.getters['gathering/find']({
                constellation: { '$id': this.constellation._id }
            })
        }
    },
    head () {
        this.$emit('page', {            
            subtitle: `Gestion des rencontres`, fa: 'calendar-pen'
        })
        
        let meta = {
            title: `Gestion des rencontres ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>

<style lang="scss" scoped>

.Section {

    & + & {
        margin-top: 40px;
    }
}
</style>