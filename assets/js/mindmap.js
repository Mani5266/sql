/* ============================================
   SQLSENSEI — Mind Map (Radial SVG)
   Renders the curriculum as a central node with
   5 level branches, each fanning out into modules.
   ============================================ */

(function () {
  'use strict';

  function renderMindMap(containerId, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container || !window.CURRICULUM) return;

    const progress = window.getProgress ? window.getProgress() : { completed: [], current: '1.1' };
    const completed = new Set(progress.completed || []);
    const current = progress.current || '1.1';

    const W = 1200;
    const H = 760;
    const cx = W / 2;
    const cy = H / 2;
    const innerR = 80;     // Center node radius
    const levelR = 220;    // Level node distance from center
    const moduleR = 350;   // Module node distance from center

    const levels = window.CURRICULUM;
    const levelCount = levels.length;
    // We arrange levels in an arc from -150deg to +150deg (top-leaning fan)
    // Actually, full circle for symmetry: -90 (top) going clockwise.
    const startAngle = -Math.PI / 2;     // start at top
    const totalAngle = Math.PI * 2;      // full circle

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'mindmap-svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Defs (gradients)
    svg.innerHTML = `
      <defs>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#22d3ee"/>
          <stop offset="100%" stop-color="#0891b2"/>
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    `;

    // Calculate angles for each level (evenly spaced on circle)
    const levelAngles = levels.map((_, i) => startAngle + (i / levelCount) * totalAngle);

    // ====== Draw all links first (so nodes appear on top) ======
    levels.forEach((level, li) => {
      const angle = levelAngles[li];
      const lx = cx + Math.cos(angle) * levelR;
      const ly = cy + Math.sin(angle) * levelR;

      // Link: center → level node
      const isLevelActive = level.modules.some(m => completed.has(m.id) || m.id === current);
      const centerLink = document.createElementNS(svgNS, 'path');
      centerLink.setAttribute('d', curvePath(cx, cy, lx, ly));
      centerLink.setAttribute('class', `mindmap-link ${isLevelActive ? 'active' : ''}`);
      svg.appendChild(centerLink);

      // Module fan: spread the modules in an arc around the level angle
      const moduleCount = level.modules.length;
      const fanWidth = Math.PI / 3.5; // ~50° fan
      const fanStart = angle - fanWidth / 2;
      const fanStep = moduleCount > 1 ? fanWidth / (moduleCount - 1) : 0;

      level.modules.forEach((mod, mi) => {
        const mAngle = moduleCount > 1 ? fanStart + mi * fanStep : angle;
        const mx = cx + Math.cos(mAngle) * moduleR;
        const my = cy + Math.sin(mAngle) * moduleR;

        const isComp = completed.has(mod.id);
        const isCur = mod.id === current;

        const link = document.createElementNS(svgNS, 'path');
        link.setAttribute('d', curvePath(lx, ly, mx, my));
        link.setAttribute('class', `mindmap-link ${isComp || isCur ? 'active' : ''}`);
        svg.appendChild(link);

        // Store for second pass
        mod._x = mx; mod._y = my; mod._level = level;
      });

      level._x = lx; level._y = ly;
    });

    // ====== Draw level nodes ======
    levels.forEach((level) => {
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('class', 'mindmap-node');
      g.setAttribute('transform', `translate(${level._x}, ${level._y})`);
      g.style.cursor = 'pointer';
      g.addEventListener('click', () => {
        window.location.href = `chat.html?module=${level.modules[0].id}`;
      });

      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('r', 38);
      circle.setAttribute('fill', level.color);
      circle.setAttribute('opacity', '0.15');
      circle.setAttribute('stroke', level.color);
      circle.setAttribute('stroke-width', '1.5');
      g.appendChild(circle);

      const inner = document.createElementNS(svgNS, 'circle');
      inner.setAttribute('r', 26);
      inner.setAttribute('fill', '#0b0f17');
      inner.setAttribute('stroke', level.color);
      inner.setAttribute('stroke-width', '2');
      g.appendChild(inner);

      const lvlNum = document.createElementNS(svgNS, 'text');
      lvlNum.setAttribute('class', 'mindmap-level-label');
      lvlNum.setAttribute('y', '-2');
      lvlNum.setAttribute('fill', level.color);
      lvlNum.textContent = `L${level.number}`;
      g.appendChild(lvlNum);

      const lvlTitle = document.createElementNS(svgNS, 'text');
      lvlTitle.setAttribute('class', 'mindmap-node-sub');
      lvlTitle.setAttribute('y', '14');
      lvlTitle.setAttribute('fill', '#cbd5e1');
      lvlTitle.textContent = level.title.toUpperCase();
      g.appendChild(lvlTitle);

      svg.appendChild(g);
    });

    // ====== Draw module nodes ======
    levels.forEach((level) => {
      level.modules.forEach((mod) => {
        const g = document.createElementNS(svgNS, 'g');
        const isComp = completed.has(mod.id);
        const isCur = mod.id === current;
        g.setAttribute('class', `mindmap-node ${isComp ? 'completed' : ''} ${isCur ? 'current' : ''}`);
        g.setAttribute('transform', `translate(${mod._x}, ${mod._y})`);
        g.style.cursor = 'pointer';
        g.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.href = `chat.html?module=${mod.id}`;
        });

        // Truncate label to fit box
        const labelText = truncate(mod.title, 18);
        const boxW = Math.max(120, labelText.length * 7.5);
        const boxH = 44;

        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('class', 'mindmap-node-rect');
        rect.setAttribute('x', -boxW / 2);
        rect.setAttribute('y', -boxH / 2);
        rect.setAttribute('width', boxW);
        rect.setAttribute('height', boxH);
        rect.setAttribute('rx', 10);
        g.appendChild(rect);

        const sub = document.createElementNS(svgNS, 'text');
        sub.setAttribute('class', 'mindmap-node-sub');
        sub.setAttribute('y', -7);
        sub.setAttribute('fill', level.color);
        sub.textContent = `MODULE ${mod.id}`;
        g.appendChild(sub);

        const label = document.createElementNS(svgNS, 'text');
        label.setAttribute('class', 'mindmap-node-label');
        label.setAttribute('y', 10);
        label.textContent = labelText;
        g.appendChild(label);

        // Tooltip on hover (native)
        const title = document.createElementNS(svgNS, 'title');
        title.textContent = `${mod.id} — ${mod.title}\n${mod.topic}`;
        g.appendChild(title);

        svg.appendChild(g);
      });
    });

    // ====== Center node ======
    const centerG = document.createElementNS(svgNS, 'g');
    centerG.setAttribute('transform', `translate(${cx}, ${cy})`);

    const centerOuter = document.createElementNS(svgNS, 'circle');
    centerOuter.setAttribute('r', innerR);
    centerOuter.setAttribute('fill', 'rgba(34, 211, 238, 0.08)');
    centerOuter.setAttribute('stroke', 'rgba(34, 211, 238, 0.3)');
    centerOuter.setAttribute('stroke-width', '1');
    centerG.appendChild(centerOuter);

    const centerInner = document.createElementNS(svgNS, 'circle');
    centerInner.setAttribute('class', 'mindmap-center');
    centerInner.setAttribute('r', 56);
    centerG.appendChild(centerInner);

    const centerLabel = document.createElementNS(svgNS, 'text');
    centerLabel.setAttribute('class', 'mindmap-center-label');
    centerLabel.setAttribute('y', -4);
    centerLabel.textContent = 'SQL';
    centerG.appendChild(centerLabel);

    const centerSub = document.createElementNS(svgNS, 'text');
    centerSub.setAttribute('class', 'mindmap-center-label');
    centerSub.setAttribute('y', 14);
    centerSub.setAttribute('font-size', '9');
    centerSub.setAttribute('opacity', '0.7');
    centerSub.textContent = 'SENSEI';
    centerG.appendChild(centerSub);

    svg.appendChild(centerG);

    // Mount + legend
    container.innerHTML = '';
    container.appendChild(svg);

    if (!opts.noLegend) {
      const legend = document.createElement('div');
      legend.className = 'mindmap-legend';
      legend.innerHTML = `
        <div class="mindmap-legend-item">
          <span class="mindmap-legend-swatch" style="background: rgba(52,211,153,0.1); border-color: var(--emerald-400);"></span>
          Completed
        </div>
        <div class="mindmap-legend-item">
          <span class="mindmap-legend-swatch" style="background: rgba(251,191,36,0.1); border-color: var(--amber-400);"></span>
          Current module
        </div>
        <div class="mindmap-legend-item">
          <span class="mindmap-legend-swatch" style="background: var(--bg-2); border-color: var(--line-strong);"></span>
          Locked / upcoming
        </div>
        <div class="mindmap-legend-item" style="margin-left: auto; color: var(--ink-400);">
          Click any node to open that lesson →
        </div>
      `;
      container.appendChild(legend);
    }
  }

  // Smooth quadratic curve between two points (bows away from center)
  function curvePath(x1, y1, x2, y2) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    // Pull control point slightly toward midpoint perpendicular to keep curve organic
    const dx = x2 - x1;
    const dy = y2 - y1;
    const perpX = -dy * 0.15;
    const perpY = dx * 0.15;
    return `M ${x1} ${y1} Q ${mx + perpX} ${my + perpY} ${x2} ${y2}`;
  }

  function truncate(s, n) {
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  }

  window.renderMindMap = renderMindMap;
})();
