import { readdirSync, statSync, writeFileSync } from 'fs';
import { resolve, basename, extname, join } from 'path';
import { parseFile } from 'music-metadata';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取当前模块的目录名（模拟 __dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 设置音乐文件夹路径和 JSON 保存路径
const musicDir = resolve(__dirname, 'music');
const outputJsonPath = resolve(__dirname, 'songs.json');

// 初始化 JSON 结构
const songsJson = { songs: [] };
let songId = 1;

// 递归遍历文件夹以获取音乐文件
const saveSongsInfo = async (dir) => {
  const items = readdirSync(dir);
  for (const item of items) {
    const itemPath = join(dir, item);
    const stats = statSync(itemPath);

    if (stats.isDirectory()) {
      // 如果是目录，递归调用
      await saveSongsInfo(itemPath);
    } else if (extname(item).toLowerCase() === '.mp3') {
      try {
        const metadata = await parseFile(itemPath);
        const artist = metadata.common.artist || "Unknown Artist";
        const displayName = basename(item, extname(item)).replace(artist, '').replace('-','').trim();

        // 定义各路径
        const path = `music/${artist}/${basename(itemPath)}`;
        const lrcPath = path.replace('.mp3', '.lrc');
        const cover = `image/${basename(item, extname(item))}.jpg`;

        // 将歌曲信息添加到 JSON 结构中
        songsJson.songs.push({
          id: songId++,
          path: path,
          lrcPath: lrcPath,
          displayName: displayName,
          cover: cover,
          artist: artist
        });

        console.log(`歌曲信息已保存: ${displayName}`);
      } catch (err) {
        console.error(`无法解析文件 ${itemPath}`, err);
      }
    }
  }
};

// 遍历音乐文件夹并保存 JSON
await saveSongsInfo(musicDir);

// 写入 JSON 文件
writeFileSync(outputJsonPath, JSON.stringify(songsJson, null, 2), 'utf8');
console.log(`歌曲信息已保存到 ${outputJsonPath}`);
