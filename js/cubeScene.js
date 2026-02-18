function initCube() {
  const container = document.getElementById("cube-container");
  container.innerHTML = "";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const labels = [
    { text:"Contact", target:"contact" },
    { text:"Experience", target:"experience" },
    { text:"Skills", target:"skills" },
    { text:"Projects", target:"projects" },
    { text:"About", target:"about" },
    { text:"Education", target:"education" }
  ];

  const materials = labels.map(l => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle="gold";
    ctx.fillRect(0,0,256,256);
    ctx.fillStyle="black";
    ctx.font="24px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText(l.text,128,128);
    return new THREE.MeshBasicMaterial({ map:new THREE.CanvasTexture(c) });
  });

  const cube = new THREE.Mesh(new THREE.BoxGeometry(), materials);
  scene.add(cube);
  camera.position.z = 3;

  let spinX=0, spinY=0.01, dragging=false, lx=0, ly=0;

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
    mouse.x=(e.clientX/renderer.domElement.clientWidth)*2-1;
    mouse.y=-(e.clientY/renderer.domElement.clientHeight)*2+1;
    raycaster.setFromCamera(mouse,camera);
    const hit=raycaster.intersectObject(cube);
    if(hit.length){
      const face=Math.floor(hit[0].faceIndex/2);
      showSection(labels[face].target);
    }
  });

  function animate(){
    requestAnimationFrame(animate);
    cube.rotation.x+=spinX;
    cube.rotation.y+=spinY;
    renderer.render(scene,camera);
  }
  animate();
}

