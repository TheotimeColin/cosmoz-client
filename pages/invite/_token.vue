<template>
    <div class="Container" :class="{ 'is-loading': isLoading }" :style="cover ? { '--cover': `url(${cover})` } : {}">
        <div v-if="constellation">
            <div class="Invite block-r p-40 width-100 text-center o-hidden p-relative shadow" :class="join ? [] : ['bg-cover-25 bg-night']">
                <div class="G_cosmoz" v-if="!join"></div>

                <template v-if="!join">
                    <div>
                        <const-icon v-bind="constellation" :modifiers="['xl']" :no-link="true" />
                    </div>

                    <p class="ft-s color-ft-weak mt-10">Tu as été invité à rejoindre</p>
                    <p class="ft-title-m">{{ constellation.name }}</p>
                    <p class="mt-5" v-if="constellation.intro">{{ constellation.intro }}</p>

                    <button-base class="mt-30" :modifiers="['full', 'light']" @click="() => user ? onSuccess() : join = true">
                        Rejoindre la communauté
                    </button-base>
                </template>
                <register-form :redirect="false" @success="onSuccess" v-else />
            </div>
            
            <div class="text-center p-relative" v-if="user">
                <button-base class="mt-20" :image="user.profileSmall" icon-after="times" :modifiers="['s']" :text="user.name" @click="logOut" />
            </div>
        </div>
        <div class="Invite block-r p-40 max-width-s width-100 text-center" v-else-if="!isLoading">
            <p class="ft-title-m">Lien d'invitation invalide</p>
            <p class="ft-s color-ft-weak mt-10">Ce lien a peut-être expiré.</p>
            
            <button-base class="mt-30" :modifiers="['full']" :to="{ name: 'index' }">
                Retour à Cosmoz
            </button-base>
        </div>
        <div v-else>
            <fa icon="far fa-spinner-third" class="spin" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'InviteToken',
    layout: 'full',
    data: () => ({
        isLoading: true,
        constellation: null,
        join: false
    }),
    computed: {
        
        cover () {
            return this.constellation?.cover?.medias ? this.constellation.cover.medias.find(m => m.size == 's')?.src : null
        }
    },
    async mounted () {
        try {
            const token = await this.$recaptcha.execute('login')

            const response = await this.$store.dispatch('token/get', {
                id: this.$route.params.token, token, type: 'invite'
            })

            console.log(response)

            if (response && response.constellation) {
                this.constellation = await this.$store.dispatch('constellation/get', {
                    query: { _id: response.constellation }
                })
            } else {
                throw new Error('not-found')
            }
        } catch (e) {
            console.error(e)
        }

        setTimeout(() => this.isLoading = false, 100)
    },
    methods: {
        async onSuccess () {
            try {
                const response = await this.$store.dispatch('constellation/accept', {
                    token: this.$route.params.token,
                    conste: this.constellation._id
                })

                if (response.status == 1) {
                    this.$router.push(this.localePath({ name: 'c-slug', params: { slug: this.constellation.slug } }))
                }
            } catch (e) {
                console.error(e)
            }
        },
        async logOut () {
            this.join = true
            await this.$store.dispatch('user/logOut')
        }
    }
}
</script>

<style lang="scss" scoped>
.Container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: fixed;
    overflow: hidden;

    &::before {
        content: "";
        background-image: var(--cover);
        background-size: cover;
        background-position: center;
        opacity: 0.15;
        filter: blur(2px);
        transition: all 1200ms ease-out;
        transition-delay: 200ms;
        transform: scale(1);
        @include absolute-fill(120);
    }

    &.is-loading {

        &::before {
            filter: blur(5px);
            transform: scale(0.98);
            opacity: 0;
        }

        .Invite {
            transform: translateY(5px);
            opacity: 0;
        }
    }
}

.Invite {
    position: relative;
    transition: all 150ms ease-out;
    transition-delay: 200ms;
    transform: translateY(0);
    opacity: 1;
    max-width: 400px;
}
</style>