import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj'
import {defaults} from 'ol/control/defaults'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Point, LineString, Polygon} from 'ol/geom';
import Feature from 'ol/Feature';
import { Icon, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke} from 'ol/style.js';
import {Zoom, ZoomSlider, ScaleLine, FullScreen, MousePosition} from 'ol/control';
import XYZ from 'ol/source/XYZ.js';
import {toStringHDMS} from 'ol/coordinate.js';
import { createStringXY } from 'ol/coordinate';

const markerStyle01 = new Style({
    image: new Icon({
        anchor: [0.5, 0.5], // Ajusta el punto de anclaje según sea necesario
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/CentroAtencion.png',
        scale: 0.1 // Ajusta el valor de escala para cambiar el tamaño del icono
    })
  });
  

const markerStyle02 = new Style({
    image: new Icon({
        anchor: [0.5, 0.5], // Ajusta el punto de anclaje según sea necesario
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/CentroProcesamiento.png',
        scale: 0.1 // Ajusta el valor de escala para cambiar el tamaño del icono
    })
  });

const markerStyle03 = new Style({
    image: new Icon({
        anchor: [0.5, 0.5], // Ajusta el punto de anclaje según sea necesario
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'datos/SalaAtencion.png',
        scale: 0.1 // Ajusta el valor de escala para cambiar el tamaño del icono
    })
  });
  
  

const CentroAtencion = new VectorLayer({
    source: new VectorSource({
    url: 'datos/centroatencion.geojson', // Ruta a tu archivo GeoJSON
    format: new GeoJSON()
    }),
    style: markerStyle01
    });



const map = new Map({
    target: 'map',
    layers: [
    new TileLayer({
    source: new OSM()
    }),
    CentroAtencion
    ],
    view: new View({
    center: fromLonLat([-74.0758, 4.7110]),
    zoom: 10
    }),
    controls: defaults({ //ol.control.defaults.defaults
    zoom:true,
    attribution: false,
    rotate: true
    })
    });


map.addControl(new Zoom());
map.addControl(new ScaleLine());
map.addControl(new FullScreen());
map.addControl(new ZoomSlider());
map.addControl(new MousePosition({
  coordinateFormat: createStringXY(5),
  projection: 'EPSG: 4326',
  target: document.getElementById('mouse-position'),
  undefinedHTML: '&nbsp;'
}));



var container = document.getElementById('popup'),
    content_element = document.getElementById('popup-content'),
    closer = document.getElementById('popup-closer');
closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
var overlay = new Overlay({
    element: container,
    autoPan: true,
    offset: [0, -10]
});
map.addOverlay(overlay);
map.on('click', function(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });
    if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        
        var content = '<h3>Correo:' + feature.get('CAVCELECTR') + '</h3>';
        content += '<h5> Nombre estación y descripción: ' + feature.get('CAVDESCRIP') + '</h5>';
        content_element.innerHTML = content;
        overlay.setPosition(coord);
        
        console.info(feature.getProperties());
    }
});