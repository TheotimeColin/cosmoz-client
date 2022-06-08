const BREAKPOINTS = [
    { id: 'xs', size: 0 },
    { id: 's', size: 600 },
    { id: 'm', size: 1000 },
    { id: 'l', size: 1400 },
]

export default {
    namespaced: true,
    state: () => ({
        subtitle: '',
        current: '',
        fa: '',
        currentConst: '',
        isCartActive: false,
        isNavCompact: false,
        isBodyOverflow: true,
        isPWA: false,
        isScrolled: false,
        isDisableFooter: false,
        breakpoint: 'l',
        body: {
            classes: [ 'is-fill' ],
            background : ''
        },
        header: {
            transparent: false
        },
        banner: {
            classes: [],
            title: ''
        },
        popins: {
            register: null
        },
        meta: {
            title: ''
        }
    }),
    mutations: {
        set (state, v) {
            let data = Object.entries(v)
            
            data.forEach(key => {
                state[key[0]] = key[1]
            })
        },
        setCurrent (state, v) {
            state.current = v
        },
        register (state, v) {
            state.popins = {
                ...state.popins,
                register: v
            }
        },
        setMode (state, v) {
            state.isPWA = v
        },
        setBreakpoint (state, v) {
            state.breakpoint = BREAKPOINTS.reduce((r, b) => {
                return v > b.size ? b.id : r
            }, 'l')
        },
        toggleOverflow (state, v) {
            if (!state.isBodyOverflow || v === true) {
                state.isBodyOverflow = true
            } else if (state.isBodyOverflow) {
                state.isBodyOverflow = false 
            }
            
            document.body.classList.toggle('o-hidden', !state.isBodyOverflow)
        },
        toggleCompact (state, params) {
            state.isNavCompact = params.force !== undefined ? params.force : !state.isNavCompact
            if (params.save) this.$cookies.set('nav-compact', JSON.stringify(state.isNavCompact))
        },
        toggleCart (state) {
            state.isCartActive = !state.isCartActive
        },
        setBanner (state, banner ) {
            state.banner = { ...state.banner, ...banner  }
        },
        setHeader (state, header) {
            state.header = { ...state.header, ...header  }
        },
        setClasses (state, classes) {
            state.body = { ...state.body, classes }
        },
        setScrolled (state, action) {
            state.isScrolled = action
        },
        setProperty (state, params) {
            state.meta = {
                ...state.meta,
                ...params,
                title: params.secondary ? params.secondary : params.title
            }
        }
    },
    getters: {
        smallerThan: (state) => (v) => {
            return state.breakpoint ? BREAKPOINTS.find(b => b.id == v).size >= BREAKPOINTS.find(b => b.id == state.breakpoint).size : false
        },
        biggerThan: (state) => (v) => {
            return state.breakpoint ? BREAKPOINTS.find(b => b.id == v).size < BREAKPOINTS.find(b => b.id == state.breakpoint).size : false
        }
    }
}