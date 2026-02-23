import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../src/assets/mantras');
const outputDir = path.join(__dirname, '../src/assets/deities');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir);

const convertImages = async () => {
    for (const file of files) {
        if (!file.match(/\.(png|jpe?g)$/i)) continue;

        const inputPath = path.join(inputDir, file);
        // Normalize filename: lowercase, hypthens instead of underscores or spaces
        const outputName = path.parse(file).name.toLowerCase().replace(/[_\s]+/g, '-');
        const outputPath = path.join(outputDir, `${outputName}.webp`);

        try {
            await sharp(inputPath)
                .resize(256, 256, { fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(outputPath);
            console.log(`Converted ${file} -> ${outputName}.webp`);
        } catch (error) {
            console.error(`Error converting ${file}:`, error);
        }
    }

    // Generate a generic fallback image
    const fallbackPath = path.join(outputDir, 'generic-fallback.webp');
    if (!fs.existsSync(fallbackPath)) {
        try {
            await sharp({
                create: {
                    width: 256,
                    height: 256,
                    channels: 4,
                    background: { r: 0, g: 0, b: 0, alpha: 0.1 }
                }
            })
                .webp({ quality: 80 })
                .toFile(fallbackPath);
            console.log('Created generic-fallback.webp');
        } catch (error) {
            console.error(`Error creating fallback image:`, error);
        }
    }

    console.log('Done converting images.');
};

convertImages();
