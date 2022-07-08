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
    utils: {
        users: `{users} | {users} | {users} et {others} autre(s)`
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
    notifications: {
        'post-reply': {
            content: '<b>{users}</b> a répondu à ton statut : <i>{status}</i> | <b>{users}</b> a répondu à ton statut : <i>{status}</i> | <b>{users}</b> ont répondu à ton statut : <i>{status}</i>'
        },
        'post-react': {
            content: '<b>{users}</b> a réagi à ton statut : <i>{status}</i> | <b>{users}</b> a réagi à ton statut : <i>{status}</i> | <b>{users}</b> ont réagi à ton statut : <i>{status}</i>'
        },
        'post-gathering': {
            content: '<b>{users}</b> a publié dans <b>{gathering}</b> | <b>{users}</b> a publié dans <b>{gathering}</b> | <b>{users}</b> ont publié dans <b>{gathering}</b>'
        },
        'gathering-new': {
            content: `<b>{gathering}</b> a été annoncé dans {constellation} | <b>{gathering}</b> a été annoncé dans <b>{constellation}</b> | {n} nouveaux événements ont été annoncés dans <b>{constellation}</b>`
        },
        'gathering-mention': {
            content: `Tu as reçu un remerciement pour ta présence ! | Tu as reçu un remerciement pour ta présence ! | Tu as reçu {n} remerciements pour ta présence !</b>`
        },
        'gathering-confirmed': {
            content: `Ta présence à été confirmée ! Il est temps de créer de nouvelles connexions ✨`
        },
        'gathering-cancelled': {
            content: `L'événement <b>{content}</b> a dû être annulé.`
        },
        'conste-application': {
            content: `<b>{users}</b> a demandé à rejoindre {constellation} | <b>{users}</b> a demandé à rejoindre <b>{constellation}</b> | {users} ont demandé à rejoindre <b>{constellation}</b>`
        },
        'conste-enter': {
            content: `Ta demande a été approuvée : bienvenue chez <b>{constellation}</b> !`
        },
        'friends-new': {
            content: `<b>{user}</b> a accepté ta demande et a rejoint ta constellation !`
        }
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
        friends: {
            icon: 'far fa-sparkles',
            title: 'Amis uniquement',
            subtitle: `Visible par mes amis uniquement`,
            error: `Uniquement visible par ses amis.`
        },
        ['g-member']: {
            icon: 'far fa-sparkles',
            title: 'Constellation uniquement',
            subtitle: `Visible uniquement par les autres membres`,
            error: `Uniquement visible par les membres.`
        },
        extended: {
            icon: 'far fa-solar-system',
            title: 'Contellation étendue uniquement',
            subtitle: `Visible par ma constellation étendue`,
            error: `Uniquement visible par sa constellation étendue.`
        }
    },
    interests: {
        nature: `En pleine nature`,
        sport: `Sportif en herbe`,
        outside: `À l'extérieur`,
        afterwork: `Afterworks`,
        drinks: `Trinquer ensemble`,
        foodie: `Bons petits plats`,
        games: `Jouer ensemble`,
        insolite: `Insolite`,
        geek: `Univers geek`,
        lgbtq: `Communauté LGBTQ+`,
        movies: `Ciné & pop-corn`,
        art: `Art & musées`,
        culture: `Culture`,
        volunteering: `Bénévolat`,
        chill: `Au calme`,
        festive: `En mode festif`,
        music: `Music lover`,
        startups: `Entrepreneurs`,
        girls: `Girls only`,
        singles: `Entre célibs`
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
            'slug-taken': `Désolé, ce nom de boutique est déjà pris par un autre utilisateur.`,
            'unauthorized': `Tu n'es pas autorisé à modifier cet élément. Contacte notre support si tu penses que c'est une erreur.`,
            'no-content': `Cette publication doit avoir du contenu.`
        }
    },
    hangouts: {
        categories: {
            eat: {
                label: `Manger quelque part`,
                tags: {
                    default: { emoji: '🍝', label: `Manger un truc bon` },
                    new: { emoji: '🍤', label: `Tester quelque chose nouveau` },
                    sweet: { emoji: '🍨', label: `S'accorder une petite douceur` },
                }
            },
            party: {
                label: `Faire la fête`,
                tags: {
                    default: { emoji: '🍻', label: `Prendre des verres` },
                    taste: { emoji: '🍸', label: `Déguster un bon cocktail` },
                    dance: { emoji: '💃', label: `Aller danser` },
                }
            },
            out: {
                label: `En plein air`,
                tags: {
                    default: { emoji: '🍃', label: `Se balader et aviser` },
                    picnic: { emoji: '🌞', label: `Partager un pique-nique` },
                    hike: { emoji: '🥾', label: `Faire une grande balade` },
                    sport: { emoji: '🏃‍♀️', label: `Faire du sport` },
                }
            },
            activities: {
                label: `Activités`,
                tags: {
                    default: { emoji: '🙌', label: `Faire quelque chose ensemble` },
                    movies: { emoji: '🍿', label: `Voir un bon film` },
                    new: { emoji: '😱', label: `Faire dans l'original` },
                    shopping: { emoji: '🛍', label: `Faire du shopping` },
                }
            },
        },
    }
}