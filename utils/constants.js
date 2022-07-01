import holo from '@/assets/img/texture/holo.webp'
import aluminium from '@/assets/img/texture/aluminium.webp'
import bubbleGum from '@/assets/img/texture/bubble-gum.webp'
import denim from '@/assets/img/texture/denim.webp'
import iceCream from '@/assets/img/texture/ice-cream.webp'
import plasticBlack from '@/assets/img/texture/plastic-black.webp'
import night from '@/assets/img/texture/night.webp'

export default {
    articleCategories: [
        { id: 0, label: `Article`, value: 'article' },
    ],
    status: [
        { id: 0, label: `Actif`, value: 'active' },
        { id: 2, label: `Brouillon`, value: 'draft' },
        { id: 1, label: `Désactivé`, value: 'disabled' },
    ],
    bg: { holo, aluminium, bubbleGum, denim, iceCream, plasticBlack, night },
    mentions: [
        { id: 0, emoji: '🤗', icon: 'hand-wave', label: `Merci pour l'accueil`, value: 'welcome' },
        { id: 1, emoji: '😄', icon: 'face-laugh-beam', label: `Super sympa !`, value: 'nice' },
        { id: 2, emoji: '✨', icon: 'message-smile', label: `Discussion passionnante`, value: 'passionate' },
        { id: 3, emoji: '⚡', icon: 'bolt', label: `J'adore ton énergie`, value: 'energy' }
    ],
    hashtags: [
        { id: 'présentations', icon: 'hand-wave', description: 'Présente-toi aux membres de la communauté !', disabled: '$introduced' },
        { id: 'entraide', icon: 'heart', description: 'Une question ou un conseil à donner ?' },
        { id: 'débat', icon: 'keynote', description: 'Enflamme ta communauté avec une question !' },
        { id: 'passion', icon: 'face-smile-hearts', description: 'Partage tes passions.' },
    ]
}