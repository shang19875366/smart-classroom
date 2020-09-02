<template>
  <div class="container">
    <!-- 激光笔  -->
    <div  v-show="showLaser" class="reddot" ref="laserDrop" id="laserDrop" style="left:50%;top:50%"></div>
    <!-- PPT+canvas -->
    <div id="canvasContainer" class="ppt" ref="ppt">
      <img
        v-for="(v,i) in this.countList"
        :key="i"
        :src="imageUrl + v +'.png'"
        class="imgppt"
        v-show="choseOne==v"
      />
      <canvas id="canvas" ref="canvas" width="1920px" height="1080px"></canvas>
    </div>
    <!-- 当前页、总页数 -->
    <div class="currentPage">
      <span>{{choseOne}}/{{countList.length}}</span>
    </div>
    <!-- 按钮控制器 -->
    <ul class="controlBox">
      <li class="colorList">
        <div
          v-for="(v,i) in colorList"
          :key="i"
          :style="{backgroundColor:v}"
          @click="changeColor(v)"
        >
          <img v-show="penColor == v" class="image" src="../assets/imgs/chose.png" />
        </div>
      </li>
      <li @click="clearPPT">
        <i class="el-icon-brush"></i>
      </li>
      <li @click="changePage(0)" :style="{'background':choseOne==1?'#C0C4CC':'#409EFF'}">
        <i class="el-icon-arrow-left"></i>
      </li>
      <li
        @click="changePage(1)"
        :style="{'background':choseOne==countList.length?'#C0C4CC':'#409EFF'}"
      >
        <i class="el-icon-arrow-right"></i>
      </li>

      <!-- <li class="screen" @click="screenfull">{{isFullscreen?'取消':'全屏'}}</li> -->
    </ul>
  </div>
</template>
<script>
import { Draw } from "@/utils/draw.js";
import html2canvas from "html2canvas";
import screenfull from "screenfull";
import { setInterval, clearInterval } from 'timers';

export default {
  data() {
    return {
      colorList: [
        "#F31718",
        "#409EFF",
        "#67C23A",
        "#E6A23C",
        "#909399",
        "#000",
      ],
      
      isFullscreen: false,
      draw: null,
      penWight: 4,
      penColor: "#F31718",
      imageUrl: "",
      countList: [],
      choseOne: 1,
      websocket: null,
      windowH: null,
      windowW: null,
      laserDom: null,
      showLaser: false,
      canvasHeight:0,
      canvasWidth:0
    };
  },
  
  methods: {
    //激光笔移动
    laserAnimate(position) {
      console.log(position)
      let laserDom =  this.laserDom
      let left =laserDom.offsetLeft 
      let top = laserDom.offsetTop
      // console.log('style',laserDom.style.left)
      // console.log('offset',laserDom.offsetLeft )
      // console.log((this.windowW/500)*(-position.left)*2 )
        // let top = this.$refs.laserDrop.style.top;
        let curLeft = (this.windowW/500)*(-position.left)*3.5 + left;
        let curTop =(this.windowH/500)*(-position.top)*2 + top ;
        console.log(curLeft)
        console.log(curTop)
        if (curLeft > this.windowW) {
          curLeft = this.windowW - 32;
        }
        if (curTop > this.windowH) {
          curTop = this.windowH -32;
        }
        if (curTop < 0) {
          curTop = 0;
        }
        if (curLeft < 0) {
          curLeft = 0;
        }
        
        laserDom.style.left  = curLeft +'px';
        laserDom.style.top = curTop +'px'; 

        // var laserDrop = document.getElementById("laserDrop");
      // setTimeout(()=>{
      //   console.log((this.canvasWidth /2 - Number(left.toFixed(0)) *40))
      //   laserDrop.style.left = (this.canvasWidth /2 + Number(left.toFixed(0)) *40) + "px";
      //   laserDrop.style.top = (this.canvasHeight /2 - Number(top.toFixed(0)) *40) + "px";

      // },200)
    },
    changePage(code, flag = true) {
      //code  0  表示上一页，1  表示下一页
      if (code == 0) {
        if (flag) {
          this.websocketsend({ cmd: "changePage", code: 0 });
        }

        if (this.choseOne == 1) return;
        this.choseOne = this.choseOne - 1;
      } else {
        if (flag) {
          this.websocketsend({ cmd: "changePage", code: 1 });
        }
        if (this.choseOne == this.countList.length) return;
        this.choseOne = this.choseOne + 1;
      }
    },
    screenfull() {
      screenfull.toggle();
      this.isFullscreen = !this.isFullscreen;
    },
    initDraw() {
      var width = 1920 || window.innerWidth;
      var height = 1080 || window.innerHeight;
      var openDrawPen = 1; //1为开启画笔功能
      this.draw = new Draw({
        container: "#canvasContainer",
        width: width, //原始画板宽度
        height: height, //原始画板高度
        showStep: true,
        penCallBack: function (data) {
          //自由画笔绘制返回数据  一段之后连续的
          //   console.log(data);
          //console.log("1绘制返回数据"+JSON.stringify(data));
          //parent.postMessage(JSON.stringify({cmd: 'canvasDrawing'}), '*');//通知父级已开始绘画//画板数据保存到速课
          //parent.postMessage(JSON.stringify({cmd: 'canvasDataToCourse', content: data}), '*');//画板数据保存到速课
        },
        penCallBack2: function (data) {
          // console.log(data); //连续的
          //自由画笔绘制返回数据
          //console.log("2绘制返回数据"+JSON.stringify(data));
          // parent.postMessage(
          //   JSON.stringify({ cmd: "canvasDataToStu", content: data }),
          //   "*"
          // );
           //画板数据发给学生端和大屏端
        },
        clickCallBack: function (direction) {},
      });
      // console.log(this.draw)
      if (openDrawPen == 1) {
        this.draw.drawPen(5, this.penColor, this.penWight);
      }
    },
    //清除PPT
    clearPPT() {
      this.draw.clearCanvas();
    },
    changeColor(v) {
      this.penColor = v;
      this.draw.drawPen(5, this.penColor, this.penWight);
    },
    getPPTList() {
      this.$htp.get_("/our/upload/showPPT").then((res) => {
        let { imageUrl, count } = res.data.image;
        this.imageUrl = imageUrl;
        this.countList = [];
        for (let i = 1; i <= count; i++) {
          this.countList.push(i);
        }
      });
    },
    initWebSocket() {
      if ("WebSocket" in window) {
        let host = this.$htp.host.replace("http", "");
        const wsuri = "ws" + host + "/our/connectWebSocket/computer";
        this.websocket = new WebSocket(wsuri);
        //接收到消息的回调方法
        this.websocket.onopen = this.websocketonopen;
        this.websocket.onmessage = this.websocketonmessage;

        this.websocket.onerror = this.websocketonerror;
        this.websocket.onclose = this.websocketclose;
      } else {
        alert("当前浏览器 Not support websocket");
      }
    },
    websocketonopen() {
      console.log("连接成功");
    },
    //接收信息
    websocketonmessage(e) {
      let data = JSON.parse(e.data);

      if (data.textMessage) {
        let arr = JSON.parse(data.textMessage);
        if (arr.cmd == "changePage") {
          this.changePage(arr.code, false);
        }
        if (arr.cmd == "getAcc") {
          this.laserAnimate({ left: arr.value.left, top: arr.value.top });
        }
        if (arr.cmd == "endAcc") {
          this.showLaser = false;
        }
        if (arr.cmd == "movestart") {
          this.showLaser = true;
        }
        if (arr.cmd == "closeSceen") {
          this.$router.push({ path: "/" });
        }
        if(arr.cmd == 'boradToScreen'){
          console.log(arr.context)
          let drawData = arr.context
            if(drawData.data.graphtype != 9 && drawData.data.graphtype != 10){
               console.log(drawData.data)
              this.draw.dodraw(drawData);
              if(drawData.data.color){
                this.penColor = drawData.data.color;
              }
                if(drawData.data.weight){
                  this.penWight = drawData.data.weight;
              }

            }
        }
        if(arr.cmd == 'clearPPT'){
          this.clearPPT()
        }
      }
    },
    //发送信息
    websocketsend(msg) {
      let data = { message: msg, usrId: "phone", to: "phone" };
      this.$globalWs.ws.send(JSON.stringify(data));
    },
    websocketonerror() {
      console.log("长连接发生错误！");
    },
    websocketclose(e) {
      console.log("长连接已关闭");
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.websocket) {
      this.websocket.close();
    }
    next();
  },
  created() {
    this.$globalWs.ws.onmessage = (res) =>{
      this.websocketonmessage(res)
    }
  },
  mounted() {
    this.windowW = window.innerWidth;
    this.windowH = window.innerHeight;
    this.laserDom = document.getElementById("laserDrop");
    // console.log(this.windowW )
    // console.log(this.windowH )
    // this.laserAnimate({left: "-1.10", top: "0"})
    this.getPPTList();
    this.initDraw();
    this.canvasHeight = this.$refs.canvas.clientHeight
    this.canvasWidth = this.$refs.canvas.clientWidth
    
  },
};
</script>
<style lang="scss" scoped>
#canvasContainer {
  user-select: none;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
#canvas {
  width: 100%;
}
@mixin wh($value) {
  width: $value;
  height: $value;
}
.container {
  @include wh(100%);
  position: relative;
  background-color: #000;
  padding: 0px 120px;
  box-sizing: border-box;
  overflow: hidden;
  .ppt {
    @include wh(100%);
    overflow: hidden;
    position: relative;
    img.imgppt {
      @include wh(100%);
    }
    #canvas {
      @include wh(100%);
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 99;
    }
  }
  .currentPage {
    color: #000;
    position: absolute;
    bottom: 20px;
    left: 0px;
    background: #fff;
    padding: 10px 14px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .controlBox {
    position: absolute;
    z-index: 999;
    bottom: 0px;
    right: 60px;
    color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    li {
      background: #409eff;
      @include wh(30px);
      padding: 7px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.5s;

      &.screen {
        @include wh(35px);
        font-size: 12px;
      }
      &.colorList {
        width: 210px;
        height: 18px;
        padding: 10px 20px;
        border-radius: 30px;
        background-color: #f2f6fc;
        div {
          margin: 0px 5px;
          padding: 3px;

          border-radius: 50%;

          width: 16px;
          height: 16px;
          background-color: pink;
          // display: inline-block;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          .image {
            width: 14px;
            height: 14px;
          }
        }
      }
    }
  }
}

.reddot {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  border: 0.5rem solid #ff3534;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0.1rem #ff8888;
  border-radius: 50%;
  position: absolute;
  z-index: 89898;
  // top:0px;
  // left:0px;
}
</style>
