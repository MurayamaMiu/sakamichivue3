import { createI18n } from 'vue-i18n'

const messages = {
  ja: {
    placeholder: '入力してください',
    allsong: 'オールソング',
    lovedsong: 'お気に入りソング',
    volume: 'ボリューム',
    title: '坂道ウエブアプリ',
    removeFromFavorites: 'お気に入りから削除されました',
    addedToFavorites: 'お気に入りに追加されました',
    fetchError: '曲情報の取得中に問題が発生しました：{error}',
    unloadError: 'サウンドのアンロード中にエラーが発生しました：{error}',
    translation: '言語を日本語に切り替えました',
  },
  zh: {
    placeholder: '請輸入',
    allsong: '全部歌曲',
    lovedsong: '收藏歌曲',
    volume: '音量',
    title: '坂道網頁應用',
    removeFromFavorites: '已从收藏中删除',
    addedToFavorites: '已添加到收藏',
    fetchError: '获取曲目信息时发生错误：{error}',
    unloadError: '卸载音频时发生错误：{error}',
    translation: '已將語言切換到中文',
  },
}

const i18n = createI18n({
  locale: 'zh', // 设置默认语言
  messages,
})

export default i18n
