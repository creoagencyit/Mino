
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, RotateCcw, Download, Image as ImageIcon, CheckCircle2, AlertCircle, Magnet, LayoutTemplate, Share2, FileText, MoveHorizontal } from 'lucide-react';
import { COLORS, TEXTURES, TEXTURE_ICONS } from './constants';
import { AppState, ColorOption, TextureOption } from './types';
import { generateWindowDesign } from './services/geminiService';
import { createSyntheticWindowImage, createProjectSheet } from './services/imageGenerator';
import ImageUpload from './components/ImageUpload';
import Button from './components/Button';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLORS[0]);
  const [selectedTexture, setSelectedTexture] = useState<TextureOption>(TEXTURES[0]); 
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Comparison Slider State
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const handleImageSelect = (base64: string) => {
    setOriginalImage(base64);
    setGeneratedImage(null);
    setAppState(AppState.READY);
    setErrorMsg(null);
    setSliderPosition(0); // Reset slider to hide generated initially
  };

  const loadSampleImage = useCallback(() => {
    try {
      const generatedBase64 = createSyntheticWindowImage();
      if (generatedBase64) {
        setOriginalImage(generatedBase64);
        setGeneratedImage(null);
        setAppState(AppState.READY);
        setSliderPosition(0);
      } else {
        throw new Error("Canvas generation failed");
      }
    } catch (err) {
      console.error("Failed to generate synthetic window:", err);
      setErrorMsg("Impossibile generare il modello 3D. Ricarica la pagina.");
    }
  }, []);

  // Auto-load sample image on mount
  useEffect(() => {
    loadSampleImage();
  }, [loadSampleImage]);

  // Animation effect when entering COMPLETE state
  useEffect(() => {
    if (appState === AppState.COMPLETE) {
      // Start from 0 (Original) and animate to 100% (Full Reveal) for a smooth replacement effect
      setSliderPosition(0);
      const timer = setTimeout(() => {
        setSliderPosition(100);
      }, 100); // Small delay to ensure render happens first
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleGenerate = async () => {
    if (!originalImage) return;

    setAppState(AppState.GENERATING);
    setErrorMsg(null);
    setSliderPosition(0); // Ensure we start looking at the "original" underneath

    try {
      const result = await generateWindowDesign(
        originalImage,
        selectedColor.name,
        selectedTexture.promptMod
      );
      setGeneratedImage(result);
      setAppState(AppState.COMPLETE);
    } catch (err) {
      console.error(err);
      setErrorMsg("Generazione fallita. Prova con un'immagine più chiara o controlla la tua connessione.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `magnetika-dgv-${selectedColor.id}-${selectedTexture.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadSheet = async () => {
    if (!originalImage || !generatedImage) return;
    
    try {
      const sheetDataUrl = await createProjectSheet(
        originalImage,
        generatedImage,
        selectedTexture.name,
        selectedColor.name
      );
      
      const link = document.createElement('a');
      link.href = sheetDataUrl;
      link.download = `MAGNETIKA-Progetto-${selectedTexture.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate sheet:", err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'MAGNETIKA DGV',
      text: 'Guarda queste cover magnetiche per infissi MAGNETIKA DGV: ',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
    setIsResizing(true);
  };

  const handleSliderUp = () => {
    setIsResizing(false);
  };

  // Helper to determine text color on button (dark text for light colors)
  const isLightColor = (id: string) => {
    return ['pure-white', 'cream', 'silver', 'mint', 'baby-pink', 'baby-blue', 'pearl-grey', 'lavender', 'sun-yellow', 'gold'].includes(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Magnet className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">MAGNETIKA DGV</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-sm font-medium text-slate-500 hidden sm:block">
               Sistemi di Copertura Magnetica
             </div>
             <button 
               onClick={handleShare}
               className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors flex items-center gap-2"
               title="Condividi su WhatsApp"
             >
               <span className="text-xs font-semibold hidden md:inline">Condividi</span>
               <Share2 className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* SECTION 1: The Window (Hero Area) */}
        <section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[500px] relative flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">1</span>
                <h3 className="font-semibold text-slate-800">La tua Finestra</h3>
             </div>
             {appState === AppState.COMPLETE && generatedImage && (
                <div className="flex items-center gap-2">
                   <button 
                     onClick={handleDownloadSheet}
                     className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                   >
                     <FileText className="w-4 h-4" /> Scheda
                   </button>
                   <button 
                     onClick={handleDownload}
                     className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
                   >
                     <Download className="w-4 h-4" /> Salva
                   </button>
                </div>
              )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center bg-slate-100/50 p-6 relative select-none">
            {errorMsg && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3 text-red-700 shadow-sm max-w-[90%]">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{errorMsg}</p>
                </div>
            )}

            {(appState === AppState.IDLE || appState === AppState.UPLOADING) && (
                <div className="w-full max-w-lg text-center flex flex-col items-center gap-6">
                  <div className="w-full p-6 border border-indigo-100 bg-indigo-50/50 rounded-2xl">
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Trasformazione Magnetica</h2>
                    <p className="text-slate-600 mb-4">
                      Applica le cover MAGNETIKA DGV con trame artistiche e materiali premium ai tuoi infissi esistenti.
                    </p>
                  </div>

                  <ImageUpload onImageSelected={handleImageSelect} />

                  <div className="flex items-center gap-4 w-full">
                    <div className="h-px bg-slate-300 flex-1"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Oppure</span>
                    <div className="h-px bg-slate-300 flex-1"></div>
                  </div>

                  <Button 
                    variant="secondary" 
                    fullWidth 
                    onClick={loadSampleImage}
                    className="h-12 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm"
                  >
                    <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                    Usa Modello 3D (2 Ante Standard)
                  </Button>
                </div>
            )}

            {/* PREVIEW & GENERATING STATE */}
            {(appState === AppState.READY || appState === AppState.GENERATING || (appState === AppState.UPLOADING && originalImage)) && originalImage && (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={originalImage} 
                  alt="Finestra Originale" 
                  className={`max-w-full max-h-[600px] object-contain rounded-lg shadow-md transition-all duration-500 ${appState === AppState.GENERATING ? 'opacity-50 blur-[2px]' : ''}`}
                />
                {appState === AppState.GENERATING && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="bg-white/90 backdrop-blur-md px-8 py-6 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center">
                      <div className="relative w-16 h-16 mb-4">
                          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-lg font-semibold text-slate-800">Progettazione Cover...</p>
                      <p className="text-sm text-slate-500">Applicazione: {selectedTexture.name}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* COMPLETED STATE - BEFORE/AFTER SLIDER */}
            {appState === AppState.COMPLETE && generatedImage && originalImage && (
              <div className="relative w-full h-full max-h-[600px] max-w-4xl mx-auto flex items-center justify-center rounded-lg shadow-xl overflow-hidden bg-slate-200">
                {/* 1. Underlying Original Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                   <img 
                     src={originalImage} 
                     alt="Originale" 
                     className="max-w-full max-h-[600px] object-contain w-full h-auto"
                     draggable={false}
                   />
                </div>

                {/* 2. Overlying Generated Image (Clipped) */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-all ease-in-out ${isResizing ? 'duration-0' : 'duration-[1500ms]'}`}
                  style={{ 
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  }}
                >
                   <img 
                     src={generatedImage} 
                     alt="Generata" 
                     className="max-w-full max-h-[600px] object-contain w-full h-auto"
                     draggable={false}
                   />
                </div>

                {/* 3. Slider Handle Line */}
                <div 
                   className={`absolute inset-y-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 transition-all ease-in-out ${isResizing ? 'duration-0' : 'duration-[1500ms]'}`}
                   style={{ left: `${sliderPosition}%` }}
                >
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg text-indigo-600 border border-slate-200">
                      <MoveHorizontal className="w-5 h-5" />
                   </div>
                </div>

                {/* 4. Invisible Range Input for Interaction */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={handleSliderChange}
                  onMouseUp={handleSliderUp}
                  onTouchEnd={handleSliderUp}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                  aria-label="Confronto prima e dopo"
                />
                
                {/* Labels */}
                <div 
                  className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded-md z-10 pointer-events-none transition-opacity duration-300"
                  style={{ opacity: sliderPosition > 90 ? 0 : 1 }}
                >
                  Originale
                </div>
                <div 
                  className="absolute bottom-4 right-4 bg-indigo-600/90 backdrop-blur text-white text-xs px-2 py-1 rounded-md shadow-lg z-10 pointer-events-none transition-opacity duration-300"
                  style={{ opacity: sliderPosition < 10 ? 0 : 1 }}
                >
                  Con Magnetika
                </div>
              </div>
            )}
            
            {appState === AppState.ERROR && originalImage && (
               <div className="relative w-full h-full flex items-center justify-center opacity-50 grayscale">
                <img src={originalImage} alt="Errore" className="max-w-full max-h-[600px] object-contain rounded-lg shadow-md" />
               </div>
            )}
          </div>
        </section>

        {/* SECTION 2: The Controls (Bottom Area) */}
        <section className={`transition-all duration-500 ${appState === AppState.IDLE ? 'opacity-50 pointer-events-none blur-[1px]' : 'opacity-100'}`}>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">2</span>
                  <h3 className="text-xl font-bold text-slate-900">Personalizza Cover</h3>
               </div>
               
               {appState !== AppState.IDLE && (
                 <Button variant="outline" onClick={handleReset} className="text-sm h-9">
                   <RotateCcw className="w-4 h-4" /> Reset
                 </Button>
               )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                
                {/* Textures (Graphic Patterns) - Taking prominence now */}
                <div className="lg:col-span-6">
                   <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Trame Grafiche e Materiali</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                      {TEXTURES.map((texture) => (
                        <button
                          key={texture.id}
                          onClick={() => setSelectedTexture(texture)}
                          className={`
                            flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                            ${selectedTexture.id === texture.id 
                              ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' 
                              : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
                          `}
                        >
                          <div className={`
                            p-2 rounded-lg flex-shrink-0
                            ${selectedTexture.id === texture.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}
                          `}>
                            {TEXTURE_ICONS[texture.id] || <Sparkles className="w-5 h-5"/>}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-900">{texture.name}</div>
                            <div className="text-xs text-slate-500 line-clamp-1">{texture.description}</div>
                          </div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Colors - Secondary importance for artistic prints */}
                <div className="lg:col-span-4">
                   <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Tonalità Base</h4>
                   <div className="grid grid-cols-5 sm:grid-cols-5 gap-3">
                      {COLORS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color)}
                          className={`
                            relative w-full aspect-square rounded-xl shadow-sm transition-all duration-200
                            ${selectedColor.id === color.id 
                              ? 'ring-2 ring-offset-2 ring-indigo-600 scale-105 z-10' 
                              : 'hover:scale-105 hover:shadow-md'}
                          `}
                          style={{ backgroundColor: color.hex, border: color.id === 'pure-white' ? '1px solid #e2e8f0' : 'none' }}
                          title={color.name}
                        >
                          {selectedColor.id === color.id && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <CheckCircle2 className={`w-5 h-5 drop-shadow-md ${isLightColor(color.id) ? 'text-slate-800' : 'text-white'}`} />
                            </span>
                          )}
                        </button>
                      ))}
                   </div>
                   <p className="mt-3 text-xs text-slate-500">
                     *I colori potrebbero fondersi con le trame grafiche.
                   </p>
                </div>

                {/* Generate Button */}
                <div className="lg:col-span-2 flex flex-col justify-end">
                   <Button 
                      fullWidth 
                      onClick={handleGenerate}
                      disabled={!originalImage || appState === AppState.GENERATING}
                      isLoading={appState === AppState.GENERATING}
                      className="h-14 text-lg font-bold shadow-xl shadow-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 border-none"
                    >
                      <Sparkles className="w-5 h-5" />
                      Applica
                    </Button>
                </div>

             </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default App;
