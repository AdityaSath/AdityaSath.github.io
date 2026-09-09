"""Prepare the user's browser-compatible H.264 video. Requires FFmpeg."""
import argparse
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('--ffmpeg', default='ffmpeg')
args = parser.parse_args()
(ROOT/'media').mkdir(exist_ok=True)
output = ROOT/'media/rocket-plume.mp4'
# Remove the bottom 90px containing the watermark and play at half speed.
# Keep the original source untouched and prepare a silent, streaming-friendly MP4.
subprocess.run([args.ffmpeg, '-y', '-hide_banner', '-loglevel', 'error',
    '-i', str(args.source), '-map', '0:v:0', '-an', '-map_metadata', '-1',
    '-vf', 'crop=1920:990:0:0,setpts=2*(PTS-STARTPTS),fps=24',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', str(output)], check=True)
subprocess.run([args.ffmpeg, '-y', '-hide_banner', '-loglevel', 'error',
    '-ss', '6', '-i', str(output), '-frames:v', '1', '-q:v', '3', '-update', '1',
    str(ROOT/'images/plume-poster.jpg')], check=True)
print(f'Prepared landing animation: {output.stat().st_size / 1_000_000:.2f} MB')
