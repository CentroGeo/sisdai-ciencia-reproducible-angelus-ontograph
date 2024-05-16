<template>
    <text :style="'font-size: ' + fontSize + '; font-family: monospace; fill: #000C'" :font-size="fontSize">  
        <tspan v-for="(line, index) of label_lines" :key="'wrap_'+index" :x="offsetX" :y="index * (fontSize + 2) + offsetY">{{line}}</tspan>
    </text>  
</template>

<script>

export default {
    props: {
        text: {
            type: String,
            default: null
        },
        lines:{
            type: Number,
            default: 1
        },
        width: {
            type: Number,
            default: 40
        },
        fontSize:{
            type: Number,
            default: 14
        },
        offsetX:{
            type: Number,
            default: 14
        },
        offsetY:{
            type: Number,
            default: 14
        }
    },

    data: () => ({
        label_lines: null,
    }),

    mounted () {
        this.setLabels()
    },

    watch: {
        text (text) {
            this.setLabels()
        },
    },
    methods: {
        setLabels(){
            this.label_lines = []

            let line_buffer = JSON.parse(JSON.stringify(this.text))
            let line_jump = null

            while(this.label_lines.length < this.lines-1 && line_buffer.length > this.width){
                line_jump = line_buffer.substring(0, this.width).lastIndexOf(' ')
                this.label_lines.push(line_buffer.substring(0, line_jump))
                line_buffer = line_buffer.substring(line_jump + 1, line_buffer.length)
            }

            if(line_buffer.length > this.width)
                line_buffer = line_buffer.substring(0, this.width-3) + '...'
                    
            this.label_lines.push(line_buffer)
        }
    }
};

</script>