<template>
    <div>
        <div class="Wrapper Wrapper--xs pv-40 ft-l">
            <h1 class="ft-title-l mb-30">Envie de voir de nouvelles têtes {{ user.name }} ?</h1>

            <conversation :items="conversation" @action="onAction" />
        </div>

        <div class="p-relative bg-bg-xstrong" v-if="doubt">
            <div id="faq" class="anchor"></div>

            <div class="Wrapper Wrapper--s pv-40 ft-l">
                <h2 class="ft-title-m mb-30">Un doute, une question ?</h2>
                <faq />
            </div>
        </div>
        <div class="bg-cover bg-ice-cream" v-if="doubt">
            <div class="Wrapper Wrapper--s pv-40 ft-l text-center">
                <h3 class="ft-title-l mb-30">On a réussi à te convaincre de te lancer ?</h3>

                <div>
                    <button-base>Non, j'ai des questions</button-base>
                    <button-base :modifiers="['light']" @click="onEnd">Je découvre la plateforme</button-base>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WelcomeIndex',
    data: () => ({
        step: 0,
        doubt: false,
        conversation: []
    }),
    computed: {
        user () { return this.$store.state.auth.user },
    },
    created () {
        this.conversation = [
            {
                id: '0',
                step: 0,
                content: `On est persuadés qu'aucun algorithme ne pourra jamais prédire la compatibilité et que le mieux à faire, c'est de se rencontrer et de voir si des affinités se créent.`,
                actions: [
                    { id: 'disagree', label: `Je préfère le virtuel`, value: -1 },
                    { id: 'agree', label: `Le réel, y'a que ça de vrai` },
                ]
            }, {
                id: '1',
                step: 1,
                content: `Gatherings est une plateforme qui met le réel au premier plan. Tu vas participer à des événements gratuits, locaux et surtout super conviviaux. <br><br>Sur place tu vas rencontrer de nouvelles têtes, créer des affinités et surtout  passer un bon moment (promis).`,
                actions: [
                    { id: 'disagree', label: `Woah, doucement`, value: -1 },
                    { id: 'agree', label: `Trop cool ! Et ensuite ?` },
                ]
            }, {
                id: '2',
                step: 2,
                content: `En fonction des affinités que tu crées, on te proposera de rejoindre des tribus : des groupes de 10 à 60 personnes qui s'apprécient.<br><br>
                Vous pourrez interagir et surtout, continuer à vous voir en organisant de nouvelles sorties ensemble.<br><br>Tu auras toujours une tribu sur laquelle compter si tu as envie de sortir.`,
                actions: [
                    { id: 'disagree', label: `Voir la FAQ`, value: -1 },
                    { id: 'agree', label: `Je me lance`, action: this.onEnd },
                ]
            }
        ]
    },
    methods: {
        onAction (v) {
            if (v === -1) {
                this.doubt = true
                this.$router.push('#faq')
            }
        },
        async onEnd () {
            await this.$store.dispatch('user/updateNotification', {
                id: 'welcomed',
                type: 'onboarding'
            })

            this.$router.push(this.localePath({ name: 'index' }))
        }
    }
}
</script>

<style lang="scss" scoped>

</style>