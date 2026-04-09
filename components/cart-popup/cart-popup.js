Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    cart: {
      type: Array,
      value: [],
    },
  },

  observers: {
    'cart': function (cart) {
      const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      this.setData({ totalPrice })
    },
  },

  data: {
    totalPrice: 0,
  },

  methods: {
    preventScroll() {},

    onClose() {
      this.triggerEvent('close')
    },

    onAdd(e) {
      const id = e.currentTarget.dataset.id
      this.triggerEvent('add', { id })
    },

    onSubtract(e) {
      const id = e.currentTarget.dataset.id
      this.triggerEvent('subtract', { id })
    },

    onDelete(e) {
      const id = e.currentTarget.dataset.id
      this.triggerEvent('delete', { id })
    },

    onClear() {
      wx.showModal({
        title: '提示',
        content: '确定清空购物车？',
        confirmColor: '#ff6b35',
        success: (res) => {
          if (res.confirm) {
            this.triggerEvent('clear')
          }
        },
      })
    },

    onOrder() {
      this.triggerEvent('order')
    },
  },
})
