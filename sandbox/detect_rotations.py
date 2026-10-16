import asyncio, os, pymupdf
from winsdk.windows.media.ocr import OcrEngine
from winsdk.windows.graphics.imaging import BitmapDecoder
from winsdk.windows.storage import StorageFile
from winsdk.windows.globalization import Language
from PIL import Image

async def find_rotations():
    doc = pymupdf.open('sandbox/csa c22 no 1/CSA-015-15-Wood-Utility-Poles.pdf')
    engine = OcrEngine.try_create_from_user_profile_languages()
    if not engine:
        engine = OcrEngine.try_create_from_language(Language('en-US'))
    
    landscape_pages = []
    # Test all pages from 20 to 92
    for p in range(19, len(doc)):
        page_num = p + 1
        with open(f'sandbox/csa_o15_ocr_tmp/page_{page_num}.txt', 'r', encoding='utf-8') as f:
            p_text = f.read()
            p_words = len([w for w in p_text.split() if any(c.isalnum() for c in w)])
        
        pix = doc[p].get_pixmap(dpi=150)
        img_path = f'sandbox/csa_o15_ocr_tmp/p{page_num}_rot.png'
        im = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
        im_rot = im.rotate(270, expand=True)
        im_rot.save(img_path)
        
        file = await StorageFile.get_file_from_path_async(os.path.abspath(img_path))
        stream = await file.open_async(0)
        decoder = await BitmapDecoder.create_async(stream)
        bitmap = await decoder.get_software_bitmap_async()
        res = await engine.recognize_async(bitmap)
        r_text = '\n'.join([l.text for l in res.lines])
        r_words = len([w for w in r_text.split() if any(c.isalnum() for c in w)])
        
        first_line = res.lines[0].text if res.lines else ''
        if r_words > p_words * 1.3 or ('Table' in r_text and 'Table' not in p_text):
            print(f'P{page_num}: LANDSCAPE (rot: {r_words} vs portrait: {p_words}) -> {first_line}')
            landscape_pages.append(page_num)
            with open(f'sandbox/csa_o15_ocr_tmp/page_{page_num}.txt', 'w', encoding='utf-8') as f:
                f.write(r_text)
        else:
            print(f'P{page_num}: PORTRAIT (portrait: {p_words} vs rot: {r_words})')
            
    print('Landscape pages detected and updated:', landscape_pages)

if __name__ == '__main__':
    asyncio.run(find_rotations())
