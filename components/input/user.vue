<template>
    <div class="">
        <div class="fx-center p-15 bg-bg-strong strong">
            <input-base class="mr-15" v-model="search" label="Rechercher un membre" placeholder="Nom ou ID" />

            <button-base type="button" :modifiers="['s', 'light']">
                Rechercher
            </button-base>
        </div>

        <div class="Area">
            <div class="Area_user" v-for="user in displayedUsers" :key="user._id" @click="$emit('input', user._id)">
                <user-icon v-bind="user" :no-link="true" :display-name="true">
                    <div class="ft-s color-ft-weak ml-5" slot="name">
                        {{ user.id }}
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
        await this.$store.dispatch('user/fetch')
    },
    props: {
        label: { type: String, default: '' },
        items: { type: Array, default: () => [] },
        exclude: { type: Array, default: () => [] },
        value: { type: Array, default: () => [] }
    },
    data: () => ({
        localValue: [],
        search: ''
    }),
    computed: {
        users () {
            return this.items ? this.items : this.$store.getters['user/find']({
            })
        },
        changesMade () {
            return JSON.stringify(this.value) != JSON.stringify(this.localValue)
        },
        displayedUsers () {
            return this.users.filter(u => {
                let include = true

                if (this.search) {
                    include = false

                    if (u.name && u.name.toLowerCase().includes(this.search.toLowerCase())) include = true

                    if (u.id && u.id.toLowerCase().includes(this.search.toLowerCase())) include = true
                }
                
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
    }
}
</script>

<style lang="scss" scoped>
.Area {
    max-height: 200px;
    padding: 10px;
    border: 1px solid var(--color-border);
    overflow: auto;
}

.Area_user {
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: var(--color-bg);
    }
}
</style>