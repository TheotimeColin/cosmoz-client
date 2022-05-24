export default {
    meta: {
        append: `| Cosmoz, rencontres hors-ligne`
    },
    base: {
        days: '{n} jour | {n} jours',
        articles: '{n} article | {n} articles',
        orders: '{n} commande | {n} commandes',
    },
    articles: {
        categories: {
            article: `Article`
        }
    },
    mentions: {
        welcome: `Merci pour l'accueil`,
        nice: `Super sympa !`,
        passionate: `Discussion passionnante`,
        energy: `J'adore ton énergie`
    },
    tidbits: {
        anything: {
            title: `Zone libre`
        },
        socials: {
            title: `Mes réseaux sociaux`
        },
    },
    permissions: {
        public: {
            icon: 'far fa-eye',
            title: 'Tout le monde',
            subtitle: `Visible par tout le monde`,
            error: `Uniquement visible par les membres.`
        },
        user: {
            icon: 'far fa-eye',
            title: 'Tout le monde',
            subtitle: `Visible par tout le monde`,
            error: `Uniquement visible par les membres.`
        },
        encountered: {
            icon: 'far fa-hand-wave',
            title: 'Connaissances uniquement',
            subtitle: `Visible par les personnes que j'ai rencontrées`,
            error: `Uniquement visible après une rencontre.`
        },
        affinity: {
            icon: 'far fa-sparkles',
            title: 'Constellation uniquement',
            subtitle: `Visible par ma constellation uniquement`,
            error: `Uniquement visible par sa constellation.`
        },
        extended: {
            icon: 'far fa-solar-system',
            title: 'Contellation étendue uniquement',
            subtitle: `Visible par ma constellation étendue`,
            error: `Uniquement visible par sa constellation étendue.`
        }
    },
    errors: {
        default: {
            generic: `Une erreur est survenue, peux-tu réessayer ?`,
            'email-not-found': `Cet e-mail n'est pas enregistré, peut-être veux-tu plutôt t'inscrire ?`,
            'wrong-credentials': `Ton mot de passe est incorrect, peux-tu réessayer s'il-te-plaît ?`,
            'missing-fields': `On dirait qu'il me manque des informations, tu veux bien vérifier s'il-te-plaît ?`,
            'already-registered': `Merveilleux, tu as déjà un compte ! Essaye plutôt de te connecter.`,
            'already-subscribed': `Superbe, tu es déjà abonné à notre newsletter !`,
            'user-not-found': `Ton adresse e-mail n'est pas reconnue.`,
            'token-expired': `Cette demande a expiré, merci de refaire une demande de réinitialisation.`,
            'slug-taken': `Désolé, ce nom de boutique est déjà pris par un autre utilisateur.`
        }
    }
}