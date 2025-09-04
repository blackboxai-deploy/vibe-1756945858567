/**
 * BaddBeatz.nl AI Beat Generation Integration
 * Perfect implementation for Dutch beat-selling platform
 * Version: 2.0.0
 * Language: Dutch/English
 */

class BaddBeatzAI {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || 'https://sb-367uwfd00g50.vercel.run/api/generate-beat';
    this.apiKey = options.apiKey || 'baddbeatz_nl_production_key_2024';
    this.language = options.language || 'nl';
    this.currency = options.currency || 'EUR';
    this.domain = options.domain || 'baddbeatz.nl';
    
    // Dutch market specific configuration
    this.dutchGenres = ['Hardstyle', 'Gabber', 'Trance', 'UK-Drill', 'Afrobeats'];
    this.pricing = {
      mp3: 29.99,
      wav: 59.99,
      exclusive: 199.99
    };
    
    this.translations = this.getTranslations();
    this.analytics = new BaddBeatzAnalytics();
    
    this.init();
  }
  
  getTranslations() {
    return {
      nl: {
        generating: 'Beat wordt gegenereerd...',
        success: 'Beat succesvol gecreëerd!',
        error: 'Fout bij het genereren van de beat',
        download: 'Download Beat',
        play: 'Afspelen',
        pause: 'Pauzeren',
        addToCart: 'Toevoegen aan Winkelwagen',
        buyNow: 'Nu Kopen',
        preview: 'Voorbeeld',
        exclusive: 'Exclusief',
        unlimited: 'Onbeperkt Gebruik',
        commercial: 'Commerciële Licentie',
        mp3Lease: 'MP3 Lease',
        wavStems: 'WAV + Stems',
        exclusiveRights: 'Exclusieve Rechten',
        priceLabel: 'Prijs',
        bpmLabel: 'BPM',
        keyLabel: 'Toonsoort',
        genreLabel: 'Genre',
        moodLabel: 'Stemming',
        promptPlaceholder: 'Beschrijf je beat...',
        generateButton: '🎵 Genereer Mijn Beat',
        processingText: 'AI creëert je beat...',
        dutchQuality: 'Nederlandse Producer Kwaliteit',
        instantDownload: 'Instant Download',
        allRightsIncluded: 'Alle rechten inbegrepen'
      },
      en: {
        generating: 'Generating beat...',
        success: 'Beat created successfully!',
        error: 'Error generating beat',
        download: 'Download Beat',
        play: 'Play',
        pause: 'Pause',
        addToCart: 'Add to Cart',
        buyNow: 'Buy Now',
        preview: 'Preview',
        exclusive: 'Exclusive',
        unlimited: 'Unlimited Use',
        commercial: 'Commercial License',
        mp3Lease: 'MP3 Lease',
        wavStems: 'WAV + Stems',
        exclusiveRights: 'Exclusive Rights',
        priceLabel: 'Price',
        bpmLabel: 'BPM',
        keyLabel: 'Key',
        genreLabel: 'Genre',
        moodLabel: 'Mood',
        promptPlaceholder: 'Describe your beat...',
        generateButton: '🎵 Generate My Beat',
        processingText: 'AI is creating your beat...',
        dutchQuality: 'Dutch Producer Quality',
        instantDownload: 'Instant Download',
        allRightsIncluded: 'All rights included'
      }
    };
  }
  
  t(key) {
    return this.translations[this.language][key] || key;
  }
  
  init() {
    this.setupEventListeners();
    this.injectStyles();
    console.log('BaddBeatz.nl AI Integration initialized');
  }
  
  setupEventListeners() {
    // Handle form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.classList.contains('baddbeatz-generator-form')) {
        e.preventDefault();
        this.handleBeatGeneration(e.target);
      }
    });
    
    // Handle buy button clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('baddbeatz-buy-btn')) {
        this.handlePurchaseClick(e.target);
      }
    });
  }
  
  async generateBeat(userId, beatParams, userTier = 'free') {
    this.analytics.trackEvent('beat_generation_started', {
      genre: beatParams.genre,
      bpm: beatParams.bpm,
      userTier: userTier
    });
    
    const startTime = Date.now();
    
    try {
      const enhancedParams = {
        ...beatParams,
        style: beatParams.style || 'modern-dutch',
        marketRegion: 'netherlands',
        currency: this.currency,
        language: this.language
      };
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Market': 'netherlands',
          'X-Language': this.language
        },
        body: JSON.stringify({
          params: enhancedParams,
          userId: `baddbeatz_nl_${userId}`,
          subscriptionTier: userTier,
          platform: 'baddbeatz.nl',
          market: 'dutch'
        })
      });
      
      const result = await response.json();
      const generationTime = Date.now() - startTime;
      
      if (result.success) {
        const formattedBeat = this.formatBeatForBaddBeatz(result.beat);
        
        this.analytics.trackEvent('beat_generation_completed', {
          beatId: formattedBeat.id,
          generationTime: generationTime,
          success: true
        });
        
        return formattedBeat;
      } else {
        throw new Error(result.message || this.t('error'));
      }
    } catch (error) {
      this.analytics.trackEvent('beat_generation_failed', {
        error: error.message,
        generationTime: Date.now() - startTime
      });
      
      console.error('BaddBeatz AI Generation Error:', error);
      return {
        success: false,
        error: error.message,
        suggestion: this.getErrorSuggestion(error)
      };
    }
  }
  
  formatBeatForBaddBeatz(beat) {
    return {
      success: true,
      id: beat.id,
      title: beat.title,
      genre: beat.genre,
      bmp: beat.bpm,
      key: beat.key,
      duration: beat.duration,
      audioUrl: beat.audioUrl,
      waveformData: beat.waveformData,
      
      // BaddBeatz.nl specific pricing in EUR
      pricing: {
        mp3: { 
          price: this.pricing.mp3, 
          currency: 'EUR', 
          label: this.t('mp3Lease'),
          features: ['High Quality MP3', 'Basic License', 'Personal Use']
        },
        wav: { 
          price: this.pricing.wav, 
          currency: 'EUR', 
          label: this.t('wavStems'),
          features: ['WAV File', 'Isolated Stems', 'Commercial License']
        },
        exclusive: { 
          price: this.pricing.exclusive, 
          currency: 'EUR', 
          label: this.t('exclusiveRights'),
          features: ['Full Ownership', 'All Files', 'Unlimited Use', 'Resale Rights']
        }
      },
      
      // Dutch market tags
      dutchTags: this.generateDutchTags(beat),
      
      // SEO data for BaddBeatz.nl
      seo: {
        title: `${beat.title} - ${beat.genre} Beat | BaddBeatz.nl`,
        description: `Download ${beat.title}, een professionele ${beat.genre} beat van ${beat.bpm} BPM. Exclusieve rechten beschikbaar.`,
        keywords: [beat.title.toLowerCase(), beat.genre.toLowerCase(), `${beat.bpm} bpm`, 'nederlands beats'].join(', ')
      },
      
      // Social media ready snippets
      socialMedia: {
        instagram: {
          caption: `🔥 ${beat.title} | ${beat.bpm} BPM ${beat.genre}\\n\\nLink in bio voor volledige beat 💫\\n\\n#BaddBeatzNL #DutchProducer`,
          hashtags: ['#BaddBeatzNL', '#DutchHipHop', '#BeatMaker']
        },
        tiktok: {
          caption: `AI maakte deze beat in 30 seconden 🤖🔥 #BaddBeatzNL #AIBeats`
        }
      },
      
      // E-commerce integration
      ecommerce: {
        shopifyVariants: this.createShopifyVariants(beat),
        woocommerceData: this.createWooCommerceData(beat)
      },
      
      // Embed codes for different platforms
      embeds: this.generateEmbedCodes(beat.id)
    };
  }
  
  generateDutchTags(beat) {
    const baseTags = [beat.genre.toLowerCase(), `${beat.bpm}bpm`, beat.key.toLowerCase()];
    const dutchTags = [
      'nederlandse beats',
      'holland producer', 
      'dutch hip hop',
      'beats kopen',
      'instrumentals nederland'
    ];
    
    return [...baseTags, ...dutchTags.slice(0, 3)];
  }
  
  createShopifyVariants(beat) {
    return [
      {
        title: this.t('mp3Lease'),
        price: this.pricing.mp3.toFixed(2),
        sku: `${beat.id}-mp3-lease`,
        inventory: 999,
        requires_shipping: false,
        weight: 0
      },
      {
        title: this.t('wavStems'),
        price: this.pricing.wav.toFixed(2),
        sku: `${beat.id}-wav-stems`,
        inventory: 999,
        requires_shipping: false,
        weight: 0
      },
      {
        title: this.t('exclusiveRights'),
        price: this.pricing.exclusive.toFixed(2),
        sku: `${beat.id}-exclusive`,
        inventory: 1,
        requires_shipping: false,
        weight: 0
      }
    ];
  }
  
  createWooCommerceData(beat) {
    return {
      post_title: `${beat.title} - ${beat.genre} Beat`,
      post_type: 'product',
      meta_input: {
        '_baddbeatz_beat_id': beat.id,
        '_baddbeatz_bpm': beat.bpm,
        '_baddbeatz_key': beat.key,
        '_baddbeatz_genre': beat.genre,
        '_baddbeatz_audio_url': beat.audioUrl
      }
    };
  }
  
  generateEmbedCodes(beatId) {
    const embedUrl = `https://sb-367uwfd00g50.vercel.run/embed/baddbeatz/${beatId}`;
    
    return {
      iframe: `<iframe src="${embedUrl}" width="100%" height="400" frameborder="0" allow="autoplay; encrypted-media" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></iframe>`,
      
      wordpress: `[baddbeatz_player id="${beatId}" width="100%" height="400"]`,
      
      javascript: `
        <div id="baddbeatz-player-${beatId}"></div>
        <script>
          (function() {
            var iframe = document.createElement('iframe');
            iframe.src = '${embedUrl}?theme=baddbeatz&lang=nl';
            iframe.width = '100%';
            iframe.height = '400';
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay; encrypted-media';
            iframe.style.borderRadius = '12px';
            iframe.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            document.getElementById('baddbeatz-player-${beatId}').appendChild(iframe);
          })();
        </script>
      `,
      
      html: this.generateHTMLPlayer(beatId)
    };
  }
  
  generateHTMLPlayer(beatId) {
    return `
      <div class="baddbeatz-player" data-beat-id="${beatId}">
        <div class="player-header">
          <div class="cover-art"></div>
          <div class="beat-info">
            <h3 class="beat-title">Loading...</h3>
            <p class="beat-details">
              <span class="dutch-flag">🇳🇱</span>
              <span class="genre">-</span> • 
              <span class="bpm">-</span> BPM
            </p>
          </div>
        </div>
        
        <div class="waveform-container">
          <div class="waveform"></div>
          <button class="play-button">▶️</button>
        </div>
        
        <div class="license-options">
          <button class="license-btn" data-license="mp3">
            <div class="price">€${this.pricing.mp3}</div>
            <div class="type">${this.t('mp3Lease')}</div>
          </button>
          
          <button class="license-btn" data-license="wav">
            <div class="price">€${this.pricing.wav}</div>
            <div class="type">${this.t('wavStems')}</div>
          </button>
          
          <button class="license-btn exclusive" data-license="exclusive">
            <div class="price">€${this.pricing.exclusive}</div>
            <div class="type">🏆 ${this.t('exclusiveRights')}</div>
          </button>
        </div>
        
        <div class="baddbeatz-branding">
          ${this.t('dutchQuality')} • BaddBeatz.nl
        </div>
      </div>
    `;
  }
  
  async handleBeatGeneration(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const progressContainer = form.querySelector('.generation-progress');
    const resultContainer = form.querySelector('.generated-beat-container');
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span class="loading-spinner"></span>
      ${this.t('generating')}
    `;
    
    if (progressContainer) {
      progressContainer.style.display = 'block';
    }
    
    try {
      const beatParams = {
        genre: formData.get('genre'),
        bpm: parseInt(formData.get('bpm')),
        key: formData.get('key'),
        mood: formData.get('mood'),
        complexity: parseInt(formData.get('complexity')) || 7,
        duration: parseInt(formData.get('duration')) || 120,
        style: formData.get('style') || 'modern',
        instruments: formData.getAll('instruments'),
        prompt: formData.get('prompt')
      };
      
      const userId = this.getCurrentUserId();
      const userTier = this.getCurrentUserTier();
      
      const result = await this.generateBeat(userId, beatParams, userTier);
      
      if (result.success) {
        this.displayGeneratedBeat(result, resultContainer);
        this.showSuccessMessage(this.t('success'));
      } else {
        this.showErrorMessage(result.error);
      }
    } catch (error) {
      this.showErrorMessage(error.message);
    } finally {
      // Reset button
      submitButton.disabled = false;
      submitButton.innerHTML = this.t('generateButton');
      
      if (progressContainer) {
        progressContainer.style.display = 'none';
      }
    }
  }
  
  displayGeneratedBeat(beat, container) {
    if (!container) return;
    
    container.innerHTML = `
      <div class="generated-beat">
        <div class="beat-header">
          <h3>${beat.title}</h3>
          <div class="beat-tags">
            ${beat.dutchTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
        
        <div class="beat-player-embed">
          ${beat.embeds.html}
        </div>
        
        <div class="beat-pricing">
          <h4>💰 Koop Deze Beat</h4>
          <div class="pricing-options">
            ${Object.entries(beat.pricing).map(([type, data]) => `
              <div class="pricing-option ${type}">
                <div class="price">€${data.price}</div>
                <div class="label">${data.label}</div>
                <ul class="features">
                  ${data.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
                </ul>
                <button class="buy-btn baddbeatz-buy-btn" 
                        data-beat-id="${beat.id}" 
                        data-license="${type}"
                        data-price="${data.price}">
                  ${this.t('buyNow')}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="beat-actions">
          <button class="share-btn" onclick="navigator.share({title: '${beat.title}', url: location.href})">
            📤 Delen
          </button>
          <button class="favorite-btn" onclick="baddbeatzAI.addToFavorites('${beat.id}')">
            ❤️ Toevoegen aan Favorieten
          </button>
        </div>
      </div>
    `;
    
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
  }
  
  handlePurchaseClick(button) {
    const beatId = button.dataset.beatId;
    const license = button.dataset.license;
    const price = button.dataset.price;
    
    this.analytics.trackEvent('license_button_clicked', {
      beatId: beatId,
      licenseType: license,
      price: parseFloat(price)
    });
    
    // Redirect to BaddBeatz.nl checkout
    const checkoutParams = new URLSearchParams({
      beat_id: beatId,
      license_type: license,
      price: price,
      currency: 'EUR'
    });
    
    window.location.href = `/checkout?${checkoutParams.toString()}`;
  }
  
  getCurrentUserId() {
    // Get from your BaddBeatz.nl user system
    return window.baddbeatzUser?.id || 'anonymous_' + Date.now();
  }
  
  getCurrentUserTier() {
    // Get from your BaddBeatz.nl user system
    return window.baddbeatzUser?.tier || 'free';
  }
  
  showSuccessMessage(message) {
    this.showNotification(message, 'success');
  }
  
  showErrorMessage(message) {
    this.showNotification(message, 'error');
  }
  
  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `baddbeatz-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '✅' : '⚠️'}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 4000);
  }
  
  getErrorSuggestion(error) {
    if (error.message.includes('limit')) {
      return 'Je hebt je dagelijkse generatie limiet bereikt. Upgrade naar Premium voor meer beats.';
    }
    if (error.message.includes('network')) {
      return 'Verbindingsprobleem. Controleer je internetverbinding en probeer opnieuw.';
    }
    return 'Er ging iets mis. Probeer het over een paar minuten opnieuw.';
  }
  
  addToFavorites(beatId) {
    // Add to user's favorites in your BaddBeatz.nl system
    this.analytics.trackEvent('beat_added_to_favorites', { beatId });
    this.showSuccessMessage('Beat toegevoegd aan favorieten!');
  }
  
  injectStyles() {
    if (document.getElementById('baddbeatz-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'baddbeatz-styles';
    styles.textContent = `
      .baddbeatz-player {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        color: white;
        font-family: 'Inter', sans-serif;
        max-width: 600px;
        margin: 20px auto;
      }
      
      .baddbeatz-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2a2a2a;
        color: white;
        padding: 16px;
        border-radius: 8px;
        border-left: 4px solid #ff6b35;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 1000;
        max-width: 300px;
      }
      
      .baddbeatz-notification.show {
        transform: translateX(0);
      }
      
      .baddbeatz-notification.success {
        border-left-color: #28a745;
      }
      
      .baddbeatz-notification.error {
        border-left-color: #dc3545;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
      }
      
      .notification-icon {
        margin-right: 12px;
        font-size: 18px;
      }
      
      .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ccc;
        border-top: 2px solid #ff6b35;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .tag {
        display: inline-block;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        margin: 2px;
      }
      
      .pricing-option {
        border: 2px solid #333;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        margin: 10px;
        transition: all 0.3s ease;
      }
      
      .pricing-option:hover {
        border-color: #ff6b35;
        transform: translateY(-4px);
      }
      
      .pricing-option.exclusive {
        border-color: #f7931e;
        background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.1));
      }
      
      .buy-btn {
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        border: none;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
        width: 100%;
        margin-top: 12px;
      }
      
      .buy-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
      }
      
      @media (max-width: 768px) {
        .baddbeatz-player {
          margin: 10px;
          padding: 16px;
        }
        
        .baddbeatz-notification {
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
}

// Analytics class for BaddBeatz.nl
class BaddBeatzAnalytics {
  constructor() {
    this.sessionId = 'baddbeatz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    this.userId = this.getUserId();
  }
  
  getUserId() {
    return window.baddbeatzUser?.id || 'anonymous_' + Date.now();
  }
  
  trackEvent(eventName, properties = {}) {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      properties: {
        ...properties,
        url: window.location.href,
        platform: 'baddbeatz.nl'
      }
    };
    
    // Send to your BaddBeatz.nl analytics
    this.sendEvent(event);
    
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
  }
  
  async sendEvent(event) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.warn('Analytics event failed:', error);
    }
  }
}

// Initialize BaddBeatz.nl AI Integration
window.baddbeatzAI = new BaddBeatzAI({
  language: window.baddbeatzLang || 'nl',
  currency: 'EUR',
  domain: 'baddbeatz.nl'
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaddBeatzAI;
}