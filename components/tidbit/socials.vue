<template>
    <div class="TidbitType" :class="{ 'is-edit': isEdit }">
        <div v-if="(!value.items || Object.values(value.items).length <= 0) && !isEdit">
            <p class="color-ft-xweak ft-italic">{{ isRedacted ? $t(`permissions.${read}.error`) : 'Aucun contenu.' }}</p>
        </div>
        <div v-else>
            <div class="row-xs">
                <div class="col-12 mb-10" v-for="v in items" :key="v.type">
                    <div class="Tidbit_social">
                        <div class="Tidbit_socialHead">
                            <fa class="mr-5" :icon="`fa-brands fa-${v.type}`" />
                            <span>{{ SOCIALS[v.type].name }}</span>
                        </div>

                        <div class="d-flex fxa-center" v-if="isEdit">
                            <div class="ft-title-2xs mr-10" v-if="SOCIALS[v.type].prefix">
                                {{ SOCIALS[v.type].prefix }}
                            </div>

                            <input-base v-model="localValue.items[v.type]" :attrs="{ placeholder: SOCIALS[v.type].placeholder ? SOCIALS[v.type].placeholder : '' }" />
                        </div>
                        <div class="ft-title-2xs" v-else>
                            {{ SOCIALS[v.type].prefix ? SOCIALS[v.type].prefix : '' }}{{ v.value }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const SOCIALS = {
    discord: { name: `Discord`, placeholder: `Username#0101` },
    instagram: { name: `Instagram`, prefix: '@' },
    twitter: { name: `Twitter`, prefix: '@' },
    whatsapp: { name: `Whatsapp`, placeholder: `+33 6 01 02 03 04` }
}

import { InputBase } from 'instant-coffee-core'

export default {
    name: 'TidbitSocials',
    components: { InputBase },
    props: {
        value: { type: Object, default: () => {} },
        read: { type: String },
        isEdit: { type: Boolean, default: false },
        isRedacted: { type: Boolean, default: false }
    },
    data: () => ({
        SOCIALS,
        localValue: {
            items: {
                instagram: '',
                twitter: '',
                whatsapp: '',
                discord: '',
            }
        }
    }),
    computed: {
        items () {
            if (!this.localValue.items) return []

            return Object.entries(this.localValue.items).map(v => ({ type: v[0], value: v[1] })).filter(v => this.isEdit ? true : v.value)
        }
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler (v) {
                if (JSON.stringify(v) == JSON.stringify(this.localValue)) return

                this.localValue = {
                    ...this.localValue,
                    ...JSON.parse(JSON.stringify(v)),
                    items: {
                        ...this.localValue.items,
                        ...v.items
                    }
                }
            }
        },
        localValue: {
            deep: true,
            handler (v) {
                this.$emit('input', v)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.TidbitType {
    padding: 10px 20px 15px 20px;

    &.is-edit {

        .Tidbit_social {
            display: block;
        }

        .Tidbit_socialHead {
            margin-bottom: 10px;
            margin-right: 0px;

            span {
                display: inline;
            }
        }
    }
}

.Tidbit_socialHead {
    margin-right: 5px;

    span {
        display: none;
    }
}

.Tidbit_social {
    display: flex;
    align-items: center;
    min-height: 50px;
    padding: 15px;
    border-radius: 5px;
    background-color: var(--color-bg-strong);
}
</style>