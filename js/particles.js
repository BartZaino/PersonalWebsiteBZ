const canvas = document.getElementById("animated-background");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const PARTICLE_COUNT = 60;
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    symbol: ["Σ","π","∫","∞","√","+","−","×"][Math.floor(Math.random()*8)]
  });
}

let particlePhase = "idle";
let targetX = 0, targetY = 0;

function drawParticles() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#FFFFF0";
  ctx.font = "16px monospace";
  particles.forEach(p => ctx.fillText(p.symbol,p.x,p.y));
}

function animateParticles() {
  drawParticles();
  particles.forEach(p => {
    if (particlePhase === "idle") {
      p.x += p.speedX; p.y += p.speedY;
    }
    if (particlePhase === "gather") {
      p.x += (targetX - p.x)*0.05;
      p.y += (targetY - p.y)*0.05;
    }
    if (particlePhase === "explode") {
      p.x += p.speedX*5;
      p.y += p.speedY*5;
    }

    if (particlePhase === "idle") {
      if (p.x<0) p.x=canvas.width;
      if (p.x>canvas.width) p.x=0;
      if (p.y<0) p.y=canvas.height;
      if (p.y>canvas.height) p.y=0;
    }
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

window.activateTV = function() {
  const btn = document.querySelector("#landing button");
  const rect = btn.getBoundingClientRect();
  targetX = rect.left + rect.width/2;
  targetY = rect.top + rect.height/2;

  particlePhase = "gather";

  setTimeout(() => {
    particlePhase = "explode";
    particles.forEach(p => {
      p.speedX = (Math.random()-0.5)*6;
      p.speedY = (Math.random()-0.5)*6;
    });
  }, 1500);

  setTimeout(() => {
    document.getElementById("landing").style.display = "none";
    document.getElementById("main-menu").style.display = "block";
    initCube();
  }, 2800);
};

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

