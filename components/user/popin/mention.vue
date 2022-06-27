<template>
    <popin :is-active="selectedUser ? true : false" :modifiers="['m']" @close="onClose" >
        <template slot="content" v-if="selectedUser">
            <div class="bg-cover bg-night text-center p-40 height-100 o-hidden" v-if="isFriend && isSent">
                <div class="G_cosmoz" style="opacity: 0.2"></div>

                <div class="d-flex fxa-center fxj-center">
                    <user-icon :modifiers="['xl']" v-bind="selectedUser" :no-link="true" />

                    <fa icon="far fa-sparkles" class="mh-10" />

                    <user-icon :modifiers="['xl']" v-bind="user" :no-link="true" />
                </div>
                <div class="ft-title-m mt-30 mb-10">Nouvelle personne dans ta constellation</div>
                <p class="mb-15">{{ selectedUser.name }} a également envie de rester en contact !</p>

                <div class="mt-20">
                    <button-base :modifiers="['cosmoz']" :to="{ name: 'p-userId', params: { userId: selectedUser.id }}" @click.native="onClose">Voir son profil</button-base>
                </div>
            </div>
            <div class="p-20" v-else>
                <user-icon :modifiers="['l']" :display-name="true" v-bind="selectedUser" />

                <div v-if="isSent.length > 0 || isSuccess">
                    <div class="mt-20 block-cosmoz">
                        <div class="+mt-20" v-if="sent.length > 0">
                            <p class="ft-m-medium mb-15">Tu as envoyé les mentions suivantes à {{ selectedUser.name }} :</p>

                            <div class="ft-title-2xs subtitle tape mr-5" v-for="(mention, i) in (isSuccess ? mentions : sent)" :key="i">
                                {{ $t('mentions.' + (mention.type ? mention.type : mention)) }}
                            </div>
                        </div>
                        
                        <div class="d-flex fxa-center +mt-20 p-15 bg-bg-weak-t br-xs" v-if="isRequested && !isFriend">
                            <fa icon="far fa-check" class="mr-15" />
                            <div>
                                <p class="ft-title-2xs">Demande d'ami envoyée
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>Tu peux remercier {{ selectedUser.name }} pour sa présence lors de l'événement ! C'est anonyme.</p>

                    <div class="mt-10">
                        <button-base class="mr-5 mt-5" :modifiers="mentions.includes(mention.value) ? ['s', 'cosmoz'] : ['s']" :icon-before="mention.icon" v-for="mention in $const.mentions" @click="toggleMention(mention.value)"  :disabled="mentions.length >= 2 && !mentions.includes(mention.value)" :key="mention.id">
                            {{ mention.label }}
                        </button-base>
                    </div>

                    <div class="mt-30 block-cosmoz">
                        <p class="ft-title-xs">
                            <fa icon="far fa-sparkles" class="mr-5" /> Ajouter en ami ?
                        </p>
                        <p class="mt-10">{{ selectedUser.name }} ne verra pas ta demande. Vous deviendriez amis seulement si la demande est réciproque. </p>

                        <input-toggle class="mt-15" label="Je veux rester en contact" v-model="requestFriend" />
                    </div>

                    <form-errors class="mt-20" :items="errors" />
                </div>
            </div>
        </template>
        <template slot="footer" v-if="selectedUser">
            <div></div>
            
            <div class="p-15 text-right" v-if="!isFriend || (isFriend && !isSent)">
                <template v-if="sent.length || isSuccess">
                    <button-base :modifiers="['light']" @click="onClose">
                        Fermer
                    </button-base>
                </template>
                <template v-else>
                    <button-base :modifiers="['light']" :disabled="mentions.length <= 0 && !requestFriend" @click="onSubmit" icon-before="paper-plane">
                        Envoyer
                    </button-base>
                </template>
            </div>
        </template>
    </popin>
</template>

<script>
export default {
    name: 'UserPopinMention',
    props: {
        gathering: { type: String },
        selectedUser: { type: [Object, Boolean], default: false },
    },
    async fetch () {
        await this.$store.dispatch('mention/fetch', { query: {
            gathering: this.gathering
        }})
    },
    data: () => ({
        mentions: [],
        isMatch: false,
        isSuccess: false,
        requestFriend: false,
        errors: []
    }),
    computed: {
        
        sent () {
            return this.$store.getters['mention/find']({
                gathering: this.gathering,
                target: this.selectedUser._id,
                owner: this.user._id
            })
        },
        isSent () {
            return this.$store.getters['mention/find']({
                gathering: this.gathering,
                target: this.selectedUser._id,
                owner: this.user._id
            }, true)
        },
        isFriend () { return this.isMatch || this.selectedUser.isFriend },
        isRequested () { return this.user.affinities.find(u => u == this.selectedUser._id )}
    },
    methods: {
        toggleMention (type) {
            if (this.mentions.includes(type)) {
                this.mentions = this.mentions.filter(t => t != type)
            } else {
                this.mentions.push(type)
            }
        },
        onClose () {
            this.mentions = []
            this.isMatch = false
            this.isSuccess = false
            this.requestFriend = false

            this.$emit('close')
        },
        async onSubmit () {
            try {
                let response = await this.$store.dispatch('mention/create', {
                    mentions: this.mentions,
                    requestFriend: this.requestFriend,
                    target: this.selectedUser._id,
                    gathering: this.gathering
                })

                if (response.error) {
                    this.errors = [ response.error ]
                    return
                }

                this.isSuccess = true
                if (response.data.match) this.isMatch = true
            } catch (e) {
                console.error(e)
            }
        }
    }
}
</script>

<style>

</style>