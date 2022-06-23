<template>
    <div class="InputBase" :class="[ $modifiers, ...classes, { 'is-prefix': prefix, 'is-invalid': errors.length > 0 } ]">
        <div class="InputBase_prefix" v-if="prefix">
            {{ prefix }} 
        </div>

        <label class="InputBase_label" v-if="label">
            {{ label }}
        </label>

        <template v-if="type == 'file'">
            <button-base class="InputBase_fileSelect">
                {{ label ||  "Choisir un fichier" }}
            </button-base>

            <label class="InputBase_fileLabel">
                {{ value.length > 0 ? (value.length == 1 ? value[0].name : value.length + ' fichiers sélectionnés') : 'Aucun fichier sélectionné' }}
            </label>

            <input
                class="InputBase_element"
                :type="type"
                v-bind="attrs"
                @input="(e) => onInput(Object.keys(e.target.files).map(key => e.target.files[key]))"
            >
        </template>

        <template v-else>
            <input
                class="InputBase_element"
                :value="value"
                :type="computedType"
                :placeholder="placeholder"
                :required="required"
                v-bind="attrs"
                @focus="state.isFocused = true"
                @blur="state.isFocused = false"
                @input="(e) => onInput(e.target.value)"
                @paste="(e) => onInput(e.target.value)"
            >
        </template>

        <div class="Inputbase_helpers" v-if="helpers.length > 0 || suffix || $slots.default || isLoading || isValidationLoading || errors.length > 0">
            <slot></slot>

            <div class="Inputbase_helper" v-if="isLoading || isValidationLoading">
                <fa icon="far fa-spinner-third" class="spin" />
            </div>

            <input-helper-number
                class="Inputbase_helper"
                @increment="increment(1)"
                @decrement="increment(-1)"
                v-if="helpers.includes('number')"
            />

            <input-helper-reset
                class="Inputbase_helper"
                :is-active="state.isValue"
                @click="reset"
                v-if="helpers.includes('reset')"
            />

            <input-helper-reveal
                class="Inputbase_helper"
                @click.native="reveal = !reveal"
                :is-revealed="reveal"
                v-if="helpers.includes('reveal')"
            />

            <div class="Inputbase_helper" v-if="suffix">
                {{ suffix }}
            </div>

            <input-helper-errors
                class="Inputbase_helper"
                :errors="errors"
                :is-valid="state.isValid"
                :is-active="errors.length > 0 && state.isFocused"
                v-show="state.isValue && errors.length > 0"
            />
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'
import Validators from '@/utils/validators'
import debounce from 'lodash.debounce'

export default {
    name: 'InputBase',
    mixins: [ ModifiersMixin ],
    props: {
        label: { type: String, default: '' },
        type: { type: String, default: 'text' },
        prefix: { type: String, default: '' },
        suffix: { type: String, default: '' },
        required: { type: Boolean, default: false },
        isLoading: { type: Boolean, default: false },
        placeholder: { type: String, default: '' },
        value: { type: [String, Number, Boolean, Object, Array] },
        helpers: { type: Array, default: () => [] },
        validator: { type: String, default: '' },
        default: { type: [String, Number] },
        attrs: { type: Object, default: () => ({}) },
    },
    data: () => ({
        isValidationLoading: false,
        state: {
            isFocused: false,
            isValue: false,
            isValid: false
        },
        reveal: false,
        errors: []
    }),
    computed: {
        classes () {
            let classes = {}
            if (this.$props.type == 'file') classes['InputBase--file'] = true
            if (this.state.isValue) classes['is-value'] = true
            if (this.state.isFocused) classes['is-focused'] = true
            
            return classes
        },
        computedType () {
            return this.reveal ? 'text' : this.type
        }
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler (v) {
                this.state.isValue = typeof v !== 'undefined' && v !== ''
                this.validate(v)
            }
        }
    },
    methods: {
        onInput (v) {
            this.validate(v)
            this.$emit('input', v)
        },
        increment (v) {
            let value = parseInt(this.$props.value)
            if (Number.isNaN(value)) value = this.$props.default ? this.$props.default : 0
            this.onInput(value + v)
        },
        validate: debounce(async function (v) {
            this.isValidationLoading = true

            const result = this.validator ? await Validators[this.validator](v, this.$store) : { valid: true }

            this.isValidationLoading = false
            
            this.state.isValid = result.valid
            this.errors = result.valid ? [] : result.errors
        }, 600),
        reset () {
            this.onInput(this.$props.default)
        }
    }
}
</script>

<style lang="scss">

.InputBase {
    color: var(--color-ft-light);
    border-radius: 4px;
    
    &.is-focused {
        border-color: var(--color-bg-light);

        .InputBase_label {
            color: var(--color-ft-light);
        }

        .InputBase_element {

            &::placeholder {
                opacity: 1;
            }
        }
    }

    &.is-invalid:not(.is-focused) {
        border-color: var(--color-error-strong);

        .InputBase_label {
            color: var(--color-error);
        }
    }

    &.is-prefix {
        
        .InputBase_element {
            padding-left: 0;
        }
    }
}

.InputBase_element {
    outline: none;

    &::placeholder {
        color: var(--color-ft-xweak);
        opacity: 0;
    }
}

.InputBase_prefix {
    padding-left: 10px;
}

.InputBase_label,
.SelectBase_label {
    color: var(--color-ft-weak);
    background-color: var(--color-bg-weak);
}

.Inputbase_helpers {
    background-color: transparent !important;
}

.InputBase_errorPopin {
    border: none;
    border-radius: 5px;
    background-color: var(--color-bg-xstrong);
}

.strong {

    .InputBase_label,
    .SelectBase_label {
        background-color: var(--color-bg) !important;
    }
}

.weak {

    .InputBase_label,
    .SelectBase_label {
        background-color: var(--color-bg-weak) !important;
    }
}


.InputBase--light {
    border-color: var(--color-border);

    .InputBase_element {
    
        &::placeholder {
            color: var(--color-ft-xweak);
            opacity: 1;
        }
    }
}
</style>