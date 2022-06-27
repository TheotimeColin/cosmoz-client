<template>
    <div>
        <form @submit.prevent="onSubmit">
            <div class="block mt-20">
                <div class="Image" :style="{ backgroundImage: `url(${coverPreview})` }">
                    <button-base type="button" :modifiers="['round', 'weak']" icon-before="pen" @click="options.cover = !options.cover" />
                </div>

                <input-pexels @select="(v) => formData.coverSelect = v" :is-active="options.cover" @close="options.cover = false" :height="$smallerThan('xs') ? 250 : 150" />

                 <div class="d-flex fxa-start mt-30 d-block@xs n-mt-30@xs ">
                    <label>
                        <const-icon class="mr-15" :no-link="true" :picture-src="logoPreview" :modifiers="['xl']" badge="pen" />

                        <div class="hide">
                            <input-file v-model="formData.logoSelect" />
                        </div>
                    </label>

                    <div class="fx-grow mt-20@xs">
                        <input-base class="mb-15" label="Nom de la constellation" v-model="formData.name" :required="true" />
                        
                        <input-base class="mv-15" label="En une phrase..." v-model="formData.intro" placeholder="Se balader dans un parc et profiter du soleil !" :required="true" />

                        <input-base class="mt-15" label="Localisation" v-model="formData.location" placeholder="Région, ville..." :required="true" />
                    </div>
                </div>
            </div>

            <div class="block mt-20">
                <input-paper label="Description" :base="true" v-model="formData.description" v-if="isInit" />
            </div>

            <form-errors class="mt-20" :items="errors" />

            <div class="text-right mt-20">
                <button-base type="submit" :modifiers="['light']">Sauvegarder</button-base>
            </div>
        </form>
    </div>
</template>

<script>
import EntityEditor from '@/mixins/entity-editor'

export default {
    mixins: [ EntityEditor ],
    props: {
        constellation: { type: Object }
    },
    async fetch () {
        await this.fetchEntity(this.constellation._id)
    },
    data: () => ({
        entityType: 'constellation',
        inputs: ['name', 'location', 'intro', 'cover', 'logo', 'description'],
        options: {
            cover: false
        }
    }),
    computed: {
        
        defaultFormData () {
            return {
                coverSelect: '',
                logoSelect: ''
            }
        },
        coverPreview () {
            let preview = ''

            if (this.formData.coverSelect) {
                preview = this.formData.coverSelect.src.medium
            } else if (this.formData.cover && this.formData.cover.medias) {
                preview = this.formData.cover.medias.find(m => m.size == 'm').src
            }
            
            return preview
        },
        logoPreview () {
            let logo = ''

            if (this.formData.logoSelect) {
                logo = URL.createObjectURL(this.formData.logoSelect)
            } else if (this.formData.logo && this.formData.logo.medias) {
                logo = this.formData.logo.medias.find(m => m.size == 'm').src
            }
            
            return logo
        }
    },
    methods: {
        postSubmit () {
            this.formData = {
                ...this.formData,
                logoSelect: '',
                coverSelect: ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.Image {
    background-size: cover;
    background-position: center;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;

    &::before {
        @include ratio(50);
    }
}

.Logo {
    flex-shrink: 0;
    background-size: cover;
    background-position: center;
    border-radius: 50%;
    width: 75px;
    height: 75px;
    position: relative;
    overflow: hidden;
}

.Logo_edit {
    @include absolute-fill;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: all 200ms ease;
    opacity: 0;

    .InputFile {
        position: absolute;
    }

    &:hover {
        opacity: 1;
    }
}

@include breakpoint-xs {

    .Logo {
        width: 60px;
        height: 60px;
    }
}
</style>