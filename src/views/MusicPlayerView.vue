<script>
import '@fortawesome/fontawesome-free/css/all.css'
import SongList from '@/components/SongList.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'

export default {
  components: {
    SongList,
    MusicPlayer,
  },
  data() {
    return {
      currentSongId: parseInt(localStorage.getItem('currentSongId'), 10) || 0,
      showSongList: window.innerWidth > 768,
    }
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 768 // 判断是否为手机端
    },
  },
  mounted() {
    // 在组件挂载后，如果窗口大小改变，可以更新 showSongList
    // window.addEventListener('resize', this.handleResize);
    // window.addEventListener('scroll', this.preventScrollClose);
    this.currentSongId = parseInt(localStorage.getItem('currentSongId'), 10)
    // 在组件挂载时获取初始窗口高度
    this.updateViewportHeight()

    // 监听窗口大小变化
    window.addEventListener('resize', this.updateViewportHeight)
    this.$store.commit('setShowNavbar', !this.showSongList)
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听器
    // window.removeEventListener('resize', this.handleResize);
    // window.removeEventListener('scroll', this.preventScrollClose);
    // 在组件销毁时移除事件监听器
    window.removeEventListener('resize', this.updateViewportHeight)
  },
  methods: {
    updateViewportHeight() {
      // 获取浏览器的可视区域高度
      const viewportHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

      // 将页面的高度设置为可视区域的高度
      document.body.style.height = `${viewportHeight}px`
    },
    preventScrollClose(event) {
      // 阻止默认的滚动行为，确保侧边栏不会因为滚动而关闭
      event.preventDefault()
      event.stopPropagation()
    },
    handleResize() {
      this.showSongList = window.innerWidth > 768 // 更新 showSongList
    },
    updateCurrentSongId(songId) {
      this.currentSongId = songId
      localStorage.setItem('currentSongId', songId)
      this.$emit('songChanged', songId)
    },
    playSong(songId) {
      const song = this.songs.find(s => s.id === songId)
      if (song) {
        this.loadMusic(song)
      } else {
        console.warn(`未找到 ID 为 ${songId} 的歌曲`)
      }
      localStorage.setItem('currentSongId', songId)
    },
    toggleSongList() {
      this.showSongList = !this.showSongList
      // 控制 Navbar 显示状态
      this.$store.commit('setShowNavbar', !this.showSongList)
      // if (this.showSongList === true) {
      //   this.$store.commit('setShowNavbar', false)
      // } else {
      //   this.$store.commit('setShowNavbar', true)
      // }
    },
  },
}
</script>

<template>
  <div class="main-container">
    <div
      id="songlist"
      class="app"
      :class="{
        show: showSongList,
        'slide-left': isMobile,
        'slide-right': !isMobile,
      }"
    >
      <div class="offcanvas-header">
        <button
          type="button"
          class="close"
          v-if="isMobile"
          @click="toggleSongList"
          style="margin-left: auto"
        >
          <i
            class="bi bi-x-square-fill"
            style="color: #666666; font-size: 1.5em"
          ></i>
        </button>
      </div>

      <transition name="slide-fade">
        <!-- 确保引用 SongList -->
        <SongList
          v-if="showSongList"
          :currentSongId="currentSongId"
          @selectSong="updateCurrentSongId"
          @songChanged="playSong"
        />
      </transition>
    </div>

    <div id="app" class="app" style="flex: 6">
      <!-- 确保引用 MusicPlayer -->
      <MusicPlayer
        :currentSongId="currentSongId"
        @songChanged="updateCurrentSongId"
        @toggleSongList="toggleSongList"
      />
    </div>
  </div>
</template>

<style>
@import '../assets/font/font.css';

.main-container {
  display: flex;
  transition: all 0.5s ease;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

#songlist {
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: white;
  z-index: 1000;
  transition: transform 0.5s ease; /* 为 transform 添加过渡动画 */
}

#songlist.show {
  transform: translateX(0);
}

.app {
  font-family: 'PingFangTC-Medium', serif;
  font-weight: 400;
}

/* 手机端样式 */
@media (max-width: 768px) {
  #songlist {
    left: 0;
    width: 100%;
    transform: translateX(-100%); /* 从左侧进入 */
  }

  #songlist.show {
    transform: translateX(0); /* 打开时从左侧滑入 */
  }

  .offcanvas-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }

  .close {
    border: none;
    background: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
}

/* 桌面端样式 */
@media (min-width: 769px) {
  #songlist {
    right: 0;
    max-width: 500px; /* 桌面端宽度不全屏 */
    transform: translateX(100%); /* 从右侧进入 */
  }

  #songlist.show {
    transform: translateX(0); /* 打开时从右侧滑入 */
  }

  .close {
    display: none; /* 在桌面端隐藏关闭按钮 */
  }
}
</style>
