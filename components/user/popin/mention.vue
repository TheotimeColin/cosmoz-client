<template>
    <popin-base :is-active="selectedUser" :modifiers="['s']" @close="onClose" v-if="selectedUser">
        <template slot="content">
            <div class="bg-cover bg-holo" v-if="affinity">
                <div>It's a match !!</div>
            </div>
            <div class="p-30" v-else>
                <div class="fx-center">
                    <user-icon :modifiers="['l']" v-bind="selectedUser" />

                    <p class="ft-l fx-grow ml-15 subtitle">{{ selectedUser.name }}</p>
                </div>
                <hr class="Separator mv-20">
                
                <div v-if="sent.length > 0">
                    <p class="mb-15">Tu as envoyé les mentions suivantes à {{ selectedUser.name }} :</p>

                    <div class="tape tape-1" v-for="mention in sent[0].mentions" :key="mention">
                        {{ $t('mentions.' + mention) }}
                    </div>
                </div>
                <div v-else>
                    <p class="ft-title-xs">Envoyer une affinité</p>
                    <p class="mt-5">Si tu as apprécié passer du temps avec {{ selectedUser.name }}, envoie un autocollant ! {{ selectedUser.name }} sera pas au courant, sauf si l'affinité est réciproque.</p>

                    <div class="mt-20">
                        <button-base class="mr-5 mt-5" :modifiers="mentions.includes(mention.value) ? ['s', 'light'] : ['s']" :class="{ 'is-disabled': mentions.length >= 2 && !mentions.includes(mention.value) }" :icon-before="mentions.includes(mention.value) ? mention.icon : ''" v-for="mention in $const.mentions" @click="toggleMention(mention.value)" :key="mention.id">
                            {{ mention.label }}
                        </button-base>
                    </div>
                </div>
            </div>
        </template>
        <template slot="footer">
            <div></div>
            
            <div class="p-15 text-right" v-if="!affinity">
                <template v-if="sent.length">
                    <button-base :modifiers="['light']" @click="onClose">
                        Fermer
                    </button-base>
                </template>
                <template v-else>
                    <link-base class="mr-5">Comment ça marche ?</link-base>
                    <button-base :modifiers="['light']" :disabled="mentions.length <= 0" @click="onSubmit">
                        Envoyer une affinité
                    </button-base>
                </template>
            </div>
        </template>
    </popin-base>
</template>

<script>
export default {
    name: 'UserPopinMention',
    props: {
        gathering: { type: String },
        selectedUser: { type: [Object, Boolean], default: false },
    },
    data: () => ({
        mentions: [],
        isMatch: false
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        sent () {
            return this.selectedUser.mentions.filter(m => m.user == this.user._id && m.gathering == this.gathering)
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
            this.isMatch = false

            this.$emit('close')
        },
        async onSubmit () {
            try {
                let response = await this.$store.dispatch('affinities/sendMentions', {
                    mentions: this.mentions,
                    target: this.selectedUser._id,
                    gathering: this.gathering
                })

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