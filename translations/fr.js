export default {
    meta: {
        append: ` | L'Arrière Boutique`
    },
    base: {
        days: '{n} jour | {n} jours',
        articles: '{n} article | {n} articles',
        orders: '{n} commande | {n} commandes',
    },
    errors: {
        default: {
            generic: `Une erreur est survenue, peux-tu réessayer ?`,
            emailNotFound: `Cet e-mail n'est pas enregistré, peut-être veux-tu plutôt t'inscrire ?`,
            wrongCredentials: `Ton mot de passe est incorrect, peux-tu réessayer s'il-te-plaît ?`,
            missingFields: `On dirait qu'il me manque des informations, tu veux bien vérifier s'il-te-plaît ?`,
            alreadyRegistered: `Merveilleux, tu as déjà un compte ! Essaye plutôt de te connecter.`,
            'already-subscribed': `Superbe, tu es déjà abonné à notre newsletter !`,
            'user-not-found': `On dirait que cet utilisateur n'existe pas.`,
            'token-expired': `Cette demande a expiré, merci de réessayer.`,
            'slug-taken': `Désolé, ce nom de boutique est déjà pris par un autre utilisateur.`
        }
    }
}