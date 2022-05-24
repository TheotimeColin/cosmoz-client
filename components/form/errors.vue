<template>
    <transition tag="div" name="fade">
        <div class="Errors ft-s-medium bg-merlot-xstrong pv-5 ph-20" v-show="errors.length > 0">
            <div class="mv-10" v-for="(error, i) in errors" :key="i">
                <fa class="mr-5" icon="far fa-times" /> {{ error }}
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Errors',
    props: {
        items: { type: Array, default: () => [] },
        domain: { type: String, default: 'default' }
    },
    computed: {
        errors () {
            return this.items.map(item => {
                let errorText = this.$t(`errors.${this.domain}['${item.code ? item.code : item}']`)

                if (errorText == `errors.${this.domain}['${item.code ? item.code : item}']`) errorText = this.$t('errors.default.generic')

                return errorText
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.Errors {
    background-color: #441e2c;
    border-radius: 10px;
}
</style>