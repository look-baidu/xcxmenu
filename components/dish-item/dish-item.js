Component({
  properties: {
    dish: {
      type: Object,
      value: {},
    },
  },

  methods: {
    onAddTap() {
      this.triggerEvent('addtocart', this.data.dish)
    },
  },
})
