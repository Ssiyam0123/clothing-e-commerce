import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execPromise = util.promisify(exec);

async function test() {
    const inputPath = 'C:/Users/ssiya/.gemini/antigravity-ide/brain/bafcc96f-b098-4f5e-9d9f-9d235331f619/drip_nation_logo_pure_1779273313191.png';
    const outputPath = 'C:/Users/ssiya/.gemini/antigravity-ide/brain/bafcc96f-b098-4f5e-9d9f-9d235331f619/drip_nation_logo_runner_out.png';
    
    const runnerPath = path.resolve('src/services/bgRemoverRunner.js');
    
    console.log("Running child process...");
    console.time("child_process");
    try {
        const { stdout, stderr } = await execPromise(`node "${runnerPath}" "${inputPath}" "${outputPath}"`);
        console.timeEnd("child_process");
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
        console.log("Success!");
    } catch (e) {
        console.error("Failed:", e);
    }
}

test();
