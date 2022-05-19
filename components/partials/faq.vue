<template>
    <div>
        <div class="ft-title-2xs color-ft-weak mb-15">
            <fa icon="far fa-thumbtack" class="mr-5" /> Le concept
        </div>

        <accordion class="FAQ_question" title="C'est quoi l'objectif de Cosmoz ?">
            Te permettre de sortir et créer du lien social avec des personnes cools et surtout de l'entretenir ensuite.
            <br><br>
            On a tous déjà ressenti ce besoin de voir de nouvelles têtes, qu'on ait déjà un groupe d'amis existant ou pas. Cosmoz te permet de découvrir de nouvelles activités et te créer de nouveaux amis.
        </accordion>
        <accordion class="FAQ_question" title="Je suis vraiment obligé de participer à des événements ?">
            Hé oui. Tout le concept de la plateforme repose sur les connexions réelles. Tu ne pourras pas entrer en contact avec d'autres membres sans les avoir vus en vrai d'abord.<br><br>
            Ça nous assure 100% de membres réels et authentiques dans notre communauté, qui ont une vraie envie de créer des liens.
        </accordion>
        <accordion class="FAQ_question" title="Je cherche l'amour, c'est uniquement pour les amis ici ?">
            Tu peux trouver l'amour ici. Mais ce n'est pas le but premier. Nous ne sommes pas une application de drague.<br><br>
            Nous sommes persuadés que l'amour se trouve quand on le cherche le moins. Viens avant-tout pour rencontrer de nouvelles personnes, de nouvelles activités et garde l'esprit ouvert. L'amour viendra peut-être naturellement.<br><br>Et qui sait, c'est peut-être l'un de tes nouveaux amis qui te fera rencontrer l'âme soeur...
        </accordion>
        <accordion class="FAQ_question" title="Est-ce que c'est gratuit ?">
            Cosmoz est gratuit.<br><br>
            Pour nous soutenir, tu peux souscrire à un abonnement qui te donne l'accès à des fonctionnalités supplémentaires super sympas.
        </accordion>

        <div class="ft-title-2xs color-ft-weak mt-40 mb-15">
            <fa icon="far fa-sparkles" class="mr-5" /> Affinités & constellations
        </div>

        <accordion class="FAQ_question" title="C'est quoi cette histoire d'affinités ?">
            Après avoir rencontré quelqu'un pendant un de nos événements, tu auras accès à son profil complet. Si vous vous appréciez mutuellement, une affinité se crée.

            <p class="p-15 mv-15 bg-bg-strong br-s">Une affinité signifie simplement que deux membres aiment passer du temps ensemble de manière amicale.</p>

            On te proposera de nouvelles sorties avec les personnes avec qui tu as des affinités, mais aussi avec les leurs. Les amis de tes amis deviendront tes amis !
        </accordion>
        <accordion class="FAQ_question" title="C'est quoi une constellation ? Comment en rejoindre une ?">
            Une constellation est un groupe de 5 à 150 personnes dont les membres s'apprécient et se voient régulièrement. Certaines constellations peuvent avoir un thème particulier selon un centre d'intérêt (balades, jeux-vidéos, livres...).

            <p class="p-15 mv-15 bg-bg-strong br-s">Chaque constellation possède une page privée où leurs membres peuvent organiser des sorties ensemble.</p>

            Chaque constellation a des conditions d'entrée particulières. Tu peux également créer la tienne lorsque tu auras créé assez d'affinités.
        </accordion>
        <accordion class="FAQ_question" title="Que puis-je faire dans constellation ?">
            Les constellations sont des lieux de sociabilisation pour tes amis, mais aussi les amis de tes amis.

            <p class="p-15 mt-15 bg-bg-strong br-s">
                <ul class="pl-20">
                    <li>Organiser et participer facilement à des sorties de groupe</li>
                    <li>Partager son humeur du moment ou solliciter l'avis de la communauté</li>
                    <li>Apprendre à se connaître avec des jeux et créer une vraie cohésion</li>
                </ul>
            </p>
        </accordion>
        <accordion class="FAQ_question" title="Pourquoi seulement 150 membres par constellation ?">
            Notre objectif est de créer des communautés à taille humaine. Au-delà de ce nombre, il devient difficile de maintenir des relations avec tout le monde et de sous-groupes ont tendance à se créer.
            <br><br>
            Les personnes inactives dans une constellations la quittent automatiquement, ce qui donne l'occasion à de nouvelles têtes de la rejoindre.
            <br><br>
            Tu as aussi la possibilité d'appartenir à plusieurs constellations, donc ne t'inquiète pas, tu auras toujours des occasions de sortir !
        </accordion>

        <div class="ft-title-2xs color-ft-weak mt-40 mb-15">
            <fa icon="far fa-party-horn" class="mr-5" /> Sorties & événements
        </div>

        <accordion class="FAQ_question" title="Je suis timide...">
            On a vraiment à coeur d'intégrer nos amis timides, anxieux et/ou introvertis.<br><br>
            Lors de nos événements officiels, nous privilégions les petits groupes (-20 personnes) et de petits jeux sont prévus pour permettre à tout le monde d'apprendre à se connaître sans pression.<br><br>
            Un animateur est toujours présent sur place pour s'assure que chacun se sente bien et trouve sa place !
        </accordion>
        <accordion class="FAQ_question" title="Je veux uniquement rencontrer des personnes de mon âge ou de mon genre.">
            Des événements sont réservés à certaines tranches d'âge, identités ou communautés. Tu as la possibilité de les trouver facilement !
            <br><br>
            Certaines constellations possèdent également des critères pour y entrer. On espère que tu trouveras la communauté dans laquelle tu te sentiras bien.
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
        margin-top: 8px;
    }
}
</style>