import axios from 'axios'

export default async function sitemap () {
    let routes = [
        { url: '/' },
        { url: '/faq' },
        { url: '/g' },
    ]

    const orgas = await axios.get('https://cosmoz.events/api' + '/entities?type=organization')

    if (orgas && orgas.data) {
        routes = [
            ...routes,
            ...orgas.data.data.filter(g => g.slug).map(g => ({
                url: `/o/${g.slug}`,
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
                url: `/o/${g.organization ? g.organization.slug : 'event'}/${g.id}`,
                changefreq: 'daily',
                lastmod: g.updatedAt
            }))
        ]
    }

    return {
        hostname: process.env.BASE_URL,
        routes,
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