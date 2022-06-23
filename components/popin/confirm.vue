<template>
    <popin
        :modifiers="['xs']"
        :is-active="open"
        @close="onClose"
    > 
        <template slot="content">
            <div class="ph-30 pv-40 ft-title-xs text-center" v-if="popin">
                {{ popin.text ? popin.text : `Veux-tu vraiment effectuer cette action ?` }}

                <p class="ft-s-medium mt-10" v-if="popin.subtitle">{{ popin.subtitle }}</p>
            </div>
        </template>

        <template slot="footer">
            <div class="p-10 d-flex fxa-center fxj-center fx-grow">
                <link-base v-bind="cancel" @click="cancel.action" v-if="popin" />
                <button-base v-bind="confirm" class="ml-15" @click="confirm.action" v-if="popin" />
            </div>
        </template>
    </popin>
</template>

<script>
export default {
    name: 'PopinConfirm',
    data: () => ({
        open: false
    }),
    computed: {
        popin () {
            return this.$store.state.page.popins.confirm
        },
        confirm () {
            return {
                text: 'Confirmer',
                ...(this.popin.confirm ? this.popin.confirm : {}),
                action: () => {
                   if (this.popin.confirm && this.popin.confirm.action) this.popin.confirm.action()

                   this.onClose()
                }
            }
        },
        cancel () {
            return {
                text: 'Annuler',
                ...(this.popin.cancel ? this.popin.cancel : {}),
                action: () => {
                   if (this.popin.cancel && this.popin.cancel.action) this.popin.cancel.action()

                   this.onClose()
                }
            }
        }
    },
    watch: {
        popin (v) {
            this.open = v ? true : false
        }
    },
    methods: {
        onClose () {
            this.open = false

            setTimeout(() => this.$store.commit('page/popin', { confirm: null }), 300)
        }
    }
}
</script>
