<template>
  <div ref="stackBarCanvas">
    <div class="md:grid grid-cols-5 relative">
      <div ref="svgContainer" class="col col-span-4">
        <svg ref="svg" class="" :width="widthContainer" :height="canvasHeight">
          <g
            v-for="(serie, i) in series"
            :key="serie.id"
            :transform="`translate(0, ${
              i * barHeight * 1.1 + (i === series.length - 1 ? avgSpacing : 0)
            })`"
          >
            <rect
              v-for="(d, stackIndex) in serie.children"
              :key="serie.id + stackIndex"
              :x="getXPos(stackIndex, serie.children)"
              :y="0"
              :data-id="d.id"
              :data-stackindex="stackIndex"
              :width="widthScale(d.value)"
              :height="barHeight"
              :fill="colorScale(d.id)"
              class="stroke-white stroke-2 hover:brightness-110"
              :class="{
                'opacity-10': hoveredLegendId !== '' && hoveredLegendId !== d.id
              }"
              @mouseover="mouseoverHandler($event, d, serie.id)"
              @mouseleave="mouseoutHandler($event, d, serie.id)"
            />

            <template v-if="showFigures">
              <text
                v-for="(d, stackIndex) in serie.children"
                v-show="widthScale(d.value) > 40"
                :key="'text' + serie.id + stackIndex"
                class="pointer-events-none text-xs fill-white font-semibold mt-1 ml-1 overflow-x-hidden"
                :x="getXPos(stackIndex, serie.children)"
                :y="barHeight / 2"
                dy="0.25rem"
                dx="0.25rem"
                :style="{
                  width: widthScale(d) + 'px',
                  height: barHeight + 'px'
                }"
              >
                {{ formatter(d.value) }}
              </text>
            </template>

            <!-- main text legend for bar-->
            <text
              text-anchor="start"
              font-size="11px"
              :x="0"
              :y="barHeight / 2"
              :dy="'.35em'"
              class="fill-softBlack"
              :class="{
                italic: serie.id === 'Average',
                'font-thin': serie.id === 'Average'
              }"
            >
              {{ serie.id }}
            </text>
          </g>
          <!-- x axis -->
          <g id="axis" :transform="`translate(0,${canvasHeight - barHeight})`">
            <g
              v-for="(d, i) in widthScale.ticks(4)"
              :key="i"
              :transform="`translate(${axisWidth + widthScale(d)}, 0)`"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                :y2="4"
                stroke="black"
                stroke-width="1"
                stroke-dasharray="2,2"
              />
              <text
                x="0"
                y="0"
                dy="1.2em"
                text-anchor="start"
                font-size="11px"
                class="fill-softBlack"
              >
                {{ formatter(d) }}
              </text>
            </g>
          </g>
        </svg>
      </div>
      <div class="col-span-1">
        <div v-if="showLegend"
          class="mt-4 md:mt0 flex flex-row md:flex-col gap-1 justify-between md:justify-start"
        >
          <div
            v-for="catName in allSubCategoryNames"
            :key="catName"
            class="flex justify-start gap-4"
            @mouseover="hoveredLegendId = catName"
            @mouseleave="hoveredLegendId = ''"
          >
            <div
              :style="{ backgroundColor: colorScale(catName) }"
              class="w-4 h-4 shrink-0"
            />
            <div class="text-xs">{{ catName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * This component is a base stack chart with the common features:
 * - legend on the right
 * - x axis labels
 * - hover effect on mouseover
 * - show/hide figures
 * This variation of the stacked bar chart takes the full width of the container and divides in: 80% for the bars and 20% for the legend defined in the css grids .
 */

import { scaleLinear, scaleOrdinal, sum, max, schemeTableau10 } from 'd3'
export default {
  setup() {
    
  },
  props: {
    /**
     * The data to display. Each object in the array is a serie that will be stacked in a single bar. 
     * 
     * @type {Array}
     */
    series: {
      type: Array,
      default: () => [
        {
          id: '2010',
          children: [
            {
              id: '1',
              value: 0.1
            },
            {
              id: '2',
              value: 0.2
            }
          ],
          value: 0.3
        },
        {
          id: '2011',
          children: [
            {
              id: '1',
              value: 0.4
            },
            {
              id: '2',
              value: 0.5
            }
          ],
          value: 0.9
        }
      ]
    },
    colors: {
      type: Array,
      default: () => schemeTableau10
    },

    /** 
     * Show or hide the numbers inside the bars if there is enough space.
    */    
    showFigures: {
      type: Boolean,
      default: false
    },
    /**
     * The width of the axis on the left of the chart.
     */
    axisWidth: {
      type: Number,
      default: 50
    },
    barHeight: {
      type: Number,
      default: 20
    },
    /**
     * The formatter function for the numbers. Usually is related with one of the d3.format functions.
     */
    formatter: {
      type: Function,
      default: (d) => d
    },
    /**
     * For all series, displays the name and colours of the subcategories in a legend on the right side
     */
    showLegend: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
     
      avgSpacing: 6,
      widthContainer: 0,
      spaceForLegend: 0.3,
      hoveredLegendId: '',
      showTeleport: false
    }
  },

  computed: {
    maxSeriesData() {
      return max(this.series, (d) => d.value)
    },
    widthScale() {
      return scaleLinear()
        .domain([0, this.maxSeriesData])
        .range([0, this.widthContainer * (1 - this.spaceForLegend)])
    },
    canvasHeight() {
      return (this.series.length + 1) * this.barHeight * 1.1 + this.avgSpacing
    },
    colorScale() {
      const colorArray = this.colors
      return scaleOrdinal().domain(this.allSubCategoryNames).range(colorArray)
    },
    allSubCategoryNames() {
      const allnames = this.series.flatMap((d) => d.children.map((c) => c.id))
      // remove duplicates
      return [...new Set(allnames)]
    }
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      // run this code once 500ms after the component is mounted
      setTimeout(() => {
        // get element for svgContainer
        this.widthContainer = this.$refs.svgContainer.clientWidth
      }, 600)
    })
    // update widthContainer when the window is resized
      window.addEventListener('resize', () => {
        this.widthContainer = this.$refs.svgContainer.clientWidth
      })
  },
  // destory listener when component is destroyed
  unmounted() {
      window.removeEventListener('resize', () => {
        this.widthContainer = this.$refs.svgContainer.clientWidth
      })
  },

  methods: {
    getXPos(stackIndex, stackElements) {
      // get the sum of all items in the stack before the current item defined by stackIndex
      const sumOfPreviousStackElements = sum(
        stackElements.slice(0, stackIndex).map((d) => d.value)
      )
      // return the x position of the current item
      return this.axisWidth + this.widthScale(sumOfPreviousStackElements)
    },
    
    mouseoverHandler(event,  d, serieId) {
        const hoveredData = {
          serieId,
          childrenId: d.id,
          value: this.formatter(d.value)
        }
      this.$emit('_mouseover', { payload: hoveredData, x: event.clientX, y: event.clientY } )
    },
    mouseoutHandler(event, d, serieId) {
        const hoveredData = {
          serieId,
          childrenId: d.id,
          value: this.formatter(d.value)
        }
      this.$emit('_mouseout', {
        payload: hoveredData,
      })
    }


  }
}
</script>

<style lang="css" scoped>
rect {
  transition: y 0.5s, height 0.5s, width 1s, opacity 0.2s, filter 0.4s;
}
</style>
