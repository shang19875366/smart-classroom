<template>
  <div class="container" v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="top">
      <div class="title">{{classname}}</div>
    </div>
    <div class="content">
      <div class="title2">
        <div class="reddot"></div>
        <div class="title">GPS定位签到中</div>
      </div>
      <div class="time">{{time}}</div>
      <div class="check_in_area">
        <div v-for="(item, index) in listData" :key="index">
          <div class="icon-container">
            <span class="icon-text">{{item.stuName}}</span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="checkintotal">
          已签到：{{checked}}人  未签到{{unchecked}}人
        </div>
        <div class="close_check_in" @click="endCheckIn">
          结束签到
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
        classname:'',
        activityLogId:'',
        time:"00:01",
        timeCount:1,
        timeInterval:null,
        checked:0,
        unchecked:0,
        loadingText:'加载中...，请稍后',
        loading:false,
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
            this.listData =[]
            this.$store.commit("updateFlag", 0);
          } else if(arr.cmd == 'refresh_check_list') {
            // if(this.$store.state.flag == 0) {
            // let stuName = arr.stuName
            // this.listData.push({
            //   title:stuName
            // })
            this.getCheckList(this.activityLogId)
            // this.$store.commit("updateFlag", 1);
            // }
          } else if(arr.cmd == 'endCheckIn') {
            this.$router.push({ path: '/checkInResult',query:{classname:this.classname,activityLogId:this.activityLogId }})
          }
        }
      },
      showTime() {
        ++this.timeCount
        if(this.timeCount<10) {
          this.time ="00:0"+this.timeCount
        } else if(this.timeCount>10 && this.timeCount<60) {
          this.time="00:"+this.timeCount
        } else if(this.timeCount>60 && this.timeCount<3600) {
          let m = Math.floor(this.timeCount /60) 
          let s = this.timeCount % 60
          if(m<10) {
            if(s<10) {
              this.time = "0"+m+":0"+s
            } else {
              this.time="0"+m+":"+s
            }
          } else {
            if(s<10) {
              this.time = m+":0"+s
            } else {
              this.time=m+":"+s
            }
          }
        } else {
          let h = Math.floor(this.timeCount/3600)
          let m = Math.floor((this.timeCount-h*3600)/60)
          let s = this.timeCount % 60
          if(m<10) {
            if(s<10) {
              this.time = "0"+m+":0"+s
            } else {
              this.time="0"+m+":"+s
            }
          } else {
            if(s<10) {
              this.time = m+":0"+s
            } else {
              this.time=m+":"+s
            }
          }
        }
      },
      getCheckList(activityLogId) {
        this.loading = true
        this.$htp.get_('/mhys/activitylog/isJoinList?activityLogId='+activityLogId).then(res=>{
          console.log(res)
          if(res.data.code == 200) {
            this.checked = res.data.activityInfoId.activityStus.length
            this.unchecked = res.data.activityInfoId.unActivityStus.length
            this.listData = []
            res.data.activityInfoId.activityStus.forEach(element => {
              this.listData.push(element)
            });
          } else {
            this.$message.error('获取数据出错,请检查网络连接');
          }
          this.loading = false
        }).catch(res=>{
          this.$message.error('获取数据出错,请检查网络连接');
          this.loading = false
        })
      },
      endCheckIn() {
        this.loading = true
        this.$htp.get_('/mhys/activitylog/end?activityLogId='+this.activityLogId).then(res=>{
          console.log(res)
          if(res.data.code == 200) {
            this.websocketsend({cmd:"endCheckIn"})
             this.$router.push({ path: '/checkInResult',query:{classname:this.classname,activityLogId:this.activityLogId }})
          } else {
            this.$message.error('获取数据出错,请检查网络连接');
          }
          this.loading = false
        }).catch(res=>{
          this.$message.error('获取数据出错,请检查网络连接');
          this.loading = false
        })
      },
      //发送信息给老师
      websocketsend(msg) {
        let data = { message: msg, scheduleId: this.$store.state.scheduleId, username: this.$store.state.username };
        console.log(data)
        this.$globalWs.ws.send(JSON.stringify(data));
      },
    },
    created() {
      console.log(this.$store.state.flag)
      // if(this.$store.state.flag == 0) {
        this.$globalWs.ws.onmessage = (res) =>{
          this.websocketonmessage(res)
          // this.$store.commit("updateFlag", 1);
          // console.log(this.$store.state.flag)
        }
      // }
    },
    beforeDestroy() {
      if(this.timeInterval != null) {
          clearInterval(this.timeInterval)
      }
    },
    mounted() {
      this.classname = this.$route.query.classname
      this.activityLogId = this.$route.query.activityLogId
      console.log(this.classname)
      this.getCheckList(this.activityLogId)
      this.timeInterval = setInterval(this.showTime,1000)
    },
  }
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: #fff;
  }
  .top {
    height: 80px;
    background: #252525;
    display: flex;
    align-items: center;
    padding-left: 30px;
  }
  .content{
    flex:1;
    display: flex;
    flex-direction: column;
    background: #2E3133;
  }
  .title {
    height: 50px;
    font-size: 36px;
    font-weight: 500;
    line-height: 50px;
    color: #FFFFFF;
    display: flex;
    align-items: center;
  }
  .title2 {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
  }
  .reddot {
    width: 24px;
    height: 24px;
    background: #FF0000;
    border-radius: 50%;
    margin-right: 20px;
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
    flex:1;
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
  .time {
    height: 109px;
    font-size: 80px;
    font-weight: 600;
    line-height: 109px;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
  }
  .bottom {
    height: 45px;
    font-size: 32px;
    font-weight: 400;
    line-height: 47px;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
  }
  .checkintotal {
    flex:1;
    display: flex;
    justify-content: center;
  }
  .close_check_in {
    position: absolute;
    bottom: 30px;
    right: 50px;
    width: 240px;
    height: 64px;
    background: linear-gradient(90deg, #FA8333 0%, #FA5033 100%);
    box-shadow: 0px 3px 20px rgba(250, 80, 51, 0.3);
    opacity: 1;
    border-radius: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
