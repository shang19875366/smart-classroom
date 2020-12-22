<template>
  <div
    class="container"
    v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="top">
      <div class="title">{{ courseName }}</div>
      <div class="header_right">
        <div class="check-in-history">
          <img
            src="../assets/imgs/check-in-history.png"
            alt="签到历史"
            class="check-in-history-icon"
          />签到历史
        </div>
        <img src="../assets/imgs/close-btn.png" alt="关闭" class="close-btn" @click="closeCurrentPage" />
      </div>
    </div>
    <div class="content">
      <div class="check-in-detail">
        <div class="check-in-detail-title">签到详情</div>
        <div class="check-in-detail-checked-title">已签到</div>
        <el-progress
          :percentage="percentChecked"
          :stroke-width="30"
          :format="format"
          color="#1B8CFF;"
          class="checked-progress"
        ></el-progress>
        <div class="check-in-detail-unchecked-title">未签到</div>
        <el-progress
          :percentage="percentUnChecked"
          :stroke-width="30"
          :format="format"
          color="#FA5033"
          class="checked-progress"
        ></el-progress>
        <div class="line"></div>
        <div id="pieChart" class="pieChart"></div>
      </div>
      <div class="uncheck-in-students">
        <div class="uncheck-in-students-title">未签到学生</div>
        <div class="uncheck-in-students-content">
          <div
            class="icon-container"
            v-for="(item, index) in listData"
            :key="index"
          >
            <span class="icon-text">{{ item.stuName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      loading: false,
      loadingText: "加载中...，请稍后",
      courseName: "我是课程的名称",
      activityLogId: "",
      listData: [],
      checked: -1,
      unchecked: -1,
      percentChecked: 0,
      percentUnChecked: 0,
    };
  },
  methods: {
    format(percentage) {
      console.log(percentage)
      return `${Math.round(percentage * (this.unchecked + this.checked)/100)}人`;
    },
    getCheckedData(activityLogId) {
      this.loading = true;
      console.log(activityLogId)
      this.$htp.get_('/mhys/activitylog/isJoinList?activityLogId=' + activityLogId).then((res) => {
            console.log(res)
          if (res.data.code == 200) {
            this.checked = res.data.activityInfoId.activityStus.length;
            this.unchecked = res.data.activityInfoId.unActivityStus.length;
            this.percentChecked =Math.round((this.checked / (this.checked + this.unchecked)) * 100);
            this.percentUnChecked = Math.round((this.unchecked / (this.checked + this.unchecked)) * 100);
            this.listData = [];
            res.data.activityInfoId.unActivityStus.forEach((element) => {
              this.listData.push(element);
            });
            this.updateChart();
          } else {
            this.$message.error("获取数据出错,请检查网络连接");
          }
          this.loading = false;
        }).catch((res) => {
          this.$message.error("获取数据出错,请检查网络连接",res);
          this.loading = false;
        });
    },
    updateChart() {
      let chart = echarts.init(document.getElementById("pieChart"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c}人 ({d}%)",
        },
        color:['#007AFF','#FA5033'],
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            label:{
                normal:{
                    formatter:'{b} {d}%',
                    fontWeight:600,
                    fontSize:24
                }
            },
            labelLine:{
                normal:{
                    lineStyle:{
                        width:3
                    }
                }
            },
            data: [
              { value: this.checked, name: "已签到" },
              { value: this.unchecked, name: "未签到" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      chart.setOption(option);
    },
    closeCurrentPage() {
        this.$router.go(-1);
        this.$router.go(-1);
    }
  },
  mounted() {
    this.courseName = this.$route.query.classname;
    this.activityLogId = this.$route.query.activityLogId;
    this.getCheckedData(this.activityLogId);
    window.onresize = function () {
      const chart1 = echarts.init(document.getElementById("pieChart"));
      chart1.resize();
    };
  },
};
</script>

<style lang="scss" scoped>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header_right {
  width: 284px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
.close-btn {
  width: 62px;
  height: 62px;
}
.check-in-history {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 24px;
  font-weight: 400;
  line-height: 34px;
  color: #ffffff;
  opacity: 0.8;
}
.check-in-history-icon {
  margin: 15px;
}
.check-in-detail {
  width: 1188px;
  background: #2e3133;
  opacity: 1;
  display: flex;
  flex-direction: column;
  padding-top: 22px;
  padding-left: 30px;
}
.uncheck-in-students {
  width: 732px;
  background: #3c4043;
  opacity: 1;
  padding-top: 22px;
  padding-left: 80px;
  padding-right: 80px;
}
.check-in-detail-title {
  height: 50px;
  font-size: 36px;
  font-weight: 400;
  line-height: 52px;
  color: #ffffff;
  opacity: 1;
}
.check-in-detail-checked-title {
  height: 48px;
  font-size: 36px;
  font-weight: 400;
  line-height: 49px;
  color: #ffffff;
  opacity: 1;
  margin-top: 34px;
  margin-bottom: 32px;
}
.checked-progress {
  width: 1000px;
  height: 50px;
}
.check-in-detail-unchecked-title {
  height: 48px;
  font-size: 36px;
  font-family: Open Sans;
  font-weight: 400;
  line-height: 49px;
  color: #ffffff;
  opacity: 1;
  margin-top: 65px;
  margin-bottom: 32px;
}
.line {
  border-top: solid rgba($color: #ffffff, $alpha: 0.2) 1px;
  margin-top: 97px;
  margin-left: -30px;
}
.pieChart {
  height: 100%;
}
.uncheck-in-students-title {
  height: 50px;
  font-size: 36px;
  font-weight: 400;
  line-height: 52px;
  color: #ffffff;
  opacity: 1;
  display: flex;
  justify-content: center;
}
.icon-container {
  width: 128px;
  height: 128px;
  background-color: #844797;
  border-radius: 50%;
  margin-right: 74px;
  margin-bottom: 61px;
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
.uncheck-in-students-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  padding-top: 114px;
}
</style>
<style>
.content .el-progress__text {
  height: 50px;
  font-size: 36px !important;
  font-weight: 400;
  line-height: 49px;
  color: #ffffff;
  opacity: 1;
  float: right;
  margin-left: 20px;
}
.content .el-progress-bar {
  margin-right: -150px;
  padding-right: 150px;
}
.content .el-progress-bar__outer {
  margin-top: 10px;
}
</style>