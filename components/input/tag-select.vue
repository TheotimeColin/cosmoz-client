<template>
    <form @submit.prevent="onSubmit" class="TagSelect">
        <div class="TagSelect_area d-flex">
            <button-base
                v-for="tag in [ ...dyn, ...value ]"
                :modifiers="['s', 'light']"
                icon-before="hashtag"
                :ellipsis="20"
                :text="tag"
                icon-after="times"
                type="button"
                class="m-3"
                @click="() => {
                    dyn.includes(tag) ? $emit('exclude', tag) : $emit('input', value.filter(v => v != tag))
                }"
                :key="tag + Math.random()"
            />
            
            <input type="text" class="Area_input" :placeholder="placeholder" v-model="search" @focus="isFocused = true" @blur="onBlur" />
        </div>

        <!-- <div class="TagSelect_popin" :class="{ 'is-active': isFocused && displayedUsers.length > 0 }">
            <div class="TagSelect_user" v-for="user in displayedUsers" :key="user._id" @click="() => { $emit('input', [ ...value, user._id ]); search = '' }">
                <user-icon v-bind="user" :modifiers="['m']" :no-link="true" :display-name="true">
                    <div class="ft-s color-ft-weak ellipsis-1 ellipsis-break">
                        @{{ user.id }}
                    </div>
                </user-icon>
            </div>
        </div> -->
    </form>
</template>

<script>
export default {
    name: 'InputTag',
    props: {
        placeholder: { type: String, default: '' },
        min: { type: [Number, Boolean], default: false },
        dyn: { type: Array, default: () => [] },
        value: { type: Array, default: () => [] }
    },
    data: () => ({
        localValue: [],
        isFocused: false,
        search: ''
    }),
    computed: {
        changesMade () {
            return JSON.stringify(this.value) != JSON.stringify(this.localValue)
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
            if (this.search !== '') this.onSubmit()
            setTimeout(() => this.isFocused = false, 100)
        },
        onSubmit (e) {
            // || e.key == " " || e.code == "Space" || e.keyCode == 32

            // if (e.type == 'submit') {
                let hashtag = this.search.replace(/[`~@#$^*()_|".?<>\{\}\[\]\\\/]/gi, '')

                if (hashtag.length > 0 && ![ ...this.dyn, ...this.value].includes(hashtag) ) {
                    this.$emit('input', [ ...this.value, hashtag ])
                    this.search = ''
                }
            // }
        }
    }
}
</script>

<style lang="scss" scoped>
.TagSelect {
    position: relative;    
}

.TagSelect_area {
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

.TagSelect_popin {
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

.TagSelect_user {
    padding: 5px;
    cursor: pointer;
    transition: all 100ms ease;
    border-radius: 4px;
    
    &:hover {
        background-color: var(--color-cosmoz);
    }
}

@include breakpoint-s {

    .TagSelect_popin {
        max-height: 50vh;
    }
}
</style>