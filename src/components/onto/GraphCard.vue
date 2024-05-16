<template>
    <g v-if="node !== null" :transform="'translate('+ (node.x)+',' + (node.y)+')'">

        <g v-if="Object.keys(node.literals).length">

            <rect y="80" x="4" width="340" :height=" ( 50 * (Object.keys(node.literals).length)) + 10" 
                  style="fill: white; stroke: black; stroke-width: 2; stroke-dasharray: 5,5;"
                  />


            <g v-for="(item, index) of Object.values(node.literals)" :key="'infoitem_' + index "
                :transform="'translate(4, '+ ((index * 50) + 86) +')'">

                <text y="12" x="6" font-size="12" style="pointer-events: none; font-size: 12; font-family: monospace; fill: #000C; font-weight:bold">{{getPropertyPredicateLabel(item.predicate, OProperties)}}</text>
                <onto-text-wrap  :text="item.literal" :lines="2" :offsetX="6" :offsetY="26"/>

            </g>
        </g>

        
        <g class="node_object">
            <rect x="0" y="0" width="350" height="80" style="fill:#fff; stroke-width:2; stroke: #777"/> <!-- white background -->

            <rect v-if="isSelected"  x="1" y="1" width="348" height="78" style="fill:#fff8a6; stroke-width:0"/> <!-- yellow background -->

            <line x1="2"  y1="0" x2="2" y2="80" :style="'stroke-width:4; stroke:' + classColor" :stroke="classColor"/> <!-- class left border -->

            <line x1="16" y1="23" x2="310" y2="23" style="stroke: #454545; stroke-width:1" /> <!-- separating line -->

            <text 
                x="16" y="16" font-size="11"
                style="font-size: 11; font-family: monospace; fill: #000C; font-weight:bold">
                {{classLabel}}
            </text>

            <onto-text-wrap  v-if="nodeLabel" :text="nodeLabel" :lines="3" :offsetX="12" :offsetY="40"/>

            <text v-else x="18" y="42" font-size="15" style="font-size: 15; font-family: monospace; fill: #000C"> N/A </text>

        </g>



    </g>

</template>

<script>

import { getPropertyPredicateLabel } from '~/plugins/ontographFunctions'

export default {
    props: {
        node: {
            type: Object,
            default: null
        },
        entity_data:{
            type: Object,
            default: null
        },
        selected_node: {
            type: Object,
            default: null
        },
        classColors: {
            type: Object,
            default: null
        }
    },

    data: () => ({

    }),

    mounted () {

    },

    watch: {

    },

    computed: {
        OClasses () {
            return this.$store.state.ontograph.OClasses
        },
        OProperties () {
            return this.$store.state.ontograph.OProperties
        },

        isSelected (){
            return (!!this.selected_node && this.node.id === this.selected_node.id)
        },

        nodeLabel  () {
            //Fixing inconsistency with backend use of label/labels
            if(this.node.alt_label) return this.node.alt_label;
            else if ('label' in this.entity_data) return this.entity_data.label[0].label_value;
            else if ('labels' in this.entity_data) return this.entity_data.labels[0].label_value;
            else return null
        },
        classLabel () {
            return getPropertyPredicateLabel(this.entity_data.class, this.OClasses)
        },
        classColor (){
            if(this.entity_data.class in this.classColors) return this.classColors[this.entity_data.class]
            else return "#333"
        },


    },
    methods: {
        getPropertyPredicateLabel: getPropertyPredicateLabel,

    }
};

</script>