<template>
    <div class="ConsteSelect">
        <div class="ConsteSelect_area d-flex">
            <button-base
                v-for="u in selectedItems"
                :image="u.logoSmall"
                :modifiers="['s', 'light']"
                :ellipsis="20"
                :text="u.name"
                :icon-after="!min || value.length > min ? 'times' : ''"
                type="button"
                class="m-3"
                @click="() => { min && value.length <= min ? {} : $emit('input', max == 0 ? value.filter(v => v != u) : '') }"
                :key="u"
            />
            
            <input type="text" class="Area_input" :placeholder="placeholder" v-model="search" @focus="isFocused = true" @blur="onBlur" v-if="!max || selectedItems.length < max" ref="input" />
        </div>

        <div class="ConsteSelect_popin" :class="{ 'is-active': isFocused && displayedConste.length > 0 }">
            <div class="ConsteSelect_user" v-for="conste in displayedConste" :key="conste._id" @click="() => { $emit('input', max == 0 ? [ ...value, conste._id ] : conste._id); search = '' }">
                <const-icon v-bind="conste" :modifiers="['']" :no-link="true" :display-name="true" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InputUser',
    props: {
        placeholder: { type: String, default: '' },
        min: { type: [Number, Boolean], default: false },
        max: { type: Number, default: 0 },
        exclude: { type: Array, default: () => [] },
        value: { type: [Array, String], default: () => [] },
        query: { type: Object, default: () => ({}) }
    },
    data: () => ({
        localValue: [],
        isFocused: false,
        search: ''
    }),
    computed: {
        items () {
            return this.$store.getters['constellation/find']({
                isMember: true
            })
        },
        selectedItems () {
            return this.items.filter(u => this.max == 0 ? this.value.includes(u._id) : this.value == u._id)
        },
        changesMade () {
            return JSON.stringify(this.value) != JSON.stringify(this.localValue)
        },
        displayedConste () {
            return this.items.filter(u => {
                let include = true

                if (this.search) {
                    include = false

                    if (u.name && u.name.toLowerCase().includes(this.search.toLowerCase())) include = true

                    if (u.id && u.id.toLowerCase().includes(this.search.toLowerCase())) include = true
                }

                if (this.max == 0 ? this.value.includes(u._id) : this.value == u._id) include = false
                if (this.max == 0 ? this.exclude.includes(u._id) : this.value == u._id) include = false

                return include
            })
        }
    },
    watch: {
        value: {
            immediate: true,
            handler (v) {
                this.localValue = v
            }
        },
        localValue: {
            deep: true,
            handler (v) {
                if (this.changesMade) this.$emit('input', v)
            }
        }
    },
    methods: {
        focus () {
            if (this.$refs.input) this.$refs.input.focus()
        },
        onBlur () {
            setTimeout(() => this.isFocused = false, 100)
        }
    }
}
</script>

<style lang="scss" scoped>

.ConsteSelect {
    position: relative;    
}

.ConsteSelect_area {
    align-items: center;
    flex-wrap: wrap;
}

.Area_input {
    font: var(--ft-m);
    height: 100%;
    flex-grow: 1;
    padding: 10px;
    min-width: 250px;
    width: auto;

    &::placeholder {
        font: var(--ft-m);
        color: var(--color-ft-weak);
        opacity: 0.35;
    }

    &:focus {
        outline: none;
    }
}

.ConsteSelect_popin {
    position: absolute;
    z-index: 5;
    bottom: -10px;
    left: 0;
    width: 100%;
    max-height: 200px;
    background-color: var(--color-bg-weak);
    padding: 5px;
    border-radius: 8px;
    overflow: auto;
    @include shadow;
    transition: all 250ms ease;
    opacity: 0;
    pointer-events: none;

    transform:translateY(calc(100% + 10px));

    &.is-active {
        transform: translateY(100%);
        opacity: 1;
        pointer-events: all;
    }
}

.ConsteSelect_user {
    padding: 5px;
    cursor: pointer;
    transition: all 100ms ease;
    border-radius: 4px;
    
    &:hover {
        background-color: var(--color-cosmoz);
    }
}

@include breakpoint-s {

    .ConsteSelect_popin {
        max-height: 50vh;
    }
}
</style>