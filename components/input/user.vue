<template>
    <div class="">

        <div class="row-2xs mb-15" v-if="value && value.length > 0">
            <div class="col-6 col-12@xs mt-5" v-for="user in selectedUsers" :key="user._id">
                <div class="fx-center p-10 bg-bg br-xs bg-bg-weak@xs">
                    <user-icon v-bind="user" :modifiers="['m']" :no-link="true" :display-name="true" />

                    <quick-menu
                        :items="[
                            { label: 'Retirer', fa: 'times', action: () => $emit('input', value.filter(v => v != user._id)) }
                        ]"
                    />
                </div>
            </div>
        </div>

        <div class="fx-center p-15 bg-bg strong">
            <input-base class="mr-15" v-model="search" label="Rechercher un membre" placeholder="Nom ou ID" />

            <button-base type="button" :modifiers="['s', 'light']">
                Rechercher
            </button-base>
        </div>
        
        <div class="Area">
            <div class="Area_user" v-for="user in displayedUsers.filter(u => !value.includes(u._id))" :key="user._id" @click="$emit('input', [ ...value, user._id ])">
                <user-icon v-bind="user" :modifiers="['s']" :no-link="true" :display-name="true">
                    <div class="ft-s color-ft-weak ml-5" slot="name">
                        {{ user.id }}
                    </div>
                </user-icon>

                <button-base type="button" :modifiers="['light', 'round', '2xs']" icon-before="check" />
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
        auto: { type: Boolean, default: true },
        label: { type: String, default: '' },
        items: { type: [Array, Boolean], default: false },
        exclude: { type: Array, default: () => [] },
        value: { type: Array, default: () => [] }
    },
    data: () => ({
        localValue: [],
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
    max-height: 250px;
    padding: 10px;
    overflow: auto;
    background-color: var(--color-bg);
}

.Area_user {
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 200ms ease;

    &:hover {
        transform: translateY(-1px);
        background-color: var(--color-cosmoz);
    }
}
</style>