export default function ({ store, redirect }) {
    if (store.state.auth.user && store.state.auth.user.role != 'confirmed') {
        return redirect(process.env.BASE_URL + '/welcome')
    } else {
        return redirect(process.env.BASE_URL)
    }
}