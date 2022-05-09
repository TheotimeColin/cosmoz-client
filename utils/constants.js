import holo from '@/assets/img/texture/holo.webp'
import aluminium from '@/assets/img/texture/aluminium.webp'
import bubbleGum from '@/assets/img/texture/bubble-gum.webp'
import denim from '@/assets/img/texture/denim.webp'
import iceCream from '@/assets/img/texture/ice-cream.webp'
import plasticBlack from '@/assets/img/texture/plastic-black.webp'

export default {
    articleCategories: [
        { id: 0, label: `Article`, value: 'article' },
    ],
    status: [
        { id: 0, label: `Actif`, value: 'active' },
        { id: 1, label: `Désactivé`, value: 'disabled' },
    ],
    bg: { holo, aluminium, bubbleGum, denim, iceCream, plasticBlack }
}