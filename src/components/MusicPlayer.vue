<template>
  <div class="background">
    <img :src="currentSong.cover" id="bg-img" />
  </div>
  <div class="container">
    <div class="player-img">
      <img :src="currentSong.cover" class="active" id="cover" />
    </div>
    <div class="label">
      <h2>{{ currentSong.displayName }}</h2>
      <h4>{{ currentSong.artist }}</h4>
    </div>
    <div class="lyrics">
      <div>{{ currentLyrics.japanese }}</div>
      <div>{{ currentLyrics.chinese }}</div>
    </div>
    <div class="player-progress">
      <vue-slider
        v-model="sliderValue"
        :min="0"
        :max="100"
        :height="10"
        :dot-size="16"
        :drag-on-click="true"
        :tooltip="'focus'"
        :duration="0.2"
        :silent="true"
        :tooltip-formatter="formatTimeTooltip"
        @change="setProgressFromSlider"
        class="progress-slider"
      />
      <div class="music-duration">
        <span>{{ currentTime }}</span>
        <span>{{ duration }}</span>
      </div>
    </div>

    <MsgModal
      v-if="showModal"
      :errorMessage="errorMessage"
      @close="showModal = false"
    />

    <div
      id="msgToast"
      class="toast align-items-center"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-delay="1000"
    >
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi bi-chat-left-dots-fill"></i> {{ alertMessage }}
        </div>
        <button
          type="button"
          class="btn-close me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>

    <div class="player-controls">
      <i
        class="fa-solid fa-backward"
        title="Previous"
        @click="changeMusic(-1)"
      ></i>
      <i
        class="fa-solid"
        :class="isPlaying ? 'fa-pause' : 'fa-play'"
        title="Play"
        @click="togglePlay"
      ></i>
      <i class="fa-solid fa-forward" title="Next" @click="changeMusic(1)"></i>
    </div>
    <div class="settings-controls">
      <i
        v-if="playbackMode === 'repeat'"
        class="bi bi-repeat"
        @click="togglePlaybackMode"
      ></i>
      <i
        v-if="playbackMode === 'repeat-one'"
        class="bi bi-repeat-1"
        @click="togglePlaybackMode"
      ></i>
      <i
        v-if="playbackMode === 'shuffle'"
        class="bi bi-shuffle"
        @click="togglePlaybackMode"
      ></i>
      <i
        v-if="isFavorited"
        class="bi bi-bookmark-heart-fill"
        @click="toggleFavorite"
      ></i>
      <i v-else class="bi bi-bookmark-heart" @click="toggleFavorite"></i>
      <i
        class="bi bi-volume-up-fill"
        id="volumeIcon"
        data-bs-toggle="modal"
        data-bs-target="#volumeModal"
      ></i>
      <i
        class="bi bi-music-note-list"
        @click="$emit('toggleSongList')"
        style="cursor: pointer"
      ></i>
      <!--      <i class="bi bi-three-dots"></i>-->
      <i class="bi bi-translate" @click="changeLanguage('zh')"></i>
      <i
        class="bi bi-journal-code"
        @click="goToDocs"
        @auxclick="goToDocsNewTab"
        style="cursor: pointer"
      ></i>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="volumeModal"
      tabindex="-1"
      aria-labelledby="volumeModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4
              class="modal-title fs-5"
              id="volumeModalLabel"
              style="font-size: 15px !important"
            >
              {{ $t('volume') }}
            </h4>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="volume-control">
              <i class="bi bi-volume-up-fill volume-icon"></i>
              <vue-slider
                v-model="volumeSliderValue"
                :min="0"
                :max="100"
                :height="10"
                :dot-size="16"
                :drag-on-click="true"
                :tooltip="'focus'"
                :duration="0.2"
                :silent="true"
                @change="handleVolumeChange"
                class="volume-slider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Howl } from 'howler'
import axios from 'axios'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import * as bootstrap from 'bootstrap'
import MsgModal from './MessageModal.vue'

export default {
  emits: ['songChanged', 'toggleSongList'],
  components: { VueSlider, MsgModal },
  props: {
    currentSongId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showAlert: false, // 控制提示框显示状态
      alertMessage: '', // 存储提示消息
      volume: 100, // 音量值
      volumeSliderValue: 100, // 新增的音量滑块值
      musicIndex: 0,
      isPlaying: false,
      currentSong: {},
      currentLyrics: { japanese: '', chinese: '' },
      lyricsArray: [],
      songs: [],
      currentTime: '0:00',
      duration: '0:00',
      sliderValue: 0, // 用于滑块的值
      sound: null, // 用于存储 Howl 实例
      isLoaded: false, // 添加加载标志
      showModal: false,
      errorMessage: '',
      playbackMode: 'repeat', // 默认播放模式
      isFavorited: false, // 初始化收藏状态
      favoritedSongs: JSON.parse(localStorage.getItem('favoritedSongs')) || [], // 从 localStorage 中读取收藏的歌曲 ID
    }
  },
  mounted() {
    // Media Session API 初始化
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        this.playMusic()
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        this.pauseMusic()
      })
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.changeMusic(-1) // 上一曲
      })
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.changeMusic(1) // 下一曲
      })
    }

    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      this.$i18n.locale = savedLanguage // 设置初始语言
    }

    // 从 localStorage 读取设置
    const savedVolume = localStorage.getItem('volume')
    if (savedVolume) {
      this.volumeSliderValue = parseInt(savedVolume, 10) //转换成10进制整数
      this.updateVolume() // 更新音量
    }

    const savedPlaybackMode = localStorage.getItem('playbackMode')
    if (savedPlaybackMode) {
      this.playbackMode = savedPlaybackMode // 设置播放模式
    }

    // 从 localStorage 读取设置
    this.favoritedSongs =
      JSON.parse(localStorage.getItem('favoritedSongs')) || [] // 初始化收藏列表
    this.fetchSongs()
  },
  methods: {
    goToDocs(event) {
      // 左键点击：在当前标签页跳转
      event.preventDefault()
      const newUrl = `${window.location.origin}${window.location.pathname}docs`
      window.location.href = newUrl
    },
    goToDocsNewTab() {
      // 长按或中键点击：在新标签页打开
      const newUrl = `${window.location.origin}${window.location.pathname}docs`
      window.open(newUrl, '_blank')
    },
    changeLanguage() {
      const newLanguage = this.$i18n.locale === 'ja' ? 'zh' : 'ja' // 切换语言
      this.$i18n.locale = newLanguage // 更新当前语言
      this.$changeLanguage(newLanguage) // 调用全局方法切换语言
      localStorage.setItem('language', newLanguage) // 保存到本地存储
      this.showToast()
      this.alertMessage = this.$t('translation')
    },
    playSong(songId) {
      const song = this.songs.find(s => s.id === songId)
      if (song) {
        this.loadMusic(song) // 加载对应的音乐
        this.$nextTick(() => {
          // 等待 DOM 更新后再尝试播放
          this.playMusic() // 自动播放音乐
        })
      } else {
        console.warn(`未找到 ID 为 ${songId} 的歌曲`) // 处理未找到的情况
      }
      localStorage.setItem('currentSongId', songId) // 保存到 localStorage
    },
    showToast() {
      const toastElement = document.querySelector('.toast')
      const toast = new bootstrap.Toast(toastElement)
      toast.show() // 显示 Toast
    },
    toggleFavorite() {
      const songId = this.currentSong.id // 假设你的歌曲对象有一个 id 属性
      if (this.isFavorited) {
        this.favoritedSongs = this.favoritedSongs.filter(id => id !== songId)
        this.showToast()
        this.alertMessage = this.$t('removeFromFavorites') // 使用 $t 获取翻译
      } else {
        this.favoritedSongs.push(songId)
        this.showToast()
        this.alertMessage = this.$t('addedToFavorites') // 使用 $t 获取翻译
      }
      this.isFavorited = !this.isFavorited // 切换收藏状态
      localStorage.setItem(
        'favoritedSongs',
        JSON.stringify(this.favoritedSongs),
      ) // 保存到 localStorage
    },
    updateVolume() {
      if (this.sound) {
        if (localStorage.getItem('volume') !== null) {
          this.sound.volume(localStorage.getItem('volume') / 100) // 设置音量
        } else {
          this.sound.volume(100 / 100) // 设置音量
        }
      }
    },
    handleVolumeChange(value) {
      this.volumeSliderValue = value // 更新音量滑块值
      localStorage.setItem('volume', this.volumeSliderValue) // 保存滑块值到 localStorage
      this.updateVolume() // 调用更新音量的方法
    },
    showMsgModal(Message) {
      this.errorMessage = Message
      this.showModal = true
      this.$nextTick(() => {
        const modalElement = document.querySelector('.modal')
        const modal = new bootstrap.Modal(modalElement)
        modal.show()
      })
    },
    async fetchSongs() {
      try {
        const response = await axios.get('songs.json')
        this.songs = response.data.songs

        const savedSongId = parseInt(localStorage.getItem('currentSongId'), 10) // 转换为数字
        if (savedSongId) {
          // 找到对应的歌曲
          const savedSong = this.songs.find(song => song.id === savedSongId)
          if (savedSong) {
            this.loadMusic(savedSong)
            this.playMusic()
          } else {
            // 如果找不到对应的歌曲，加载第一首歌
            this.loadMusic(this.songs[0])
          }
        } else {
          // 如果没有保存的歌曲 ID，加载第一首歌
          this.loadMusic(this.songs[0])
        }
      } catch (error) {
        this.showMsgModal(this.$t('fetchError', { error: error.message }))
      }
    },
    togglePlay() {
      if (!this.sound) {
        this.loadMusic(this.songs[this.musicIndex])
      }
      this.isPlaying ? this.pauseMusic() : this.playMusic()
    },
    togglePlaybackMode() {
      if (this.playbackMode === 'repeat') {
        this.playbackMode = 'repeat-one' // 切换到单曲循环
      } else if (this.playbackMode === 'repeat-one') {
        this.playbackMode = 'shuffle' // 切换到随机播放
      } else {
        this.playbackMode = 'repeat' // 切换到顺序循环
      }
      localStorage.setItem('playbackMode', this.playbackMode) // 保存播放模式到 localStorage
    },
    playMusic() {
      if (this.sound && this.isLoaded) {
        this.sound.play()
        this.isPlaying = true
        this.updateVolume()
        this.updateProgressBar()
        // 更新 Media Session 状态
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'playing'
        }
      }
    },
    pauseMusic() {
      if (this.sound) {
        this.sound.pause()
        this.isPlaying = false
        cancelAnimationFrame(this.animationFrameId) // 停止进度条更新
        // 更新 Media Session 状态
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'paused'
        }
      }
    },
    updatePositionState() {
      navigator.mediaSession.setPositionState({
        duration: this.duration,
        playbackRate: 1,
        position: this.currentTime,
      })
    },
    loadMusic(song) {
      if (this.sound && this.sound instanceof Howl) {
        try {
          this.sound.unload()
        } catch (error) {
          this.showMsgModal(this.$t('unloadError', { error: error.message }))
        }
      }

      // 更新 Media Session 元数据
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.displayName,
          artist: song.artist,
          album: song.displayName,
          artwork: [{ src: song.cover }],
        })

        navigator.mediaSession.setActionHandler('seekbackward', () => {
          this.updatePositionState()
        })
      }

      this.currentSong = song
      // 保存当前歌曲的 ID 到 localStorage
      localStorage.setItem('currentSongId', song.id)
      // 触发事件，通知父组件更新 currentSongId
      this.$emit('songChanged', song.id)
      this.musicIndex = song.id
      // 检查当前歌曲是否被收藏
      this.checkIfFavorited() // 每次加载歌曲时检查收藏状态
      this.sound = new Howl({
        src: [song.path],
        html5: true,
        // rate: 1, //播放速度 0.5 - 4
        // pool: 5, //类似数据库中的连接池，保留了一个池来回收利用以提高性能。声音暂停不会从池中删除。
        onplay: () => {
          this.isPlaying = true
          this.updateProgressBar() // 在播放时更新进度条
        },
        onend: () => {
          if (this.playbackMode === 'repeat-one') {
            this.playMusic() // 单曲循环，重新播放当前歌曲
          } else if (this.playbackMode === 'shuffle') {
            // 随机播放
            this.changeMusic()
          } else {
            // 顺序播放
            this.changeMusic(1)
          }
        },
        onload: () => {
          this.duration = this.formatTime(this.sound.duration())
          this.isLoaded = true
          this.updateProgressBar() // 调用以设置 sliderValue 和其他状态
          // this.playMusic();
        },
      })

      this.currentLyrics = { japanese: '', chinese: '' } // 清空歌词

      fetch(song.lrcPath)
        .then(response => response.text())
        .then(data => this.parseLyrics(data))
        .catch(err => {
          console.error(err.message)
          this.currentLyrics = {
            japanese: '歌詞を読めませんでした',
            chinese: '',
          }
        })
    },
    checkIfFavorited() {
      const currentSongId = this.currentSong.id
      this.isFavorited = this.favoritedSongs.includes(currentSongId)
    },
    parseLyrics(data) {
      this.lyricsArray = data
        .split('\n')
        .map(line => {
          const match = line.match(/\[(\d+):(\d+\.\d+)\](.+)/)
          if (match) {
            const time = parseInt(match[1]) * 60 + parseFloat(match[2])
            const [japanese, chinese] = match[3].trim().split('  ')
            return { time, japanese, chinese }
          }
          return null
        })
        .filter(Boolean)
    },
    changeMusic(direction) {
      if (this.playbackMode === 'shuffle') {
        // 随机选择下一首
        this.musicIndex = Math.floor(Math.random() * this.songs.length) + 1
      } else {
        // 顺序播放
        this.musicIndex += direction // 更新值
        // 确保 musicIndex 在 1 到 this.songs.length 之间
        if (this.musicIndex < 1) {
          this.musicIndex = this.songs.length
        }
        if (this.musicIndex > this.songs.length) {
          this.musicIndex = 1
        }
      }
      const song = this.songs.find(s => s.id === this.musicIndex)
      this.loadMusic(song)
      this.playMusic()
    },

    updateProgressBar() {
      if (this.sound && this.isPlaying) {
        const current = this.sound.seek()
        this.sliderValue = (current / this.sound.duration()) * 100 // 更新 sliderValue
        this.currentTime = this.formatTime(current)

        // 检查当前时间是否在最后一条歌词的时间之后
        if (this.lyricsArray.length > 0) {
          const lastLyric = this.lyricsArray[this.lyricsArray.length - 1]

          if (current >= lastLyric.time) {
            this.currentLyrics = {
              japanese: lastLyric.japanese,
              chinese: lastLyric.chinese,
            }
          } else {
            const currentLyricIndex = this.lyricsArray.findIndex(
              lyric => lyric.time > current,
            )

            if (currentLyricIndex > -1) {
              // 注意这里应该是 currentLyricIndex - 1，但要确保不会越界
              const currentLyric =
                this.lyricsArray[Math.max(0, currentLyricIndex - 1)]
              this.currentLyrics = {
                japanese: currentLyric.japanese,
                chinese: currentLyric.chinese,
              }
            } else {
              this.currentLyrics = { japanese: '', chinese: '' } // 默认歌词
            }
          }
        }

        // 使用 requestAnimationFrame 来持续更新进度条
        this.animationFrameId = requestAnimationFrame(
          this.updateProgressBar.bind(this),
        )
      }
    },
    setProgressFromSlider(value) {
      if (this.sound && this.isLoaded) {
        const newTime = (value / 100) * this.sound.duration() // 计算新的播放时间
        this.sound.seek(newTime) // 跳转到新的时间
        this.currentTime = this.formatTime(newTime) // 格式化时间

        this.sliderValue = value // 更新滑块位置

        if (!this.isPlaying) {
          this.isPlaying = true
          this.sound.seek(newTime)
          // this.sound.play(); // 如果未播放则开始播放
        }
      }
    },
    formatTimeTooltip(value) {
      const totalDuration = this.sound ? this.sound.duration() : 0
      const currentTime = (value / 100) * totalDuration
      return this.formatTime(currentTime)
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    },
  },
  watch: {
    currentSongId(newId) {
      this.playSong(newId) // 或者是调用加载音乐的逻辑
    },
  },
}
</script>

<style scoped>
.lyrics {
  pointer-events: none;
  min-height: 4em;
}

.toast {
  position: fixed;
  top: 20px; /* 根据需要调整顶部距离 */
  right: 20px; /* 根据需要调整右侧距离 */
  z-index: 1050; /* 确保在其他内容上方 */
  background-color: rgba(255, 255, 255, 0.7); /* 半透明白色 */
  border-radius: 15px;
}

.toast-body i {
  margin-right: 8px; /* 或者调整这个值来增减间距 */
}

.modal-body {
  display: flex; /* 使用 Flexbox */
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between; /* 均匀分布 */
}

.volume-control {
  display: flex; /* 使用 Flexbox 以确保图标和滑块在同一行 */
  align-items: center; /* 垂直居中对齐 */
  width: 100%; /* 让容器宽度占满 */
}

.volume-icon {
  margin-right: 20px; /* 图标和滑块之间的间距 */
  font-size: 1.5em;
}

.volume-slider {
  flex: 1; /* 让滑块占据剩余空间 */
}

.progress-slider {
  margin-bottom: 0; /* 确保没有底部边距 */
}

.modal {
  /* 初始状态：隐藏在下方 */
  transform: translateY(50%);
  transition: transform 0.2s ease-out; /* 设置动画效果 */
}

.modal.show {
  /* 显示状态：从下方弹出 */
  transform: translateY(0);
}

.music-duration {
  position: relative;
  top: -5vh;
  min-height: 10px;
  display: flex;
  justify-content: space-between;
  /* margin-bottom: 1vh; */
  pointer-events: none;
  width: 100%;
  font-size: 12px;
  color: #333;
  margin-bottom: 5px;
}

.player-progress {
  /* display: flex;
  flex-direction: column;
  align-items: center;
 */
  margin: 1vh auto;
  width: 80vw;
  max-width: 350px;
  max-height: 4vh;
}

.player-controls {
  width: 100%; /* 适应屏幕宽度 */
  margin: auto auto;
  display: flex;
  justify-content: space-between; /* 保持分散布局 */
  align-items: center; /* 垂直居中 */
  max-width: 85vw; /* 控制最大宽度 */
  padding: 0 10px;
  gap: 1.5em; /* 动态设置按钮之间的间距 */
}

.fa-solid {
  flex: 1; /* 每个图标占据相等的空间 */
  font-size: 3em;
  color: #666;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  text-align: center; /* 中心对齐图标 */
}

.fa-solid:hover {
  filter: brightness(40%);
}

@media (max-width: 600px) {
  .player-controls {
    gap: 1em; /* 缩小按钮间距 */
  }

  .fa-solid {
    font-size: 2.5em; /* 调整图标大小 */
  }
}

.settings-controls {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 使子元素之间的间距相等 */
  align-items: center; /* 垂直居中对齐 */
  padding: 10px; /* 可以根据需要添加内边距 */
  overflow: hidden; /* 确保内容不超出容器 */
}

.settings-controls i {
  flex: 1; /* 使每个图标占据相等的空间 */
  text-align: center; /* 中心对齐图标 */
  cursor: pointer; /* 添加光标样式 */
  font-size: 1.5em;
  color: #666666;
}

.player-img {
  height: 35vh;
  width: 15vw;
  position: relative;
  top: -6vh;
  transform: translateY(-3vh); /* 根据需要调整上移距离 */
  /* 防止占据空间 */
  margin: auto auto -5vh;
}

/* 默认设置适用于桌面 */
.player-img {
  min-width: 420px;
  min-height: 420px;
}

/* 移动设备 */
@media (max-width: 768px) {
  /* 小于768px的设备 */
  .player-img {
    min-width: 320px;
    min-height: 320px;
  }
}

.player-img img {
  object-fit: cover;
  border-radius: 20px;
  height: 0;
  width: 0;
  opacity: 0;
  box-shadow: 0 5px 30px 5px rgba(0, 0, 0, 0.5);
}

.player-img:hover img {
  box-shadow: 0 5px 30px 5px rgba(0, 0, 0, 0.8);
}

.player-img img.active {
  width: 100%;
  height: 100%;
  transition: all 0.5s;
  opacity: 1;
}

.container {
  background-color: #e7e7e7;
  height: 90vh;
  width: 95vw;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.5s ease;
  display: flex; /* 启用 Flexbox */
  flex-direction: column;
  justify-content: center; /* 水平居中 */
  text-align: center;
  margin: auto;
  position: relative;
  max-height: 740px; /* 最大高度 */
  max-width: 460px; /* 最大宽度 */
  /* min-width: 400px;
  min-height: 680px; */
}

/* 移动设备 */
@media (max-width: 768px) {
  /* 小于768px的设备 */
  .container {
    max-height: 600px; /* 最大高度 */
    max-width: 360px; /* 最大宽度 */
    /* min-width: 360px;
    min-height: 600px; */
  }
}

.label {
  margin-top: -2vh;
}

.container:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
}

h2 {
  /* font-size:15px; */
  text-align: center;
  font-weight: 500;
  margin: 10px 0 0;
}

h4 {
  /* font-size: 10px; */
  text-align: center;
  font-weight: 500;
  margin-top: 10px;
}
</style>
