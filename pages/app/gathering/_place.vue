<template>
    <div class="Page bg-cream-xweak">
        <p class="color-cream-xstrong ft-title-m mb-30">#01 : Introduction</p>

        <card class="bg-cream-xweak" :items="items" />
    </div>
</template>

<script>
export default {
    name: 'GatheringPlace',
    data: () => ({
        placeId: '',
        items: []
    }),
    created () {
        this.placeId = this.$route.params.place

        this.items = [
            { color: 'cream', steps: [
                { title: "Bienvenue au Liquorium.", subtitle: "On espère que le lieu qu'on a sélectionné vous plaît." },
                { title: "Suis le guide !", subtitle: "On espère que le lieu qu'on a sélectionné vous plaît." }
                // { title: "Sinon, tant pis.", choices: [
                //     { title: "Table Améthyste" },
                //     { title: "Table Phacochère" },
                //     { title: "Table Tortillas" }
                // ] }
            ] },
            { color: 'cream', steps: [
                { title: "Pour ce tour, tu as le rôle l'interviewer.", subtitle: "Et c'est toi qui va pouvoir choisir les questions à poser à tes -victimes- amis." },
                { title: "Commence par la personne à ta gauche.", subtitle: "Demande-lui son prénom, puis choisis l'une des 3 questions que l'on te propose ci-dessous." }
            ] },
            { color: 'memo', steps: [
                { subtitle: "Première personne", sections: [
                    { title: "Plutôt chiens ou chats ?", subtitle: "Ou autre ?" },
                    { title: "Ton plus grand défaut ?" },
                    { title: "Est-ce que t'as hésité à venir ce soir ?" },
                ] }
            ] },
            { color: 'ocean', steps: [
                { subtitle: "Deuxième personne", sections: [
                    { title: "Ton parc d'attractions préféré ?" },
                    { title: "C'est quoi ton deuxième prénom ?" },
                    { title: "Comment t'as découvert Gatherings ?" },
                ] }
            ] },
            { color: 'alpine', steps: [
                { subtitle: "Encore une dernière !", sections: [
                    { title: "Ton parc d'attractions préféré ?" },
                    { title: "C'est quoi ton deuxième prénom ?" },
                    { title: "Comment t'as découvert Gatherings ?" },
                ] }
            ] },
            { color: 'tulip', steps: [
                { title: "On est bons !", subtitle: "Attends, je crois qu'on a oublié une personne..." },
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