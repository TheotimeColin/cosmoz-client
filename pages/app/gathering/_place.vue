<template>
    <div class="Page bg-bg">
        <p class="ft-title-m mb-30">#01 : Introduction</p>

        <card class="bg-bg" :items="items" />
    </div>
</template>

<script>
import BaseQuestions from '@/utils/icebreakers/base-questions'

export default {
    name: 'GatheringPlace',
    layout: 'app',
    data: () => ({
        placeId: '',
        items: []
    }),
    created () {
        this.placeId = this.$route.params.place

        this.items = [
            { color: 'strong', steps: [
                { title: "Bienvenue au Liquorium.", subtitle: "On espère que le lieu qu'on a sélectionné vous plaît.", background: 'https://uniiti.com/images/shops/slides/80d02764a32ea8581c41c84c2060d3aec36de550.jpeg' },
                { title: "Suis le guide !", subtitle: "On espère que le lieu qu'on a sélectionné vous plaît." }
                // { title: "Sinon, tant pis.", choices: [
                //     { title: "Table Améthyste" },
                //     { title: "Table Phacochère" },
                //     { title: "Table Tortillas" }
                // ] }
            ] },
            { color: 'cream', steps: [
                { type: 'titles', title: "L'interviewer\ninterviewé", classes: ['bgi-holo'] },
                { title: "Pour ce tour, tu as le rôle l'interviewer.", subtitle: "Et c'est toi qui va pouvoir choisir les questions à poser à tes --victimes-- amis." },
                { title: "Commence par la personne à ta gauche.", subtitle: "Demande-lui son prénom, puis choisis l'une des 3 questions que l'on te propose ci-dessous.", nextCta: 'On est partis !!' }
            ] },
            { color: 'memo', steps: [
                { type: 'random', subtitle: "Première personne", choices: BaseQuestions }
            ] },
            { color: 'ocean', steps: [
                { type: 'random', subtitle: "Deuxième personne", choices: BaseQuestions }
            ] },
            { color: 'alpine', steps: [
                { type: 'random', subtitle: "Encore une dernière !", choices: BaseQuestions }
            ] },
            { color: 'cream', steps: [
                { title: "On est bons !", subtitle: "Attends, je crois qu'on a oublié une personne...", background: this.$bg.holo },
                { title: "Tu pensais quand même pas que t'allais y échapper.", subtitle: "Commence d'abord par te présenter..." },
                { title: "Maintenant, chaque personne va te poser une question de son choix.", subtitle: "Oui, c'est injuste." }
            ] },
            { steps: [
                { title: "Le tour des présentations est bouclé !", subtitle: "Quand vous le sentez, c'est à la prochaine personne (carte #02) de scanner son QR code." }
            ] },
        ]
    },
}
</script>

<style lang="scss" scoped>
.Page {
    padding: 30px;
    height: 100vh;
    overflow: hidden;
}
</style>