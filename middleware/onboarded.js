export default function ({ store, redirect }) {
    if (store.state.auth.user && !store.state.auth.user.notifications.find(n => n.type == 'onboarding' && n.id == 'welcomed')) {
        return redirect(process.env.APP_URL + '/welcome')
    } else if (!store.state.auth.user) {
        return redirect('/compte/login')
    }
}