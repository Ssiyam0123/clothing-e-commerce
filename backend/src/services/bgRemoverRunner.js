import { removeBackground } from "@imgly/background-removal-node";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

async function run() {
    const [,, inputPath, outputPath] = process.argv;
    if (!inputPath || !outputPath) {
        console.error("Missing input or output path arguments.");
        process.exit(1);
    }

    try {
        const inputBuffer = await fs.readFile(inputPath);
        const blobInput = new Blob([inputBuffer], { type: "image/png" });
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const distPath = path.resolve(__dirname, "../../node_modules/@imgly/background-removal-node/dist").replace(/\\/g, '/');
        const publicPath = `file://${distPath}/`;
        
        const blob = await removeBackground(blobInput, { publicPath });
        const outBuffer = Buffer.from(await blob.arrayBuffer());
        
        await fs.writeFile(outputPath, outBuffer);
        process.exit(0);
    } catch (err) {
        console.error("Runner Error:", err.message);
        process.exit(1);
    }
}

run();
