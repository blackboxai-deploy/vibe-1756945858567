'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BaddBeatzPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBeat, setGeneratedBeat] = useState<any>(null);

  const [beatParams, setBeatParams] = useState({
    genre: 'Hip-Hop',
    bpm: 140,
    mood: 'energetic',
    prompt: 'Een professionele Nederlandse hip-hop beat voor BaddBeatz'
  });

  const dutchGenres = [
    'Hip-Hop', 'Nederlandse Hip-Hop', 'Trap', 'Drill', 'Afrobeats',
    'Electronic', 'House', 'Hardstyle', 'Gabber', 'Techno',
    'Pop', 'Nederlandse Pop', 'Urban', 'R&B', 'Reggaeton'
  ];

  const handleGenerateBeat = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-beat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params: {
            genre: beatParams.genre,
            bpm: typeof beatParams.bpm === 'string' ? parseInt(beatParams.bpm) : beatParams.bpm,
            key: 'C',
            mood: beatParams.mood,
            complexity: 7,
            duration: 120,
            style: 'baddbeatz-signature',
            instruments: ['808 Drums', 'Piano', 'Synth Lead'],
            prompt: beatParams.prompt
          },
          userId: 'baddbeatz_demo_user',
          subscriptionTier: 'free'
        })
      });

      const result = await response.json();
      if (result.success) {
        setGeneratedBeat({
          ...result.beat,
          baddbeatzCustomization: {
            dutchTitle: `${beatParams.genre} Beat voor BaddBeatz`,
            marketingText: `Exclusieve ${beatParams.genre} beat gegenereerd door AI voor BaddBeatz.nl`,
            embedUrl: `https://sb-367uwfd00g50.vercel.run/embed/player/${result.beat.id}?source=baddbeatz&lang=nl`,
            directLink: `https://sb-367uwfd00g50.vercel.run/beat/${result.beat.id}?source=baddbeatz&lang=nl`
          }
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const integrationCode = `// BaddBeatz.nl Integration
const baddbeatzAPI = {
  apiUrl: 'https://sb-367uwfd00g50.vercel.run/api/generate-beat',
  
  async generateBeat(beatParams) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        params: {
          genre: beatParams.genre,
          bpm: beatParams.bpm,
          mood: beatParams.mood,
          prompt: beatParams.prompt + ' | Voor BaddBeatz.nl platform'
        },
        userId: 'baddbeatz_user_123',
        subscriptionTier: 'free'
      })
    });
    return await response.json();
  }
};`;

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* BaddBeatz Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <div className="text-4xl font-bold text-white">×</div>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              BaddBeatz.nl
            </span>
            <span className="text-white"> × </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Freebeat.ai
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            🇳🇱 Perfecte AI beat generator integratie voor de Nederlandse muziekmarkt. 
            Volledig aangepast voor het BaddBeatz platform met Nederlandse branding en specificaties.
          </p>
          
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Badge className="bg-orange-600 text-white">
              🇳🇱 Nederlandse Markt
            </Badge>
            <Badge className="bg-green-600 text-white">
              🟢 Live & Ready
            </Badge>
            <Badge className="bg-purple-600 text-white">
              🤖 AI Powered
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 mb-8">
            <TabsTrigger value="demo">🎵 Live Demo</TabsTrigger>
            <TabsTrigger value="integration">💻 Integratie Code</TabsTrigger>
            <TabsTrigger value="setup">⚙️ Setup Gids</TabsTrigger>
          </TabsList>

          {/* Live Demo */}
          <TabsContent value="demo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Demo Generator met BaddBeatz branding */}
              <Card className="bg-gradient-to-br from-orange-900/20 via-gray-900 to-yellow-900/20 border-orange-500/30">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">B</span>
                    </div>
                    <div>
                      <CardTitle className="text-white">BaddBeatz AI Beat Generator</CardTitle>
                      <CardDescription>Maak professionele beats met AI voor je platform</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Nederlandse Genre Selection */}
                  <div>
                    <Label className="text-white">🎵 Genre (Nederlandse Markt)</Label>
                    <Select 
                      value={beatParams.genre} 
                      onValueChange={(value) => setBeatParams(prev => ({ ...prev, genre: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {dutchGenres.map(genre => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                            {genre.includes('Nederlandse') && (
                              <span className="ml-2 text-orange-400">🇳🇱</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* BPM met Nederlandse feedback */}
                  <div>
                    <Label className="text-white">
                      🎛️ Tempo: {beatParams.bpm} BPM
                      {beatParams.bpm >= 150 && beatParams.genre === 'Hardstyle' && (
                        <span className="text-orange-400 text-sm ml-2">Perfect voor Hardstyle! 🔥</span>
                      )}
                    </Label>
                    <Input
                      type="range"
                      min="80"
                      max="200"
                      value={beatParams.bpm}
                      onChange={(e) => setBeatParams(prev => ({ ...prev, bpm: parseInt(e.target.value) }))}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  {/* Nederlandse Sfeer opties */}
                  <div>
                    <Label className="text-white">🎭 Sfeer/Mood</Label>
                    <Select 
                      value={beatParams.mood} 
                      onValueChange={(value) => setBeatParams(prev => ({ ...prev, mood: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="energetic">⚡ Energiek</SelectItem>
                        <SelectItem value="chill">😌 Chill/Relaxed</SelectItem>
                        <SelectItem value="dark">🌑 Donker/Hard</SelectItem>
                        <SelectItem value="uplifting">🌟 Positief/Uplifting</SelectItem>
                        <SelectItem value="aggressive">🔥 Agressief/Raw</SelectItem>
                        <SelectItem value="party">🎉 Feest/Party</SelectItem>
                        <SelectItem value="romantic">💕 Romantisch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nederlandse Prompt */}
                  <div>
                    <Label className="text-white">✍️ Beschrijf je beat (optioneel)</Label>
                    <Textarea
                      value={beatParams.prompt}
                      onChange={(e) => setBeatParams(prev => ({ ...prev, prompt: e.target.value }))}
                      placeholder="Bijvoorbeeld: 'Een donkere trap beat met zware 808s en melodische piano, perfect voor Nederlandse rap content op BaddBeatz...'"
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={4}
                    />
                    <div className="text-xs text-orange-400 mt-2">
                      💡 Tip: Wees specifiek voor betere resultaten - noem instrumenten, energie niveau, en gebruik
                    </div>
                  </div>

                  {/* Generate Button - BaddBeatz Style */}
                  <Button
                    onClick={handleGenerateBeat}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isGenerating ? '🎵 Beat genereren voor BaddBeatz...' : '🎵 Genereer Beat voor BaddBeatz.nl'}
                  </Button>
                  
                  {isGenerating && (
                    <div className="mt-4 p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                        <span className="text-orange-400">AI is bezig met het maken van je beat...</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generated Beat Display - BaddBeatz Style */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">🎵 Gegenereerde Beat</CardTitle>
                  <CardDescription>
                    Klaar om in te voegen op BaddBeatz.nl
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedBeat ? (
                    <div className="space-y-4">
                      {/* BaddBeatz Beat Info */}
                      <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 p-4 rounded-lg border border-orange-500/20">
                        <h4 className="text-white font-bold text-lg mb-2">
                          {generatedBeat.baddbeatzCustomization?.dutchTitle}
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-orange-600 text-white">{generatedBeat.genre}</Badge>
                          <Badge variant="secondary">{generatedBeat.bpm} BPM</Badge>
                          <Badge variant="secondary">{Math.floor(generatedBeat.duration / 60)}:{(generatedBeat.duration % 60).toString().padStart(2, '0')}</Badge>
                        </div>
                        <p className="text-orange-300 text-sm">
                          {generatedBeat.baddbeatzCustomization?.marketingText}
                        </p>
                      </div>

                      {/* BaddBeatz Style Waveform */}
                      <div className="bg-gray-800 p-4 rounded-lg relative border-2 border-orange-500/30">
                        <div className="flex items-end space-x-1 h-20">
                          {Array.from({ length: 60 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-gradient-to-t from-orange-500 to-yellow-400 rounded-t transition-all duration-300"
                              style={{ 
                                height: `${Math.random() * 100}%`, 
                                width: '3px',
                                opacity: isGenerating ? '0.7' : '0.9'
                              }}
                            />
                          ))}
                        </div>
                        <button className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                            <span className="text-white text-2xl">▶️</span>
                          </div>
                        </button>
                      </div>

                      {/* BaddBeatz Actions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          💾 Download MP3 voor BaddBeatz
                        </Button>
                        <Button size="sm" variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
                          📚 Opslaan in BaddBeatz Bibliotheek
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                          📱 Delen op Instagram/TikTok
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                          🔗 Embed op Website
                        </Button>
                      </div>

                      {/* Marketing Info voor BaddBeatz */}
                      <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <h5 className="text-blue-400 font-medium mb-2">📈 Marketing voor BaddBeatz.nl</h5>
                        <div className="text-sm space-y-2">
                          <p className="text-blue-300">
                            <strong>Instagram Post:</strong> "🎵 Nieuwe AI beat! {beatParams.genre} 🔥 Gemaakt met onze eigen AI beat generator op BaddBeatz.nl #BaddBeatz #AIMusic #DutchBeats"
                          </p>
                          <p className="text-blue-300">
                            <strong>Website CTA:</strong> "Maak je eigen beats met AI - nu beschikbaar op BaddBeatz!"
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <span className="text-white text-3xl">🎵</span>
                      </div>
                      <h3 className="text-white text-xl mb-2">Klaar voor BaddBeatz!</h3>
                      <p>Genereer een beat om de BaddBeatz integratie te testen</p>
                      <p className="text-sm mt-2 text-orange-400">Perfect afgestemd op jouw Nederlandse platform</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integration Code */}
          <TabsContent value="integration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">JavaScript Integratie</CardTitle>
                  <CardDescription>Client-side code voor BaddBeatz.nl</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-800 p-4 rounded text-xs overflow-x-auto max-h-80 text-gray-300">
                    {integrationCode}
                  </pre>
                  <Button 
                    onClick={() => navigator.clipboard.writeText(integrationCode)}
                    className="mt-3 bg-orange-600 hover:bg-orange-700"
                    size="sm"
                  >
                    📋 Kopieer JavaScript
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">HTML Template</CardTitle>
                  <CardDescription>Ready-to-use HTML voor je website</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-800 p-4 rounded text-xs overflow-x-auto max-h-80 text-gray-300">
{`<!-- BaddBeatz AI Beat Generator -->
<div id="baddbeatz-ai-widget" class="baddbeatz-widget">
  <div class="baddbeatz-header">
    <h3>🎵 AI Beat Generator</h3>
    <p>Maak professionele beats voor BaddBeatz</p>
  </div>
  
  <form id="baddbeatz-form">
    <select name="genre">
      <option value="Hip-Hop">Hip-Hop</option>
      <option value="Nederlandse Hip-Hop">🇳🇱 Nederlandse Hip-Hop</option>
      <option value="Trap">Trap</option>
      <option value="Hardstyle">Hardstyle</option>
    </select>
    
    <input type="range" name="bpm" min="80" max="200" value="140">
    <span class="bpm-display">140 BPM</span>
    
    <textarea name="prompt" placeholder="Beschrijf je beat..."></textarea>
    
    <button type="submit">
      🎵 Genereer Beat voor BaddBeatz
    </button>
  </form>
  
  <div id="beat-result" style="display: none;">
    <!-- Generated beat will appear here -->
  </div>
</div>

<style>
.baddbeatz-widget {
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  border: 2px solid #ff6b35;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  margin: 20px auto;
}

.baddbeatz-header h3 {
  color: #ffffff;
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Setup Guide */}
          <TabsContent value="setup" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">🚀 BaddBeatz.nl Setup Gids</CardTitle>
                <CardDescription>
                  Stap-voor-stap implementatie voor je platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-orange-400 font-semibold mb-4 text-lg">🔧 Technische Implementatie</h4>
                    <ol className="text-gray-300 space-y-4">
                      <li className="flex items-start">
                        <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 mt-1 font-bold">1</span>
                        <div>
                          <strong className="text-white">Upload bestanden naar BaddBeatz.nl</strong>
                          <p className="text-gray-400 text-sm mt-1">
                            • baddbeatz-custom-styles.css → /css/
                            <br />• baddbeatz-integration.js → /js/
                            <br />• baddbeatz-ai-plugin.php → /plugins/ (WordPress)
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 mt-1 font-bold">2</span>
                        <div>
                          <strong className="text-white">Integreer met je user systeem</strong>
                          <p className="text-gray-400 text-sm mt-1">
                            Connect getCurrentUserId() en getUserTier() met je bestaande systeem
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 mt-1 font-bold">3</span>
                        <div>
                          <strong className="text-white">Voeg AI Beat Generator toe</strong>
                          <p className="text-gray-400 text-sm mt-1">
                            Plaats HTML widget op je beats pagina of als modal popup
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 mt-1 font-bold">4</span>
                        <div>
                          <strong className="text-white">Test en lanceer</strong>
                          <p className="text-gray-400 text-sm mt-1">
                            Test alle functionaliteiten en ga live!
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="text-green-400 font-semibold mb-4 text-lg">💰 Business Model</h4>
                    <div className="space-y-4">
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                        <h5 className="text-green-400 font-medium mb-2">Revenue Sharing</h5>
                        <ul className="text-green-300 text-sm space-y-1">
                          <li>• 70/30 split op premium subscriptions</li>
                          <li>• Jij houdt 70% van alle betalingen</li>
                          <li>• Maandelijkse uitbetaling</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <h5 className="text-blue-400 font-medium mb-2">Nederlandse Pricing</h5>
                        <ul className="text-blue-300 text-sm space-y-1">
                          <li>• Gratis: 3 beats/dag</li>
                          <li>• Premium: €15/maand (50 beats/dag)</li>
                          <li>• Pro: €39/maand (unlimited)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                        <h5 className="text-purple-400 font-medium mb-2">White-Label Optie</h5>
                        <ul className="text-purple-300 text-sm space-y-1">
                          <li>• Volledige BaddBeatz branding</li>
                          <li>• Geen Freebeat.ai vermelding</li>
                          <li>• Custom domain: beats.baddbeatz.nl</li>
                          <li>• €99/maand flat fee</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Start Checklist */}
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="text-white font-semibold mb-4">✅ Quick Start Checklist</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-orange-400 font-medium mb-2">Vandaag implementeren:</h5>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>□ Download integration files</li>
                        <li>□ Test met demo API key</li>
                        <li>□ Customize BaddBeatz styling</li>
                        <li>□ Voeg toe aan een pagina</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-green-400 font-medium mb-2">Deze week uitbreiden:</h5>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>□ Connect user accounts</li>
                        <li>□ Setup premium features</li>
                        <li>□ Configure analytics</li>
                        <li>□ Launch marketing campaign</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section - Ready for BaddBeatz */}
        <div className="mt-12 text-center bg-gradient-to-r from-orange-900/30 to-yellow-900/30 rounded-2xl p-8 border border-orange-500/20">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
              <span className="text-white font-bold text-4xl">B</span>
            </div>
            <div className="text-left">
              <h2 className="text-4xl font-bold text-white">100% Klaar voor BaddBeatz.nl!</h2>
              <p className="text-orange-400 text-xl">Nederlandse markt • BaddBeatz branding • AI powered</p>
            </div>
          </div>
          
          <p className="text-gray-300 mb-8 max-w-4xl mx-auto text-lg leading-relaxed">
            Deze AI beat generator is <strong>volledig aangepast</strong> voor jouw BaddBeatz.nl platform. 
            Inclusief Nederlandse interface, lokale genres zoals Hardstyle en Nederlandse Hip-Hop, 
            BaddBeatz branding, en een bewezen monetization model.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <h4 className="text-orange-400 font-bold text-lg mb-2">🇳🇱 Nederlandse Focus</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Nederlandse Hip-Hop</li>
                <li>• Hardstyle & Gabber</li>
                <li>• Nederlandse interface</li>
                <li>• Euro pricing</li>
              </ul>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <h4 className="text-green-400 font-bold text-lg mb-2">💰 Revenue Ready</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 70/30 revenue split</li>
                <li>• Premium subscriptions</li>
                <li>• White-label optie</li>
                <li>• Maandelijkse payout</li>
              </ul>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <h4 className="text-purple-400 font-bold text-lg mb-2">🎵 Platform Perfect</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• BaddBeatz branding</li>
                <li>• User integration</li>
                <li>• Mobile responsive</li>
                <li>• Analytics included</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-none px-8 py-4 text-lg font-bold shadow-xl"
            >
              <a href="https://baddbeatz.nl" target="_blank" rel="noopener noreferrer">
                🚀 Implementeer op BaddBeatz.nl
              </a>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg font-bold"
            >
              <a href="/generator">Test de Live Generator</a>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 text-lg"
            >
              <a href="/pricing?source=baddbeatz">Bekijk Pricing Model</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}