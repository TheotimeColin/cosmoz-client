<template>
    <div>
        <div class="ft-s color-ft-weak text-upper ft-italic mt-20 mb-5">Le concept</div>

        <accordion class="FAQ_question" title="C'est quoi l'objectif de Cosmoz ?">
            Te permettre de sortir et créer du lien social avec des personnes cools.<br><br>
            On a tous déjà ressenti ce besoin de voir de nouvelles têtes, qu'on ait déjà un groupe d'amis existant ou pas. Gathering te permet de découvrir de nouvelles activités et te créer de nouveaux amis.
        </accordion>
        <accordion class="FAQ_question" title="Je suis vraiment obligé de participer à des événements ?">
            Hé oui. Tout le concept de la plateforme repose sur les connexions réelles. Tu ne pourras pas entrer en contact avec d'autres membres sans les avoir vus en vrai d'abord.<br><br>
            Ça nous assure 100% de membres réels et authentiques dans notre communauté, qui ont une vraie envie de créer des liens.
        </accordion>
        <accordion class="FAQ_question" title="Je cherche l'amour, c'est uniquement pour les amis ici ?">
            Tu peux trouver l'amour ici. Mais ce n'est pas le but premier. Nous ne sommes pas une application de drague.<br><br>
            Nous sommes persuadé que l'amour se trouve quand on le cherche le moins. Viens avant-tout pour rencontrer de nouvelles personnes, de nouvelles activités et garde l'esprit ouvert. L'amour viendra peut-être naturellement.<br><br>Et qui sait, c'est peut-être l'un de tes nouveaux amis qui te fera rencontrer l'âme soeur...
        </accordion>
        <accordion class="FAQ_question" title="Est-ce que c'est gratuit ?">
            Cosmoz est gratuit.<br><br>
            Pour nous soutenir, tu peux souscrire à un abonnement qui te donne l'accès à des extras super sympas.
        </accordion>

        <div class="ft-s color-ft-weak text-upper ft-italic mt-20 mb-5">Affinités & tribus</div>

        <accordion class="FAQ_question" title="C'est quoi cette histoire d'affinités ?">
            Lorsque tu rencontres un de nos membres dans un événement, tu auras accès à son profil complet. Si vous vous appréciez mutuellement, une affinité se crée. Une affinité signifie simplement que deux membres aiment passer du temps ensemble de manière amicale.
            <br><br>
            On te proposera de nouvelles sorties avec les personnes avec qui tu as des affinités, mais aussi avec les leurs. Les amis de tes amis deviendront tes amis !
            <br><br>
            Si 10 membres ou plus ont de nombreuses affinités entre eux, nous vous proposerons de fonder une tribu.
        </accordion>
        <accordion class="FAQ_question" title="C'est quoi une tribu ? Comment en rejoindre une ?">
            Une tribu est un groupe de 10 à 60 personnes dont les membres s'apprécient et se voient régulièrement. Certaines tribus peuvent avoir un thème particulier selon un centre d'intérêt (balades, jeux-vidéos, livres...).
            <br><br>
            Pour entrer dans une tribu, il faut que tu aies assez d'affinités avec ses membres. Certaines tribus organisent des sorties ouvertes à tous, c'est l'occasion d'y rencontrer ses membres !
        </accordion>
        <accordion class="FAQ_question" title="Pourquoi seulement 60 membres par tribu ?">
            Notre objectif est de créer des communautés à taille humaine. Au-delà de ce nombre, il devient difficile de maintenir des relations avec tout le monde et de sous-groupes ont tendance à se créer.
            <br><br>
            Les personnes inactives dans une tribu la quittent automatiquement, ce qui donne l'occasion à de nouvelles têtes de la rejoindre.
            <br><br>
            Tu as aussi la possibilité d'appartenir à plusieurs tribus, donc ne t'inquiète pas, tu auras toujours des occasions de sortir !
        </accordion>

        
        <div class="ft-s color-ft-weak text-upper ft-italic mt-20 mb-5">Sorties & événements</div>

        <accordion class="FAQ_question" title="Je suis timide...">
            On a vraiment à coeur d'intégrer nos amis timides, anxieux et/ou introvertis.<br><br>
            Lors de nos événements officiels, nous privilégions les petits groupes (-20 personnes) et de petits jeux sont prévus pour permettre à tout le monde d'apprendre à se connaître sans pression.<br><br>
            Un animateur est toujours présent sur place pour s'assure que chacun se sente bien et trouve sa place !
        </accordion>
        <accordion class="FAQ_question" title="Je veux uniquement rencontrer des personnes de mon âge ou de mon genre.">
            Des événements sont réservés à certaines tranches d'âge, identités ou communautés. Tu as la possibilité de les trouver facilement !
            <br><br>
            Certaines tribus possèdent également des critères pour y entrer. On espère que tu trouveras la communauté dans laquelle tu te sentiras bien.
        </accordion>
        <accordion class="FAQ_question" title="Et si je m'entends avec personne lors des événements ?">
            Ça peut arriver. Tu as la possibilité de continuer à participer gratuitement à d'autres événements, jusqu'à que tu te crées quelques affinités !<br><br>
            Mais la majorité des membres créent de premières affinités lors de leur premier événement.
        </accordion>
        <accordion class="FAQ_question" title="Que faire si quelqu'un me met mal à l'aise ?">
            Nous avons à coeur de créer une communauté bienveillante. Il peut arriver que certaines personnes aient un comportement déplacé. Un animateur est présent en tant que médiateur, n'hésite pas à lui en parler.<br><br>
            Si tu n'as pas apprécié tes interactions avec quelqu'un, tu pourras le signifier sur la plateforme. Tu ne reverras plus cette personne lors de nos événements.<br><br>
            Si cette personne est signalée par plusieurs personnes, nous prendrons les actions nécessaires pour faire respecter nos valeurs.
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