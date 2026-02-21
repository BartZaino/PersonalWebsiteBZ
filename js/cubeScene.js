function initCube() {
  const container = document.getElementById("cube-container");
  container.innerHTML = "";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const labels = [
    { text:"Projects", page:"projects.html" },
    { text:"Skills", page:"skills.html" },
    { text:"About", page:"about.html" },
    { text:"Experience", page:"experience.html" },
    { text:"Contact", page:"contact.html" },
    { text:"Education", page:"education.html" }
  ];

  const materials = labels.map(l => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const ctx = c.getContext("2d");

    const g = ctx.createLinearGradient(0,0,512,512);
    g.addColorStop(0,"#001f3f");
    g.addColorStop(1,"#003366");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,512,512);

    ctx.fillStyle = "gold";
    ctx.font = "bold 48px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(l.text,256,256);

    return new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(c),
      metalness: 0.7,
      roughness: 0.2
    });
  });

  const cube = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), materials);
  scene.add(cube);

  camera.position.z = 7;

  const light1 = new THREE.PointLight(0xffffff, 1);
  light1.position.set(5,5,5);
  scene.add(light1);
  scene.add(new THREE.AmbientLight(0x404040));

  let spinX=0, spinY=0.005, dragging=false, lx=0, ly=0;

  renderer.domElement.addEventListener("mousedown", e=>{
    dragging=true; lx=e.clientX; ly=e.clientY;
  });
  window.addEventListener("mouseup", ()=>dragging=false);
  window.addEventListener("mousemove", e=>{
    if(!dragging) return;
    spinY=(e.clientX-lx)*0.005;
    spinX=(e.clientY-ly)*0.005;
    lx=e.clientX; ly=e.clientY;
  });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener("click", e=>{
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObject(cube);

    if(hit.length){
      const face = Math.floor(hit[0].faceIndex / 2);
      const page = labels[face].page;
      console.log("Opening:", page);
      window.location.href = "pages/" + page;
    }
  });

  function animate(){
    requestAnimationFrame(animate);
    cube.rotation.x += spinX;
    cube.rotation.y += spinY;
    renderer.render(scene, camera);
  }
  animate();
}
