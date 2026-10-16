import * as THREE from "three";
export async function mountPlanet() {
  const canvas = document.querySelector("#planet");
  const stage = canvas.parentElement;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: devicePixelRatio < 2,
      powerPreference: "low-power",
    });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.z = 4.2;
  const loader = new THREE.TextureLoader();
  let day, night;
  try {
    [day, night] = await Promise.all([
      loader.loadAsync("/assets/earth-day.jpg"),
      loader.loadAsync("/assets/earth-night.png"),
    ]);
  } catch {
    renderer.dispose();
    return;
  }
  day.colorSpace = night.colorSpace = THREE.SRGBColorSpace;
  const globe = new THREE.Group();
  globe.rotation.z = -0.22;
  scene.add(globe);
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 48),
    new THREE.MeshPhongMaterial({
      map: day,
      emissiveMap: night,
      emissive: new THREE.Color("#f3ba6e"),
      emissiveIntensity: 0.38,
      shininess: 9,
      specular: new THREE.Color("#294755"),
    }),
  );
  sphere.rotation.y = 2.55;
  globe.add(sphere);
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.016, 48, 32),
    new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {},
      vertexShader:
        "varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}",
      fragmentShader:
        "varying vec3 vNormal; varying vec3 vPosition; void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),3.0);gl_FragColor=vec4(0.28,0.55,0.76,rim*0.58);}",
    }),
  );
  globe.add(atmosphere);
  scene.add(new THREE.AmbientLight("#728b9f", 0.14));
  const sunlight = new THREE.DirectionalLight("#f1ead5", 2.3);
  sunlight.position.set(-3, 2, 2);
  scene.add(sunlight);
  function resize() {
    const size = stage.clientWidth;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  let inView = true,
    paused = false,
    frame = 0,
    previous = 0;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  function draw(time) {
    frame = 0;
    if (document.hidden || !inView || motion.matches || paused) return;
    if (time - previous > 32) {
      sphere.rotation.y += 0.0007;
      renderer.render(scene, camera);
      previous = time;
    }
    frame = requestAnimationFrame(draw);
  }
  function resume() {
    if (!frame && !document.hidden && inView && !motion.matches && !paused)
      frame = requestAnimationFrame(draw);
  }
  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    resume();
  });
  visibility.observe(stage);
  document.addEventListener("visibilitychange", resume);
  motion.addEventListener("change", () => {
    if (motion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      stage.classList.remove("ready");
    } else {
      stage.classList.add("ready");
      resume();
    }
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    frame = 0;
    stage.classList.remove("ready");
  });
  const toggle = document.querySelector("#motion-toggle");
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    paused = !paused;
    toggle.textContent = paused ? "Resume globe" : "Pause globe";
    toggle.setAttribute("aria-pressed", String(paused));
    if (paused) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else resume();
  });
  renderer.render(scene, camera);
  stage.classList.add("ready");
  resume();
  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      sphere.geometry.dispose();
      sphere.material.dispose();
      atmosphere.geometry.dispose();
      atmosphere.material.dispose();
      day.dispose();
      night.dispose();
      renderer.dispose();
    },
    { once: true },
  );
}
