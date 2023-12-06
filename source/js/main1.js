import { Feature, Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat, transform} from 'ol/proj'
import {defaults} from 'ol/control/defaults'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {ZoomToExtent, defaults as defaultControls} from 'ol/control.js';
import OlSourceTileWMS from 'ol/source/tilewms';
import {Zoom, ZoomSlider, ScaleLine, FullScreen, MousePosition} from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import Overlay from 'ol/Overlay.js';
import {toLonLat} from 'ol/proj.js';
import XYZ from 'ol/source/XYZ.js';
import {toStringHDMS} from 'ol/coordinate.js';


const container = document.getElementById('popup');
const content_element = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');



const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 900,
    },
  },
});


closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

//Coloreo de funciones

var defaultStyle = new Style({
  fill: new Fill({
  color: 'rgba(128, 128, 128, 0.5)', // Gris con opacidad 0.5
  }),
  stroke: new Stroke({
  color: 'rgba(0, 0, 0, 0.8)', // Negro con 80% de opacidad
  width: 1,
  }),
  });

 
var regionStyles = {
  '1000': new Style({
  fill: new Fill({
  color: 'rgb(255, 160, 122)', // Verde con opacidad 0.5
  opacity: 0.1,
  }),
  stroke: new Stroke({
  color: 'black',
  width: 1,
  }),
  }),
  '2000': new Style({
  fill: new Fill({
  color: 'rgb(233, 150, 122)', // Azul con 50% de opacidad
  opacity: 0.1,
  }),
  stroke: new Stroke({
  color: 'black',
  width: 1,
  }),
  }),
  '2000': new Style({
  fill: new Fill({
  color: 'rgb(250, 128, 114)', // Naranja con 50% de opacidad
  opacity: 0.1,
  }),
  stroke: new Stroke({
  color: 'black',
  width: 1,
  }),
  }),
  '3000': new Style({
  fill: new Fill({
  color: 'rgb(240, 128, 128)', // Rojo con 50% de opacidad
  opacity: 0.1,
  }),
  stroke: new Stroke({
  color: 'black',
  width: 1,
  }),
  }),
  '6000': new Style({
  fill: new Fill({
  color: 'rgb(205, 92, 92)', // Morado con 80% de opacidad
  opacity: 0.1,
  }),
  stroke: new Stroke({
  color: 'black',
  width: 1,
  }),
  }),
  };

  var getRegionStyle = function (feature) {
      var region = feature.get('CMLP20CONTEO');
      
      if (region > 0 && region < 10) {
          return regionStyles['1000'];
      }
      
      if (region >= 10 && region < 20) {
          return regionStyles['2000'];
      }
  
      if (region >= 30 && region < 40){
          return regionStyles['3000'];
      }

      if (region >= 50 && region < 60){
          return regionStyles['6000'];
      }
      else {
      
          return regionStyles['1000'];
      }
  };

    var getRegionStyle = function (feature) {
      var region = feature.get('CMLP20CONT');
      
      if (region > 0 && region < 10) {
          return regionStyles['1000'];
      }
      
      if (region >= 10 && region < 20) {
          return regionStyles['2000'];
      }
  
      if (region >= 20 && region < 30){
          return regionStyles['3000'];
      }

      if (region >= 40 && region < 50){
          return regionStyles['4000'];
      }
      else {
      
          return defaultStyle;
      }
  };


  const DAI_S = new VectorLayer({
    source: new VectorSource({
    url: 'datos/DAISCAT.geojson', // Ruta a tu archivo GeoJSON
    format: new GeoJSON()
    }),
    style: getRegionStyle,
    });


  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      }), DAI_S
      // Puedes añadir más capas aquí si es necesario
    ],
    view: new View({
      center: fromLonLat([-74, 4]),
      zoom: 10,
      // extent: transformedExtent  // Puedes incluir esto si necesitas un extent específico
    }),
    controls: new defaultControls({ // Utiliza ol.control.defaults para los controles predeterminados
      zoom: true,
      attribution: false,
      rotate: true
    }).extend([
      new ZoomToExtent({
        extent: [
          -8500000,  -1000000,  -7500000,
          1500000
        ],
      }),
      // Puedes añadir más controles aquí si es necesario
    ])
  });

 
map.addControl(new Zoom());
map.addControl(new ScaleLine());
map.addControl(new FullScreen());
map.addControl(new ZoomSlider());
map.addOverlay(overlay);
map.addControl(new MousePosition({
  coordinateFormat: createStringXY(5),
  projection: 'EPSG: 4326',
  target: document.getElementById('mouse-position'),
  undefinedHTML: '&nbsp;'
}));





map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));

  // Mostrar las coordenadas en el popup
  content_element.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
  overlay.setPosition(coordinate);

  // Buscar una feature en la ubicación del clic
  var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    return feature;
  });

  // Mostrar información de la feature si se encontró
  if (feature) {
    var geometry = feature.getGeometry();
    var coord = geometry.getCoordinates();
    
    var popupContent = '<h3>Sector Catastral:' + feature.get('CMNOMSCAT') + '</h3>';
    popupContent += '<h5> Numero de Crimenes en el 2020: ' + feature.get('CMLP20CONT') + '</h5>';
  
    
    content_element.innerHTML = popupContent;
    overlay.setPosition(coord);
  }
});








