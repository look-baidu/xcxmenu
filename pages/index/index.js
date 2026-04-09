const { categories, dishes, categoryColors } = require('../../utils/data')

Page({
  data: {
    categories,
    dishes,
    categoryColors,
    activeCategory: categories[0],
    searchKey: '',
    isSearching: false,
    filteredDishes: [],
    groupedDishes: [],
    dishScrollTop: 0,
    cart: [],
    cartCount: 0,
    cartTotal: 0,
    showCart: false,
  },

  onLoad() {
    this.buildGroupedDishes()
  },

  buildGroupedDishes() {
    const grouped = []
    categories.forEach((cat, idx) => {
      const list = dishes.filter(d => d.category === cat)
      if (list.length > 0) {
        grouped.push({ category: cat, scrollId: 'cat' + idx, list })
      }
    })
    this.setData({ groupedDishes: grouped })
  },

  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category
    this.setData({ activeCategory: category })

    if (this.data.isSearching) {
      this.filterDishes(this.data.searchKey, category)
      return
    }

    const grouped = this.data.groupedDishes

    // 第一个分类直接回顶部
    const isFirst = grouped.length > 0 && grouped[0].category === category
    if (isFirst) {
      // 先设一个非0值再置0，确保即使当前已是0也能触发更新
      this.setData({ dishScrollTop: -1 })
      setTimeout(() => { this.setData({ dishScrollTop: 0 }) }, 50)
      return
    }

    // 其他分类：用 SelectorQuery 计算目标节点相对滚动容器的偏移量
    const found = grouped.find(g => g.category === category)
    const targetScrollId = found ? found.scrollId : ''
    if (!targetScrollId) return

    const query = wx.createSelectorQuery()
    query.select('#dishScrollView').scrollOffset()
    query.select('#' + targetScrollId).boundingClientRect()
    query.select('#dishScrollView').boundingClientRect()
    query.exec((res) => {
      const scrollInfo = res[0]
      const targetRect = res[1]
      const containerRect = res[2]
      if (!scrollInfo || !targetRect || !containerRect) return
      const scrollTop = Math.max(0, scrollInfo.scrollTop + targetRect.top - containerRect.top)
      const cur = this.data.dishScrollTop
      // 若目标值与当前 data 值相同，先设一个临近值再设目标值，强制触发更新
      if (cur === scrollTop) {
        this.setData({ dishScrollTop: scrollTop - 1 })
        setTimeout(() => { this.setData({ dishScrollTop: scrollTop }) }, 50)
      } else {
        this.setData({ dishScrollTop: scrollTop })
      }
    })
  },

  onDishScroll(e) {
    const now = Date.now()
    // 节流：距上次更新超过 150ms 才更新
    if (!this._lastScrollTime || now - this._lastScrollTime > 150) {
      this._lastScrollTime = now

      // 如果不在搜索模式，根据滚动位置更新 activeCategory
      if (!this.data.isSearching) {
        this._updateActiveCategoryByScroll(e.detail.scrollTop)
      }
    }
  },

  // 根据当前滚动位置计算应该高亮的分类
  _updateActiveCategoryByScroll(scrollTop) {
    const grouped = this.data.groupedDishes
    if (!grouped || grouped.length === 0) return

    // 使用 SelectorQuery 获取所有分类头部的位置信息
    const query = wx.createSelectorQuery()
    grouped.forEach((item) => {
      query.select('#' + item.scrollId).boundingClientRect()
    })

    query.exec((res) => {
      if (!res || res.length !== grouped.length) return

      // 获取所有分类头部距离屏幕顶部的距离
      const rects = res.map((rect, idx) => ({
        category: grouped[idx].category,
        top: rect ? rect.top : Infinity,
      }))

      // 找距离屏幕顶部最近且在屏幕内的分类（距顶部 80px 范围内）
      let targetCategory = this.data.activeCategory
      const threshold = 80 // 距屏幕顶部 80px 处触发高亮

      for (const item of rects) {
        // 如果分类头在屏幕顶部 threshold 范围内，选中它
        if (item.top >= 0 && item.top <= threshold) {
          targetCategory = item.category
        }
      }

      // 只在分类改变时更新，减少 setData 调用
      if (targetCategory !== this.data.activeCategory) {
        console.log('[滚动高亮] 更新分类:', targetCategory)
        this.setData({ activeCategory: targetCategory })
      }
    })
  },

  onSearchInput(e) {
    const key = e.detail.value.trim()
    if (!key) {
      this.setData({
        searchKey: '',
        isSearching: false,
        filteredDishes: [],
      })
      return
    }
    this.setData({ searchKey: key, isSearching: true })
    this.filterDishes(key, this.data.activeCategory)
  },

  clearSearch() {
    this.setData({
      searchKey: '',
      isSearching: false,
      filteredDishes: [],
    })
  },

  filterDishes(keyword, category) {
    let result = dishes
    if (category) {
      result = result.filter(d => d.category === category)
    }
    if (keyword) {
      const lower = keyword.toLowerCase()
      result = result.filter(d =>
        d.name.toLowerCase().includes(lower) ||
        d.desc.toLowerCase().includes(lower)
      )
    }
    this.setData({ filteredDishes: result })
  },

  onAddToCart(e) {
    const dish = e.detail
    const cart = [...this.data.cart]
    const idx = cart.findIndex(item => item.id === dish.id)

    if (idx >= 0) {
      cart[idx].quantity += 1
    } else {
      cart.push({
        id: dish.id,
        name: dish.name,
        emoji: dish.emoji,
        price: dish.price,
        quantity: 1,
      })
    }

    this.updateCart(cart)

    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1200,
    })
  },

  onCartAdd(e) {
    const { id } = e.detail
    const cart = [...this.data.cart]
    const idx = cart.findIndex(item => item.id === id)
    if (idx >= 0) {
      cart[idx].quantity += 1
      this.updateCart(cart)
    }
  },

  onCartSubtract(e) {
    const { id } = e.detail
    const cart = [...this.data.cart]
    const idx = cart.findIndex(item => item.id === id)
    if (idx >= 0) {
      if (cart[idx].quantity > 1) {
        cart[idx].quantity -= 1
      } else {
        cart.splice(idx, 1)
      }
      this.updateCart(cart)
    }
  },

  onCartDelete(e) {
    const { id } = e.detail
    const cart = this.data.cart.filter(item => item.id !== id)
    this.updateCart(cart)
  },

  onCartClear() {
    this.updateCart([])
  },

  updateCart(cart) {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    this.setData({ cart, cartCount, cartTotal })
  },

  toggleCart() {
    if (this.data.cartCount === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' })
      return
    }
    this.setData({ showCart: !this.data.showCart })
  },

  closeCart() {
    this.setData({ showCart: false })
  },

  onCheckout() {
    if (this.data.cartCount === 0) {
      wx.showToast({ title: '请先添加菜品', icon: 'none' })
      return
    }
    this.setData({ showCart: true })
  },

  notifyKitchen(cart, total) {
    // 企业微信群机器人 Webhook 地址，替换为实际的 key
    const WEBHOOK_URL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=f97eded3-4d21-430d-bb74-9bf611f443f5'

    // 拼接菜品明细
    const itemLines = cart.map(item =>
      `> **${item.name}** × ${item.quantity}　¥${item.price * item.quantity}`
    ).join('\n')

    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const msgContent = [
      '## 🔔 新订单通知',
      `> **下单时间：** ${timeStr}`,
      `> **菜品明细：**`,
      itemLines,
      `> **合计金额：** ¥${total}`,
      '> **请尽快备餐！**',
    ].join('\n')

    wx.request({
      url: WEBHOOK_URL,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        msgtype: 'markdown',
        markdown: { content: msgContent },
      },
      success(res) {
        console.log('[后厨通知] 发送结果：', JSON.stringify(res.data))
      },
      fail(err) {
        console.error('[后厨通知] 请求失败：', JSON.stringify(err))
      },
    })
  },

  onOrder() {
    wx.showModal({
      title: '确认下单',
      content: `共 ${this.data.cartCount} 道菜，合计 ¥${this.data.cartTotal}`,
      confirmText: '确认下单',
      confirmColor: '#ff6b35',
      success: (res) => {
        if (res.confirm) {
          // 下单成功后通知企业微信后厨群
          this.notifyKitchen(this.data.cart, this.data.cartTotal)
          this.updateCart([])
          this.setData({ showCart: false })
          wx.showToast({
            title: '下单成功，请等待配送',
            icon: 'none',
            duration: 2500,
          })
        }
      },
    })
  },
})
