<script type="text/jsx">
import { mixColor } from '@/utils/tools.js'
export default {
  name: 'SmBar',

  render(h) {
    return (
      <ul
        role="SmBar"
        style={{ backgroundColor: this.backgroundColor || '' }}
        class="sm-menu"
      >
        {this.$slots.default}
      </ul>
    )
  },

  props: {
    defaultActive: {
      type: String,
      default: ''
    },
    backgroundColor: String,
    textColor: String,
    activeTextColor: String
  },

  data() {
    return {
      activeIndex: this.defaultActive,
      items: {}
    }
  },

  computed: {
    hoverBackground() {
      return this.backgroundColor
        ? this.mixColor(this.backgroundColor, 0.2)
        : ''
    }
  },
  
  watch: {
    defaultActive: 'updateActiveIndex'
  }
}
</script>


