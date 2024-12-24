<template>
  <div class="list-group song-list">
    <a
      class="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom fixed-header"
      style="min-height: 100px; max-height: 100px"
    >
      <div class="input-group mb-3">
        <i
          class="bi bi-file-earmark-music-fill"
          style="font-size: 2em; margin-right: 20px; color: #666666"
        ></i>
        <input
          type="text"
          class="form-control"
          :placeholder="$t('placeholder')"
          aria-describedby="button-addon2"
          v-model="searchQuery"
          @input="filterSongs"
        />
        <button
          class="btn btn-outline-secondary search"
          type="button"
          id="button-addon2"
          :title="$t('search')"
          @click="filterSongs"
        >
          <i class="bi bi-search"></i>
        </button>
      </div>
    </a>

    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          class="nav-link"
          data-bs-toggle="tab"
          href="#all-songs"
          :class="{ active: activeTab === 'all-songs' }"
          @click="switchTab('all-songs')"
          >{{ $t('allsong') }}</a
        >
      </li>

      <li class="nav-item">
        <a
          class="nav-link"
          data-bs-toggle="tab"
          href="#favorited-songs"
          :class="{ active: activeTab === 'favorited-songs' }"
          @click="switchTab('favorited-songs')"
          >{{ $t('lovedsong') }}</a
        >
      </li>

      <li class="nav-item">
        <a
          class="nav-link sakurazaka"
          data-bs-toggle="tab"
          href="#favorited-songs"
          :class="{ active: activeTab === 'sakurazaka' }"
          @click="switchTab('sakurazaka')"
          >{{ $t('sakurazaka46') }}</a
        >
      </li>

      <li class="nav-item">
        <a
          class="nav-link nogizaka"
          data-bs-toggle="tab"
          href="#favorited-songs"
          :class="{ active: activeTab === 'nogizaka' }"
          @click="switchTab('nogizaka')"
          >{{ $t('nogizaka46') }}</a
        >
      </li>

      <li class="nav-item">
        <a
          class="nav-link hinatazaka"
          data-bs-toggle="tab"
          href="#favorited-songs"
          :class="{ active: activeTab === 'hinatazaka' }"
          @click="switchTab('hinatazaka')"
          >{{ $t('hinatazaka46') }}</a
        >
      </li>

      <li class="nav-item">
        <a
          class="nav-link keyakizaka"
          data-bs-toggle="tab"
          href="#favorited-songs"
          :class="{ active: activeTab === 'keyakizaka' }"
          @click="switchTab('keyakizaka')"
          >{{ $t('keyakizaka46') }}</a
        >
      </li>

      <li class="nav-item">
        <a
          class="nav-link others"
          data-bs-toggle="tab"
          href="#favorited-songs"
          :class="{ active: activeTab === 'others' }"
          @click="switchTab('others')"
          >{{ $t('others') }}</a
        >
      </li>
    </ul>

    <div class="tab-content">
      <div class="tab-pane fade show active" id="all-songs">
        <div
          class="list-group-item d-flex align-items-center"
          v-for="song in filteredSongs"
          :key="song.id"
          :class="{ active: song.id === currentSongId }"
          @click="playSong(song)"
        >
          <img
            :src="song.cover"
            alt="封面"
            class="me-3"
            style="width: 55px; height: 55px; object-fit: cover"
          />
          <div>
            <h5 class="mb-1">{{ song.displayName }}</h5>
            <small>{{ song.artist }}</small>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="favorited-songs">
        <div
          class="list-group-item d-flex align-items-center"
          v-for="song in filteredSongs"
          :key="song.id"
          :class="{ active: song.id === currentSongId }"
          @click="playSong(song)"
        >
          <img
            :src="song.cover"
            alt="封面"
            class="me-3"
            style="width: 55px; height: 55px; object-fit: cover"
          />
          <div>
            <h5 class="mb-1">{{ song.displayName }}</h5>
            <small>{{ song.artist }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    currentSongId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      activeTab: localStorage.getItem('activeTab') || 'all-songs',
      songs: [],
      favoritedSongs: [],
      searchQuery: '',
      filteredSongs: [],
    }
  },
  mounted() {
    this.fetchSongs()
  },
  methods: {
    async fetchSongs() {
      try {
        const response = await axios.get('songs.json')
        this.songs = response.data.songs
        this.filteredSongs = this.songs

        this.loadTabSongs(this.activeTab)
      } catch (error) {
        console.error('Error fetching songs:', error)
      }
    },
    switchTab(tab) {
      this.activeTab = tab
      this.loadTabSongs(tab)
      localStorage.setItem('activeTab', tab)
    },
    loadTabSongs(tab) {
      if (!this.songs.length) {
        console.warn('歌曲數據尚未加載')
        return
      }
      if (tab === 'favorited-songs') {
        this.loadFavoritedSongs()
      } else if (tab === 'all-songs') {
        this.filteredSongs = this.songs
      } else {
        this.loadGroupSongs(tab)
      }
    },

    loadFavoritedSongs() {
      const favoritedIds =
        JSON.parse(localStorage.getItem('favoritedSongs')) || []
      this.filteredSongs = this.songs.filter(song =>
        favoritedIds.includes(Number(song.id)),
      )
    },

    loadGroupSongs(group) {
      const groupArtists = {
        sakurazaka: '櫻坂46',
        nogizaka: '乃木坂46',
        hinatazaka: '日向坂46',
        keyakizaka: '欅坂46',
        others: '',
      }

      if (group === 'others') {
        this.filteredSongs = this.songs.filter(
          song => !Object.values(groupArtists).includes(song.artist),
        )
      } else {
        this.filteredSongs = this.songs.filter(
          song => song.artist === groupArtists[group],
          console.log(groupArtists[group])
        )
        console.log(this.filteredSongs)
      }
    },
    filterSongs() {
      const query = this.searchQuery.toLowerCase()
      this.filteredSongs = this.songs.filter(
        song =>
          song.displayName.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query),
      )
    },
    playSong(song) {
      this.$emit('selectSong', parseInt(song.id, 10))
    },
  },
}
</script>

<style scoped>
/* 其他歌手 标签 */
.nav-link.others {
  color: #bb002c !important; /* 未选中时的颜色 */
}

.nav-link.others.active {
  color: whitesmoke !important; /* 选中时的颜色 */
  background-color: #bb002c !important;
  border-color: #bb002c !important;
}

/* 櫻坂46 标签 */
.nav-link.sakurazaka {
  color: #f0a1b5 !important; /* 未选中时的颜色 */
}

.nav-link.sakurazaka.active {
  color: whitesmoke !important; /* 选中时的颜色 */
  background-color: #f0a1b5 !important;
  border-color: #f0a1b5 !important;
}

/* 乃木坂46 标签 */
.nav-link.nogizaka {
  color: #812990 !important; /* 未选中时的颜色 */
}

.nav-link.nogizaka.active {
  color: whitesmoke !important; /* 选中时的颜色 */
  background-color: #812990 !important;
  border-color: #812990 !important;
}

/* 日向坂46 标签 */
.nav-link.hinatazaka {
  color: #5bbee4 !important; /* 未选中时的颜色 */
}

.nav-link.hinatazaka.active {
  color: whitesmoke !important; /* 选中时的颜色 */
  background-color: #5bbee4 !important;
  border-color: #5bbee4 !important;
}

/* 欅坂46 标签 */
.nav-link.keyakizaka {
  color: #5eb954 !important; /* 未选中时的颜色 */
}

.nav-link.keyakizaka.active {
  color: whitesmoke !important; /* 选中时的颜色 */
  background-color: #5eb954 !important;
  border-color: #5eb954 !important;
}

.nav-tabs {
  position: sticky;
  top: 100px; /* 根据你的搜索框高度调整 */
  z-index: 1030; /* 确保在其他元素上方 */
  background-color: white; /* 背景颜色，确保可读性 */
  border-bottom: 1px solid #dee2e6; /* 可选，添加底部边框 */
  max-width: 100%;
}

/* 选中时的文本颜色 */
.nav-tabs .nav-link.active {
  color: whitesmoke; /* 你想要的选中颜色 */
}

/* 未选中时的文本颜色 */
.nav-tabs .nav-link {
  color: #3498db; /* 你想要的未选中颜色 */
}

.nav-tabs .nav-link {
  color: #3498db; /* 你想要的未选中颜色 */
}

.search {
  background-color: #3498db;
  color: whitesmoke;
  border-radius: 10px;
}

.search:hover {
  background-color: #2980b9;
}

.form-control {
  max-width: 65vw;
}

.form-control:focus {
  border-color: #2980b9; /* 设置边框颜色 */
  box-shadow: 0 0 0 0.2rem rgba(30, 159, 255, 0.25); /* 设置阴影效果 */
}

.active {
  background-color: #3498db !important; /* 自定义高亮颜色 */
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.4) !important; /* 添加阴影 */
  border-color: #3498db !important;
}

.list-group-item {
  user-select: none; /* 禁止文本选择 */
  pointer-events: auto; /* 确保可以交互 */
}

.list-group-item img {
  pointer-events: none; /* 禁止图像的交互 */
}

.fixed-header {
  position: sticky; /* 或使用 fixed */
  top: 0; /* 如果使用 fixed，可以调整位置 */
  background-color: whitesmoke; /* 确保背景色 */
  z-index: 10; /* 确保在其他元素之上 */
}

.list-group {
  max-height: 100vh; /* 最大高度 */
  width: 22vw;
  min-width: 330px;
  overflow-y: auto;
  background-color: #e7e7e7;
}

@media (max-width: 768px) {
  .list-group {
    min-height: 85vh;
    min-width: 100vw;
  }
}

.list-group-item {
  background-color: #e7e7e7;
}

/* 滚动条的整体样式 */
.list-group::-webkit-scrollbar {
  width: 12px; /* 宽度 */
}

/* 滚动条的轨道 */
.list-group::-webkit-scrollbar-track {
  background: #f0f0f0; /* 轨道颜色 */
  border-radius: 10px; /* 圆角 */
}

/* 滚动条的滑块 */
.list-group::-webkit-scrollbar-thumb {
  background-color: #3498db; /* 滑块颜色 */
  border-radius: 10px; /* 圆角 */
  border: 2px solid #f0f0f0; /* 滑块的边框 */
}

/* 滑块在悬停时的颜色 */
.list-group::-webkit-scrollbar-thumb:hover {
  background-color: #2980b9;
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.nav-scroller .nav {
  display: flex;
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  margin-top: -1px;
  overflow-x: auto;
  text-align: center;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.bd-mode-toggle .dropdown-menu .active .bi {
  display: block !important;
}

.btn-toggle-nav a {
  padding: 0.1875rem 0.5rem;
  margin-top: 0.125rem;
  margin-left: 1.25rem;
}

.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
  background-color: var(--bs-tertiary-bg);
}
</style>
