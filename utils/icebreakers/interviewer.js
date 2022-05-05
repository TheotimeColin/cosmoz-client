import BaseQuestions from '@/utils/generic/base-questions'

export default [
    { color: 'cream', steps: [
        { type: 'titles', title: "L'interviewer\ninterviewé", subtitle: `Pour se mettre en jambe`, classes: ['bgi-holo'] },
        { title: "Pour ce tour, tu as le rôle l'interviewer.", subtitle: "Et c'est toi qui va pouvoir choisir les questions à poser à tes --victimes-- *nouveaux amis*." },
        { title: "Commence par la personne à ta gauche.", subtitle: "Demande-lui son prénom puis pose la question qu'on te propose ci-dessous. Et ainsi de suite !", nextCta: 'On est partis !!' }
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
        { title: "On est bons !", subtitle: "Attends, je crois qu'on a oublié une personne...", background: 'holo' },
        { title: "Tu pensais quand même pas que t'allais y échapper.", subtitle: "Commence d'abord par te présenter..." },
        { title: "Maintenant, chaque personne va te poser une question de son choix.", subtitle: "Oui, c'est injuste." }
    ] }
]