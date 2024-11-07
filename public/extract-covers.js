//node extract-covers.js


import { existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from 'fs';
import { resolve, basename, extname, join } from 'path';
import { parseFile } from 'music-metadata';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Buffer } from 'buffer';

// 获取当前模块的目录名（模拟 __dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 设置音乐文件夹路径和封面保存路径
const musicDir = resolve(__dirname, 'music');  // 音乐文件夹路径
const coverDir = resolve(__dirname, 'image'); // 封面保存路径

// 创建封面保存目录（如果不存在）
if (!existsSync(coverDir)) {
  mkdirSync(coverDir, { recursive: true });
}

// 获取音乐文件信息（包括封面图）
const getMusicInfo = async (filePath) => {
  try {
    const metadata = await parseFile(filePath);
    const cover = metadata.common.picture ? metadata.common.picture[0] : null;

    if (cover) {
      // 保存封面图像
      const coverFileName = basename(filePath, extname(filePath)) + '.jpg';
      const coverFilePath = join(coverDir, coverFileName);

      // 保存封面图像到本地
      const buffer = Buffer.from(cover.data);
      writeFileSync(coverFilePath, buffer);

      console.log(`封面已保存到 ${coverFilePath}`);
    }
  } catch (err) {
    console.error(`无法解析文件 ${filePath}`, err);
  }
};

// 递归遍历文件夹以获取音乐文件
const saveCoverImages = (dir) => {
  const items = readdirSync(dir);
  items.forEach(item => {
    const itemPath = join(dir, item);
    const stats = statSync(itemPath);

    if (stats.isDirectory()) {
      // 如果是目录，递归调用
      saveCoverImages(itemPath);
    } else if (extname(item).toLowerCase() === '.mp3') {
      // 如果是音乐文件，提取封面
      getMusicInfo(itemPath);
    }
  });
};

// 开始处理音乐文件夹
saveCoverImages(musicDir);
