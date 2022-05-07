<template>
    <div>
        <accordion class="FAQ_question" title="Je suis timide...">
            Parce que c'est comme ça !
        </accordion>
        <accordion class="FAQ_question" title="Et si je m'entends avec personne pendant l'événement d'accueil ?">
            Parce que c'est comme ça !
        </accordion>
        <accordion class="FAQ_question" title="J'ai peur de me faire draguer par des relous.">
            Parce que c'est comme ça !
        </accordion>
        <accordion class="FAQ_question" title="Je cherche l'amour, c'est uniquement pour les amis ici ?">
            Parce que c'est comme ça !
        </accordion>
    </div>
</template>

<script>
export default {
    name: 'FAQ'
}
</script>

<style lang="scss" scoped>
.FAQ_question {
    
    & + & {
        margin-top: 5px;
    }
}
</style>