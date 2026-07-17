import React, { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Node & Wire Grid Config
    let nodes = [];
    let pulses = [];
    const maxPulses = 35;
    const spacing = 120; // grid spacing

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initGrid();
    };

    const initGrid = () => {
      nodes = [];
      pulses = [];
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;

      // Generate grid nodes with slight offsets for natural circuit look
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const offsetX = (Math.sin(r + c) * 20);
          const offsetY = (Math.cos(r - c) * 20);
          nodes.push({
            x: c * spacing + offsetX,
            y: r * spacing + offsetY,
            neighbors: [],
            id: nodes.length
          });
        }
      }

      // Connect adjacent nodes (horizontal, vertical, diagonal wires)
      nodes.forEach(node => {
        nodes.forEach(other => {
          if (node.id === other.id) return;
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < spacing * 1.5) {
            node.neighbors.push(other);
          }
        });
      });
    };

    const spawnPulse = () => {
      if (pulses.length >= maxPulses || nodes.length === 0) return;
      // Start pulse from a random node
      const startNode = nodes[Math.floor(Math.random() * nodes.length)];
      if (startNode.neighbors.length === 0) return;
      const nextNode = startNode.neighbors[Math.floor(Math.random() * startNode.neighbors.length)];

      pulses.push({
        currentX: startNode.x,
        currentY: startNode.y,
        startNode: startNode,
        targetNode: nextNode,
        speed: 1.5 + Math.random() * 2,
        progress: 0
      });
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Render loop
    const render = () => {
      const isLightTheme = document.body.classList.contains('light-theme');
      
      // Clear canvas with subtle trail effect
      ctx.fillStyle = isLightTheme ? 'rgba(240, 244, 248, 0.08)' : 'rgba(9, 11, 16, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Colors configuration based on theme
      const wireColor = isLightTheme ? 'rgba(0, 180, 220, 0.04)' : 'rgba(255, 255, 255, 0.025)';
      const nodeColor = isLightTheme ? 'rgba(0, 180, 220, 0.07)' : 'rgba(255, 255, 255, 0.05)';
      const pulseColor = isLightTheme ? '#00A8CC' : '#00E5FF';
      const secondaryPulseColor = isLightTheme ? '#8B5CF6' : '#FF2A55';

      // 1. Draw Wires (Circuit Lines)
      ctx.lineWidth = 1;
      ctx.strokeStyle = wireColor;
      ctx.beginPath();
      nodes.forEach(node => {
        node.neighbors.forEach(neighbor => {
          if (node.id < neighbor.id) { // Avoid drawing lines twice
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(neighbor.x, neighbor.y);
          }
        });
      });
      ctx.stroke();

      // 2. Draw Junction Nodes
      ctx.fillStyle = nodeColor;
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Update & Draw Pulses (Moving Lights in Wires)
      if (Math.random() < 0.15) spawnPulse(); // Randomly spawn new signals

      pulses.forEach((pulse, index) => {
        // Calculate current position
        const dx = pulse.targetNode.x - pulse.startNode.x;
        const dy = pulse.targetNode.y - pulse.startNode.y;
        const totalDist = Math.hypot(dx, dy);
        
        pulse.progress += pulse.speed;
        
        const ratio = Math.min(1, pulse.progress / totalDist);
        pulse.currentX = pulse.startNode.x + dx * ratio;
        pulse.currentY = pulse.startNode.y + dy * ratio;

        // Draw light packet
        ctx.shadowBlur = isLightTheme ? 6 : 12;
        ctx.shadowColor = index % 2 === 0 ? pulseColor : secondaryPulseColor;
        ctx.fillStyle = index % 2 === 0 ? pulseColor : secondaryPulseColor;

        ctx.beginPath();
        ctx.arc(pulse.currentX, pulse.currentY, isLightTheme ? 2.5 : 3, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;

        // If pulse reached target node
        if (ratio >= 1) {
          // 65% chance to continue traveling to a neighbor node
          const neighbors = pulse.targetNode.neighbors.filter(n => n.id !== pulse.startNode.id);
          if (neighbors.length > 0 && Math.random() < 0.65) {
            const nextTarget = neighbors[Math.floor(Math.random() * neighbors.length)];
            pulse.startNode = pulse.targetNode;
            pulse.targetNode = nextTarget;
            pulse.progress = 0;
          } else {
            // Remove pulse
            pulses.splice(index, 1);
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="animated-circuit-bg" />;
}
