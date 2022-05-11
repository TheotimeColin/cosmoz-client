<template>
    <popin-base :is-active="selectedUser" :modifiers="['s']" @close="onClose">
        <template slot="content">
            <div class="p-30" v-if="selectedUser">
                <div v-if="isMatch">
                    It's a match !!
                </div>
                <div v-else>
                    <div class="fx-center">
                        <user-icon :modifiers="['l']" v-bind="selectedUser" />

                        <p class="ft-l fx-grow ml-15 subtitle">{{ selectedUser.name }}</p>
                    </div>
                    <hr class="Separator mv-20">
                    <div>
                        <p class="ft-title-xs">Envoyer une affinité</p>
                        <p class="mt-5">Si tu as apprécié passer du temps avec {{ selectedUser.name }}, envoie un autocollant ! {{ selectedUser.name }} sera pas au courant, sauf si l'affinité est réciproque.</p>
                    </div>
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

            <div v-if="isMatch">
                <button-base :modifiers="['light']" @click="onClose">
                    Fermer
                </button-base>
            </div>
            <div class="p-15 text-right" v-else>
                <link-base class="mr-5">Comment ça marche ?</link-base>
                <button-base :modifiers="['light']" :disabled="mentions.length <= 0" @click="onSubmit">
                    Envoyer une affinité
                </button-base>
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