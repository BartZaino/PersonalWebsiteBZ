document.addEventListener("DOMContentLoaded", () => {

  window.showSection = function(id) {
    document.querySelectorAll("section").forEach(s => s.style.display = "none");
    const target = document.getElementById(id);
    if (target) target.style.display = "block";
  };

});

