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

var defaultStyle = new Style({
  fill: new Fill({
  color: 'rgb(186, 74, 0) ', // Gris con opacidad 0.5
  }),
  stroke: new Stroke({
  color: 'rgba(0, 0, 0, 0.8)', // Negro con 80% de opacidad
  width: 1,
  }),
  });

  var regionStyles = {
    'USME': new Style({
        fill: new Fill({
            color: 'rgba(0, 255, 0, 0.5)', // Verde con opacidad 0.5
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'SANTA FE': new Style({
        fill: new Fill({
            color: 'rgba(0, 0, 255, 0.5)', // Azul con 50% de opacidad
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 2,
            lineDash: [3, 6]
        }),
    }),
    'CHAPINERO': new Style({
        fill: new Fill({
            color: 'rgba(255, 165, 0, 0.5)', // Naranja con 50% de opacidad
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'KENNEDY': new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 0, 0.5)', // Rojo con 50% de opacidad
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'USAQUEN': new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 255, 0.5)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'TUNJUELITO': new Style({
        fill: new Fill({
            color: 'rgba(255, 165, 0, 0.5)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'BOSA': new Style({
        fill: new Fill({
            color: 'rgba(0, 255, 0, 0.5)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'FONTIBON': new Style({
        fill: new Fill({
            color: 'rgba(0, 0, 255, 0.5)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 2,
            lineDash: [3, 6]
        }),
    }),
    'ENGATIVA': new Style({
        fill: new Fill({
            color: 'rgba(255, 165, 0, 0.5)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'SUBA': new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 0, 0.5)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'BARRIOS UNIDOS': new Style({
        fill: new Fill({
            color: 'rgba(128, 0, 128, 0.8)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'TEUSAQUILLO': new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 255, 0.5)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'LOS MARTIRES': new Style({
        fill: new Fill({
            color: 'rgba(255, 165, 0, 0.5)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'ANTONIO NARIÑO': new Style({
        fill: new Fill({
            color: 'rgba(0, 255, 0, 0.5)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),
    }),
    'PUENTE ARANDA': new Style({
        fill: new Fill({
            color: 'rgba(0, 0, 255, 0.5)',
            opacity: 0.1,
        }),
        stroke: new Stroke({
            color: 'red',
            width: 1,
        }),

        'SAN CRISTOBAL': new Style({
          fill: new Fill({
              color: 'rgba(255, 0, 255, 0.5)', // Púrpura con opacidad 0.5
              opacity: 0.1,
          }),
          stroke: new Stroke({
              color: 'red',
              width: 1,
          }),
      }),
      'CIUDAD BOLIVAR': new Style({
          fill: new Fill({
              color: 'rgba(0, 0, 255, 0.5)', // Azul con opacidad 0.5
              opacity: 0.1,
          }),
          stroke: new Stroke({
              color: 'red',
              width: 1,
          }),
      }),
      'CANDELARIA': new Style({
          fill: new Fill({
              color: 'rgba(255, 165, 0, 0.5)', // Naranja con opacidad 0.5
              opacity: 0.1,
          }),
          stroke: new Stroke({
              color: 'red',
              width: 1,
          }),
      }),
    }),

    'RAFAEL URIBE URIBE': new Style({
      fill: new Fill({
          color: 'rgba(128, 0, 128, 0.8)', // Morado con opacidad 0.8
          opacity: 0.1,
      }),
      stroke: new Stroke({
          color: 'red',
          width: 1,
      }),
  }),

    
  };
  

var getRegionStyle = function (feature) {
  var region = feature.get('Nombre_de_');
return regionStyles[region] || defaultStyle;
};


const markerCoordinates01 = fromLonLat([-74.14177614599998, 4.694931578000023]);
const marker01 = new Feature({
geometry: new Point(markerCoordinates01),
name: 'Estación de Policía Aeropuerto',
});

const markerCoordinates02 = fromLonLat([-74.10313454199996, 4.585608036000053]);
const marker02 = new Feature({
geometry: new Point(markerCoordinates02),
name: 'Estación de Policía Antonio Nariño',
});

const markerCoordinates03 = fromLonLat([-74.08186178199998,4.67381199700003]);
const marker03 = new Feature({
geometry: new Point(markerCoordinates03),
name: 'Estación de Policía Barrios Unidos',
});

const markerCoordinates04 = fromLonLat([-74.18678724699998, 4.600156612000035]);
const marker04 = new Feature({
geometry: new Point(markerCoordinates04),
name: 'Estación de Policía Bosa',
});

const markerCoordinates05 = fromLonLat([-74.05839031199997, 4.641612697000028]);
const marker05 = new Feature({
geometry: new Point(markerCoordinates05),
name: 'Estación de Policía Chapinero',
});

const markerCoordinates06 = fromLonLat([-74.05839031199997,4.641612697000028]);
const marker06 = new Feature({
geometry: new Point(markerCoordinates06),
name: 'Estación de Policía Chapinero',
});

const markerCoordinates07 = fromLonLat([-74.16465861299997, 4.577478177000046]);
const marker07 = new Feature({
geometry: new Point(markerCoordinates07),
name: 'Estación de Policía Ciudad Bolívar',
});

const markerCoordinates08 = fromLonLat([-74.10267599999997, 4.690011000000027]);
const marker08 = new Feature({
geometry: new Point(markerCoordinates08),
name: 'Estación de Policía Engativá',
});

const markerCoordinates09 = fromLonLat([-74.15957197899996, 4.619553241000062]);
const marker09 = new Feature({
geometry: new Point(markerCoordinates09),
name: 'Estación de Policía Kennedy',
});

const markerCoordinates10 = fromLonLat([-74.11055632699998, 4.585383204000038]);
const marker10 = new Feature({
geometry: new Point(markerCoordinates10),
name: 'Estación de Policía Rafael Uribe Uribe',
});

const markerStyle01 = new Style({
  image: new Icon({
      anchor: [0.5, 0.5], // Ajusta el punto de anclaje según sea necesario
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: 'datos/2561918.png',
      scale: 0.1 // Ajusta el valor de escala para cambiar el tamaño del icono
  })
});

const markerStyle02 = new Style({
  image: new Icon({
      anchor: [0.5, 0.5], // Ajusta el punto de anclaje según sea necesario
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: 'datos/descarga.png',
      scale: 0.1 // Ajusta el valor de escala para cambiar el tamaño del icono
  })
});


marker01.setStyle(markerStyle01);
marker02.setStyle(markerStyle01);
marker03.setStyle(markerStyle01);
marker04.setStyle(markerStyle01);
marker05.setStyle(markerStyle01);
marker06.setStyle(markerStyle01);
marker07.setStyle(markerStyle01);
marker08.setStyle(markerStyle01);
marker09.setStyle(markerStyle01);
marker10.setStyle(markerStyle01);


const Localidad = new VectorLayer({
  source: new VectorSource({
  url: 'datos/localidades.geojson', // Ruta a tu archivo GeoJSON
  format: new GeoJSON()
  }),
  style: getRegionStyle
  });

const Bomberos = new VectorLayer({
  source: new VectorSource({
  url: 'datos/bomberos.geojson', // Ruta a tu archivo GeoJSON
  format: new GeoJSON()
  }),
  style: markerStyle02
  });



    const vectorLayer = new VectorLayer({
    source: new VectorSource({
    features: [marker01, marker02,marker03,marker04,marker05,marker06,marker07,marker08,marker09,marker10]
    })
});
const map = new Map({
target: 'map',
layers: [
new TileLayer({
source: new OSM()
}),
Localidad, vectorLayer, Bomberos
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
        
        var content = '<h3>Nombre:' + feature.get('name') + '</h3>';
        content += '<h5> Estación Bomberos en la zona: ' + feature.get('EBONOMBRE') + '</h5>';
        content_element.innerHTML = content;
        overlay.setPosition(coord);
        
        console.info(feature.getProperties());
    }
});