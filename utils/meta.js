export function getMeta ($route, $store) {
    let name = $route ? $route.name.split('_')[0] : ''
    let constellation = null
    let gathering = null
    
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

    const router = {
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
        'constellation': {
            title: 'Ma constellation',
            fa: 'sparkles'
        },
        'c-slug': {
            title: constellation?.name,

            children: {
                'feed': {
                    title: 'Activité de ' + constellation?.name,
                    fa: 'message-lines'
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
                            isPanel: true
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