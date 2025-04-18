class InspirationBoard {
    constructor() {
      this.searchBtn = document.getElementById('pexels-search-btn');
      this.searchInput = document.getElementById('pexels-search');
      this.resultsContainer = document.getElementById('pexels-results');
      this.loadingIndicator = document.getElementById('pexels-loading');
      
      this.initializeEvents();
      this.searchPexels('art'); // Default search on load
    }
  
    initializeEvents() {
      this.searchBtn.addEventListener('click', () => this.searchPexels());
      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.searchPexels();
      });
    }
  
    async searchPexels(defaultQuery = null) {
      const query = defaultQuery || this.searchInput.value.trim();
      this.showLoading(true);
      this.clearResults();
  
      try {
        const response = await fetch('/drawings/search_pexels', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
          },
          body: JSON.stringify({ query })
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'API request failed');
        }
  
        // No need to parse again - data is already parsed
        if (!data.photos || data.photos.length === 0) {
          throw new Error('No images found');
        }
  
        this.displayResults(data.photos);
      } catch (error) {
        console.error('Search error:', error);
        this.resultsContainer.innerHTML = `
          <div class="error-message">
            ${error.message}<br>
            <small>Try a different search term</small>
          </div>
        `;
      } finally {
        this.showLoading(false);
      }
    }
  
    displayResults(photos) {
      if (!photos?.length) {
        this.resultsContainer.innerHTML = '<p>No images found. Try a different search.</p>';
        return;
      }
  
      photos.forEach(photo => {
        const imgCard = document.createElement('div');
        imgCard.className = 'image-card';
        imgCard.innerHTML = `
          <img src="${photo.src.medium}" 
               alt="Photo by ${photo.photographer}"
               data-large-src="${photo.src.large}"
               class="inspiration-img">
          <div class="image-credit">Photo by ${photo.photographer}</div>
        `;
        imgCard.addEventListener('click', () => this.handleImageSelect(photo));
        this.resultsContainer.appendChild(imgCard);
      });
    }
  
    handleImageSelect(photo) {
      // Implement what happens when an image is clicked
      console.log('Selected photo:', photo);
      // Example: Could set as canvas background or reference
    }
  
    showLoading(show) {
      this.loadingIndicator.style.display = show ? 'block' : 'none';
    }
  
    clearResults() {
      this.resultsContainer.innerHTML = '';
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new InspirationBoard();
  });
  