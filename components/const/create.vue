<template>
    <form @submit.prevent="onSubmit">
        <transition-group name="fade">
            <div v-if="!formData.type" key="type">
                <p class="ft-title-s mb-30">Que veux-tu créer ?</p>

                <button-base type="button" class="+mt-5" :modifiers="['rect']" icon-before="hand-wave" icon-after="angle-right" subtitle="Parfait pour organiser des sorties et discuter avec tes potes." @click="formData.type = 'hidden'">
                    Groupe d'amis (simplifié)
                </button-base>

                <button-base type="button" class="+mt-5" :modifiers="['rect']" icon-before="face-sunglasses" icon-after="angle-right" subtitle="Si tu comptes y accueillir du monde et organiser des événements." @click="formData.type = 'public'">
                    Communauté (avancé)
                </button-base>
            </div>
            <div v-else key="info">
                <p class="ft-title-s mb-30">Personnalise ta communauté</p>

                <div class="block-r fx-center">
                    <label class="c-pointer" for="image-edit">
                        <const-icon class="mr-15" :no-link="true" :picture-src="picture" :modifiers="['xl']" :name="formData.name" badge="pen" />
                    </label>
                        
                    <input-base label="Nom du groupe" placeholder="La Communauté de l'Anneau" validator="consteName" v-model="formData.name" />
                </div>

                <div class="hide">
                    <input-file :no-label="true" id="image-edit" v-model="formData.newPicture" />
                </div>

                <div class="mt-20 fx-center">
                    <link-base icon-before="arrow-left" @click="formData.type = ''">Retour</link-base>

                    <button-base type="button" :modifiers="['cosmoz']" :disabled="!formData.name">
                        Créer
                    </button-base>
                </div>
            </div>
        </transition-group>
    </form>
</template>

<script>
export default {
    name: 'ConstellationCreate',
    middleware: ['loggedUser'],
    layout: 'app',
    data: () => ({
        formData: {
            type: '',
            join: '',
            newPicture: ''
        }
    }),
    computed: {
        picture () {
            if (this.formData.removePicture) return null

            return this.formData.newPicture ? URL.createObjectURL(this.formData.newPicture) : this.user.profileLarge
        }
    }
}
</script>