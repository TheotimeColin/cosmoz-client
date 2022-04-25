<template>
    <popin-base :modifiers="['absolute-header', 'm']" :is-active="isActive" @close="$emit('close')">
        <template slot="content">
            <div class="p-30">
                <p class="ft-title-m">
                    Nos expériences en avant-première
                </p>

                <p class="mt-10">Tous les mardis, reçois la liste des nouvelles expériences directement dans ta boîte mail. Pas de spam.</p>

                <form class="strong mt-20" @submit.prevent="onSubmit">
                    <div class="row-xs">
                        <div class="col-6">
                            <input-base label="Ton prénom" v-model="formData.name" />
                        </div>
                        <div class="col-6">
                            <input-base label="Ton adresse e-mail" v-model="formData.email" />
                        </div>
                    </div>

                    <p class="ft-s-medium mt-20">Les Gatherings qui t'intéressent :</p>
                    <div class="row-2xs mt-5">
                        <div class="col-4 mt-5" v-for="category in CATEGORIES" :key="category.value">
                            <input-image-check v-bind="category" :value="formData.categories.includes(category.id)" @input="(v) => toggleCategory(category.id, v)" />
                        </div>
                    </div>

                    <div class="text-right mt-20">
                        <button-base :modifiers="['light']">
                            Je m'inscris
                        </button-base>
                    </div>
                </form>
            </div>
        </template>
    </popin-base>
</template>

<script>
const CATEGORIES = [
    { label: `chill`, id: 'chill', description: `Ambiances propices à la discussion`, background: 'https://images.unsplash.com/photo-1615705592748-029c989e6d5c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80' },
    { label: `festif`, id: 'fiesta', description: `Ambiances animées & musique`, background: 'https://images.unsplash.com/photo-1621295244949-580172382e4c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80' },
    { label: `impact`, id: 'impact', description: `S'amuser & étendre son réseau pro`, background: 'https://images.unsplash.com/photo-1595411425732-e69c1abe2763?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
    { label: `insolite`, id: 'unique', description: `Lieux & expériences uniques`, background: 'https://images.unsplash.com/photo-1541356665065-22676f35dd40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60' },
    { label: `geek`, id: 'geek', description: `Jouer & partager ses passions`, background: 'https://images.unsplash.com/photo-1610337673044-720471f83677?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1672&q=80' },
    { label: `queer`, id: 'queer', description: `Safe-spaces pour la commu LGBTQ`, background: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
    { label: `-35 ans`, id: 'young', description: `Comme son nom l'indique`, background: 'https://images.unsplash.com/photo-1644943054825-13b1e3f22d60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
    { label: `girls only`, id: 'girls', description: `Rencontres entre filles uniquement`, background: 'https://images.unsplash.com/photo-1632905460027-abad5efa8798?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2129&q=80' },
    { label: `travellers`, id: 'world', description: `For locals & visitors, in english`, background: 'https://images.unsplash.com/photo-1530788446596-f1dfa729142f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80' },
]

import { InputBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'PopinNewsletter',
    components: { InputBase, ToggleBase },
    props: {
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        CATEGORIES,
        formData: {
            name: '',
            email: '',
            categories: []
        }
    }),
    methods: {
        toggleCategory (id, value) {
            if (value) {
                this.formData.categories = [ ...this.formData.categories, id ]
            } else {
                this.formData.categories = this.formData.categories.filter(c => c != id)
            }
        },
        async onSubmit () {
            const response = await this.$store.dispatch('newsletter/subscribe', this.formData)

            console.log(response)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>