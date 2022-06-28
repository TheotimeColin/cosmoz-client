<template>
    <popin :is-active="isActive" :modifiers="['m']" query="edit" @open="$emit('open')" @close="$emit('close')">
        <form id="profile" @submit.prevent="onSubmit" class="ProfileEdit strong" slot="content">
            <div class="ratio-15 ratio-25@xs bgi-cover" :style="{ backgroundImage: `url(${$bg.holo})` }"></div>

            <div class="p-30">
                <div class="d-flex fxa-center mb-30 d-block@xs">
                    <label class="c-pointer" for="profile-edit">
                        <user-icon :no-link="true" :modifiers="$smallerThan('xs') ? ['xl'] : ['2xl']" v-bind="formData" :picture-src="picture" badge="pen" />
                    </label>

                    <div class="ml-30 ml-0@xs mt-20@xs">
                        <p class="ft-title-xs">Photo de profil</p>
                        <p class="ft-s color-ft-weak mt-3">Ta photo de profil sera uniquement visible par les personnes que tu as croisé lors d'un événement.</p>

                        <div class="mt-15">
                            <button-base tag="label" :attrs="{ for: 'profile-edit' }" :modifiers="['s', 'cosmoz']" icon-before="image">
                                Choisir une image
                            </button-base>

                            <link-base class="ml-10" @click="() => { formData.picture == null; formData.removePicture = true }" v-if="picture">
                                Retirer ma photo
                            </link-base>
                        </div>

                        <div class="hide">
                            <input-file :no-label="true" id="profile-edit" v-model="formData.newPicture" />
                        </div>
                    </div>
                </div>
                
                <input-base class="+mt-10" label="Nom affiché" 
                validator="name" v-model="formData.name" :required="true" />
            
                <div class="+mt-10 p-15 br-xs bg-bg-weak weak">
                    <input-date label="Date de naissance" v-model="formData.birthdate" :required="true" prefix="@" />

                    <p class="ft-xs color-ft-weak mt-15">
                        <fa icon="fas fa-lock" class="mr-3"></fa> Information privée
                    </p>
                </div>
            </div>
        </form>

        <div slot="footer" class="p-15 text-right fx-grow">
            <button-base type="submit" form="profile" :modifiers="['light']" :loading="isLoading">
                Sauvegarder les changements
            </button-base>
        </div>
    </popin>
</template>

<script>
import EntityEditor from '@/mixins/entity-editor'

export default {
    name: 'ProfileEdit',
    mixins: [ EntityEditor ],
    props: {
        isActive: { type: Boolean }
    },
    data: () => ({
        entityId: '',
        entityType: 'user',
        inputs: ['picture', 'name', 'alias', 'birthdate']
    }),
    computed: {
        
        picture () {
            if (this.formData.removePicture) return null

            return this.formData.newPicture ? URL.createObjectURL(this.formData.newPicture) : this.user.profileLarge
        },
        defaultFormData () {
            return {
                newPicture: '',
                removePicture: false
            }
        },
    },
    watch: {
        user: {
            immediate: true,
            handler (v) {
                if (v) this.entityId = v._id
            }
        }
    },
    methods: {
        postSubmit () {
            this.formData.newPicture = ''
        },
        postSubmitSuccess () {
            this.$emit('close')
        }
    }
}
</script>

<style>

</style>