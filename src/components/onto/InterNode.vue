<template>
    <g>

        <line :x1="node.x" :y1="node.y" :x2="objectNode.x"  :y2="objectNode.y" stroke="#000" stroke-width="2" marker-end="url(#arrow_small_r)"/>
        <line :x1="node.x" :y1="node.y" :x2="subjectNode.x"  :y2="subjectNode.y"  stroke="#000" stroke-width="2"  marker-start="url(#arrow)" marker-end="url(#arrow_small)" />

        <g :transform="'translate(' + (node.x - 10) + ','+ (node.y - 10) + ')'">

            <g v-if="Object.keys(node.literals).length">

                <rect x="9" y="20" width="340" 
                      :height="Object.keys(node.literals).length * 24 + 10"
                      style="fill: white; stroke: black; stroke-width:2; stroke-dasharray: 5,5"       
                      />

                

                <g v-for="(item, index) of Object.values(node.literals)" 
                   :key="'infoitem_' + index"
                   :transform="'translate(14, '+ ((index * 24) + 26) +')'"
                   >

                    <onto-rate-of-trust-svg :confianza="getShortUrl(item.confianza)" :size="22"/>
                    <text y="15" x="26" font-size="12"
                        style="pointer-events: none; font-size: 12; font-family: monospace; fill: #000C"
                        v-html="getShortUrl(item.document) || 'Documento sin ID'"
                        />

                </g>

            </g>


            <rect x="10" width="340" height="21" style="stroke:#444; stroke-width:1; fill: #EEE"/> <!-- background rect-->
            <rect v-if="isSelected" x="10" width="340" height="21" style="stroke-width:0; fill: #fff8a6"/>
            <circle cx="10" cy="11" r="12" style="stroke:#444; stroke-width:1; fill: white" /> <!-- left handle -->
            <path style="stroke-width: 3; stroke: #444;" d="M 2,6 L 18,6 M 2,11 L 18,11 M 2,16 L 18,16"/> <!-- Handle drag icon-->
            <text x="26" y="17" font-size="12"
                style="pointer-events: none; font-size: 12; font-family: monospace; fill: #000C; font-weight:bold"
                >{{getPropertyPredicateLabel(node.link_type, ORelations)}}</text> <!-- internode text-->

        </g>

    </g>

</template>

<script>
import { getShortUrl, getPropertyPredicateLabel } from '~/plugins/ontographFunctions'

export default {

    props: {
        data_nodes_referenced: {
            type: Object,
            default: null
        },
        node: {
            type: Object,
            default: null
        },
        selected_node: {
            type: Object,
            default: null
        },

    },

    computed: {
        ORelations () {
            return this.$store.state.ontograph.ORelations
        },
        isSelected (){
            return (!!this.selected_node && this.node.id === this.selected_node.id)
        },
        objectNode(){
            console.log(this.node)
            return this.data_nodes_referenced[this.node.object_id]
        },
        subjectNode(){
            return this.data_nodes_referenced[this.node.subject_id]
        }

    },

    methods: {
        getShortUrl: getShortUrl,
        getPropertyPredicateLabel: getPropertyPredicateLabel
    }
    
}

</script>