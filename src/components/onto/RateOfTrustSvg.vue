<template>
    <svg viewBox="0 0 200 200" :width="size" :height="size">

        <circle cx="100" cy="100" r="80"  style="stroke: #A3A3A3; stroke-width: 24; fill: none;" />
        
        <circle v-if="verde.includes(confianzaString)" cx="100" cy="100" r="80"  stroke="green" />

        <path v-else-if="naranja.includes(confianzaString)" style="stroke: orange; stroke-width: 24; fill: none;" d="M 30.71 140 A 80 80 0 1 0 100 20" />

        <path v-else-if="roja.includes(confianzaString)" style="stroke: red; stroke-width: 24; fill: none;" d="M 169.28 140 A 80 80 0 0 0 100 20" />

        <path v-else style="stroke-width: 23; stroke: #777;" d="M 100,45 L 100,125 M 100,135 L 100,154"/>

    </svg>
    
</template>

<script>
export default {

    data: () => ({
        radius: 80,
        centerX: 100,
        centerY: 100,
        verde: ['positiva', 'alta'],
        naranja: ['neutra', 'media'],
        roja: ['baja', 'negativa']
    }),

    props: {
        confianza: {
            type: String,
            default: null
        },
        size: {
            type: Number,
            default: 30
        }
    },

    computed: {
        confianzaString: function(){
            return this.confianza.toLowerCase()
        },

    },  
    methods: {
        //Storing methods for future calculations of the semicircle
        // polarToCartesian(angleInDegrees) {
        // let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        // return {
        //     x: this.centerX + (this.radius * Math.cos(angleInRadians)),
        //     y: this.centerY + (this.radius * Math.sin(angleInRadians))
        // };
        // },
        
        // describeArc(startAngle, endAngle){

        //     let start = this.polarToCartesian(endAngle);
        //     let end = this.polarToCartesian(startAngle);

        //     let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        //     let d = [
        //         "M", start.x, start.y, 
        //         "A", this.radius, this.radius, 0, largeArcFlag, 0, end.x, end.y
        //     ].join(" ");

        //     return d;       
        // }
    }
}
</script>