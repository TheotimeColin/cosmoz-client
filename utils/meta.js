export function getMeta ($route, $store) {
    let name = $route ? $route.name.split('_')[0] : ''
    let constellation = { name: '' }
    let gathering = { title: '' }
    let user = { name: '' }
    let post = { content: '' }
    
    if ($route.params.slug) {
        try {
            constellation = $store.getters['constellation/findOne']({
                slug: $route.params.slug
            })
        } catch (e) { console.warn(e) }
    }

    if ($route.params.eventId) {
        try {
            gathering = $store.getters['gathering/findOne']({
                id: $route.params.eventId
            })
        } catch (e) { console.warn(e) }
    }
    
    if ($route.params.userId) {
        try {
            user = $store.getters['user/findOne']({
                id: $route.params.userId
            })
        } catch (e) { console.warn(e) }
    }

    if ($route.params.postId) {
        try {
            post = $store.getters['status/findOne']({
                _id: $route.params.postId
            })
        } catch (e) { console.warn(e) }
    }

    const router = {
        'p': {
            title: user ? 'Profil de ' + user?.name : 'Profil',
            isPanel: true
        },
        'post': {
            title: 'Post',
            fa: 'message-lines',

            children: {

                'postId': {
                    title: post?.content,
                    isPanel: true
                }
            }
        },
        'feed': {
            title: 'Mon activité',
            fa: 'home'
        },
        'agenda': {
            title: 'Mon agenda',
            fa: 'calendar'
        },
        'explore': {
            title: 'Explorer',
            fa: 'compass'
        },
        'compte': {
            title: 'Mon compte',
            fa: 'cog'
        },
        'constellation': {
            title: 'Ma constellation',
            fa: 'sparkles'
        },
        'c-slug': {
            title: constellation?.name,
            fa: 'home',

            children: {
                'post': {
                    title: 'Post',
                    fa: 'message-lines',

                    children: {

                        'postId': {
                            title: post?.content,
                            isPanel: true
                        }
                    }
                },
                'feed': {
                    title: 'Activité de ' + constellation?.name,
                    fa: 'message-lines'
                },
                'members': {
                    title: 'Membres de ' + constellation?.name,
                    fa: 'user-astronaut'
                },
                'hangouts': {
                    title: 'Sorties',
                    fa: 'hand-wave'
                },
                'discussions': {
                    title: 'Discussions',
                    fa: 'comments'
                },
                'events': {
                    title: 'Événements',
                    fa: 'calendar',

                    children: {

                        'eventId': {
                            title: gathering?.title,
                            back: { name: 'c-slug-events', params: { slug: constellation?.slug } },
                            isPanel: true
                        }
                    }
                },
                'settings': {
                    title: `Mes paramètres dans ` + constellation?.name,
                    fa: 'cog'
                },
                'rejoindre': {
                    title: `Rejoindre ` + constellation?.name,
                    fa: 'envelope-open-text'
                },
                'manage-events': {
                    title: 'Événements',
                    fa: 'calendar',

                    children: {

                        'id': {
                            title: 'Modifier'
                        }
                    }
                }
            }
        },
    }

    const checkRoute = (current) => {
        let result = null

        Object.keys(current).forEach(currentName => {
            if (name.includes(currentName)) {
                result = current[currentName]
                let child = result?.children ? checkRoute(result.children) : null

                if (child) {
                    result = {
                        ...child,
                        fa: child.fa ? child.fa : result.fa
                    }
                }
            }
        })

        return result
    }
    
    let route = checkRoute(router)

    return route
}