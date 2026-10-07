"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

export default function LetterGlitch({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
}) {
  const canvasRef = useRef(null);
  const optsRef = useRef({
    glitchColors,
    glitchSpeed,
    centerVignette,
    outerVignette,
    smooth,
  });

  
  useEffect(() => {
    optsRef.current = {
      glitchColors,
      glitchSpeed,
      centerVignette,
      outerVignette,
      smooth,
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const SIZE = 16;
    let animId;
    let lastTime = 0;
    let cols = 0;
    let rows = 0;
    let grid = [];

    const rChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];
    const rColor = () => {
      const colors = optsRef.current.glitchColors;
      return colors[Math.floor(Math.random() * colors.length)];
    }; 
    const render = () => {
      if (!rows || !cols) return;
      const { outerVignette: outer, centerVignette: center } = optsRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${SIZE}px monospace`;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];
          ctx.fillStyle = cell.color;
          ctx.fillText(cell.char, c * SIZE, (r + 1) * SIZE);
        }
      }

      if (outer) {
        const r = Math.max(canvas.width, canvas.height);
        const g = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, r * 0.2,
          canvas.width / 2, canvas.height / 2, r * 0.85
        );
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, "rgba(0,0,0,0.96)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (center) {
        const r = Math.max(canvas.width, canvas.height);
        const g = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, r * 0.5
        );
        g.addColorStop(0, "rgba(0,0,0,0.88)");
        g.addColorStop(0.45, "rgba(0,0,0,0.25)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) return;
    
      if (canvas.width === w && canvas.height === h) return;

      
      canvas.width = w;
      canvas.height = h;

      const nextCols = Math.ceil(w / SIZE);
      const nextRows = Math.ceil(h / SIZE);
      
      const prev = grid;
      grid = Array.from({ length: nextRows }, (_, r) =>
        Array.from(
          { length: nextCols },
          (_, c) =>
            (prev[r] && prev[r][c]) || { char: rChar(), color: rColor() }
        )
      );
      cols = nextCols;
      rows = nextRows;

      
      render();
    };

    const draw = (ts) => {
      animId = requestAnimationFrame(draw);
      const { glitchSpeed: speed, smooth: isSmooth } = optsRef.current;
      if (ts - lastTime < speed) return;
      lastTime = ts;
      if (!rows || !cols) return;

      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!isSmooth || Math.random() < 0.03) {
            const cell = grid[r][c];
            cell.char = rChar();
            cell.color = rColor();
          }
        }
      }

      render();
    };

    resize();
const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    }; 
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}