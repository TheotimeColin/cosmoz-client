<template>
    <div>
        <transition v-for="item in choices" name="fade" :key="item.content">
            <div class="Conversation_step" :class="{ 'is-past': item.step < step }" v-show="step >= item.step">
                <div class="Conversation_content mr-40" v-html="item.content"></div>
                <div class="mt-20 text-right">
                    <button-base
                        class="Conversation_choice ml-5"
                        :modifiers="item.choice == action.id ? ['light'] : []"
                        :class="{ 'is-past': item.step < step, 'is-chosen': item.choice == action.id }"
                        v-for="action in item.actions"
                        @click="onAction(item, action)"
                        :key="action.id"
                    >
                        {{ action.label }}
                    </button-base>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Conversation',
    props: {
        items: { type: Array, default: () => [] }
    },
    data: () => ({
        step: 0,
        choices: []
    }),
    watch: {
        items: {
            immediate: true,
            handler (v) { this.choices = v }
        }
    },
    methods: {
        onAction (current, choice) {
            this.$emit('action', choice.value ? choice.value : null)

            if (choice.action) {
                choice.action()
            } else {
                if (current.step < this.step) {
                    this.step = current.step
                }

                this.choices = this.items.map(item => ({
                    ...item,
                    choice: item.id == current.id ? choice.id : (item.step > this.step ? null : item.choice)
                }))


                if (choice.value == null) this.step++
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.Conversation_step {

    // &.is-past {
    //     opacity: 0.5;

    //     &:hover {
    //         opacity: 1;
    //     }
    // }
    
    & + & {
        margin-top: 30px;
        padding-top: 30px;
        border-top: 1px solid var(--color-border);
    }
}

.Conversation_content {
    max-width: 75%;
    padding: 20px;
    background: var(--color-bg-2xstrong);
    border-radius: 4px;
}

.Conversation_choice {

    &.is-past {
        opacity: 0.5;
    
        &.is-chosen {
            opacity: 1;
            pointer-events: none;
        }
    }
}
</style>