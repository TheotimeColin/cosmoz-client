<template>
    <popin :is-active="selectedUser ? true : false" :modifiers="['s']" @close="onClose" >
        <template slot="content" v-if="selectedUser">
            <div class="bg-cover bg-night text-center p-40" v-if="affinity && received.length > 0 && sent.length > 0">
                <div>
                    <user-icon :modifiers="['xl']" v-bind="selectedUser" :no-link="true" />
                    <user-icon :modifiers="['xl']" v-bind="user" :no-link="true" />
                </div>
                <div class="ft-title-m mt-30 mb-10">Nouveau lien stellaire</div>
                <p class="mb-15">{{ selectedUser.name }} t'as envoyé les mentions suivantes :</p>

                <div class="ft-title-xs subtitle tape" v-for="mention in received" :key="mention">
                    {{ $t('mentions.' + mention.type) }}
                </div>

                <button-base class="mt-20" :modifiers="['light']" :to="{ name: 'p-id', params: { id: selectedUser.id }}">Voir son profil</button-base>
            </div>
            <div class="p-30" v-else>
                <user-icon :modifiers="['l']" :display-name="true" v-bind="selectedUser" />

                <hr class="Separator mv-20">
                
                <div v-if="sent.length > 0 || isSuccess">
                    <p class="mb-15">Tu as envoyé les mentions suivantes à {{ selectedUser.name }} :</p>

                    <div class="ft-title-xs subtitle tape mr-5" v-for="(mention, i) in (isSuccess ? mentions : sent)" :key="i">
                        {{ $t('mentions.' + (mention.type ? mention.type : mention)) }}
                    </div>
                </div>
                <div v-else>
                    <p class="ft-title-xs">Envoyer</p>
                    <p class="mt-5" v-if="affinity">{{ selectedUser.name }} fait déjà partie de ta constellation, mais tu peux lui renvoyer une mention, juste pour le plaisir !</p>
                    <p class="mt-5" v-else>Si tu as apprécié passer du temps avec {{ selectedUser.name }}, envoie un autocollant ! {{ selectedUser.name }} sera pas au courant, sauf si c'est réciproque.</p>

                    <div class="mt-20">
                        <button-base class="mr-5 mt-5" :modifiers="mentions.includes(mention.value) ? ['s', 'light'] : ['s']" :class="{ 'is-disabled': mentions.length >= 2 && !mentions.includes(mention.value) }" :icon-before="mentions.includes(mention.value) ? mention.icon : ''" v-for="mention in $const.mentions" @click="toggleMention(mention.value)" :key="mention.id">
                            {{ mention.label }}
                        </button-base>
                    </div>

                    <form-errors class="mt-20" :items="errors" />
                </div>
            </div>
        </template>
        <template slot="footer" v-if="selectedUser">
            <div></div>
            
            <div class="p-15 text-right" v-if="!affinity || (affinity && sent.length <= 0)">
                <template v-if="sent.length || isSuccess">
                    <button-base :modifiers="['light']" @click="onClose">
                        Fermer
                    </button-base>
                </template>
                <template v-else>
                    <link-base class="mr-5">Comment ça marche ?</link-base>
                    <button-base :modifiers="['light']" :disabled="mentions.length <= 0" @click="onSubmit">
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
        errors: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        sent () {
            return this.$store.getters['mention/find']({
                gathering: this.gathering,
                target: this.selectedUser._id,
                owner: this.user._id
            })
        },
        received () {
            return this.$store.getters['mention/find']({
                gathering: this.gathering,
                target: this.user._id
            })
        },
        affinity () { return this.isMatch || this.selectedUser.isAffinity }
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
            this.mentionsResponse = []
            this.isMatch = false
            this.isSuccess = false

            this.$emit('close')
        },
        async onSubmit () {
            try {
                let response = await this.$store.dispatch('mention/create', {
                    mentions: this.mentions,
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