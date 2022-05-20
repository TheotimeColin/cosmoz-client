export function parseUser (user) {
    if (!user) return user
    
    user = JSON.parse(JSON.stringify(user))

    if (user.picture && user.picture.medias) {
        if (user.picture.medias.find(m => m.size == 's')) user.profileSmall = user.picture.medias.find(m => m.size == 's').src
        
        if (user.picture.medias.find(m => m.size == 'm')) user.profileLarge = user.picture.medias.find(m => m.size == 'm').src
    }

    // if (user.mentions) {
    //     user.mentionsCategories = user.mentions.reduce((all, current) => {
    //         current.mentions.forEach(mention => {
    //             all[mention] = all[mention] ? all[mention] + 1 : 1
    //         })

    //         return all
    //     }, {})
    // }

    return user
}