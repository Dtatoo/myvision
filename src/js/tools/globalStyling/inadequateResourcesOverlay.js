let displayingDimensionsOverlay = false;

function validateClientBrowserDimensions() {
  console.log('logging');
  if (window.innerHeight < 500 || window.innerWidth < 800) {
    // code to not overwrite the overlay if already shown by browser support module
    const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
    if (inadequateClientResourcesOverlay.style.display === 'block') return;
    const inadequateClientResourcesOverlayText = document.getElementById('inadequate-client-resources-overlay-text');
    inadequateClientResourcesOverlayText.innerHTML = 'Minimum window size to use MyVision is 500 x 800 px';
    inadequateClientResourcesOverlayText.style.marginLeft = '-28px';
    inadequateClientResourcesOverlayText.style.maxWidth = 'none';
    // inadequateClientResourcesOverlay.style.display = 'block';
    // check whether the dist file has the new bundle
    inadequateClientResourcesOverlay.style.display = 'none';
    displayingDimensionsOverlay = true;
  } else {
    if (!displayingDimensionsOverlay) return;
    const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
    inadequateClientResourcesOverlay.style.display = 'none';
    displayingDimensionsOverlay = false;
  }
}

export { validateClientBrowserDimensions as default };