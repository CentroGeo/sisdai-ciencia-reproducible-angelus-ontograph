<template>
    <svg viewBox="0 0 200 100">

        <g stroke="#333333"
            stroke-width="3" >
            
            <path  d="M75,25 L10,50 L 75,75"></path>
            <circle fill="white" r="15" cx="75" cy="25"></circle>
            <circle fill="white" r="15" cx="75" cy="75"></circle>
            <circle fill="#333333" r="10" cx="75" cy="25"></circle>
            <circle fill="#333333" r="10" cx="75" cy="75"></circle>
        </g>
        
        <g font-family="monospace"  >
            <text x="100"  y="30">Date 1</text>
            <text x="100" y="80">Date 1</text>
        </g>

    </svg>
</template>

<script>
export default {
    props: {
        date_upper: {
            type: String,
            default: null
        },
        date_lower: {
            type: String,
            default: null
        },
    },

    data: () => ({

    }),
}


</script>
