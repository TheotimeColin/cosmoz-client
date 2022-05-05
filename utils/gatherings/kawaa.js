import InterviewerGame from '@/utils/icebreakers/interviewer'
import Cover from '@/assets/img/gatherings/kawaa/cover.webp'
import Cover2 from '@/assets/img/gatherings/kawaa/cover_2.webp'

export default [
    { color: 'strong', steps: [
        { title: "Bienvenue au Kawaa !", subtitle: "On espère que le lieu qu'on a sélectionné vous plaît.", background: Cover },
        { title: "Bien plus qu'un simple café.", subtitle: "C'est un lieu de partages, de rencontres. N'hésitez pas à checker les ateliers qu'ils proposent !", background: Cover2 },
        { title: "L'ambiance parfaite pour un petit Gathering.", subtitle: "Si tout le monde est arrivé, on peut démarrer !", nextCta: `On est tous là !` }
    ] },
    ...InterviewerGame,
    { steps: [
        { title: "Le tour des présentations est bouclé !", subtitle: "Quand vous le sentez, c'est à la prochaine personne (carte #02) de scanner son QR code." }
    ] },
]