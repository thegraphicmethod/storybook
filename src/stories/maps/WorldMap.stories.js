import  WorldMap  from '@/components/ChoroMaps/WorldMap.vue'
import WorldMapSource from '@/components/ChoroMaps/WorldMap.vue?raw'
import * as worldmapGeo from '@/assets/world-110m.json'
import * as spainMapGeo from '@/assets/shapefiles_provincias_espana.json'

export default {
  title: 'Maps/WorldMap',
  component: WorldMap,
  tags: ['autodocs'],
  argTypes: { 
    _click: { action: '_click' },
    _mouseover: { action: '_mouseover' },
  },
  parameters: {
    componentSource: {
      code: WorldMapSource,
      language: 'vue',
    },
  },

}



export const DefaultWorldMap = {
  args: {
    data : [
        {_id: "AFG", Total: 32358260},
        {_id: "AGO", Total: 15941390},
        {_id: "ALB", Total: 2947314},
        {_id: "AND", Total: 72766},
        {_id: "ARE", Total: 9214175},
        {_id: "ARG", Total: 43416755},
        {_id: "ARM", Total: 3017712},
        {_id: "ATG", Total: 96453},
        {_id: "AUS", Total: 23781169},
        {_id: "AUT", Total: 8479823},
        {_id: "AZE", Total: 9753968},
        {_id: "BDI", Total: 10524117},
        {_id: "BEL", Total: 11348159},
        {_id: "BEN", Total: 10872298},
    ],
    geoMap: worldmapGeo,        
  }
}

export const SpainMap = {
    args: {
        data : [
            {_id: "1", Total: 32358260},
            {_id: "2", Total: 15941390},
            {_id: "3", Total: 2947314},
            {_id: "4", Total: 72766},
            {_id: "5", Total: 9214175},
            {_id: "6", Total: 43416755},
        ],
        geoMap: spainMapGeo,
        fielIdInGeoData: 'properties.id',
        fieldNameInGeoData: 'properties.texto'
    }
}
