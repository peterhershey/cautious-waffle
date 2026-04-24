"use client";

/**
 * Inline SVG defs for the gel's organic turbulence filter. The
 * ::before pseudo on .proto-phone-screen applies `filter: url(#gel-turb)`
 * to get continuously morphing displacement — a single amorphous mass
 * rather than discrete glow motes. GelControls writes the displacement
 * scale (strength) and turbulence duration directly onto the animated
 * SVG nodes by id.
 */
export function GelFilter() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <defs>
        <filter
          id="gel-turb"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.010 0.014"
            numOctaves="2"
            seed="3"
            result="noise"
          >
            <animate
              id="gel-turb-anim"
              attributeName="baseFrequency"
              dur="14s"
              values="0.006 0.010;0.020 0.024;0.010 0.014;0.006 0.010"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </feTurbulence>
          <feDisplacementMap
            id="gel-displace"
            in="SourceGraphic"
            in2="noise"
            scale="100"
          />
        </filter>
      </defs>
    </svg>
  );
}
