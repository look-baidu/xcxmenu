Page({
  data: {
    dish: null,
    blocks: [],       // 解析后的内容块数组 [{type:'h1'|'h2'|'h3'|'p'|'li'|'img'|'hr', text, src}]
    loading: true,
    error: '',
  },

  onLoad(options) {
    const { id } = options
    const { dishes } = require('../../utils/data')
    this._init(Number(id), dishes)
  },

  _init(id, dishes) {
    const dish = dishes.find(d => d.id === id)
    if (!dish) {
      this.setData({ loading: false, error: '未找到菜品信息' })
      return
    }
    wx.setNavigationBarTitle({ title: dish.name })
    this.setData({ dish })
    this._loadTutorial(dish.tutorialUrl)
  },

  _loadTutorial(url) {
    if (!url) {
      this.setData({ loading: false, error: '暂无教程' })
      return
    }
    wx.request({
      url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && typeof res.data === 'string') {
          const blocks = this._parseMarkdown(res.data)
          this.setData({ blocks, loading: false })
        } else {
          this.setData({ loading: false, error: '教程加载失败，请检查网络' })
        }
      },
      fail: () => {
        this.setData({ loading: false, error: '网络请求失败，请重试' })
      },
    })
  },

  /**
   * 将 Markdown 文本解析为可渲染的 block 列表
   */
  _parseMarkdown(md) {
    const lines = md.split('\n')
    const blocks = []
    for (let raw of lines) {
      const line = raw.trimEnd()
      if (!line && blocks.length && blocks[blocks.length - 1].type !== 'blank') {
        blocks.push({ type: 'blank' })
        continue
      }
      // 标题
      if (line.startsWith('### ')) {
        blocks.push({ type: 'h3', text: line.slice(4).trim() })
      } else if (line.startsWith('## ')) {
        blocks.push({ type: 'h2', text: line.slice(3).trim() })
      } else if (line.startsWith('# ')) {
        blocks.push({ type: 'h1', text: line.slice(2).trim() })
      } else if (line.startsWith('---') || line.startsWith('===')) {
        blocks.push({ type: 'hr' })
      } else if (/^!\[.*\]\((.+)\)/.test(line)) {
        // 图片
        const m = line.match(/^!\[.*\]\((.+)\)/)
        const src = m[1].trim()
        // 过滤本地相对路径，只保留 http 图片
        if (src.startsWith('http')) {
          blocks.push({ type: 'img', src })
        }
      } else if (/^[-*+] /.test(line)) {
        // 无序列表
        const text = this._stripInline(line.slice(2))
        blocks.push({ type: 'li', text })
      } else if (/^\d+\. /.test(line)) {
        // 有序列表
        const text = this._stripInline(line.replace(/^\d+\. /, ''))
        blocks.push({ type: 'oli', text })
      } else if (line.trim()) {
        blocks.push({ type: 'p', text: this._stripInline(line) })
      }
    }
    return blocks
  },

  /** 去除内联 Markdown 标记（加粗、斜体、行内代码、链接） */
  _stripInline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim()
  },
})
