import sharp from 'sharp';
import fs from 'fs/promises';

async function test() {
  try {
    const inputPath = 'C:/Users/ssiya/.gemini/antigravity-ide/brain/bafcc96f-b098-4f5e-9d9f-9d235331f619/drip_nation_logo_pure_1779273313191.png';
    const buffer = await fs.readFile(inputPath);
    console.log("Input size:", buffer.length);
    
    // Test resize and compression using sharp
    const outBuffer = await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .png({ compressionLevel: 8 })
      .toBuffer();
      
    console.log("Output size:", outBuffer.length);
    
    const outputPath = 'C:/Users/ssiya/.gemini/antigravity-ide/brain/bafcc96f-b098-4f5e-9d9f-9d235331f619/drip_nation_logo_sharp.png';
    await fs.writeFile(outputPath, outBuffer);
    console.log("Saved compressed image via sharp!");
  } catch (err) {
    console.error("Sharp test failed:", err);
  }
}

test();
