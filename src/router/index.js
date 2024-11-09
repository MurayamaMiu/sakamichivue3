import { createRouter, createWebHistory } from 'vue-router'
import MusicPlayerView from '../views/MusicPlayerView.vue'
import IndexView from '@/views/IndexView.vue'
import SongList from '@/components/SongList.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
    },
    {
      path: '/musicplayer',
      name: 'musicplayer',
      component: MusicPlayerView,
      children: [
        {
          path: '',
          components: {
            songlist: SongList,
            player: MusicPlayer,
          },
        },
      ],
    },
    {
      path: '/docs',
      name: 'docs',
      beforeEnter() {
        window.location.href = `${window.location.origin}/docs/index.html`
      },
    },
  ],
})

export default router
