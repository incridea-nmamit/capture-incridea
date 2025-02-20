import ffmpeg from 'ffmpeg-static';
import { spawn } from 'child_process';
import path from 'path';

export const convertToHLS = async (inputPath: string, outputDir: string, filename: string) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(outputDir, `${filename}.m3u8`);
    
    const ffmpegProcess = spawn(ffmpeg as string, [
      '-i', inputPath,
      '-profile:v', 'baseline',
      '-level', '3.0',
      '-start_number', '0',
      '-hls_time', '10',
      '-hls_list_size', '0',
      '-f', 'hls',
      outputPath
    ]);

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data}`);
    });
  });
};
