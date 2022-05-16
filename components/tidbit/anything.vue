<template>
    <div class="TidbitType">
        <div class="" v-if="isEdit && !isRedacted">
            <input-area
                class="bg-bg-strong p-5 br-s"
                placeholder="Écris ce que tu veux ici !"
                v-model="localValue.content"
            />

            <p class="text-right ft-xs mt-5">
                <span :class="{ 'color-error': localValue.content.length > 300 }">{{ localValue.content.length }}</span> / 300
            </p>
        </div>
        <template v-else-if="isRedacted">
            <p class="color-ft-xweak ft-italic">
                {{ $t(`permissions.${read}.error`) }}
            </p>
        </template>
        <template v-else>
            <p v-html="$options.filters.striptags(value.content).slice(0, 300)" v-if="value.content"></p>
            <p class="color-ft-xweak ft-italic" v-else>Aucun contenu.</p>
        </template>
    </div>
</template>

<script>
export default {
    name: 'TidbitAnything',
    props: {
        value: { type: Object, default: () => {} },
        read: { type: String },
        isEdit: { type: Boolean, default: false },
        isRedacted: { type: Boolean, default: false }
    },
    data: () => ({
        localValue: {
            content: ''
        }
    }),
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler (v) {
                if (JSON.stringify(v) == JSON.stringify(this.localValue)) return

                this.localValue = {
                    ...this.localValue,
                    ...JSON.parse(JSON.stringify(v))
                }
            }
        },
        localValue: {
            deep: true,
            handler (v) {
                this.$emit('input', v)
                this.$emit(v.content.length <= 300 ? 'unlock' : 'lock')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.TidbitType {
    padding: 10px 20px 20px 20px;
}
</style>