(function initMagicBrushBackground() {
  const canvas = document.getElementById("webgl-canvas");
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 52;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Keep counts moderate so the effect stays smooth on typical laptops and phones.
  const particleCount = window.innerWidth < 700 ? 1400 : 2400;
  const basePositions = new Float32Array(particleCount * 3);
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i += 1) {
    const i3 = i * 3;
    const radius = 8 + Math.random() * 34;
    const angle = Math.random() * Math.PI * 2;
    const spread = (Math.random() - 0.5) * 26;

    const x = Math.cos(angle) * radius + spread * 0.22;
    const y = Math.sin(angle) * radius + spread;
    const z = (Math.random() - 0.5) * 32;

    basePositions[i3] = x;
    basePositions[i3 + 1] = y;
    basePositions[i3 + 2] = z;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    colors[i3] = 1;
    colors[i3 + 1] = 0.15 + Math.random() * 0.18;
    colors[i3 + 2] = 0.12 + Math.random() * 0.1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: window.innerWidth < 700 ? 0.18 : 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, material);
  particles.rotation.x = Math.PI * 0.08;
  scene.add(particles);

  const pointer = new THREE.Vector2(999, 999);
  const smoothedPointer = new THREE.Vector2(999, 999);

  function onPointerMove(clientX, clientY) {
    pointer.x = (clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(clientY / window.innerHeight) * 2 + 1;
  }

  window.addEventListener("mousemove", (event) => {
    onPointerMove(event.clientX, event.clientY);
  });

  window.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    if (touch) onPointerMove(touch.clientX, touch.clientY);
  }, { passive: true });

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();
    smoothedPointer.lerp(pointer, 0.08);

    const targetX = smoothedPointer.x * 18;
    const targetY = smoothedPointer.y * 10;

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];

      const px = positions[i3];
      const py = positions[i3 + 1];
      const pz = positions[i3 + 2];

      const dx = px - targetX;
      const dy = py - targetY;
      const distance = Math.sqrt(dx * dx + dy * dy) + 0.001;
      // The pointer acts like a glowing brush: nearby particles swirl, then settle back.
      const influence = Math.max(0, 7.5 - distance);
      const swirl = 0.0008 * influence;

      velocities[i3] += ((-dy / distance) * influence * 0.008) + Math.sin(elapsed + i * 0.1) * swirl;
      velocities[i3 + 1] += ((dx / distance) * influence * 0.008) + Math.cos(elapsed + i * 0.14) * swirl;
      velocities[i3 + 2] += Math.sin(elapsed * 0.7 + i * 0.05) * 0.0016;

      positions[i3] += velocities[i3] + (bx - px) * 0.024;
      positions[i3 + 1] += velocities[i3 + 1] + (by - py) * 0.024;
      positions[i3 + 2] += velocities[i3 + 2] + (bz - pz) * 0.02;

      velocities[i3] *= 0.92;
      velocities[i3 + 1] *= 0.92;
      velocities[i3 + 2] *= 0.9;

      positions[i3] += Math.sin(elapsed * 0.28 + i * 0.014) * 0.01;
      positions[i3 + 1] += Math.cos(elapsed * 0.32 + i * 0.012) * 0.01;
    }

    geometry.attributes.position.needsUpdate = true;
    particles.rotation.z = Math.sin(elapsed * 0.08) * 0.08;
    particles.position.x += ((pointer.x * 2.6) - particles.position.x) * 0.03;
    particles.position.y += ((pointer.y * 1.8) - particles.position.y) * 0.03;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    material.size = window.innerWidth < 700 ? 0.18 : 0.22;
  });
})();
