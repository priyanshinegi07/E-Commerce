document.addEventListener("DOMContentLoaded", function() {
    const loadingOverlay = document.getElementById("loading-overlay");
  
    // Show the loading spinner when the page starts loading
    loadingOverlay.style.display = "flex";
  
    // Hide the loading spinner when the page is fully loaded
    window.addEventListener("load", function() {
      loadingOverlay.style.display = "none";
    });
  });

