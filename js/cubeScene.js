function initCube() {
  const container = document.getElementById("cube-container");
  container.innerHTML = "";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Cube labels + page mapping
  const labels = [
    { text: "Projects", page: "projects.html" },
    { text: "Skills", page: "skills.html" },
    { text: "Experience", page: "experience.html" },
    { text: "Education", page: "education.html" },
    { text: "About", page: "about.html" },
    { text: "Contact", page: "contact.html" }
  ];

  // Create cube face textures
  const materials = labels.map(label => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#00ffff";
    ctx.font = "bold 28px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label.text, 128, 128);

    return new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) });
  });

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), materials);
  scene.add(cube);
  camera.position.z = 3;

  // Rotation
  let spinX = 0, spinY = 0.005, dragging = false, lx = 0, ly = 0;

  renderer.domElement.addEventListener("mousedown", e => {
    dragging = true;
    lx = e.clientX;
    ly = e.clientY;
  });

  window.addEventListener("mouseup", () => dragging = false);

  window.addEventListener("mousemove", e => {
    if (!dragging) return;
    spinY = (e.clientX - lx) * 0.005;
    spinX = (e.clientY - ly) * 0.005;
    lx = e.clientX;
    ly = e.clientY;
  });

  // Raycasting (FIXED)
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener("click", e => {
    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(cube);

    if (!hits.length) return;

    const faceIndex = Math.floor(hits[0].faceIndex / 2);
    const targetPage = labels[faceIndex].page;

    console.log("Opening:", targetPage);

    window.location.href = `pages/${targetPage}`;
  });

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += spinX;
    cube.rotation.y += spinY;
    renderer.render(scene, camera);
  }

  animate();
}
