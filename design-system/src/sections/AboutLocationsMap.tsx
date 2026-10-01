import { useEffect, useRef } from 'react';
import { ROK_PATH, ROK_ISLANDS_PATH } from './koreaCoastline';

export interface AboutLocationsMapProps {
  /** City names in this order: Gwangju, Jangseong, Goheung. */
  labels: string[];
}

// Same Mercator projection as .design-sync/generate-korea-map.py. These are
// approximate city centers, deliberately not coordinates of company facilities.
function cityPoint(longitude: number, latitude: number) {
  const x = 17.946886061743193 * longitude - 2213.627427532487;
  const y = -1028.132034673909 * Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360)) + 861.8836301237753;
  return { x: 14 + x * 3.2, y: -300 + y * 3.2 };
}

const gwangju = cityPoint(126.8526, 35.1595);
const jangseong = cityPoint(126.7849, 35.3018);
const goheung = cityPoint(127.2849, 34.6112);
const jangseongLeader = `M${jangseong.x},${jangseong.y} L179,250 H44`;
const gwangjuLeader = `M${gwangju.x},${gwangju.y} L182,325 H44`;

/** City-level view of ICARUS's development locations, including its future site. */
export function AboutLocationsMap({ labels }: AboutLocationsMapProps) {
  const mapRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    let visible = false;
    const sync = () => { map.dataset.running = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(map);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <figure className="ds-about-location-figure" onDragStart={event => event.preventDefault()}>
      <svg ref={mapRef} className="ds-about-location-map" viewBox="0 0 550 490" fill="none" aria-hidden="true" focusable="false">
        <g transform="translate(14 -300) scale(3.2)" fill="#111f30" stroke="#36506a" strokeWidth="0.34" strokeLinejoin="round">
          <path d={ROK_PATH} />
          <path d={ROK_ISLANDS_PATH} />
        </g>

        <g stroke="#8fd8ff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d={jangseongLeader} opacity="0.65" />
          <path d={gwangjuLeader} opacity="0.65" />
        </g>
        <path d={`M${goheung.x},${goheung.y} L285,392 H474`} stroke="#8293a9" strokeWidth="1" strokeDasharray="4 5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />

        <g className="ds-about-location-activity" stroke="#a6e4ff" strokeWidth="1" pointerEvents="none">
          {[gwangju, jangseong].map((point, index) => (
            <g key={index}>
              {[0, 1].map(ring => (
                <circle key={ring} className="ds-about-location-ripple" cx={point.x} cy={point.y} r="5"
                  style={{ animationDelay: `${-index * .9 - ring * 1.8}s` }} />
              ))}
            </g>
          ))}
        </g>

        <g fill="#8fd8ff" stroke="#02030a" strokeWidth="2">
          <circle className="ds-about-location-active-node" cx={gwangju.x} cy={gwangju.y} r="4.5" />
          <circle className="ds-about-location-active-node" cx={jangseong.x} cy={jangseong.y} r="4.5" />
        </g>
        <circle cx={goheung.x} cy={goheung.y} r="5" fill="#111f30" stroke="#a8b6c8" strokeWidth="1.5" />
        <circle cx={goheung.x} cy={goheung.y} r="11" stroke="#8293a9" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.6" />

        <g fontFamily="Pretendard, sans-serif" fontSize="17" fontWeight="500" letterSpacing="0.1">
          <text x="44" y="238" fill="#dcecff">{labels[1]}</text>
          <text x="44" y="313" fill="#dcecff">{labels[0]}</text>
          <text x="474" y="380" textAnchor="end" fill="#b1becf">{labels[2]}</text>
        </g>

        <g stroke="#58718b" strokeWidth="0.8" opacity="0.65">
          <path d="M45 55 V91 M39 61 L45 55 L51 61 M32 78 H58" />
          <path d="M491 445 H514 M514 422 V445" />
        </g>
        <text x="45" y="44" textAnchor="middle" fill="#7f97b0" fontFamily="IBM Plex Mono, monospace" fontSize="10">N</text>
      </svg>
    </figure>
  );
}
