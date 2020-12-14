<template>
  <div
    class="container"
    v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="tittle">
      <img class="logo" src="../assets/imgs/zhybk.png" />
    </div>
    <div class="title">
      <span class="classname">{{ classname }}</span>投票正在进行中……
    </div>
    <div class="check_in_area">
      <div class="top">
          <div class="left">
            <h2>已投 ({{ activityStus.length }})</h2>
            <div class="students">
                <div v-for="(item, index) in activityStus" :key="index">
                    <div class="icon-container">
                        <span class="icon-text">{{ item.stuName }}</span>
                    </div>
                </div>
            </div>
          </div>
          <div class="center">
            <h2>未投({{ unActivityStus.length }})</h2>
            <div class="students">
                <div v-for="(item, index) in unActivityStus" :key="index">
                    <div class="icon-container">
                        <span class="icon-text">{{ item.stuName }}</span>
                    </div>
                </div>
            </div>
          </div>
      </div>
      <div class="bottom">
          <div class="left" v-for="(item,index) in dataMap" :key="index">
              <h2>{{item.name}}({{ item.data.length }})</h2>
              <div class="students">
                <div v-for="(item1, index1) in item.data" :key="index1">
                    <div class="icon-container">
                        <span class="icon-text">{{ item1.stuName }}</span>
                    </div>
                </div>
            </div>
          </div>
      </div>
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
      dataMap:[],
      activityStus:[],
      unActivityStus:[]
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
          this.$store.commit("updateFlag", 0);
        } else if (arr.cmd == "refresh_vote_list") {
        //   if (this.$store.state.flag == 0) {
            // let stuName = arr.stuName;
            // this.listData.push({
            //   title: stuName,
            // });
            // this.$store.commit("updateFlag", 1);
            this.getVoteData()
        //   }
        }
      }
    },

    getVoteData() {
      this.loading = true;
      this.$htp
        .get_("/mhys/dataManage/activityStu/list?activityLogId="+this.$route.query.activityLogId)
        .then(({data}) => {
            console.log(data)
          if (data.code == 200) {
              this.dataMap = data.page.dataMap;
              this.activityStus = data.page.activityStus
              this.unActivityStus = data.page.unActivityStus
          } else {
            this.$message.error("获取投票数据失败，请重试");
          }
          this.loading = false;
        })
        .catch((res) => {
          this.$message.error("获取投票数据失败，请重试");
          this.loading = false;
        });
    },
  },
  created() {
    console.log(this.$store.state.flag);
    // if(this.$store.state.flag == 0) {
    this.$globalWs.ws.onmessage = (res) => {
      this.websocketonmessage(res);
      // this.$store.commit("updateFlag", 1);
      // console.log(this.$store.state.flag)
    };
    // }
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
  width: 100%;
  height: 100%;
  padding: 1%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #1b1a39;
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
.logo {
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
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
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
.top,.bottom {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: row;
    text-align: center;
    // border: dashed #fff 1px;
}
.left,.right,.center {
    flex:1;
    // border: dashed #fff 1px;
}
.students {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}
</style>
