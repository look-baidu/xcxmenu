Component({
  properties: {
    dish: {
      type: Object,
      value: {},
    },
  },

  methods: {
    /** 点击整张卡片 → 跳转详情页 */
    onCardTap() {
      const { id } = this.data.dish
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
      })
    },

    /** 点击加号按钮加入购物车（阻止冒泡，用 catchtap） */
    onAddTap() {
      this.triggerEvent('addtocart', this.data.dish)
    },
  },
})
