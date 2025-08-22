// Dynamic Graphic Design Portfolio
class DesignPortfolio {
    constructor() {
        this.designs = [];
        this.filteredDesigns = [];
        this.currentFilter = 'all';
        this.categories = new Set(['all']);
        this.init();
    }

    async init() {
        await this.scanDesignsFolder();
        this.renderGallery();
        this.createFilterButtons();
        this.setupEventListeners();
        this.setupAutoRefresh();
    }

    async scanDesignsFolder() {
        try {
            // This function simulates scanning the images folder
            // In a real server environment, this would be handled by a backend API
            console.log('Scanning designs folder...');
            
            // Get all image files from your folder (simulated)
            const imageFiles = this.getAvailableDesignFiles();
            
            this.designs = imageFiles.map((file, index) => ({
                src: file,
                title: `Design ${index + 1}`,
                category: this.detectCategory(file),
                id: index
            }));
            
            // Extract unique categories
            this.designs.forEach(design => {
                this.categories.add(design.category);
            });
            
            console.log(`Found ${this.designs.length} design files`);
            
        } catch (error) {
            console.error('Error scanning designs folder:', error);
        }
    }

    getAvailableDesignFiles() {
        // This returns all design files in your images folder
        // These are your actual graphic design files
        return [
            'images/D1.png',
            'images/D2.png',
            'images/D3.png',
            'images/D4.png',
            'images/D5.png',
            'images/D6.png'
        ];
    }

    detectCategory(filename) {
        // Simple category detection based on filename patterns
        const name = filename.toLowerCase();
        if (name.includes('logo') || name.includes('brand')) return 'branding';
        if (name.includes('web') || name.includes('ui')) return 'web-design';
        if (name.includes('print') || name.includes('poster')) return 'print';
        if (name.includes('social') || name.includes('media')) return 'social-media';
        if (name.includes('illustration') || name.includes('art')) return 'illustration';
        return 'graphic-design';
    }

    renderGallery() {
        const galleryContainer = document.querySelector('.box');
        const heading = document.querySelector('.heading h3');
        
        if (!galleryContainer) return;

        // Update heading
        if (heading) {
            heading.innerHTML = `Design <span>Portfolio</span>`;
        }

        galleryContainer.innerHTML = '';
        
        // Filter designs based on current selection
        this.filteredDesigns = this.currentFilter === 'all' 
            ? this.designs 
            : this.designs.filter(design => design.category === this.currentFilter);

        if (this.filteredDesigns.length === 0) {
            galleryContainer.innerHTML = `
                <div class="no-designs">
                    <p>No designs found in the ${this.currentFilter} category.</p>
                    <p>Add your graphic design files to the images folder!</p>
                </div>
            `;
            return;
        }

        // Create responsive columns
        const columns = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
        const itemsPerColumn = Math.ceil(this.filteredDesigns.length / columns);
        
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'dream design-column';
            
            const startIndex = i * itemsPerColumn;
            const endIndex = Math.min(startIndex + itemsPerColumn, this.filteredDesigns.length);
            
            for (let j = startIndex; j < endIndex; j++) {
                const design = this.filteredDesigns[j];
                const designElement = this.createDesignElement(design);
                column.appendChild(designElement);
            }
            
            galleryContainer.appendChild(column);
        }
    }

    createDesignElement(design) {
        const designDiv = document.createElement('div');
        designDiv.className = 'design-item';
        designDiv.dataset.category = design.category;
        
        designDiv.innerHTML = `
            <div class="design-card">
                <img src="${design.src}" alt="${design.title}" loading="lazy" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRlc2lnbiBJbWFnZTwvdGV4dD48L3N2Zz4='">
                <div class="design-overlay">
                    <div class="design-info">
                        <h4>${design.title}</h4>
                        <span class="design-category">${design.category}</span>
                    </div>
                </div>
            </div>
        `;
        
        designDiv.addEventListener('click', () => {
            this.openLightbox(design);
        });
        
        return designDiv;
    }

    createFilterButtons() {
        const filterContainer = document.querySelector('.heading');
        if (!filterContainer || this.categories.size <= 1) return;

        const filterDiv = document.createElement('div');
        filterDiv.className = 'design-filters';
        
        filterDiv.innerHTML = `
            <div class="filter-buttons">
                ${Array.from(this.categories).map(category => `
                    <button class="filter-btn ${this.currentFilter === category ? 'active' : ''}" 
                            data-filter="${category}">
                        ${category.replace('-', ' ').toUpperCase()}
                    </button>
                `).join('')}
            </div>
        `;
        
        filterContainer.appendChild(filterDiv);
    }

    openLightbox(design) {
        // Remove any existing lightbox
        const existingLightbox = document.querySelector('.lightbox');
        if (existingLightbox) {
            document.body.removeChild(existingLightbox);
        }

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close">&times;</span>
                <div class="lightbox-image">
                    <img src="${design.src}" alt="${design.title}">
                </div>
                <div class="lightbox-info">
                    <h3>${design.title}</h3>
                    <p class="design-category-badge">${design.category}</p>
                    <div class="lightbox-actions">
                        <button class="download-btn">Download</button>
                        <button class="prev-btn">← Previous</button>
                        <button class="next-btn">Next →</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Add event listeners
        lightbox.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                document.body.removeChild(lightbox);
            }
        });

        // Navigation buttons
        const currentIndex = this.filteredDesigns.findIndex(d => d.id === design.id);
        
        lightbox.querySelector('.prev-btn').addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + this.filteredDesigns.length) % this.filteredDesigns.length;
            document.body.removeChild(lightbox);
            this.openLightbox(this.filteredDesigns[prevIndex]);
        });

        lightbox.querySelector('.next-btn').addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % this.filteredDesigns.length;
            document.body.removeChild(lightbox);
            this.openLightbox(this.filteredDesigns[nextIndex]);
        });

        lightbox.querySelector('.download-btn').addEventListener('click', () => {
            this.downloadDesign(design);
        });
    }

    async downloadDesign(design) {
        // Store the current design for the password callback
        this.currentDownloadDesign = design;
        
        // Show password modal instead of using prompt()
        this.showPasswordModal();
    }

    showPasswordModal() {
        const modal = document.getElementById('passwordModal');
        const passwordInput = document.getElementById('passwordInput');
        const confirmBtn = document.getElementById('confirmPassword');
        const cancelBtn = document.getElementById('cancelPassword');
        const closeBtn = document.querySelector('.close-modal');
        const errorMsg = document.getElementById('passwordError');

        // Reset modal state
        passwordInput.value = '';
        errorMsg.style.display = 'none';
        modal.style.display = 'flex';

        // Event handlers
        const handleConfirm = () => {
            const password = passwordInput.value.trim();
            
            if (password === '') {
                errorMsg.textContent = 'Please enter a password';
                errorMsg.style.display = 'block';
                return;
            }

            // Simple password check (you can change this to any password you want)
            if (password !== 'design2025') {
                errorMsg.textContent = 'Incorrect password. Please try again.';
                errorMsg.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
                return;
            }

            // Password is correct, proceed with download
            this.hidePasswordModal();
            this.processDownload(this.currentDownloadDesign);
        };

        const handleCancel = () => {
            this.hidePasswordModal();
            console.log('Download cancelled by user');
        };

        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleConfirm();
            } else if (e.key === 'Escape') {
                handleCancel();
            }
        };

        // Add event listeners
        confirmBtn.onclick = handleConfirm;
        cancelBtn.onclick = handleCancel;
        closeBtn.onclick = handleCancel;
        passwordInput.onkeydown = handleKeyPress;

        // Focus on input
        setTimeout(() => passwordInput.focus(), 100);
    }

    hidePasswordModal() {
        const modal = document.getElementById('passwordModal');
        modal.style.display = 'none';
        
        // Clean up event listeners
        const confirmBtn = document.getElementById('confirmPassword');
        const cancelBtn = document.getElementById('cancelPassword');
        const closeBtn = document.querySelector('.close-modal');
        const passwordInput = document.getElementById('passwordInput');

        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
        closeBtn.onclick = null;
        passwordInput.onkeydown = null;
    }

    async processDownload(design) {
        try {
            console.log('Starting download for:', design.src);
            
            // Fetch the image to ensure it's accessible
            const response = await fetch(design.src, {
                mode: 'cors',
                cache: 'no-cache'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
            }
            
            // Convert to blob
            const blob = await response.blob();
            console.log('Image blob created successfully');
            
            // Create a temporary link for download
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            // Extract filename from the path and use it for download
            const filename = design.src.split('/').pop();
            link.href = url;
            link.download = filename || 'design.png';
            link.style.display = 'none';
            
            document.body.appendChild(link);
            
            // Trigger download
            link.click();
            console.log('Download triggered for:', filename);
            
            // Show success message
            alert(`Download started for: ${filename}`);
            
            // Clean up - use requestAnimationFrame for better timing
            requestAnimationFrame(() => {
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    console.log('Download cleanup completed');
                }, 100);
            });
            
        } catch (error) {
            console.error('Download failed:', error);
            
            // More specific error messages
            if (error.message.includes('Failed to fetch')) {
                alert('Download failed: Could not access the image file. Please check if the file exists and is accessible.');
            } else if (error.message.includes('network')) {
                alert('Download failed: Network error. Please check your internet connection.');
            } else {
                alert('Download failed. Please try again later.');
            }
        }
    }

    setupEventListeners() {
        // Filter button events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filter = e.target.dataset.filter;
                this.currentFilter = filter;
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                this.renderGallery();
            }
        });

        // Responsive layout on resize
        window.addEventListener('resize', () => {
            this.renderGallery();
        });
    }

    setupAutoRefresh() {
        // Check for new designs every 30 seconds
        setInterval(() => {
            this.scanDesignsFolder().then(() => {
                if (this.designs.length !== this.filteredDesigns.length) {
                    this.renderGallery();
                    console.log('Gallery refreshed with new designs');
                }
            });
        }, 30000);
    }

    // Public method to manually refresh
    refreshPortfolio() {
        this.scanDesignsFolder().then(() => this.renderGallery());
    }
}

// Initialize portfolio
document.addEventListener('DOMContentLoaded', () => {
    window.designPortfolio = new DesignPortfolio();
});

// Global refresh function
function refreshDesigns() {
    if (window.designPortfolio) {
        window.designPortfolio.refreshPortfolio();
    }
}
