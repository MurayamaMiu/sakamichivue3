<template>
  <div class="background">
    <img :src="currentSong.cover" id="bg-img" />
  </div>
  <div class="container">
    <div :class="['player-img', { 'circular-rotate': isCircularRotate }]">
      <img
        :src="currentSong.cover"
        :style="{ animationPlayState: isPlaying ? 'running' : 'paused' }"
        class="active"
        id="cover"
      />
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
        :title="$t('previous')"
        @click="changeMusic(-1)"
      ></i>
      <i
        class="fa-solid"
        :class="isPlaying ? 'fa-pause' : 'fa-play'"
        :title="isPlaying ? $t('pause') : $t('play')"
        @click="togglePlay"
      ></i>
      <i
        class="fa-solid fa-forward"
        :title="$t('next')"
        @click="changeMusic(1)"
      ></i>
    </div>
    <div class="settings-controls">
      <i
        v-if="playbackMode === 'repeat'"
        :title="$t('repeat')"
        class="bi bi-repeat"
        @click="togglePlaybackMode"
      ></i>
      <i
        v-if="playbackMode === 'repeat-one'"
        :title="$t('repeatone')"
        class="bi bi-repeat-1"
        @click="togglePlaybackMode"
      ></i>
      <i
        v-if="playbackMode === 'shuffle'"
        :title="$t('shuffle')"
        class="bi bi-shuffle"
        @click="togglePlaybackMode"
      ></i>
      <i
        class="bi bi-music-note-list"
        :title="$t('songlist')"
        @click="$emit('toggleSongList')"
        style="cursor: pointer"
      ></i>
      <i
        v-if="isFavorited"
        :title="$t('cancelloved')"
        class="bi bi-bookmark-heart-fill"
        @click="toggleFavorite"
      ></i>
      <i
        v-else
        class="bi bi-bookmark-heart"
        :title="$t('loved')"
        @click="toggleFavorite"
      ></i>
      <i
        class="bi bi-sliders"
        id="settingsIcon"
        :title="$t('settings')"
        data-bs-toggle="modal"
        data-bs-target="#settingsModal"
      ></i>
      <!--      <i class="bi bi-three-dots"></i>-->
      <!--
      <i
        class="bi bi-journal-code"
        @click="goToDocs"
        @auxclick="goToDocsNewTab"
        style="cursor: pointer"
      ></i> -->
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="settingsModal"
      tabindex="-1"
      aria-labelledby="settingsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4
              class="modal-title fs-5"
              id="settingsModalLabel"
              style="font-size: 15px !important"
            >
              {{ $t('settings') }}
            </h4>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="modal-content-custom">
              <div class="settings-control">
                <i class="bi bi-volume-up-fill settings-icon"></i>
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
                  class="settings-slider"
                />
              </div>
              <div class="settings-control">
                <i class="bi bi-speedometer2 settings-icon"></i>
                <vue-slider
                  v-model="speedSliderValue"
                  :marks="true"
                  :interval="0.5"
                  :min="0"
                  :max="2"
                  :height="10"
                  :dot-size="16"
                  :drag-on-click="true"
                  :tooltip="'focus'"
                  :duration="0.2"
                  :silent="true"
                  @change="handleSpeedChange"
                  class="settings-slider"
                />
              </div>
              <div class="settings-control" style="margin-top: 30px">
                <i class="bi bi-disc settings-icon"></i>
                <div
                  class="btn-group"
                  role="group"
                  aria-label="Basic radio toggle button group"
                >
                  <!-- 默认样式按钮 -->
                  <input
                    type="radio"
                    class="btn-check"
                    name="btnradio11"
                    id="btnradio11"
                    autocomplete="off"
                    :checked="!isCircularRotate"
                    @click="setStyleCircularRotate(false)"
                  />
                  <label
                    class="btn btn-outline-primary btn-custom"
                    for="btnradio11"
                  >
                    {{ $t('default') }}
                  </label>
                  <!-- 封面旋转按钮 -->
                  <input
                    type="radio"
                    class="btn-check"
                    name="btnradio11"
                    id="btnradio12"
                    autocomplete="off"
                    :checked="isCircularRotate"
                    @click="setStyleCircularRotate(true)"
                  />
                  <label
                    class="btn btn-outline-primary btn-custom"
                    for="btnradio12"
                  >
                    {{ $t('spin') }}
                  </label>
                </div>
              </div>

              <div class="settings-control" style="margin-top: 15px">
                <i class="bi bi-translate settings-icon"></i>
                <div
                  class="btn-group"
                  role="group"
                  aria-label="Basic radio toggle button group"
                >
                  <input
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    id="btnradio1"
                    autocomplete="off"
                    value="zh"
                    v-model="selectedLanguage"
                  />
                  <label
                    class="btn btn-outline-primary btn-custom"
                    for="btnradio1"
                    @click="changeLanguage('zh')"
                    >正體中文</label
                  >
                  <input
                    type="radio"
                    class="btn-check btn-custom"
                    name="btnradio"
                    id="btnradio3"
                    autocomplete="off"
                    value="ja"
                    v-model="selectedLanguage"
                  />
                  <label
                    class="btn btn-outline-primary btn-custom"
                    for="btnradio3"
                    @click="changeLanguage('ja')"
                    >日本語</label
                  >
                  <input
                    type="radio"
                    class="btn-check btn-custom"
                    name="btnradio"
                    id="btnradio2"
                    @click="changeLanguage('en')"
                    value="en"
                    v-model="selectedLanguage"
                    autocomplete="off"
                  />
                  <label
                    class="btn btn-outline-primary btn-custom"
                    for="btnradio2"
                    >English</label
                  >
                  <!-- <input
                    type="radio"
                    class="btn-check btn-custom"
                    name="btnradio"
                    id="btnradio4"
                    @click="changeLanguage('kr')"
                    value="kr"
                    v-model="selectedLanguage"
                    autocomplete="off"
                  /> -->
                  <!-- <label
                    class="btn btn-outline-primary btn-custom"
                    for="btnradio4"
                    >한국어</label
                  > -->
                </div>
              </div>
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
      isCircularRotate: false, // 歌曲封面默认样式
      selectedLanguage: 'zh',
      speedSliderData: ['0.5', '0.75', '1', '1.25', '1.5', '2'],
      showAlert: false, // 控制提示框显示状态
      alertMessage: '', // 存储提示消息
      volume: 100, // 音量值
      volumeSliderValue: 100, // 新增的音量滑块值
      speedSliderValue: 1,
      speed: 1,
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

    // 加载页面时从 localStorage 获取保存的封面样式状态
    const savedStyle = localStorage.getItem('isCircularRotate')
    if (savedStyle !== null) {
      this.isCircularRotate = JSON.parse(savedStyle)
    }

    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      this.$i18n.locale = savedLanguage // 设置初始语言
      this.selectedLanguage = savedLanguage
    }

    // 从 localStorage 读取设置
    const savedVolume = localStorage.getItem('volume')
    if (savedVolume) {
      this.volumeSliderValue = parseInt(savedVolume, 10) //转换成10进制整数
      this.updateVolume() // 更新音量
    }

    const savedSpeed = localStorage.getItem('speed')
    if (savedSpeed) {
      console.log(savedSpeed)
      this.speedSliderValue = parseInt(savedSpeed, 10) //转换成10进制整数
      this.updateSpeed()
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
    setStyleCircularRotate(isCircular) {
      this.isCircularRotate = isCircular
      // 将当前样式保存到 localStorage
      localStorage.setItem('isCircularRotate', JSON.stringify(isCircular))
    },
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
    changeLanguage(newLanguage) {
      // const newLanguage = this.$i18n.locale === 'ja' ? 'zh' : 'ja' // 切换语言
      this.$i18n.locale = newLanguage // 更新当前语言
      this.$changeLanguage(newLanguage) // 调用全局方法切换语言
      localStorage.setItem('language', newLanguage) // 保存到本地存储
      this.selectedLanguage = newLanguage
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
    updateSpeed() {
      if (this.sound) {
        if (localStorage.getItem('speed') !== null) {
          this.sound.rate(Number(localStorage.getItem('speed'))) // 设置音量
        } else {
          this.sound.rate(1) // 设置音量
        }
      }
    },
    handleVolumeChange(value) {
      this.volumeSliderValue = value // 更新音量滑块值
      localStorage.setItem('volume', this.volumeSliderValue) // 保存滑块值到 localStorage
      this.updateVolume() // 调用更新音量的方法
    },
    handleSpeedChange(value) {
      this.speedSliderValue = value // 更新播放速度滑块值
      localStorage.setItem('speed', this.speedSliderValue) // 保存滑块值到 localStorage
      this.updateSpeed() // 调用更新播放速度的方法
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

        // navigator.mediaSession.setActionHandler('seekbackward', () => {
        //   this.updatePositionState()
        // })
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
        // preload: true, // 确保预加载完整文件
        // xhr: {
        //   // 设置请求头，确保加载完整文件
        //   headers: {
        //     Range: 'bytes=0-',
        //   },
        // },
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
      const lines = data.split('\n')
      this.lyricsArray = []

      for (let i = 0; i < lines.length; i++) {
        const currentLine = lines[i].trim()
        const nextLine = lines[i + 1] ? lines[i + 1].trim() : null

        // 匹配时间戳和歌词内容
        const currentMatch = currentLine.match(/\[(\d+):(\d+\.\d+)\](.+)/)
        const nextMatch = nextLine
          ? nextLine.match(/\[(\d+):(\d+\.\d+)\](.+)/)
          : null

        if (currentMatch) {
          const time =
            parseInt(currentMatch[1]) * 60 + parseFloat(currentMatch[2])
          const japanese = currentMatch[3].trim()

          if (
            nextMatch &&
            currentMatch[1] === nextMatch[1] &&
            currentMatch[2] === nextMatch[2]
          ) {
            // 当前行和下一行时间戳相同，视为日文和翻译配对
            const chinese = nextMatch[3].trim()
            this.lyricsArray.push({ time, japanese, chinese })
            i++ // 跳过已处理的下一行
          } else {
            // 没有配对的行，仅显示日文或单行内容
            this.lyricsArray.push({ time, japanese, chinese: null })
          }
        }
      }
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
  /* background-color: rgba(255, 255, 255, 1); 半透明白色 */
  background-color: #e7e7e7;
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

.settings-control {
  display: flex; /* 使用 Flexbox 以确保图标和滑块在同一行 */
  align-items: center; /* 垂直居中对齐 */
  min-width: 100%;
}

.settings-icon {
  margin-right: 20px; /* 图标和滑块之间的间距 */
  font-size: 1.5em;
}

.settings-slider {
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
  transform: translateY(-2vh); /* 图片浮动 */
  margin: auto auto -5vh;
  min-width: 420px;
  min-height: 420px;
  /* 移除 overflow: hidden; 不再裁剪阴影 */
  border-radius: 20px; /* 默认圆角 */
}

@media (max-width: 768px) {
  .player-img {
    min-width: 320px;
    min-height: 320px;
  }
}

/* 阴影效果移到 ::before 伪元素中 */
.player-img::before {
  content: '';
  position: absolute;
  top: -5px; /* 微调阴影位置 */
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: inherit; /* 继承父元素的 border-radius */
  box-shadow: 0 5px 30px 5px rgba(0, 0, 0, 0.5); /* 阴影效果 */
  pointer-events: none; /* 禁止伪元素响应鼠标事件 */
  z-index: 1; /* 阴影在图片下方 */
  transition: all 0.3s ease; /* 阴影平滑过渡 */
}

/* 当图片变成圆形时，确保阴影也跟着变圆 */
.player-img.circular-rotate::before {
  border-radius: 50%; /* 与图片保持一致，变成圆形 */
}

/* 图片样式 */
.player-img img {
  object-fit: cover;
  border-radius: 20px; /* 默认圆角 */
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 0.5s;
  transform: scale(0.85);
}

.player-img img.active {
  opacity: 1;
}

.player-img.circular-rotate img {
  border-radius: 50%; /* 圆形图片 */
  transform-origin: center center; /* 确保旋转时图片的圆心不变 */
  transition: transform 1s ease-in-out; /* 旋转平滑过渡 */
  animation: rotate 20s linear infinite;
  animation-play-state: paused; /* 默认暂停旋转 */
}

@keyframes rotate {
  from {
    transform: rotate(0deg) scale(0.85);
  }
  to {
    transform: rotate(360deg) scale(0.85);
  }
}

/* Hover 状态下图片的阴影 */
.player-img:hover::before {
  box-shadow: 0 5px 30px 5px rgba(0, 0, 0, 0.8);
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
  max-height: 840px; /* 最大高度 */
  max-width: 460px; /* 最大宽度 */
  /* min-width: 400px;
  min-height: 680px; */
  margin-top: 4vh;
}

/* 移动设备 */
@media (max-width: 768px) {
  /* 小于768px的设备 */
  .container {
    max-height: 550px; /* 最大高度 */
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

.btn-custom {
  border-color: #3498db;
  color: #3498db;
}

.btn-check:checked + .btn-outline-primary {
  border-color: #3498db;
  background-color: #3498db;
}

.btn-check:hover + .btn-outline-primary {
  border-color: #2980b9;
  color: #2980b9;
}

.modal-content-custom {
  display: flex;
  flex-direction: column;
  width: 95%;
}
</style>
