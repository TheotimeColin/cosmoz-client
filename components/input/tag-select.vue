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

        <div class="TagSelect_popin" :class="{ 'is-active': isFocused }">
            <template v-if="search == '' && filterFeatured($const.hashtags).length > 0">
                <div class="TagSelect_tag" v-for="tag in filterFeatured($const.hashtags)" :key="tag._id" @click="() => { $emit('input', [ ...value, tag.id ]); search = '' }">
                <fa :icon="`far fa-${tag.icon}`" class="mr-10 fx-no-shrink" fixed-width></fa> 
                <div class="fx-grow">
                        <p class="ft-title-2xs">{{ tag.id }}</p>
                        <p class="ft-xs color-ft-weak">{{ tag.description }}</p>
                    </div>
                    <div class="ml-10 fx-no-shrink">
                        <fa icon="far fa-plus"></fa> 
                    </div>
                </div>
                
                <div class="fx-center p-5 mt-20">
                    <p class="fx-no-shrink ft-xs-medium color-ft-weak">Tendances</p>
                    <hr class="Separator fx-grow ml-10">
                </div>
            </template>


            <div class="TagSelect_tag" v-for="tag in displayedTags" :key="tag._id" @click="() => { $emit('input', [ ...value, tag.id ]); search = '' }">
               <fa :icon="`far fa-${tag.icon ? tag.icon : 'hashtag'}`" class="mr-10 fx-no-shrink" fixed-width></fa> 
               <div class="fx-grow">
                    <p class="ft-title-2xs">{{ tag.id }}</p>
                    <p class="ft-xs color-ft-weak">{{ tag.description ? tag.description : tag.count + ' publications' }}</p>
                </div>
                <div class="ml-10 fx-no-shrink">
                    <fa icon="far fa-plus"></fa> 
                </div>
            </div>
            <div class="TagSelect_tag" @click="() => { $emit('input', [ ...value, search ]); search = '' }" v-if="search.length > 0 && !displayedTags.find(t => t.id == search)">
               <fa icon="far fa-hashtag" class="mr-10 fx-no-shrink" fixed-width></fa> 
               <div class="fx-grow">
                    <p class="ft-title-2xs">{{ search }}</p>
                    <p class="ft-xs color-ft-weak">Nouveau hashtag</p>
                </div>
                <div class="ml-10 fx-no-shrink">
                    <fa icon="far fa-plus"></fa> 
                </div>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'InputTag',
    props: {
        placeholder: { type: String, default: '' },
        min: { type: [Number, Boolean], default: false },
        dyn: { type: Array, default: () => [] },
        value: { type: Array, default: () => [] },
        tags: { type: Array, default: () => [] }
    },
    data: () => ({
        localValue: [],
        isFocused: false,
        search: ''
    }),
    computed: {
        changesMade () {
            return JSON.stringify(this.value) != JSON.stringify(this.localValue)
        },
        displayedTags () {
            let baseTags = this.tags

            if (this.search != '') baseTags = [...this.$const.hashtags, ...this.tags.filter(t => !this.$const.hashtags.find(h => h.id.toLowerCase() == t.id.toLowerCase()))]

            return baseTags.filter(tag => {
                let include = true
                
                if (this.search && this.search.length > 2) {
                    include = false

                    if (tag.id.toLowerCase().includes(this.search.toLowerCase())) include = true
                }

                if (this.value.find(v => v.toLowerCase() == tag.id.toLowerCase())) include = false
                
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
        },
        isFocused (v) {
            this.$emit('focused', v)
        }
    },
    methods: {
        filterFeatured (tags) {
            return tags.filter(tag => {

                if (this.value.find(v => v.toLowerCase() == tag.id.toLowerCase())) return false

                if ((tag.disabled == '$introduced' || tag.id == 'présentations') && this.$isIntroduced) return false
                
                return true
            })
        },
        onBlur () {
            if (this.search !== '') this.onSubmit()
            setTimeout(() => this.isFocused = false, 200)
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

    @include mini-scrollbar;
    overflow-y: auto;

    &.is-active {
        transform: translateY(100%);
        opacity: 1;
        pointer-events: all;
    }
}

.TagSelect_tag {
    padding: 8px 8px;
    cursor: pointer;
    transition: all 100ms ease;
    border-radius: 4px;
    display: flex;
    align-items: center;
    
    &:hover {
        background-color: var(--color-cosmoz);
    }
}

@include breakpoint-s {

    .TagSelect_popin,
    .TagSelect_popin.is-active {
        display: none;
        position: relative;
        background-color: var(--color-bg-strong);
        width: auto;
        bottom: auto;
        transform: none;
        border-radius: 0;
        box-shadow: 0;
        min-height: 50vh;
    }

    .TagSelect_popin.is-active {
        display: block;
    }
}
</style>