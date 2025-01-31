import os
from pathlib import Path
from PIL import Image

def convert_images_to_webp(source_dir, dest_dir):
    source_dir = Path(source_dir)
    dest_dir = Path(dest_dir)
    
    if not source_dir.exists():
        print("Source directory does not exist.")
        return
    
    for root, _, files in os.walk(source_dir):
        relative_path = Path(root).relative_to(source_dir)
        target_folder = dest_dir / relative_path
        target_folder.mkdir(parents=True, exist_ok=True)
        
        for file in files:
            file_path = Path(root) / file
            try:
                with Image.open(file_path) as img:
                    webp_path = target_folder / (file_path.stem + ".webp")
                    img.save(webp_path, "WEBP", quality=80)
                    print(f"Converted: {file_path} -> {webp_path}")
            except Exception as e:
                print(f"Skipping {file_path}: {e}")

if __name__ == "__main__":
    source_directory = "public/images"
    destination_directory = "images_webp"
    convert_images_to_webp(source_directory, destination_directory)
