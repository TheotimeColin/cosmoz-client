<template>
    <div class="Page_wrapper Wrapper Wrapper--s">
        <div class="Section">
            <div class="p-40 bg-bg-strong br-s">
                <div class="text-center">
                    <div class="ft-title-2xs tape tape-s mb-15">En bêta</div>

                    <p class="ft-title-s mb-5">Organiser avec Cosmoz</p>
                    
                    <p class="mb-20">Permet aux membres de s'inscrire via la plateforme.</p>

                    <button-base :modifiers="['light', 's']" :to="{ name: 'c-slug-manage-events-id', params: { id: 'new', slug: constellation.slug } }" icon-before="plus">Créer une rencontre</button-base>
                </div>

                <hr class="Separator mv-40">

                <div class="text-center">
                    <p class="ft-title-s mb-5">Rediriger vers une autre plateforme</p>
                    <p class="mb-20">Si tu l'as déjà créée via Meetup, EventBrite...</p>

                    <button-base :modifiers="['s', 'weak']" :to="{ name: 'c-slug-manage-events-id', params: { id: 'new', slug: constellation.slug }, query: { link: 'true' } }" icon-before="plus">Ajouter une rencontre</button-base>
                </div>
            </div>
        </div>

        <div class="Section" v-if="gatherings.filter(g => g.status == 'active' && !g.isPast).length > 0">    
            <h1 class="ft-title-m">Rencontres à venir</h1>

            <div class="row-xs">
                <div class="col-3 col-12@xs" v-for="gathering in gatherings.filter(g => g.status == 'active' && !g.isPast)" :key="gathering._id">
                    <block-gathering
                        class="mt-20"
                        :modifiers="['square']"
                        :replace-link="localePath({ name: `c-slug-manage-events-id`, params: { slug: constellation.slug, id: gathering._id } })"
                        :status-only="true"
                        v-bind="gathering"
                    />
                </div>
            </div>
        </div>

        <div class="Section" v-if="gatherings.filter(g => g.status == 'draft' && !g.isPast).length > 0">
            <h1 class="ft-title-m">Brouillons</h1>

            <div class="row-xs">
                <div class="col-3 col-6@s col-12@xs" v-for="gathering in gatherings.filter(g => g.status == 'draft')" :key="gathering._id">
                    <block-gathering
                        class="mt-20"
                        :modifiers="['square']"
                        :replace-link="localePath({ name: `c-slug-manage-events-id`, params: { slug: constellation.slug, id: gathering._id } })"
                        :status-only="true"
                        v-bind="gathering"
                    />
                </div>
            </div>
        </div>

        <div class="Section" v-if="gatherings.filter(g => g.isPast && g.status == 'active').length > 0">
            <h1 class="ft-title-m">Passées</h1>

            <div class="row-xs">
                <div class="col-3 col-6@s col-12@xs" v-for="gathering in gatherings.filter(g => g.isPast && g.status == 'active')" :key="gathering._id">
                    <block-gathering
                        class="mt-20"
                        :modifiers="['square']"
                        :replace-link="localePath({ name: `c-slug-manage-events-id`, params: { slug: constellation.slug, id: gathering._id } })"
                        :status-only="true"
                        v-bind="gathering"
                    />
                </div>
            </div>
        </div>

        <div class="Section" v-if="gatherings.filter(g => g.isPast && g.status == 'disabled').length > 0">
            <h1 class="ft-title-m">Désactivés</h1>

            <div class="row-xs">
                <div class="col-3 col-6@s col-12@xs" v-for="gathering in gatherings.filter(g => g.isPast && g.status == 'disabled')" :key="gathering._id">
                    <block-gathering
                        class="mt-20"
                        :modifiers="['square']"
                        :replace-link="localePath({ name: `c-slug-manage-events-id`, params: { slug: constellation.slug, id: gathering._id } })"
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
        this.$store.commit('page/set', {
            subtitle: `Gestion des rencontres`, fa: 'calendar-pen'
        })

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