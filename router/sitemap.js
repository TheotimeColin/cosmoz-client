import axios from 'axios'

export default function sitemap () {
    return {
        hostname: process.env.BASE_URL,
        routes: async () => {
            let routes = [
                { url: '/' },
                { url: '/faq' },
                { url: '/g' },
            ]
    
            try {
                const orgas = await axios.get('https://cosmoz.events/api' + '/entities?type=organization')
    
                if (orgas && orgas.data) {
                    routes = [
                        ...routes,
                        ...orgas.data.data.filter(g => g.slug).map(g => ({
                            url: `/c/${g.slug}`,
                            changefreq: 'daily',
                            lastmod: g.updatedAt
                        }))
                    ]
                }
    
                const gatherings = await axios.get('https://cosmoz.events/api' + '/entities?type=gathering')
    
                if (gatherings && gatherings.data) {
                    routes = [
                        ...routes,
                        ...gatherings.data.data.filter(g => g.status == 'active' && g.id).map(g => ({
                            url: `/c/${g.organization ? g.organization.slug : 'event'}/events/${g.id}`,
                            changefreq: 'daily',
                            lastmod: g.updatedAt
                        }))
                    ]
                }
            } catch (e) {
                console.warn(e)
            }

            return routes
        },
        exclude: [
            '/admin',
            '/admin/**',
            '/blog',
            '/blog/**',
            '/compte',
            '/compte/**',
            '/social',
            '/social/**',
            '/main',
            '/main/**',
            '/feed',
            '/g/**',
            '/constellation'
        ]
    }
}