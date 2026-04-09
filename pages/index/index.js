const { categories, dishes, categoryColors } = require('../../utils/data')

Page({
  data: {
    categories,
    dishes,
    categoryColors,
    activeCategory: '全部',
    searchKey: '',
    isSearching: false,
    filteredDishes: [],
    groupedDishes: [],
    scrollToView: '',
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
    const cats = categories.filter(c => c !== '全部')
    cats.forEach(cat => {
      const list = dishes.filter(d => d.category === cat)
      if (list.length > 0) {
        grouped.push({ category: cat, list })
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

    if (category === '全部') {
      this.setData({ scrollToView: '' })
      setTimeout(() => {
        this.setData({ scrollToView: 'cat-' + categories[1] })
      }, 50)
      return
    }

    this.setData({ scrollToView: '' })
    setTimeout(() => {
      this.setData({ scrollToView: 'cat-' + category })
    }, 50)
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
    if (category && category !== '全部') {
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

  onOrder() {
    wx.showModal({
      title: '确认下单',
      content: `共 ${this.data.cartCount} 道菜，合计 ¥${this.data.cartTotal}`,
      confirmText: '确认下单',
      confirmColor: '#ff6b35',
      success: (res) => {
        if (res.confirm) {
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
