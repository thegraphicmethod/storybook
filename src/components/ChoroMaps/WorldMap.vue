<template>
  <div class="relative">
    <svg class="mt-8" :style="{ width: width + 'px', height: height + 'px' }">
      <g
        :transform="`translate(${zoomData.x}, ${zoomData.y}) scale(${zoomData.scale}, ${zoomData.scale})`"
      >
        <g>
          <MapPathSingle
            v-for="geo in pathAndData"
            :id="geo.id"
            :key="geo.id"
            :d="geo.path"
            :color="geo.color"
            @_mouseover="mouseoverHandler($event, geo.id)"
            @_mouseout="mouseoutHandler($event, geo.id)"
            @_click="clickHandler($event, geo.id)"
          ></MapPathSingle>
        </g>
      </g>
    </svg>
    <MapLegend>

    </MapLegend>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as geo from 'd3-geo'
import MapPathSingle from './MapPathSingle.vue'
import MapLegend from './MapLegend.vue'
import {get} from 'lodash'
export default {
  components: {
    MapPathSingle,
    MapLegend
  },
  name: 'WorldMap',
  emits: ['_mouseover', '_mouseout','_click'],
  props: {
    /**
     * The geoJson data must have a features array for each shape. Each shape should have an id
     */
    geoMap: {
      type: Object,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    width: {
      type: Number,
      default: 1200
    },
    height: {
      type: Number,
      default: 800
    },
    /**
     * The field name in the geoData (shapefiles) that will be used to join the data
     */
    fielIdInGeoData: {
      type: String,
      default: 'id'
    },
    fieldNameInGeoData: {
      type: String,
      default: 'properties.name'
    },

    /**
     * The field name in the data that will be used to join the data
     */
    metricObject: {
      type: Object,
      default: () => ({
        id: '_id',
        value: 'Total'
      })
    },
    colors: {
      type: Array,
      default: () => [
        '#004c6d',
        '#346888',
        '#5886a5',
        '#7aa6c2',
        '#9dc6e0',
        '#c1e7ff'
      ]
    },    
    nonAvailableColor: {
      type: String,
      default: '#CCD6D8'
    },
    HighLightFromOutside: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      geoPath: geo.geoPath(),
      pathAndData: [],
      zoomData: {
        scale: 0.15,
        x: 500,
        y: 300
      },
      zoomGeoId: null
    }
  },
  computed: {


    colorScale() {
      return d3
        .scaleQuantile()
        .domain(this.OnlyValuesArray)
        .range(this.colors)
    },
    OnlyValuesArray() {
      return this.data.map((d) => parseFloat(d[this.metricObject.value]))
    },
  },
  watch: {
    width() {
      this.resetProjection()
      this.BuildPathAndData()
    },
    data() {
      this.setGeoJsoDataStates()
    },
    outsideHighLight(newValue) {
      if (newValue == 0) this.zoomOut()
    },
    metricObject() {
      this.BuildPathAndData()
    }
  },
  created() {
    this.resetProjection()
  },
  mounted() {
    this.BuildPathAndData()
  },
  methods: {
    BuildPathAndData() {
      this.pathAndData = this.geoMap.features.map((d) => {
        const _id= get(d, `${this.fielIdInGeoData}`)+''
        const _name = get(d, `${this.fieldNameInGeoData}`)
        return {
          path: this.geoPath(d),
          id: _id,
          name: _name,
          bounds: this.geoPath.bounds(d),
          value: this.valueFromData(_id),
          color: this.colorFromData(_id),
          nonAvailableData: this.valueFromData==='N/A'
        }
      })
    },
    resetProjection(projectionRatio = 1.1) {
      this.projection = geo
        .geoMercator()
        .scale(this.width * projectionRatio)
        .translate([this.width / 2, this.height / 2])
      this.geoPath.projection(this.projection)
    },
    datumFromGeoId(geoId) {
      return this.data.find((d) => d._id === geoId)
    },
    colorFromData(regionID) {
      const element = this.data.find((d) => {
        return d._id === regionID
      })
      if (element) {
        if (
          element.total_demand < this.$THRESHOLD ||
          isNaN(element[this.metricObject.value])
        )
          return this.nonAvailableColor
        else return this.colorScale(element[this.metricObject.value])
      }
      return this.nonAvailableColor
    },
    valueFromData(regionID) {
      const element = this.data.find((d) => {
        return d._id === regionID
      })
      if (element) {
        if (
          element.total_demand < this.$THRESHOLD ||
          isNaN(element[this.metricObject.value])
        )
          return 'N/A'
        else return element[this.metricObject.value]
      }
      return 'N/A'
    },

    zoomOut() {
      this.zoomData = {
        scale: 0.25,
        x: 0,
        y: 0
      }
      this.showZoomControls = false
    },

    clickHandler(event, geoid) {
      const pathAndDataObj = this.pathAndData.find((d) => d.id === geoid)
      if(pathAndDataObj.nonAvailableData) return

      this.$emit('_click', {
        value: pathAndDataObj,
        x: event.clientX,
        y: event.clientY
      })
    },

    mouseoverHandler(event, geoid) {
      const pathAndDataObj = this.pathAndData.find((d) => d.id === geoid)
      if(pathAndDataObj.nonAvailableData) return
      this.$emit('_mouseover', { payload: pathAndDataObj, x: event.clientX, y: event.clientY } )
    },
    mouseoutHandler(event, geoid) {
      this.$emit('_mouseout', {
        geoid
      })
    }
  }
}
</script>

<style lang="css" scoped>
path.state {
  stroke: #333;
  stroke-width: 0.5px;
}

path.state {
  pointer-events: none;
}

path.state.selectionable {
  cursor: pointer;
  pointer-events: all;
}
path.state:hover,
path.state {
  transition: fill 0.5s ease-in-out;
}

path.selected {
  stroke: #112a45;
  stroke-width: 2px;
}
</style>
