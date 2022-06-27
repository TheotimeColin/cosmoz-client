<template>
    <div class="Wrapper--s pv-100">
        <ul ref="messages" class="messages">
            <li v-for="(msg, index) in messages" :key="index" class="message">
                <i :title="msg.date">
                {{ msg.date.split('T')[1].slice(0, -2) }}
                </i>: {{ msg.text }}
            </li>
        </ul>

        <input v-model="message" class="inputMessage" type="text" placeholder="Type here..." @keyup.enter="sendMessage" />

        <!-- <div v-for="emoji in emojis.filter(e => e)"  :key="emoji">
            { aliases: [], value: '{{ emoji }}', cat: 'people' }, 
        </div> -->
    </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io(process.env.NUXT_ENV_API_URL)

export default {
    asyncData () {
        return new Promise(resolve =>
            socket.emit('last-messages', messages => resolve({ messages }))
        )
    },
    data: () => ({
        messages: [],
        message: ''
    }),
    beforeMount () {
        socket.on('new-message', (message) => {
            this.messages.push(message)
        })
    },
    methods: {
        sendMessage () {
            if (!this.message.trim()) { return }

            const message = {
                date: new Date().toJSON(),
                text: this.message.trim()
            }

            this.messages.push(message)
            this.message = ''

            socket.emit('send-message', message)
        }
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