<template>
    <div>
        <accordion class="FAQ_question" title="Je suis vraiment obligé de participer à un événement d'accueil ?">
            Hé oui. Tout le concept de la plateforme repose sur les connexions réelles. Tu ne pourras pas entrer en contact avec d'autres membres sans les avoir vus en vrai d'abord.<br><br>
            Ça nous assure une sécurité et 100% de membres réels et authentiques dans notre communauté, qui ont envie de créer des liens.
        </accordion>
        <accordion class="FAQ_question" title="Je suis timide...">
            On a vraiment à coeur d'intégrer nos amis timides, anxieux et/ou introvertis.<br><br>
            Lors de l'événement d'accueil, les nouveaux sont placés par tablées de 4 personnes maximum pour assurer la proximité. Des petits jeux sont prévus pour permettre à tout le monde d'apprendre à se connaître sans pression.<br><br>
            Un animateur est toujours présent sur place pour s'assure que chacun se sente bien et trouve sa place !
        </accordion>
        <accordion class="FAQ_question" title="Et si je m'entends avec personne pendant l'événement d'accueil ?">
            Ça peut arriver. Tu auras la possibilité de participer gratuitement à d'autres événements que nous organisons, jusqu'à que tu te crées quelques affinités !<br><br>
            Mais saches que la majorité des membres créent de premières affinités lors de ce premier événement.
        </accordion>
        <accordion class="FAQ_question" title="Je cherche l'amour, c'est uniquement pour les amis ici ?">
            Tu peux trouver l'amour ici. Mais ce n'est pas le but premier. Nous ne sommes pas une application de drague.<br><br>
            Nous sommes persuadé que l'amour se trouve quand on le cherche le moins. Viens avant-tout pour rencontrer de nouvelles personnes et garde l'esprit ouvert. L'amour viendra peut-être de façon tout à fait naturelle.
        </accordion>
        <accordion class="FAQ_question" title="Et si quelqu'un me met mal à l'aise ?">
            Nous avons à coeur de créer une communauté bienveillante. Il peut arriver que certaines personnes aient un comportement déplacé. Un animateur est présent en tant que médiateur, n'hésite pas à lui en parler.<br><br>
            Si tu n'as pas apprécié tes interactions avec quelqu'un, tu pourras le signifier sur la plateforme. Tu ne reverras plus cette personne lors de nos événements.<br><br>
            Si cette personne est signalée par plusieurs personnes, nous prendrons les décisions nécessaires pour faire respecter nos valeurs.
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