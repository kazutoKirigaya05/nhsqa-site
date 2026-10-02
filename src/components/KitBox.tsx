const H = [0.17, 0.3, 0.5, 0.68, 0.92, 0.92, 0.6, 0.42, 0.24, 0.14];

/** The kit's mailer box, drawn at an angle with the bell-curve bars on the lid. */
export function KitBox() {
  // front face 300 × 96, depth vector (86, -70)
  const ox = 30, oy = 190, w = 300, h = 96, dx = 86, dy = -70;
  return (
    <svg viewBox="0 0 450 310" role="img" aria-label="The Market Game kit box: a kraft mailer box with grey and yellow bars on the lid">
      <polygon points={`${ox + w},${oy} ${ox + w + dx},${oy + dy} ${ox + w + dx},${oy + dy + h} ${ox + w},${oy + h}`} fill="#a9825a" stroke="var(--pencil)" strokeWidth={1.5} strokeLinejoin="round" />
      <rect x={ox} y={oy} width={w} height={h} fill="#bf9870" stroke="var(--pencil)" strokeWidth={1.5} />
      <polygon points={`${ox},${oy} ${ox + dx},${oy + dy} ${ox + w + dx},${oy + dy} ${ox + w},${oy}`} fill="var(--kraft)" stroke="var(--pencil)" strokeWidth={1.5} strokeLinejoin="round" />
      <path d={`M${ox + w / 2 - 20},${oy} a20,16 0 0 0 40,0`} fill="#8f6c47" stroke="var(--pencil)" strokeWidth={1.5} />
      <g transform={`matrix(${w} 0 ${dx} ${dy} ${ox} ${oy})`}>
        {H.map((v, i) => (
          <rect key={i} x={0.14 + i * 0.074} y={0.2} width={0.052} height={v * 0.62} fill={i === 4 || i === 5 ? "#f5b81f" : "#74777e"} />
        ))}
      </g>
    </svg>
  );
}
