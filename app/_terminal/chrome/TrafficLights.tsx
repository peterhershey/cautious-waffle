/** macOS window traffic lights. Real OS colors (not palette tokens) so they
 *  read as "an operating system", not as our brand. Decorative. */
export function TrafficLights() {
  return (
    <div className="term-lights" aria-hidden="true">
      <span className="term-light" style={{ background: "#ff5f57" }} />
      <span className="term-light" style={{ background: "#febc2e" }} />
      <span className="term-light" style={{ background: "#28c840" }} />
    </div>
  );
}
