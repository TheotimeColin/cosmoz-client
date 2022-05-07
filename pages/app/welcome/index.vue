<template>
    <div>
        <div class="Wrapper Wrapper--xs pv-40 ft-l">
            <h1 class="ft-title-l mb-30">Bienvenue !</h1>

            <conversation :items="conversation" @action="onAction" />
        </div>

        <div class="p-relative bg-bg-strong" v-if="doubt">
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
                    <button-base :modifiers="['light']">Je m'inscris à un événement d'accueil</button-base>
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
    created () {
        this.conversation = [
            {
                id: '0',
                step: 0,
                content: `On est persuadés qu'aucun algorithme ne pourra jamais prédire la compatibilité. La meilleure chose à faire, c'est de se rencontrer et de voir si des affinités se créent.`,
                actions: [
                    { id: 'disagree', label: `Je préfère le virtuel`, value: -1 },
                    { id: 'agree', label: `Le réel, y'a que ça de vrai` },
                ]
            }, {
                id: '1',
                step: 1,
                content: `On te propose un truc un peu fou : tu vas rencontrer une dizaine d'autres nouveaux membres comme toi, lors d'un de nos événements d'accueil.<br><br>Sur place tu vas créer des liens, des affinités et surtout tu vas passer un bon moment (promis).`,
                actions: [
                    { id: 'disagree', label: `Woah, doucement`, value: -1 },
                    { id: 'agree', label: `Trop cool ! Et ensuite ?` },
                ]
            }, {
                id: '2',
                step: 2,
                content: `On te proposera des sorties personnalisées avec les personnes que tu as apprécié et d'autres avec qui tu es susceptible de bien t'entendre. Les amis de tes amis seront tes amis !`,
                actions: [
                    { id: 'disagree', label: `Je doute`, value: -1 },
                    { id: 'agree', label: `Je me lance` },
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
        }
    }
}
</script>

<style lang="scss" scoped>

</style>