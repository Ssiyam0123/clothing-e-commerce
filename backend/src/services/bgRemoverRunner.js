import { removeBackground } from "@imgly/background-removal-node";
import fs from "fs/promises";
import path from "path";

async function run() {
    const [,, inputPath, outputPath] = process.argv;
    if (!inputPath || !outputPath) {
        console.error("Missing input or output path arguments.");
        process.exit(1);
    }

    try {
        const inputBuffer = await fs.readFile(inputPath);
        const blobInput = new Blob([inputBuffer], { type: "image/png" });
        
        const distPath = path.resolve('node_modules/@imgly/background-removal-node/dist').replace(/\\/g, '/');
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
