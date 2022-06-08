<template>
    <form @submit.prevent="onSubmit" class="Wrapper Wrapper--xs pv-40">
        <div class="d-flex">
            <div class="fx-grow">
                <div class="block d-flex fxa-start">
                    <div class="Logo mr-20" :style="{ backgroundImage: `url(${logoPreview})` }">
                        <label class="Logo_edit">
                            <input-file class="hide" v-model="formData.logoSelect" />
                            <fa icon="far fa-pen" />
                        </label>
                    </div>

                    <div class="fx-grow">
                        <input-base class="mb-15" label="Nom de la constellation" v-model="formData.name" :required="true" />
                        <input-base class="mv-15" label="En une phrase..." v-model="formData.intro" placeholder="Se balader dans un parc et profiter du soleil !" :required="true" />
                        <input-base class="mt-15" label="Localisation" v-model="formData.location" placeholder="Région, ville..." :required="true" />
                    </div>
                </div>
                
                <div class="block mt-20">
                    <div class="Image" :style="{ backgroundImage: `url(${coverPreview})` }">
                        <button-base type="button" :modifiers="['round', 'weak']" icon-before="pen" @click="options.cover = !options.cover" />
                    </div>

                    <input-pexels class="mt-15" @select="(v) => formData.coverSelect = v" v-if="options.cover"/>
                </div>

                <div class="block mt-20">
                    <div class="mb-30">
                        <p class="ft-title-xs mb-15">Administration</p>

                        <div class="fx-center p-10 br-xs bg-bg-strong mr-5 mb-5" v-for="user in formData.admins" :key="user">
                            <user-icon :modifiers="['s']" :display-name="true" v-bind="getUser(user)" />

                            <div>
                                <button-base type="button" icon-before="times" :modifiers="['xs', 'round', 'xweak']" @click="removeUser(user, 'admins')" v-if="formData.admins.length > 1" />
                            </div>
                        </div>
                    </div>

                    <div class="mb-30">
                        <p class="ft-title-xs mb-15">Organisation</p>

                        <div class="p-10 br-xs bg-bg text-center color-ft-xweak" v-if="formData.organizers.length <= 0">
                            Pas d'organisateurs.
                        </div>
                        <div class="fx-center p-10 br-xs bg-bg-strong mr-5 mb-5" v-for="user in formData.organizers" :key="user" v-else>
                            <user-icon :modifiers="['s']" :display-name="true" v-bind="getUser(user)" />

                            <div>
                                <button-base type="button" icon-before="crown" :modifiers="['xs', 'round', 'xweak']" @click="addAdmin(user)" />

                                <button-base type="button" icon-before="times" :modifiers="['xs', 'round', 'xweak']" @click="removeUser(user, 'organizers')" />
                            </div>
                        </div>
                    </div>

                    <input-user @input="addUser" :exclude="[...formData.organizers, ...formData.admins ]" />
                </div>

                <form-errors class="mt-20" :items="errors" />

                <div class="text-right mt-20">
                    <button-base type="submit" :modifiers="['light']">Sauvegarder</button-base>
                </div>
            </div>
        </div>
    </form>
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
        inputs: ['name', 'location', 'intro', 'cover', 'logo', 'admins', 'organizers'],
        options: {
            cover: false
        },
        defaultFormData: {
            organizers: [],
            admins: [],
            coverSelect: '',
            logoSelect: ''
        }
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
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
        addAdmin (_id) {
            this.formData.admins = [ ...this.formData.admins, _id ]
            this.removeUser(_id, 'organizers')
        },
        removeUser (_id, type) {
            this.formData = {
                ...this.formData,
                [type]: this.formData[type].filter(u => u !== _id)
            }
        },
        getUser (_id) {
            return this.$store.getters['user/findOne']({ _id })
        },
        postSubmit () {
            this.formData = {
                ...this.formData,
                logoSelect: '',
                coverSelect: ''
            }
        },
        addUser (v) {
            this.formData.organizers = [ ...this.formData.organizers, v ]
        }
    },
    head () {
        this.$store.commit('page/set', {
            subtitle: `Paramètres de la constellation`
        })

        this.$emit('page', {            
            subtitle: `Paramètres de la constellation`, fa: 'cog'
        })

        let meta = {
            title: `Paramètres de la constellation ${this.$t('meta.append')}`,
        }

        return meta
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
    width: 100px;
    height: 100px;
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
</style>