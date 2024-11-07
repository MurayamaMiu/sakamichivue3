import comp from "D:/Code/Web/sakamichivue3/docs/.vuepress/.temp/pages/ja-JP/index.html.vue"
const data = JSON.parse("{\"path\":\"/ja-JP/\",\"title\":\"櫻坂46\",\"lang\":\"ja-JP\",\"frontmatter\":{\"lang\":\"ja-JP\",\"title\":\"櫻坂46\",\"description\":\"櫻坂46ウイキ\"},\"headers\":[{\"level\":2,\"title\":\"Sakurazaka46\",\"slug\":\"sakurazaka46\",\"link\":\"#sakurazaka46\",\"children\":[]}],\"git\":{\"updatedTime\":1730736200000,\"contributors\":[{\"name\":\"西宮ソラ\",\"email\":\"kohojp@outlook.jp\",\"commits\":1}]},\"filePathRelative\":\"ja-JP/README.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
