<template>
    <div class="Wrapper--s pv-100">
        <ul ref="messages" class="messages">
            <li v-for="(msg, index) in messages" :key="index" class="message">
                <i :title="msg.date">
                {{ msg.date.split('T')[1].slice(0, -2) }}
                </i>: {{ msg.text }}
            </li>
        </ul>

        <!-- <div v-for="emoji in emojis.filter(e => e)"  :key="emoji">
            { aliases: [], value: '{{ emoji }}', cat: 'people' }, 
        </div> -->
    </div>
</template>

<script>

export default {
    data: () => ({
        messages: [],
        message: ''
    }),
    beforeMount () {
    },
    computed: {
        emojis () {
            return ['🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️']
        }
    }
}
</script>

<style>

</style>