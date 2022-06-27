<template>
    <div class="UserSelect">
        <div class="UserSelect_area d-flex">
            <button-base
                v-for="u in value"
                :image="$getUser(u).profileSmall"
                :modifiers="['s', 'light']"
                :ellipsis="20"
                :text="$getUser(u).name"
                v-bind="$getUser(u)"
                icon-after="times"
                class="m-3"
                @click="$emit('input', value.filter(v => v != u))"
                :key="u"
            />
            
            <input type="text" class="Area_input" :placeholder="placeholder" v-model="search" @focus="isFocused = true" @blur="onBlur" />
        </div>

        <div class="UserSelect_popin" :class="{ 'is-active': isFocused && displayedUsers.length > 0 }">
            <div class="UserSelect_user" v-for="user in displayedUsers" :key="user._id" @click="() => { $emit('input', [ ...value, user._id ]); search = '' }">
                <user-icon v-bind="user" :modifiers="['m']" :no-link="true" :display-name="true">
                    <div class="ft-s color-ft-weak ellipsis-1 ellipsis-break">
                        @{{ user.id }}
                    </div>
                </user-icon>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InputUser',
    async fetch () {
        if (!this.items) await this.$store.dispatch('user/fetch')
    },
    props: {
        placeholder: { type: String, default: '' },
        items: { type: [Array, Boolean], default: false },
        exclude: { type: Array, default: () => [] },
        value: { type: Array, default: () => [] }
    },
    data: () => ({
        localValue: [],
        isFocused: false,
        search: ''
    }),
    computed: {
        selectedUsers () {
            return this.$store.getters['user/find']({
                _id: { $in: this.value }
            })
        },
        users () {
            return this.items ? this.items : this.$store.getters['user/find']({
            })
        },
        changesMade () {
            return JSON.stringify(this.value) != JSON.stringify(this.localValue)
        },
        displayedUsers () {
            return this.users.filter(u => {
                if (!u) return false
                
                let include = true

                if (this.search) {
                    include = false

                    if (u.name && u.name.toLowerCase().includes(this.search.toLowerCase())) include = true

                    if (u.id && u.id.toLowerCase().includes(this.search.toLowerCase())) include = true
                }

                if (this.value.includes(u._id)) include = false
                if (this.exclude.includes(u._id)) include = false

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
        onBlur () {
            setTimeout(() => this.isFocused = false, 100)
        }
    }
}
</script>

<style lang="scss" scoped>

.UserSelect {
    position: relative;    
}

.UserSelect_area {
    align-items: center;
    flex-wrap: wrap;
}

.Area_input {
    font: var(--ft-m);
    height: 100%;
    flex-grow: 1;
    padding: 10px;
    min-width: 200px;
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

.UserSelect_popin {
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

.UserSelect_user {
    padding: 5px;
    cursor: pointer;
    transition: all 100ms ease;
    border-radius: 4px;
    
    &:hover {
        background-color: var(--color-cosmoz);
    }
}

@include breakpoint-s {

    .UserSelect_popin {
        max-height: 50vh;
    }
}
</style>