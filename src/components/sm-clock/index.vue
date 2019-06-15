<template>
  <div class="sm-clock">
    <!-- <span class="sm-clock--date">{{date}}</span> -->
    <span class="sm-clock--time">{{time}}</span>
  </div>
</template>
<script>
export default {
  name: 'SmClock',

  componentName: 'SmClock',

  data() {
    return {
      date: '',
      time: ''
    }
  },

  created() {
    setInterval(this.updateTime, 1000)
  },

  methods: {
    updateTime() {
      const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      const cd = new Date()
      this.time =
        this.zeroPadding(cd.getHours(), 2) +
        ':' +
        this.zeroPadding(cd.getMinutes(), 2) +
        ':' +
        this.zeroPadding(cd.getSeconds(), 2)
      this.date =
        this.zeroPadding(cd.getFullYear(), 4) +
        '-' +
        this.zeroPadding(cd.getMonth() + 1, 2) +
        '-' +
        this.zeroPadding(cd.getDate(), 2) +
        ' ' +
        week[cd.getDay()]
    },

    zeroPadding(num, digit) {
      let zero = ''
      for (let i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    }
  }
}
</script>


