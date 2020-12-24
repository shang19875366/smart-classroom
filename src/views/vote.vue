<template>
  <div
    class="container"
    v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="top">
      <div class="title">投票</div>
    </div>
    <div class="content">
       <div class="check-in-detail">
         <div class="vote-title">{{voteName}}</div>
         <div class="option-container" v-for="(item, index) in listData" :key="index">
           <div class="option-title">
             {{item.title}}
           </div>
           <div class="option-progress">
             <el-progress
                :percentage="percentChecked"
                :stroke-width="30"
                color="#1B8CFF;"
              ></el-progress>
           </div>
         </div>
       </div>
       <div class="uncheck-in-students"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //   listData: [],
      classname: "",
      loadingText: "正在加载中...请稍后",
      loading: false,
      dataMap: [],
      activityStus: [],
      unActivityStus: [],
      voteName: "我是一个投票的主题",
    };
  },
  methods: {
    //接收信息
    websocketonmessage(e) {
      console.log(111);
      let data = JSON.parse(e.data);
      console.log(data);
      if (data.textMessage) {
        let arr = JSON.parse(data.textMessage);
        if (arr.cmd == "closeVote") {
          this.$router.go(-1);
          //   this.listData = [];
          // this.$store.commit("updateFlag", 0);
        } else if (arr.cmd == "refresh_vote_list") {
          //   if (this.$store.state.flag == 0) {
          // let stuName = arr.stuName;
          // this.listData.push({
          //   title: stuName,
          // });
          // this.$store.commit("updateFlag", 1);
          this.getVoteData();
          //   }
        }
      }
    },

    getVoteData() {
      this.loading = true;
      this.$htp
        .get_(
          "/mhys/activitylog/isJoinList?activityLogId=" +
            this.$route.query.activityLogId
        )
        .then(({ data }) => {
          console.log(data);
          if (data.code == 200) {

          } else {
            this.$message.error("获取数据出错,请检查网络连接");
          }
          this.loading = false;
        })
        .catch((res) => {
          this.$message.error("获取数据出错,请检查网络连接");
          this.loading = false;
        });
    },
  },
  created() {
    // console.log(this.$store.state.flag);
    // if(this.$store.state.flag == 0) {
    // this.$globalWs.ws.onmessage = (res) => {
      // this.websocketonmessage(res);
      // this.$store.commit("updateFlag", 1);
      // console.log(this.$store.state.flag)
    // };
    // }
    PubSub.subscribe("closeVote",(msg,arr)=> {
      this.$router.go(-1);
    })
    PubSub.subscribe("refresh_vote_list",(msg,arr)=> {
      this.getVoteData();
    })
  },
  beforeDestroy() {
    PubSub.unsubscribe("closeVote")
    PubSub.unsubscribe("refresh_vote_list")
  },
  mounted() {
    this.classname = this.$route.query.classname;
    this.getVoteData();
    console.log(this.classname);
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 1920px;
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
.content {
  flex: 1;
  display: flex;
}
.title {
  height: 50px;
  font-size: 36px;
  font-weight: 500;
  line-height: 50px;
  color: #ffffff;
  display: flex;
  align-items: center;
}
.check-in-detail {
  width: 1188px;
  background: #2e3133;
  height: 100%;
}
.uncheck-in-students {
  width: 732px;
  background: #3c4043;
  height: 100%;
}
.vote-title {
  height: 50px;
  font-size: 36px;
  font-weight: 400;
  line-height: 52px;
  color: #FFFFFF;
  margin-left: 30px;
  margin-top: 21px;
}
.option-container {
  height: 160px;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
