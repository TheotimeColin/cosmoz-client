<template>
    <div>
        <div class="QR" @click="zoom = true">
            <img :src="src" v-if="src">
            <canvas class="QR_canvas" ref="canvas" v-else></canvas>
        </div>

        <popin :is-active="zoom" :modifiers="['xs', 'fixed']" @close="zoom = false">
            <template slot="content">
                <div class="QR_container">
                    <div class="QR QR--popin p-relative">
                        <img :src="src" v-if="src">
                        <canvas class="QR_canvas" ref="zoomed" v-else></canvas>
                    </div>
                </div>
            </template>
        </popin>
    </div>
</template>

<script>

import QRCode from 'qrcode'

export default {
    name: 'QRCode',
    props: {
        src: { type: String },
        data: { type: String }
    },
    data: () => ({
        zoom: false
    }),
    mounted () {
        if (this.$refs.canvas) QRCode.toCanvas(this.$refs.canvas, this.data)

        if (this.$refs.zoomed) QRCode.toCanvas(this.$refs.zoomed, this.data, {
            scale: 50
        })
    }
}
</script>

<style lang="scss" scoped>
    .QR {
        position: relative;
        flex-grow: 1;

        &::before {
            content: "";
            display: block;
            @include ratio(100);
        }

        canvas,
        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
        }
    }
</style>