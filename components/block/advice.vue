<template>
    <div class="Advice bg-cover-25 bg-night">
        <div class="G_cosmoz"></div>
        
        <div class="Advice_content">
            <div class="ph-20 pv-20">
                <p class="ft-title-xs">Bienvenue sur Cosmoz !</p>

                <chart-line class="mt-15" :current="(completed / total) * 100" />
            </div>

            <slider-block :slots="steps.filter(s => !s.hidden).map(s => s.id)" :auto-height="true" :offset="20" :offset-v="20" v-if="completed < total">
                <div v-for="step in steps" class="p-15 bg-bg-weak-t br-xs shadow width-xs d-flex fx-dir-column height-100 fxj-around text-center" :slot="step.id" :key="step.id">
                    <p class="ft-title-2xs">{{ step.title }}</p>
                    <div class="ft-s-medium mt-10" v-html="step.text"></div>

                    <div class="text-center mt-20">
                        <p class="color-ft-weak ft-xs mb-5" v-if="step.completed">Terminé !</p>

                        <button-base :modifiers="['s', 'cosmoz']" icon-before="check" @click="hide(step.id)" v-if="step.completed">{{ step.amount}} points</button-base>
                        <button-base :modifiers="['s', 'light']" :to="localePath(step.to)" v-bind="step.cta" v-else />
                    </div>
                </div>
            </slider-block>
            <div class="p-20 text-center bg-bg-weak-t br-xs mh-15 mb-15 " v-else>
                <p class="ft-title-s">Bien joué, {{ user.name }}.</p>
                <div class="ft-s-medium mt-10 mb-20">
                    L'équipe Cosmoz espère que tu trouveras les communautés qui te feront vibrer.

                    On te laisse profiter de la plateforme ! 
                </div>

                <button-base :modifiers="['light']" @click="onConclude" icon-before="party-horn">
                    C'est parti !
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BlockAdvice',
    data: () => ({
        steps: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        completed () {
            return this.steps.filter(s => s.hidden).reduce((t, c) => t + c.amount, 0) + 10
        },
        total () {
            return this.steps.reduce((t, c) => t + c.amount, 0) - 10
        }
    },
    mounted () {
        this.steps = [
            {
                id: 'register',
                title: `Inscrit(e) sur Cosmoz`,
                text: `Bienvenue parmi nous !`,
                amount: 20,
                completed: true
            }, {
                id: 'profile',
                title: `Complète ton profil`,
                text: `C'est super important pour que tes amis puissent te reconnaître !`,
                completed: this.user.profileSmall && this.user.alias && this.user.birthdate,
                amount: 60,
                cta: { text: 'Compléter', iconBefore: 'pen' },
                to: { name: 'p-userId', params: { userId: this.user.id } }
            }, {
                id: 'group',
                title: `Rejoins un groupe`,
                text: `Cosmoz, c'est une histoire de communautés. Il est temps d'en rejoindre une.`,
                amount: 80,
                cta: { text: 'Explorer', iconBefore: 'compass' },
                completed: this.user.constellations.length > 0,
                to: { name: 'explore' }
            }, {
                id: 'friends',
                title: `Invite tes amis`,
                text: `Plus on est de fous, plus on rit ! Invite tes amis à rejoindre la plateforme.`,
                amount: 30,
                cta: { text: 'Inviter', iconBefore: 'paper-plane' },
                to: { name: 'constellation' }
            }
        ]
    },
    methods: {
        onConclude () {
            this.$store.dispatch('user/updateNotification', {
                id: 'welcomed', type: 'onboarding'
            })
        },
        hide (id) {
            this.steps = this.steps.map(s => s.id == id ? { ...s, hidden: true }: s)
        }
    }
}
</script>

<style lang="scss" scoped>
.Advice {
    border-radius: 8px;
    // background: linear-gradient(45deg, var(--color-bg-xstrong), var(--color-bg-strong));
    background-color: var(--color-bg-xstrong);
    position: relative;
    overflow: hidden;
}

.Advice_content {
    position: relative;
}
</style>