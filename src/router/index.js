import { createRouter, createWebHashHistory } from 'vue-router'
import MusicPlayerView from '../views/MusicPlayerView.vue'
import SongList from '@/components/SongList.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'

const router = createRouter({
  //   Vue Router History 模式：你在 Vue Router 中使用了 createWebHistory()，这会让路由路径看起来像是普通的 URL（例如 /musicplayer），而不会显示 #（hash）符号。虽然这对于正常的浏览体验非常好，但在部署到 GitHub Pages 这样的静态网站托管环境中，如果直接访问非根路径（例如 /musicplayer），会导致 404 错误，因为 GitHub Pages 不知道如何处理这个路径。

  // 静态文件托管的限制：GitHub Pages 是一个静态网站托管服务，它不处理动态路由。当你访问 https://your-username.github.io/repository-name/musicplayer 时，GitHub 会尝试寻找 musicplayer 目录下的 index.html 文件，但由于它只会直接提供静态资源而不会处理 Vue Router 的动态路由，所以会导致 404 错误。
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL), // hash 模式
  routes: [
    {
      path: '/',
      component: MusicPlayerView,
      children: [
        {
          path: '',
          name: 'musicplayer',
          components: {
            songlist: SongList,
            player: MusicPlayer,
          },
        },
      ],
    },
  ],
})

export default router
