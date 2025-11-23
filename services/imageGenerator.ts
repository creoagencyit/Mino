

export const createSyntheticWindowImage = (): string => {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  // High resolution for quality
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  // 1. Background - Neutral Wall (Clean White/Grey for Product Shot)
  const wallGradient = ctx.createLinearGradient(0, 0, 0, 900);
  wallGradient.addColorStop(0, '#f8fafc'); // Slate-50
  wallGradient.addColorStop(1, '#e2e8f0'); // Slate-200
  ctx.fillStyle = wallGradient;
  ctx.fillRect(0, 0, 1200, 900);

  // Center coordinates
  const cx = 600;
  const cy = 450;
  
  // Window Dimensions (Two-sash standard window)
  const wWidth = 500;
  const wHeight = 550;
  const wX = cx - (wWidth / 2);
  const wY = cy - (wHeight / 2);

  // === SHADOWS ===
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;
  ctx.shadowOffsetX = 0;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(wX, wY, wWidth, wHeight);
  ctx.restore();

  // === OUTER FRAME ===
  const frameWidth = 40;
  ctx.fillStyle = '#fdfdfd'; // Pure white PVC
  ctx.fillRect(wX, wY, wWidth, wHeight);
  
  // Outer frame contours (Simple shading)
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.strokeRect(wX, wY, wWidth, wHeight);

  // Inner recess of the frame
  const innerX = wX + frameWidth;
  const innerY = wY + frameWidth;
  const innerW = wWidth - (frameWidth * 2);
  const innerH = wHeight - (frameWidth * 2);
  
  ctx.fillStyle = '#f1f5f9'; // Slightly darker recess
  ctx.fillRect(innerX, innerY, innerW, innerH);
  ctx.strokeRect(innerX, innerY, innerW, innerH);

  // === SASHES (Ante) ===
  const sashGap = 4; // Gap between sashes in the middle
  const centralPostWidth = 0; // Modern windows often overlap
  const sashW = (innerW - sashGap) / 2;
  const sashH = innerH - 6; // Small gap top/bottom
  
  const drawSash = (x: number, y: number, handleSide: 'left' | 'right') => {
    // Sash Frame Material
    const sashFrameSize = 45;
    
    // Main Sash Body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, sashW, sashH);
    
    // Sash Border/Bevel
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, sashW, sashH);
    
    // Miter joints (Diagonal lines at corners)
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.moveTo(x, y);
    ctx.lineTo(x + sashFrameSize, y + sashFrameSize);
    ctx.moveTo(x + sashW, y);
    ctx.lineTo(x + sashW - sashFrameSize, y + sashFrameSize);
    ctx.moveTo(x, y + sashH);
    ctx.lineTo(x + sashFrameSize, y + sashH - sashFrameSize);
    ctx.moveTo(x + sashW, y + sashH);
    ctx.lineTo(x + sashW - sashFrameSize, y + sashH - sashFrameSize);
    ctx.stroke();

    // Glass Pane
    const gx = x + sashFrameSize;
    const gy = y + sashFrameSize;
    const gw = sashW - (sashFrameSize * 2);
    const gh = sashH - (sashFrameSize * 2);

    // Glass Gradient
    const glassGrad = ctx.createLinearGradient(gx, gy, gx + gw, gy + gh);
    glassGrad.addColorStop(0, '#e0f2fe'); // Sky 100
    glassGrad.addColorStop(1, '#dbeafe'); // Blue 100
    ctx.fillStyle = glassGrad;
    ctx.fillRect(gx, gy, gw, gh);
    
    // Inner rubber seal (Black gasket)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(gx, gy, gw, gh);

    // Reflection on Glass
    ctx.save();
    ctx.beginPath();
    ctx.rect(gx, gy, gw, gh);
    ctx.clip();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(gx - 20, gy + gh);
    ctx.lineTo(gx + gw + 20, gy - 20);
    ctx.lineTo(gx + gw + 100, gy - 20);
    ctx.lineTo(gx + 60, gy + gh);
    ctx.fill();
    ctx.restore();

    // Handle
    const handleY = y + (sashH / 2);
    const handleX = handleSide === 'left' ? x + sashW - 25 : x + 25;
    
    // Handle Escutcheon (Base)
    ctx.fillStyle = '#cbd5e1'; // Silver/Grey
    ctx.fillRect(handleX - 8, handleY - 30, 16, 60);
    
    // Handle Grip
    ctx.strokeStyle = '#94a3b8'; // Darker silver
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(handleX, handleY - 10);
    ctx.lineTo(handleX, handleY + 10);
    // Grip direction
    ctx.lineTo(handleX + (handleSide === 'left' ? -50 : 50), handleY + 10);
    ctx.stroke();

    // Handle Highlight
    ctx.strokeStyle = '#f1f5f9'; // Lighter silver
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(handleX, handleY - 10);
    ctx.lineTo(handleX, handleY + 8);
    ctx.lineTo(handleX + (handleSide === 'left' ? -48 : 48), handleY + 8);
    ctx.stroke();
  };

  // Draw Left Sash
  drawSash(innerX + 2, innerY + 3, 'left');
  
  // Draw Right Sash
  drawSash(innerX + sashW + sashGap - 2, innerY + 3, 'right');
  
  // === SILL (Davanzale) ===
  const sillY = wY + wHeight;
  const sillX = wX - 10;
  const sillW = wWidth + 20;
  
  ctx.fillStyle = '#334155'; // Dark Slate (Stone/Marble look)
  ctx.fillRect(sillX, sillY, sillW, 25);
  
  // Sill highlight
  ctx.fillStyle = '#475569';
  ctx.fillRect(sillX, sillY, sillW, 5);

  return canvas.toDataURL('image/jpeg', 0.95);
};

export const createProjectSheet = async (
  original: string,
  generated: string,
  texture: string,
  color: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject('No canvas context'); return; }

    // Full HD layout
    canvas.width = 1920;
    canvas.height = 1080;

    const img1 = new Image();
    const img2 = new Image();
    let loadedCount = 0;

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        // 1. Background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Header
        ctx.fillStyle = '#1e293b'; // Slate 800
        ctx.fillRect(0, 0, 1920, 140);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px Inter, system-ui, sans-serif';
        ctx.fillText('MAGNETIKA DGV', 60, 90);
        
        ctx.font = '30px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Simulazione Cover Magnetica', 500, 90);

        // 3. Image Layout
        const margin = 60;
        const availableWidth = (1920 - (margin * 3)) / 2;
        const availableHeight = 1080 - 140 - 200 - (margin * 2); // Header - Footer - Margins
        const contentY = 140 + margin;

        // Draw Images
        drawImageScaled(ctx, img1, margin, contentY, availableWidth, availableHeight);
        drawImageScaled(ctx, img2, margin * 2 + availableWidth, contentY, availableWidth, availableHeight);

        // 4. Labels
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.textAlign = 'center';
        // Position labels above images or below? Below looks cleaner.
        ctx.fillText('Stato Attuale', margin + availableWidth / 2, contentY - 20);
        ctx.fillText('Con Cover Magnetika', margin * 2 + availableWidth * 1.5, contentY - 20);

        // 5. Footer / Specs
        const footerY = 1080 - 180;
        ctx.fillStyle = '#ffffff';
        // Top shadow for footer
        ctx.shadowColor = 'rgba(0,0,0,0.05)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = -5;
        ctx.fillRect(0, footerY, 1920, 180);
        ctx.shadowColor = 'transparent';

        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 40px Inter, sans-serif';
        ctx.fillText(texture, 60, footerY + 80);
        
        ctx.font = '30px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`Finitura Base: ${color}`, 60, footerY + 130);
        
        ctx.textAlign = 'right';
        ctx.font = 'italic 24px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Design generato con MAGNETIKA DGV App', 1860, footerY + 100);

        resolve(canvas.toDataURL('image/jpeg', 0.9));
      }
    };

    img1.crossOrigin = "anonymous";
    img2.crossOrigin = "anonymous";
    img1.onload = onImageLoad;
    img2.onload = onImageLoad;
    img1.onerror = reject;
    img2.onerror = reject;

    img1.src = original;
    img2.src = generated;
  });
};

function drawImageScaled(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, maxW: number, maxH: number) {
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const offsetX = (maxW - w) / 2;
  const offsetY = (maxH - h) / 2;

  ctx.save();
  // Shadow for images
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  ctx.drawImage(img, x + offsetX, y + offsetY, w, h);
  ctx.restore();
  
  // Border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(x + offsetX, y + offsetY, w, h);
}
