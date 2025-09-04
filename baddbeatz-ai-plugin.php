<?php
/**
 * Plugin Name: BaddBeatz AI Beat Generator
 * Plugin URI: https://baddbeatz.nl
 * Description: Voeg AI beat generatie toe aan je BaddBeatz.nl website. Volledig aangepast voor de Nederlandse muziekmarkt.
 * Version: 1.0.0
 * Author: BaddBeatz.nl
 * Author URI: https://baddbeatz.nl
 * Text Domain: baddbeatz-ai
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

define('BADDBEATZ_AI_VERSION', '1.0.0');
define('BADDBEATZ_AI_PLUGIN_URL', plugin_dir_url(__FILE__));
define('BADDBEATZ_AI_PLUGIN_PATH', plugin_dir_path(__FILE__));

class BaddBeatzAIPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_ajax_baddbeatz_generate_beat', array($this, 'ajax_generate_beat'));
        add_action('wp_ajax_nopriv_baddbeatz_generate_beat', array($this, 'ajax_generate_beat'));
        
        // Shortcodes
        add_shortcode('baddbeatz_generator', array($this, 'generator_shortcode'));
        add_shortcode('baddbeatz_player', array($this, 'player_shortcode'));
        
        // Admin menu
        add_action('admin_menu', array($this, 'admin_menu'));
        
        // Settings
        add_action('admin_init', array($this, 'admin_init'));
    }
    
    public function init() {
        // Laad Nederlandse vertalingen
        load_plugin_textdomain('baddbeatz-ai', false, dirname(plugin_basename(__FILE__)) . '/languages/');
    }
    
    public function enqueue_scripts() {
        wp_enqueue_script(
            'baddbeatz-ai', 
            BADDBEATZ_AI_PLUGIN_URL . 'js/baddbeatz-ai.js', 
            array('jquery'), 
            BADDBEATZ_AI_VERSION, 
            true
        );
        
        wp_enqueue_style(
            'baddbeatz-ai', 
            BADDBEATZ_AI_PLUGIN_URL . 'css/baddbeatz-ai.css', 
            array(), 
            BADDBEATZ_AI_VERSION
        );
        
        // Localize script met Nederlandse teksten
        wp_localize_script('baddbeatz-ai', 'baddbeatzAI', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('baddbeatz_ai_nonce'),
            'apiUrl' => 'https://sb-367uwfd00g50.vercel.run/api/generate-beat',
            'apiKey' => get_option('baddbeatz_ai_api_key', 'baddbeatz_demo_key_2024'),
            'messages' => array(
                'generating' => '🎵 Beat genereren...',
                'generate' => '🎵 Genereer Beat',
                'success' => 'Beat succesvol gegenereerd!',
                'error' => 'Er ging iets mis. Probeer opnieuw.',
                'limit_reached' => 'Dagelijkse limiet bereikt. Upgrade voor meer beats!',
                'download' => '💾 Download MP3',
                'save' => '📚 Opslaan',
                'share' => '📱 Delen'
            ),
            'genres' => array(
                'Hip-Hop' => 'Hip-Hop',
                'Nederlandse Hip-Hop' => 'Nederlandse Hip-Hop',
                'Trap' => 'Trap',
                'Drill' => 'Drill',
                'Afrobeats' => 'Afrobeats',
                'Electronic' => 'Electronic',
                'House' => 'House',
                'Hardstyle' => 'Hardstyle',
                'Urban' => 'Urban',
                'Nederlandse Pop' => 'Nederlandse Pop'
            ),
            'moods' => array(
                'energetic' => 'Energiek',
                'chill' => 'Chill/Relaxed',
                'dark' => 'Donker/Hard',
                'uplifting' => 'Positief/Uplifting',
                'aggressive' => 'Agressief/Raw',
                'party' => 'Feest/Party',
                'romantic' => 'Romantisch'
            )
        ));
    }
    
    /**
     * Shortcode voor beat generator
     * Gebruik: [baddbeatz_generator genre="Hip-Hop" user_tier="free"]
     */
    public function generator_shortcode($atts) {
        $atts = shortcode_atts(array(
            'genre' => 'Hip-Hop',
            'user_tier' => 'free',
            'theme' => 'dark',
            'width' => '100%',
            'show_advanced' => 'true'
        ), $atts);
        
        ob_start();
        ?>
        <div class="baddbeatz-ai-generator" 
             data-genre="<?php echo esc_attr($atts['genre']); ?>" 
             data-tier="<?php echo esc_attr($atts['user_tier']); ?>"
             data-theme="<?php echo esc_attr($atts['theme']); ?>"
             style="width: <?php echo esc_attr($atts['width']); ?>">
            
            <div class="baddbeatz-generator-header">
                <div class="baddbeatz-logo">
                    <span class="baddbeatz-logo-icon">B</span>
                    <div class="baddbeatz-logo-text">
                        <h3>AI Beat Generator</h3>
                        <p>Maak professionele beats met AI</p>
                    </div>
                </div>
            </div>
            
            <form class="baddbeatz-generator-form" data-generator-id="<?php echo uniqid('baddbeatz_'); ?>">
                <!-- Genre selectie -->
                <div class="baddbeatz-form-group">
                    <label for="genre">Genre</label>
                    <select name="genre" id="genre" class="baddbeatz-select" required>
                        <?php foreach ($this->getDutchGenres() as $value => $label): ?>
                            <option value="<?php echo esc_attr($value); ?>" <?php selected($atts['genre'], $value); ?>>
                                <?php echo esc_html($label); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <!-- BPM slider -->
                <div class="baddbeatz-form-group">
                    <label for="bpm">Tempo (BPM): <span class="bpm-display">140</span></label>
                    <input type="range" name="bpm" id="bpm" min="80" max="180" value="140" class="baddbeatz-slider">
                </div>
                
                <!-- Mood/Sfeer -->
                <div class="baddbeatz-form-group">
                    <label for="mood">Sfeer</label>
                    <select name="mood" id="mood" class="baddbeatz-select" required>
                        <?php foreach ($this->getDutchMoods() as $value => $label): ?>
                            <option value="<?php echo esc_attr($value); ?>">
                                <?php echo esc_html($label); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <!-- Custom prompt -->
                <div class="baddbeatz-form-group">
                    <label for="prompt">Beschrijf je beat (optioneel)</label>
                    <textarea 
                        name="prompt" 
                        id="prompt" 
                        class="baddbeatz-textarea" 
                        rows="3"
                        placeholder="Bijvoorbeeld: 'Een donkere trap beat met zware 808s, perfect voor Nederlandse rap'"
                    ></textarea>
                </div>
                
                <!-- Submit button -->
                <button type="submit" class="baddbeatz-generate-btn">
                    🎵 Genereer Beat voor BaddBeatz
                </button>
            </form>
            
            <!-- Result container -->
            <div class="baddbeatz-result" style="display: none;">
                <!-- Beat result wordt hier getoond -->
            </div>
            
            <!-- Loading state -->
            <div class="baddbeatz-loading" style="display: none;">
                <div class="baddbeatz-spinner"></div>
                <p>AI is bezig met het maken van je beat...</p>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Shortcode voor beat player
     * Gebruik: [baddbeatz_player beat_id="beat_123"]
     */
    public function player_shortcode($atts) {
        $atts = shortcode_atts(array(
            'beat_id' => '',
            'width' => '100%',
            'height' => '280',
            'theme' => 'baddbeatz'
        ), $atts);
        
        if (empty($atts['beat_id'])) {
            return '<p>Fout: Beat ID is vereist.</p>';
        }
        
        $embed_url = "https://sb-367uwfd00g50.vercel.run/embed/baddbeatz/" . urlencode($atts['beat_id']);
        
        return sprintf(
            '<iframe src="%s" width="%s" height="%s" frameborder="0" allow="autoplay; encrypted-media" class="baddbeatz-ai-player"></iframe>',
            esc_url($embed_url),
            esc_attr($atts['width']),
            esc_attr($atts['height'])
        );
    }
    
    /**
     * AJAX handler voor beat generatie
     */
    public function ajax_generate_beat() {
        // Verificeer nonce
        if (!wp_verify_nonce($_POST['nonce'], 'baddbeatz_ai_nonce')) {
            wp_die('Ongeldig verzoek');
        }
        
        $user_id = get_current_user_id();
        $beat_params = array(
            'genre' => sanitize_text_field($_POST['genre']),
            'bpm' => intval($_POST['bpm']),
            'mood' => sanitize_text_field($_POST['mood']),
            'prompt' => sanitize_textarea_field($_POST['prompt'])
        );
        
        // Bepaal user tier (integreer met je membership systeem)
        $user_tier = $this->getUserTier($user_id);
        
        // Check dagelijkse limiet
        if (!$this->canUserGenerate($user_id, $user_tier)) {
            wp_send_json_error(array(
                'message' => 'Je hebt je dagelijkse limiet bereikt.',
                'upgrade_url' => home_url('/pricing/')
            ));
        }
        
        // Genereer beat via API
        $result = $this->generateBeat($user_id, $beat_params, $user_tier);
        
        if ($result['success']) {
            // Sla beat op in database
            $this->saveBeatToDatabase($user_id, $result);
            
            // Track analytics
            $this->trackBeatGeneration($user_id, $beat_params);
            
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result);
        }
    }
    
    /**
     * Bepaal user subscription tier
     */
    private function getUserTier($user_id) {
        // Integreer met je membership/subscription systeem
        // Bijvoorbeeld: WooCommerce Subscriptions, MemberPress, etc.
        
        if (!$user_id) return 'free';
        
        // Voorbeeld: check for membership meta
        $membership = get_user_meta($user_id, 'baddbeatz_membership', true);
        
        switch ($membership) {
            case 'premium':
                return 'premium';
            case 'pro':
                return 'pro';
            default:
                return 'free';
        }
    }
    
    /**
     * Check of user nog beats kan genereren vandaag
     */
    private function canUserGenerate($user_id, $user_tier) {
        if ($user_tier === 'pro') return true; // Unlimited
        
        $daily_limit = ($user_tier === 'premium') ? 50 : 3;
        
        // Check hoeveelgenerations vandaag
        $today = date('Y-m-d');
        $generations_today = get_user_meta($user_id, "baddbeatz_generations_$today", true) ?: 0;
        
        return $generations_today < $daily_limit;
    }
    
    /**
     * Genereer beat via Freebeat.ai API
     */
    private function generateBeat($user_id, $beat_params, $user_tier) {
        $api_url = 'https://sb-367uwfd00g50.vercel.run/api/generate-beat';
        $api_key = get_option('baddbeatz_ai_api_key', 'baddbeatz_demo_key_2024');
        
        $data = array(
            'params' => array(
                'genre' => $beat_params['genre'],
                'bpm' => $beat_params['bpm'],
                'key' => 'C',
                'mood' => $beat_params['mood'],
                'complexity' => 7,
                'duration' => 120,
                'style' => 'baddbeatz-signature',
                'instruments' => array('808 Drums', 'Piano', 'Synth Lead'),
                'prompt' => $beat_params['prompt'] . ' | Nederlandse stijl voor BaddBeatz.nl platform'
            ),
            'userId' => 'baddbeatz_nl_' . $user_id,
            'subscriptionTier' => $user_tier,
            'source' => 'baddbeatz.nl'
        );
        
        $response = wp_remote_post($api_url, array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'X-BaddBeatz-Source' => 'wordpress',
                'Accept-Language' => 'nl-NL,nl;q=0.9'
            ),
            'body' => json_encode($data),
            'timeout' => 60
        ));
        
        if (is_wp_error($response)) {
            return array(
                'success' => false,
                'error' => 'API verbinding mislukt: ' . $response->get_error_message()
            );
        }
        
        $body = wp_remote_retrieve_body($response);
        $result = json_decode($body, true);
        
        if ($result['success']) {
            // Update daily generation count
            $today = date('Y-m-d');
            $current_count = get_user_meta($user_id, "baddbeatz_generations_$today", true) ?: 0;
            update_user_meta($user_id, "baddbeatz_generations_$today", $current_count + 1);
            
            return array(
                'success' => true,
                'beatId' => $result['beat']['id'],
                'title' => $result['beat']['title'],
                'dutchTitle' => $result['beat']['genre'] . ' Beat voor BaddBeatz',
                'genre' => $result['beat']['genre'],
                'bpm' => $result['beat']['bpm'],
                'duration' => $result['beat']['duration'],
                'audioUrl' => $result['beat']['audioUrl'],
                'embedCode' => $this->generateWordPressEmbed($result['beat']['id']),
                'downloadUrl' => $this->getDownloadUrl($result['beat']['id'], $user_tier),
                'usageInfo' => $result['usageInfo']
            );
        } else {
            return array(
                'success' => false,
                'error' => $result['message'] ?: 'Beat generatie mislukt'
            );
        }
    }
    
    /**
     * Sla gegenereerde beat op in WordPress database
     */
    private function saveBeatToDatabase($user_id, $beat_data) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'baddbeatz_beats';
        
        $wpdb->insert(
            $table_name,
            array(
                'user_id' => $user_id,
                'beat_id' => $beat_data['beatId'],
                'title' => $beat_data['title'],
                'dutch_title' => $beat_data['dutchTitle'],
                'genre' => $beat_data['genre'],
                'bpm' => $beat_data['bpm'],
                'duration' => $beat_data['duration'],
                'audio_url' => $beat_data['audioUrl'],
                'download_url' => $beat_data['downloadUrl'],
                'created_at' => current_time('mysql'),
                'source' => 'ai_generator'
            ),
            array('%d', '%s', '%s', '%s', '%s', '%d', '%d', '%s', '%s', '%s', '%s')
        );
        
        return $wpdb->insert_id;
    }
    
    /**
     * Track beat generation voor analytics
     */
    private function trackBeatGeneration($user_id, $beat_params) {
        // Google Analytics Event
        if (function_exists('gtag')) {
            ?>
            <script>
                gtag('event', 'beat_generated', {
                    'genre': '<?php echo esc_js($beat_params['genre']); ?>',
                    'user_id': '<?php echo esc_js($user_id); ?>',
                    'platform': 'baddbeatz_wordpress'
                });
            </script>
            <?php
        }
        
        // Custom analytics table
        global $wpdb;
        $wpdb->insert(
            $wpdb->prefix . 'baddbeatz_analytics',
            array(
                'user_id' => $user_id,
                'action' => 'beat_generated',
                'genre' => $beat_params['genre'],
                'bpm' => $beat_params['bpm'],
                'mood' => $beat_params['mood'],
                'date' => current_time('mysql'),
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? ''
            )
        );
    }
    
    /**
     * Genereer WordPress-vriendelijke embed code
     */
    private function generateWordPressEmbed($beat_id) {
        return array(
            'shortcode' => "[baddbeatz_player beat_id=\"$beat_id\"]",
            'iframe' => '<iframe src="https://sb-367uwfd00g50.vercel.run/embed/baddbeatz/' . $beat_id . '" width="100%" height="280" frameborder="0" allow="autoplay; encrypted-media" class="baddbeatz-ai-player"></iframe>',
            'gutenberg' => array(
                'block' => 'baddbeatz/beat-player',
                'attributes' => array('beatId' => $beat_id)
            )
        );
    }
    
    private function getDownloadUrl($beat_id, $user_tier) {
        return "https://sb-367uwfd00g50.vercel.run/api/download?beatId=$beat_id&format=mp3&source=baddbeatz&tier=$user_tier";
    }
    
    /**
     * Nederlandse genres voor BaddBeatz markt
     */
    private function getDutchGenres() {
        return array(
            'Hip-Hop' => 'Hip-Hop',
            'Nederlandse Hip-Hop' => 'Nederlandse Hip-Hop',
            'Trap' => 'Trap',
            'Drill' => 'Drill',
            'Afrobeats' => 'Afrobeats',
            'Electronic' => 'Electronic',
            'House' => 'House',
            'Hardstyle' => 'Hardstyle',
            'Gabber' => 'Gabber',
            'Urban' => 'Urban',
            'R&B' => 'R&B',
            'Reggaeton' => 'Reggaeton',
            'Pop' => 'Pop',
            'Nederlandse Pop' => 'Nederlandse Pop'
        );
    }
    
    private function getDutchMoods() {
        return array(
            'energetic' => 'Energiek',
            'chill' => 'Chill/Relaxed',
            'dark' => 'Donker/Hard',
            'uplifting' => 'Positief/Uplifting',
            'aggressive' => 'Agressief/Raw',
            'party' => 'Feest/Party',
            'romantic' => 'Romantisch'
        );
    }
    
    /**
     * Admin menu setup
     */
    public function admin_menu() {
        add_options_page(
            'BaddBeatz AI Instellingen',
            'BaddBeatz AI',
            'manage_options',
            'baddbeatz-ai-settings',
            array($this, 'admin_page')
        );
    }
    
    public function admin_init() {
        register_setting('baddbeatz_ai_settings', 'baddbeatz_ai_api_key');
        register_setting('baddbeatz_ai_settings', 'baddbeatz_ai_user_tier_mapping');
        register_setting('baddbeatz_ai_settings', 'baddbeatz_ai_analytics_enabled');
    }
    
    /**
     * Admin settings pagina
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>BaddBeatz AI Beat Generator Instellingen</h1>
            
            <form method="post" action="options.php">
                <?php settings_fields('baddbeatz_ai_settings'); ?>
                <?php do_settings_sections('baddbeatz_ai_settings'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">API Key</th>
                        <td>
                            <input type="text" name="baddbeatz_ai_api_key" value="<?php echo esc_attr(get_option('baddbeatz_ai_api_key', 'baddbeatz_demo_key_2024')); ?>" class="regular-text" />
                            <p class="description">Jouw BaddBeatz AI API key</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Analytics</th>
                        <td>
                            <input type="checkbox" name="baddbeatz_ai_analytics_enabled" value="1" <?php checked(get_option('baddbeatz_ai_analytics_enabled'), 1); ?> />
                            <label>Beat generatie analytics inschakelen</label>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button('Instellingen Opslaan'); ?>
            </form>
            
            <h2>Gebruik</h2>
            <p>Voeg de beat generator toe met deze shortcodes:</p>
            <ul>
                <li><code>[baddbeatz_generator]</code> - Volledige beat generator</li>
                <li><code>[baddbeatz_generator genre="Trap" user_tier="premium"]</code> - Met custom instellingen</li>
                <li><code>[baddbeatz_player beat_id="BEAT_ID"]</code> - Beat player</li>
            </ul>
        </div>
        <?php
    }
}

// Database tabellen aanmaken bij activatie
register_activation_hook(__FILE__, 'baddbeatz_ai_create_tables');

function baddbeatz_ai_create_tables() {
    global $wpdb;
    
    // Beats table
    $beats_table = $wpdb->prefix . 'baddbeatz_beats';
    
    $beats_sql = "CREATE TABLE $beats_table (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) NOT NULL,
        beat_id varchar(255) NOT NULL,
        title varchar(255) NOT NULL,
        dutch_title varchar(255),
        genre varchar(100),
        bpm int(11),
        duration int(11),
        audio_url text,
        download_url text,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        source varchar(50) DEFAULT 'ai_generator',
        PRIMARY KEY (id),
        KEY user_id (user_id),
        KEY beat_id (beat_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    // Analytics table
    $analytics_table = $wpdb->prefix . 'baddbeatz_analytics';
    
    $analytics_sql = "CREATE TABLE $analytics_table (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_id bigint(20),
        action varchar(50) NOT NULL,
        genre varchar(100),
        bpm int(11),
        mood varchar(50),
        date datetime DEFAULT CURRENT_TIMESTAMP,
        ip_address varchar(45),
        PRIMARY KEY (id),
        KEY user_id (user_id),
        KEY action (action),
        KEY date (date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($beats_sql);
    dbDelta($analytics_sql);
}

// Initialiseer plugin
new BaddBeatzAIPlugin();

// Helper functions voor themes
function baddbeatz_ai_generator($atts = array()) {
    $plugin = new BaddBeatzAIPlugin();
    return $plugin->generator_shortcode($atts);
}

function baddbeatz_ai_player($beat_id, $atts = array()) {
    $plugin = new BaddBeatzAIPlugin();
    return $plugin->player_shortcode(array_merge($atts, array('beat_id' => $beat_id)));
}

function baddbeatz_ai_user_beats($user_id = null) {
    if (!$user_id) $user_id = get_current_user_id();
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'baddbeatz_beats';
    
    return $wpdb->get_results(
        $wpdb->prepare("SELECT * FROM $table_name WHERE user_id = %d ORDER BY created_at DESC", $user_id)
    );
}
?>