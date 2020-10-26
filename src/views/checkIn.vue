<template>
  <div class="container">
    <block v-for="(item, index) in listData" :key="index">
      <div class="icon-container">
      	<span class="icon-text">{{item.title}}</span>
      </div>
    </block>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        listData:[]
      }
    },
    methods:{
      //接收信息
    websocketonmessage(e) {
      console.log(111)
      let data = JSON.parse(e.data);
      console.log(data)
      if (data.textMessage) {
        let arr = JSON.parse(data.textMessage);
        if(arr.cmd == 'closeCheckIn') {
          this.$router.go(-1)
        } else if(arr.cmd == 'refresh_checked_list') {
          let stuName = arr.stuName
          this.listData.push({
            title:stuName
          })
        }
      }
    }
    },
    created() {
        this.$globalWs.ws.onmessage = (res) =>{
        this.websocketonmessage(res)
      }
    },
    mounted() {
      
    }
  }
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    padding: 10%;
    display: flex;
    box-sizing: border-box;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #1B1A39;
    color: #fff;
    flex-wrap: wrap;
  }
  .icon-container {
    width: 80px;
    height: 80px;
    background-color: #844797;
    border-radius: 50%;
    margin-right: 40px;
    margin-bottom: 40px;
  }
  .icon-text {
    width: 80px;
    height: 80px;
    color: white;
    display: block;
    text-align: center;
    line-height: 80px;
    font-size: 18px;
  }
</style>
