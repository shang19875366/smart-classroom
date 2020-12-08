<template>
  <div class="container">
    <div class="tittle">
      <img  class="logo" src="../assets/imgs/zhybk.png"/>
    </div>
    <div class="title"><span class="classname">{{classname}}</span>签到正在进行中……</div>
    <div class="check_in_area">
      <div v-for="(item, index) in listData" :key="index">
        <div class="icon-container">
          <span class="icon-text">{{item.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        listData:[],
        classname:''
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
          this.$router.go(-1);
        } else if(arr.cmd == 'refresh_checked_list') {
          console.log('----------------------',this.listData)
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
        console.log(this.$store.flag)
        if(this.$store.state.flag == 0) {
          this.websocketonmessage(res)
          this.$store.commit("updateFlag", 1);
          console.log(this.$store.state.flag)
        }
      }
    },
    mounted() {
      this.classname = this.$route.query.classname
      console.log(this.classname)
    },
  }
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    padding: 1%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: #1B1A39;
    color: #fff;
  }
  .title {
    width: 100%;
    height: 10%;
    text-align: center;
    font-size: 36px;
    margin-top: 2%;
    font-weight: bold;
  }
  .classname {
    font-size: 36px;
  }
  .logo{
  position: absolute;
  top: 10px;
  left: 16px;
  width: 400px;
  // height: 70px;
}
  .check_in_area {
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: row;;
    box-sizing: border-box;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .icon-container {
    width: 128px;
    height: 128px;
    background-color: #844797;
    border-radius: 50%;
    margin-right: 40px;
    margin-bottom: 40px;
  }
  .icon-text {
    width: 128px;
    height: 128px;
    color: white;
    display: block;
    text-align: center;
    line-height: 128px;
    font-size: 36px;
  }
</style>
