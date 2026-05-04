import { Fragment, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip, Pane, Rectangle } from 'react-leaflet';
import L from 'leaflet';

const RESORT = {
  name: 'Rainleaf Family Retreat',
  location: 'Kaniyāmbetta, Wayanad, Kerala',
  lat: 11.685,
  lng: 76.082,
};

const ATTRACTIONS = [
  { name: 'Pookode Lake',              lat: 11.5425, lng: 76.0272, color: '#1565c0', distance: '~5 km',  drive: '15 min',     category: 'Lakes & Waterfalls', image: '/images/attractions/pookode-lake.jpg' },
  { name: 'Lakkidi View Point',        lat: 11.5219, lng: 76.0247, color: '#f9a825', distance: '~8 km',  drive: '20 min',     category: 'Viewpoints & Peaks', image: '/images/attractions/wayanad-scenery.jpg' },
  { name: 'Chain Tree',                lat: 11.6480, lng: 76.0490, color: '#e64a19', distance: '~9 km',  drive: '20 min',     category: 'Heritage & Caves',  image: '/images/attractions/wayanad-scenery.jpg' },
  { name: 'Chembra Peak',              lat: 11.5122, lng: 76.0894, color: '#f9a825', distance: '~22 km', drive: '40 min',     category: 'Viewpoints & Peaks', image: '/images/attractions/chembra-peak.jpg' },
  { name: 'Soochippara Falls',         lat: 11.5122, lng: 76.1631, color: '#1565c0', distance: '~25 km', drive: '45 min',     category: 'Lakes & Waterfalls', image: '/images/attractions/soochippara-falls.jpg' },
  { name: 'Banasura Sagar Dam',        lat: 11.6700, lng: 75.9578, color: '#c62828', distance: '~27 km', drive: '50 min',     category: 'Dams & Islands',     image: '/images/attractions/banasura-dam.jpg' },
  { name: 'Meenmutty Falls',           lat: 11.7280, lng: 75.8860, color: '#1565c0', distance: '~29 km', drive: '55 min',     category: 'Lakes & Waterfalls', image: '/images/attractions/meenmutty-falls.jpg' },
  { name: 'Edakkal Caves',             lat: 11.6247, lng: 76.2358, color: '#e64a19', distance: '~30 km', drive: '1 hr',       category: 'Heritage & Caves',  image: '/images/attractions/edakkal-caves.jpg' },
  { name: 'Phantom Rock',              lat: 11.6366, lng: 76.2046, color: '#f9a825', distance: '~32 km', drive: '1 hr',       category: 'Viewpoints & Peaks', image: '/images/attractions/phantom-rock.jpg' },
  { name: 'Wayanad Wildlife Sanctuary',lat: 11.6460, lng: 76.3640, color: '#6a1b9a', distance: '~35 km', drive: '1 hr',       category: 'Wildlife',           image: '/images/attractions/wildlife-sanctuary.jpg' },
  { name: 'Kuruva Island',             lat: 11.8266, lng: 76.0929, color: '#c62828', distance: '~40 km', drive: '1 hr 15 min',category: 'Dams & Islands',     image: '/images/attractions/kuruva-island.jpg' },
  { name: 'Thirunelli Temple',         lat: 11.9117, lng: 75.9958, color: '#e64a19', distance: '~50 km', drive: '1 hr 30 min',category: 'Heritage & Caves',  image: '/images/attractions/thirunelli-temple.jpg' },
];

const LEGEND = [
  { label: 'Resort',                color: '#3a6b1e' },
  { label: 'Lakes & Waterfalls',    color: '#1565c0' },
  { label: 'Viewpoints & Peaks',    color: '#f9a825' },
  { label: 'Heritage & Caves',      color: '#e64a19' },
  { label: 'Wildlife',              color: '#6a1b9a' },
  { label: 'Dams & Islands',        color: '#c62828' },
];

const RINGS = [10000, 20000, 30000, 50000];

function buildResortIcon() {
  return L.divIcon({
    className: 'rl-resort-marker',
    html: '<span class="rl-resort-dot"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function buildAttractionIcon(color, image, name) {
  const safeName = (name || '').replace(/"/g, '&quot;');
  const safeImage = (image || '').replace(/"/g, '&quot;');
  const inner = image
    ? `<img class="rl-attr-img" src="${safeImage}" alt="${safeName}" loading="lazy" onerror="this.style.display='none';this.parentNode.classList.add('rl-attr-fallback');" />`
    : '';
  return L.divIcon({
    className: 'rl-attraction-marker',
    html: `<span class="rl-attr-thumb" style="--rl-c:${color};">${inner}</span>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
}

export default function AttractionsMap() {
  const resortIcon = useMemo(() => buildResortIcon(), []);
  const resortPos = [RESORT.lat, RESORT.lng];

  return (
    <section id="attractions-map" className="section attractions-map-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <i className="fas fa-map-marked-alt" aria-hidden="true"></i> Explore Wayanad
          </span>
          <h2 className="section-title">Top Attractions Around Rainleaf</h2>
          <p className="section-desc">
            Discover Wayanad's most loved waterfalls, viewpoints, wildlife and heritage spots — all within easy reach of the resort.
          </p>
        </div>
      </div>

      <div className="attractions-map-fullwidth">
        <div className="attractions-map-wrap">
          <MapContainer
            center={resortPos}
            zoom={11}
            scrollWheelZoom={false}
            className="attractions-leaflet"
            attributionControl
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains={['a', 'b', 'c', 'd']}
            />

            <Pane name="rl-tint" style={{ zIndex: 250 }}>
              <Rectangle
                bounds={[[-85, -180], [85, 180]]}
                pane="rl-tint"
                interactive={false}
                pathOptions={{
                  stroke: false,
                  fill: true,
                  fillColor: '#020f02',
                  fillOpacity: 0.60,
                }}
              />
            </Pane>

            {RINGS.map((r) => (
              <Circle
                key={r}
                center={resortPos}
                radius={r}
                pathOptions={{
                  color: '#3a6b1e',
                  weight: 1,
                  opacity: 0.55,
                  dashArray: '4 6',
                  fillColor: '#a3c585',
                  fillOpacity: 0.04,
                }}
              />
            ))}

            {ATTRACTIONS.map((a) => {
              const mid = [(RESORT.lat + a.lat) / 2, (RESORT.lng + a.lng) / 2];
              return (
                <Fragment key={a.name}>
                  <Polyline
                    positions={[resortPos, [a.lat, a.lng]]}
                    pathOptions={{
                      color: a.color,
                      weight: 2,
                      opacity: 0.7,
                      dashArray: '5 6',
                    }}
                  />
                  <Marker position={mid} opacity={0} interactive={false} icon={L.divIcon({ className: 'rl-empty-icon', iconSize: [1, 1] })}>
                    <Tooltip
                      permanent
                      direction="center"
                      className="rl-distance-label"
                      offset={[0, 0]}
                    >
                      {a.distance}
                    </Tooltip>
                  </Marker>
                  <Marker position={[a.lat, a.lng]} icon={buildAttractionIcon(a.color, a.image, a.name)}>
                    <Popup>
                      <div className="rl-popup rl-popup-with-image">
                        {a.image && (
                          <div className="rl-popup-img-wrap" style={{ '--rl-c': a.color }}>
                            <img src={a.image} alt={a.name} className="rl-popup-img" loading="lazy" />
                            <span className="rl-popup-cat">{a.category}</span>
                          </div>
                        )}
                        <strong>{a.name}</strong>
                        <span className="rl-popup-meta">
                          <i className="fas fa-route" aria-hidden="true"></i> {a.distance} from resort
                        </span>
                        <span className="rl-popup-meta">
                          <i className="fas fa-car" aria-hidden="true"></i> {a.drive} drive
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                </Fragment>
              );
            })}

            <Marker position={resortPos} icon={resortIcon}>
              <Popup>
                <div className="rl-popup rl-popup-resort">
                  <strong>{RESORT.name}</strong>
                  <span className="rl-popup-meta">
                    <i className="fas fa-map-marker-alt" aria-hidden="true"></i> {RESORT.location}
                  </span>
                  <span className="rl-popup-meta">
                    <i className="fas fa-crosshairs" aria-hidden="true"></i> {RESORT.lat.toFixed(3)}°N, {RESORT.lng.toFixed(3)}°E
                  </span>
                </div>
              </Popup>
            </Marker>
          </MapContainer>

          <div className="attractions-legend" aria-label="Map legend">
            <div className="attractions-legend-title">Legend</div>
            <ul>
              {LEGEND.map((item) => (
                <li key={item.label}>
                  <span className="legend-dot" style={{ background: item.color }} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

