<template>
    <div class="InputBase" :class="{ 'is-active': state.isActive }" @click="state.isActive = true">
        <label class="InputBase_label" v-if="label">
            {{ label }}
        </label>

        <input
            type="text"
            class="InputBase_value"
            :placeholder="placeholder"
            @focus="onFocus(true)"
            @blur="onFocus(false)"
            @input="(e) => search = e.target.value"
            :disabled="!enableSearch"
            ref="search"
        />

        <div class="Inputbase_helpers">
            <div class="Inputbase_helper">
                <fa icon="far fa-angle-down" />
            </div>
        </div>

        <div class="InputBase_options">
            <div
                v-for="option in displayOptions"
                class="InputBase_option"
                :class="{ 'is-selected': selectedOptions.includes(option) }"
                @click.stop="onSelect(option.value, selectedOptions.includes(option))"
                :key="option.value"
            >
                {{ option.label }}

                <i class="InputBase_optionCheck fal fa-check" v-if="enableMultiple"></i>
                <i class="InputBase_optionRemove fal fa-times" v-if="enableMultiple"></i>
            </div>

            <div
                class="InputBase_option InputBase_option--add"
                @click="$emit('add', search)"
                v-if="enableAdd && search && !searchExists"
            >
                <span>
                    <i class="fal fa-plus mr-10"></i> {{ $t('component.selectBase.add', { value: search }) }}
                </span>
            </div>

            <div class="InputBase_option InputBase_option--no-results" v-if="displayOptions.length <= 0 && !enableAdd && enableSearch">
                <span>
                    <i class="fal fa-times mr-10"></i> {{ $t('component.selectBase.noResults') }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InputBase',
    props: {
        label: { type: String, default: '' },
        options: { type: Array, default: () => [] },
        value: { type: [Number, Array, Boolean, String] },
        constraints: { type: Array, default: () => [] },
        placeholder: { type: String, default: '' },
        enableMultiple: { type: Boolean, default: false },
        enableSearch: { type: Boolean, default: false },
        enableAdd: { type: Boolean, default: false }
    },
    data: () => ({
        search: '',
        state: {
            isFocused: false,
            isActive: false
        },
        listeners: {
            active: null
        }
    }),
    computed: {
        arrayValue () {
            return this.$props.value !== null ? (Array.isArray(this.$props.value) ? this.$props.value : [ this.$props.value ]) : []
        },
        searchExists () {
            return this.$props.options.find(o => o.label == this.$data.search) ? true : false
        },
        selectedOptions () {
            return this.$props.options.filter(o => this.arrayValue.includes(o.value))
        },
        displayValue () {
            return this.selectedOptions.length > 0 ? this.selectedOptions.map(o => o.label).join(', ') : ''
        },
        displayOptions () {
            let options = this.$props.options
            if (this.$data.search) {
                options = options.filter(o => {
                    return o.label.toLowerCase().includes(this.$data.search.toLowerCase())
                })
            }
            
            return options
        }
    },
    watch: {
        displayValue (v) {
            if (this.$refs.search) this.$refs.search.value = v
        },
        ['state.isActive'] (v) {
            if (v) {
                this.$listeners.active = (e) => {
                    if (!this.$el.contains(e.target)) this.$data.state.isActive = false
                }
                document.addEventListener('click', this.$listeners.active)
            } else {
                document.removeEventListener('click', this.$listeners.active)
                this.$listeners.active = null
            }
        }
    },
    mounted () {
        if (this.displayValue) this.$refs.search.value = this.displayValue
    },
    methods: {
        onSelect (value, deselect = false) {
            if (!this.$props.enableMultiple) this.$data.state.isActive = false
            let total = this.$props.enableMultiple ? this.selectedOptions.map(o => o.value) : []
            
            if (deselect && this.$props.enableMultiple) {
                total = total.filter(o => o != value)
            } else {
                total.push(this.$props.options.find(o => o.value == value).value)
            }
            
            this.$emit('input', total.length > 0 ? (this.$props.enableMultiple ? total : total[0]) : null)
        },
        onFocus (toggle) {
            this.$data.state.isFocused = toggle
            if (toggle) {
                this.$refs.search.value = ''
            } else {
                setTimeout(() => {
                    this.$data.search = ''
                    this.$refs.search.value = this.displayValue ? this.displayValue : ''
                }, 100)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.InputBase {
    position: relative;
    border-radius: 50px;
    min-height: 40px;
}

.InputBase_label {
    transform: translate3d(-6px, -100%, 0) scale(0.75);
    max-width: 9999px;
}

.InputBase_helpers {
    padding-right: 15px;
}

.InputBase_value {
    flex-grow: 1;
    padding: 10px 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.InputBase_options {
    position: absolute;
    bottom: -3px;
    left: 0;
    border-radius: 5px;
    z-index: 5;
    width: 100%;
    min-width: 300px;
    background-color: var(--color-bg-2xstrong);
    padding: 8px;
    opacity: 0;
    transform: translateY(calc(100% + 5px));
    pointer-events: none;
    transition: all 150ms ease;
}

.InputBase_option {
    font: var(--ft-m);
    line-height: 1.4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
    padding: 8px 10px;
    cursor: pointer;
    border-radius: 4px;
    margin-bottom: 2px;

    &.is-selected {
        color: var(--color-ft);
        background-color: var(--color-bg-light);

        .InputBase_optionCheck {
            opacity: 1;
        }
    }

    &:hover {
        background-color: var(--color-bg-strong);

        &.is-selected {
            background-color: var(--color-bg-light);
            
            .InputBase_optionCheck {
                display: none;
            }

            .InputBase_optionRemove {
                display: block;
            }
        }
    }

    &:last-child {
        margin-bottom: 0;
    }
}

.InputBase_optionCheck {
    opacity: 0;
    flex-shrink: 0;
}

.InputBase_optionRemove {
    color: var(--color-ft-weak);
    display: none;
}

.InputBase_option--no-results {
    pointer-events: none;
    color: var(--color-ft-weak);
}

/* STATES */

.InputBase.is-active {
    
    .InputBase_options {
        opacity: 1;
        transform: translateY(100%);
        pointer-events: all;
    }
}
</style>