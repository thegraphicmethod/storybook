<template>
  <div class="relative">
    <svg class="mt-8" :style="{ width: width + 'px', height: height + 'px' }">
      <g>
        <g>
          <MapPathSingle
            v-for="geoObj in pathAndData"
            :id="geoObj.id"
            :key="geoObj.id"
            :d="geoObj.path"
            :color="geoObj.color"
            :hoveredColor="geoObj.colorHovered"            
            :showHoverState="!geoObj.nonAvailableData"
            :showStrokeHovered="true"
            strokeHoveredColor="black"
            @_mouseover="mouseoverHandler($event, geoObj.id)"
            @_mouseout="mouseoutHandler($event, geoObj.id)"
            @_click="clickHandler($event, geoObj.id)"
          ></MapPathSingle>
        </g>
      </g>
    </svg>
    <MapLegend>

    </MapLegend>
  </div>
</template>

<script>
import * as geo from 'd3-geo'
import { scaleQuantile,color} from 'd3'
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
     * The name of the projection that will be used to draw the map included in d3-geo
     */
    projectionName: {
      type: String,
      default: 'geoMercator'
    },
    /**
     * The scale of the projection. If not provided, the map will fit the geometry of the geo data
     * If you provide this value you also need to provide the center
     */
    projectionScale: {
      type: Number,
      default: NaN
    },
    center: {
      type: Array,
      default: () => null
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
   
   
    }
  },
  computed: {
    colorScale() {
      return scaleQuantile()
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
        const value = this.valueFromData(_id)
        return {
          path: this.geoPath(d),
          id: _id,
          name: _name,
          bounds: this.geoPath.bounds(d),
          value,
          color: this.colorFromData(_id),
          colorHovered: this.colorFromData(_id),
          nonAvailableData: value==='N/A'
        }
      })
    },
    resetProjection() {
      this.projection = geo[this.projectionName]() 
      if( this.center && this.center.length>0 && !isNaN(this.projectionScale)){
        this.projection.center(this.center)
        this.projection.scale(this.projectionScale)
      }
      else 
        this.projection.fitSize([this.width,this.height], this.geoMap)       
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

</style>
