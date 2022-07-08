<template>
    <popin :is-active="isActive" query="hangout-create" :modifiers="['panel', 'full']" @close="onClose">
        <template slot="content">
            <div class="fx-grow strong">
                <div class="p-40 p-30@xs" v-if="step == 0">
                    <p class="ft-title-m mb-20">Qu'as-tu envie de faire ?</p>

                    <div class="+mt-30" v-for="(cat, id) in $const.hangouts.categories" :key="id">
                        <div class="ft-s-medium color-ft-weak mb-10">
                            {{ $t(`hangouts.categories.${id}.label`) }}
                        </div>

                        <button-base
                            v-for="tag in cat"
                            class="mr-5 mb-5"
                            :modifiers="formData.category == id + '.' + tag ? ['cosmoz'] : ['weak']"
                            :emoji-before="$t(`hangouts.categories.${id}.tags.${tag}.emoji`)"
                            @click="formData.category = id + '.' + tag"
                            :key="tag"
                        >
                            {{ $t(`hangouts.categories.${id}.tags.${tag}.label`) }}
                        </button-base>
                    </div>
                </div>
                <div class="" v-else-if="step == 1">
                    <placeholder :ratio="25" />

                    <div class="p-40 p-30@xs">
                        <input-base class="+mt-15" v-model="formData.title" label="Donner un nom à la sortie" />
                        <input-base class="+mt-15" v-model="formData.location" label="Nom du lieu" />
                        <input-base class="+mt-15" v-model="formData.address" label="Entrer une adresse" />

                        <div class="d-flex +mt-15">
                            <v-date-picker
                                :value="dates.find(d => d.id == selectedDate)"
                                @input="updateDate"
                                mode="dateTime"
                                :minute-increment="5"
                                is24hr 
                                :is-dark="true"
                                :min-date="$moment().subtract(1, 'hours').toDate()"
                            />

                            <div class="pl-20">
                                <p class="ft-s-medium mb-10">Dates proposées</p>

                                <transition-group name="transition-list">
                                    <button-base
                                        v-for="date in dates"
                                        class="mr-3 mb-3"
                                        :modifiers="['s' , date.id == selectedDate ? 'light' : '']"
                                        @click="selectedDate = date.id"
                                        @delete="deleteDate(date.id)"
                                        canDelete
                                        :key="date.id"
                                    >
                                        {{ $moment(date.date).format('D MMMM YYYY à H:mm') }}
                                    </button-base>

                                    <button-base
                                        class="mr-3 mb-3"
                                        icon-before="plus"
                                        :modifiers="['round']"
                                        @click="addDate"
                                        key="add"
                                    />
                                </transition-group>

                                <label class="block-r d-block mt-15">
                                    <input-toggle v-model="formData.userDates" />

                                    <div class="mt-15">
                                        <p>Tout le monde peut proposer des dates</p>
                                        <div class="ft-s color-ft-weak">Tu auras le dernier mot sur la date choisie.</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-40 p-30@xs" v-else-if="step == 2">
                    <div class="+mt-40">
                        <p class="ft-title-xs">Publier dans une constellation</p>
                        <p class="mt-5 color-ft-weak">Toutes les personnes qui font partie du groupe pourront s'y inscrire.</p>

                        <div class="mt-20 row-xs">
                            <div class="col-6 col-12@xs mb-10" v-for="conste in constellations" :key="conste._id">
                                <div class="Block_conste" :class="{ 'is-active': formData.constellation == conste._id }" @click="() => formData.constellation = formData.constellation == conste._id ? null : conste._id">
                                    <const-icon displayName :no-link="true" v-bind="conste" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="+mt-40">
                        <p class="ft-title-xs">Inviter des amis</p>

                        <div class="+mt-40 mt-20 row-xs">
                            <div class="col-6 col-12@xs mb-10" v-for="friend in friends" @click="inviteFriend(friend._id)" :key="friend._id">
                                <div class="Block_user" :class="{ 'is-active': formData.invited.includes(friend._id) }">
                                    <user-icon displayName :no-link="true" v-bind="friend" />
                                </div>
                            </div>
                        </div>

                        <div class="+mt-40" v-if="currentConstellation && unavailableFriends.length > 0">
                            <p class="mt-5 color-ft-weak">Ces amis ne peuvent pas être invités car ils ne font pas partie de <b>{{ currentConstellation.name }}</b>.</p>

                            <div class="mt-20 row-xs">
                                <div class="col-6 col-12@xs mb-10" v-for="friend in unavailableFriends" :key="friend._id">
                                    <div class="Block_user is-disabled" :class="{ 'is-active': false }">
                                        <user-icon displayName :no-link="true" v-bind="friend" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="" v-else-if="step == 3">
                    <placeholder :ratio="25" />
                    
                    <div class="p-40 p-30@xs">
                        <div class="+mt-20">
                            <div class="ft-title-s">
                                {{ formData.name ? formData.name : defaultTitle }}
                                
                                <button-base
                                    :modifiers="['round', '2xs']"
                                    class="ml-5"
                                    icon-before="pen"
                                    @click="step = 1"
                                />
                            </div>
                        </div>

                        <div class="+mt-20 b-top d-flex fxa-center pt-20">
                            <div class="pr-15 fx-grow">
                                <div class="ft-title-2xs">
                                    <span v-if="formData.location">{{ formData.location }}</span>
                                    <span class="color-ft-weak" v-else>Pas de lieu</span>

                                    <button-base
                                        :modifiers="['round', '2xs']"
                                        class="ml-5"
                                        icon-before="pen"
                                        @click="step = 1"
                                    />
                                </div>
                                <div class="ft-m-medium color-ft-weak">
                                    <span v-if="formData.address">{{ formData.address }}</span>
                                    <span class="color-ft-weak" v-else>Pas d'adresse</span>

                                    <button-base
                                        :modifiers="['round', '2xs']"
                                        class="ml-5"
                                        icon-before="pen"
                                        @click="step = 1"
                                    />
                                </div>
                            </div>

                            <fa icon="far fa-map-marker-alt" />
                        </div>

                        <div class="+mt-20 b-top pt-20">
                            <p class="ft-m-medium color-ft-weak mb-10">Détails</p>

                            <input-area class="n-mh-10" placeholder="Ajouter des détails sur la sortie..." v-model="formData.description" />
                        </div>

                        <div class="+mt-20 b-top pt-20" v-if="formData.dates.length > 0">
                            <p class="ft-m-medium color-ft-weak mb-10">Je propose ces dates :</p>

                            <button-base
                                v-for="(date, i) in formData.dates"
                                class="mr-5 mb-5"
                                :modifiers="['s', 'light']"
                                canDelete
                                @delete="formData.dates = formData.dates.filter(i => i != date)"
                                :key="i"
                            >
                                {{ $moment(date).format('D MMMM YYYY à H:mm') }}
                            </button-base>

                            <button-base
                                :modifiers="['round']"
                                icon-before="plus"
                                @click="step = 1"
                            />
                        </div>

                        <div class="+mt-20 b-top pt-15" v-if="formData.invited.length > 0">
                            <p class="ft-m-medium color-ft-weak pb-10">Invités :</p>

                            <button-base
                                :modifiers="['s', 'light']"
                                :image="currentConstellation.logoSmall"
                                :text="currentConstellation.name"
                                canDelete
                                v-if="formData.constellation"
                                @delete="formData.constellation = null"
                            />

                            <button-base
                                v-for="invited in invitedFriends"
                                class="mr-5 mb-5"
                                :modifiers="['s', 'light']"
                                :image="invited.profileSmall"
                                :text="invited.name"
                                canDelete
                                @delete="formData.invited = formData.invited.filter(i => i != invited._id)"
                                :key="invited._id"
                            />

                            <button-base
                                :modifiers="['round']"
                                icon-before="plus"
                                @click="step = 2"
                            />
                        </div>

                        <div class="+mt-20 b-top pt-20" v-if="options.max">
                            <input-base label="Limiter le nombre d'inscriptions" suffix="participants" type="number" v-model="formData.max" :attrs="{ min: 0 }" />

                            <div class="mt-10 text-right">
                                <link-base @click="() => { options.max = false; formData.max = 0 }">Retirer la limite</link-base>
                            </div>
                        </div>

                        <div class="+mt-20 b-top pt-15">
                            <button-base
                                :modifiers="['s']"
                                class="mr-3 mb-5"
                                icon-before="calendar-alt"
                                text="Proposer une date"
                                v-if="formData.dates.length <= 0"
                                @click="step = 1"
                            />
                            
                            <button-base
                                :modifiers="['s']"
                                class="mr-3 mb-5"
                                icon-before="hand-wave"
                                text="Inviter des gens"
                                v-if="formData.invited.length <= 0 && !formData.constellation"
                                @click="step = 2"
                            />

                            <button-base
                                :modifiers="['s']"
                                class="mr-3 mb-5"
                                icon-before="hand"
                                text="Limiter les inscriptions"
                                @click="options.max = true"
                                v-if="!options.max"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <form-sticky :is-active="formData.category !== null">
                <button-base type="button" class="mr-5" icon-after="arrow-left" :modifiers="['round', 's', 'weak']" @click="onStepBack" v-if="step > 0" />

                <template v-if="step == 0">
                    <button-base type="button" icon-after="arrow-right" :modifiers="[isStepComplete ? 'cosmoz' : '', 'l']" @click="onStepComplete">
                        {{ isStepComplete ? 'Choisir la date et le lieu' : 'Continuer sans choisir' }}
                    </button-base>
                </template>
                <template v-else-if="step == 1">
                    <button-base type="button" icon-after="arrow-right" :modifiers="[isStepComplete ? 'cosmoz' : '', 'l']" @click="onStepComplete">
                        {{ isStepComplete ? 'Choisir les invités' : 'Continuer sans date' }}
                    </button-base>
                </template>
                <template v-else-if="step == 2">
                    <button-base type="button" icon-after="arrow-right" :modifiers="[isStepComplete ? 'cosmoz' : '', 'l']" @click="onStepComplete">
                        {{ isStepComplete ? 'Récapitulatif avant envoi' : 'Continuer sans invités' }}
                    </button-base>
                </template>
                <template v-else-if="step == 3">
                    <button-base type="button" icon-after="paper-plane" :modifiers="['l', 'cosmoz']" @click="onSubmit">
                        Publier !
                    </button-base>
                </template>
            </form-sticky>
        </template>
    </popin>
</template>

<script>
export default {
    name: 'HangoutPopin',
    data: () => ({
        errors: [],
        step: 1,
        options: {
            max: false
        },
        formData: {
            category: null,
            constellation: null,
            max: 0,
            title: '',
            description: '',
            location: '',
            address: '',
            userDates: true,
            dates: [],
            invited: []
        },
        dates: [],
        selectedDate: null,
        isSuccess: false
    }),
    computed: {
        friends () {
            return this.$store.getters['user/find']({
                _id: { $in: this.user.friends }
            }).filter(u => this.formData.constellation ? u.constellations.includes(this.formData.constellation) : true)
        },
        invitedFriends () {
            return this.$store.getters['user/find']({
                _id: { $in: this.formData.invited }
            })
        },
        unavailableFriends () {
            if (!this.formData.constellation) return []

            return this.$store.getters['user/find']({
                _id: { $in: this.user.friends }
            }).filter(u => !u.constellations.includes(this.formData.constellation))
        },
        currentConstellation () {
            if (!this.formData.constellation) return false

            return this.$store.getters['constellation/findOne']({
                _id: this.formData.constellation
            })
        },
        constellations () {
            return this.$store.getters['constellation/find']({
                _id: { $in: this.user.constellations }
            })
        },
        isStepComplete () {
            switch (this.step) {
                case 0:
                    return this.formData.category !== null
                case 1:
                    return this.formData.dates.length > 0
                case 2:
                    return this.formData.invited.length > 0
                default: false
            }
        },
        isActive () {
            return this.$store.state.page.popins.hangout ? true : false
        },
        defaultTitle () {
            if (!this.formData.category) return '✨ On sort ?'
            let tag = this.formData.category.split('.')
            return this.$t(`hangouts.categories.${tag[0]}.tags.${tag[1]}.emoji`) + ' ' + this.$t(`hangouts.categories.${tag[0]}.tags.${tag[1]}.label`)
        }
    },
    watch: {
        ['dates'] (v) {
            this.formData.dates = this.dates.map(d => d.date)
        },
        ['formData.constellation'] (v) {
            if (v) {
                this.formData.invited = this.formData.invited.filter(i => !this.unavailableFriends.find(u => u._id == i))
            }
        }
    },
    methods: {
        inviteFriend (_id) {
            if (this.formData.invited.includes(_id)) {
                this.formData.invited = this.formData.invited.filter(i => i != _id)
            } else {
                this.formData.invited = [ ...this.formData.invited, _id ]
            }
        },
        updateDate (v) {
            if (v && this.selectedDate) {
                this.dates = this.dates.map(d => ({
                    ...d, date: (d.id == this.selectedDate) ? v : d.date
                }))
            } else if (v) {
                let id = Math.random()
                this.selectedDate = id
                this.dates = [ ...this.dates, { id, date: v }]
            }

            this.dates.sort((a, b) => {
                return this.$moment(a.date).valueOf() - this.$moment(b.date).valueOf()
            })
        },
        deleteDate (id) {
            this.selectedDate = null
            this.dates = this.dates.filter(d => d.id != id)
        },
        addDate () {
            let id = Math.random()

            this.selectedDate = id
            this.dates = [ { id, date: new Date() }, ...this.dates ]
        },
        onStepBack () {
            switch (this.step) {
                case 1:
                    this.step = 0
                    break
                case 2:
                    this.step = 1
                    break
                case 3:
                    this.step = 2
                    break
                default:
                    this.step = 0
                    break
            }
        },
        onStepComplete () {
            switch (this.step) {
                case 0:
                    if (this.formData.category) {
                        this.formData.title = this.defaultTitle
                    }

                    this.step = 1
                    break
                case 1:
                    this.step = 2
                    break
                case 2:
                    this.step = 3
                    break
                default:
                    return
            }
        },
        onClose () {
            this.$store.commit('page/popin', { hangout: false })
        },
        async onSubmit () {
            this.isLoading = true

            this.$store.dispatch('gathering/createHangout', {
                ...this.formData,
                title: this.formData.title ? this.formData.title : this.defaultTitle
            })

            this.isLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.Block_user,
.Block_conste {
    padding: 10px;
    border-radius: 8px;
    background-color: var(--color-bg-weak);
    @include shadow;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 150ms ease;

    &:hover {
        transform: translateY(-2px);
    }

    &.is-active {
        background-color: var(--color-cosmoz);
    }

    &.is-disabled {
        opacity: 0.5;
        pointer-events: none;
    }
}
</style>