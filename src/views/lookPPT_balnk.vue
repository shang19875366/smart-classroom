<template>
  <div class="container">
    <div id="ppt" class="ppt" ref="ppt">
      <iframe
      class="imgppt"
      id="PPTIframe"
      frameborder=0 name="showHere" scrolling=auto
      style="width:100%;height:100%"
      src="http://vip.ow365.cn/?i=34&n=5&furl=http%3A%2F%2Fofficeweb365.com%2Fviewfile%2F%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAHTML5%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91.pptx&p=1">
      </iframe>
      <canvas id="cavs" ref='cavs'></canvas>
    </div>

    <ul class="controlBox">
      <li class="colorList">
          <span v-for="(v,i) in colorList" :key="i" 
          :style="{backgroundColor:v}" @click="changeColor(v)"></span>
      </li>
      <li @click="clearPPT">
        <i class="el-icon-brush"></i>
      </li>
      <li @click="prevPage">
        <i class="el-icon-arrow-left"></i>
      </li>
      <li @click="nextPage">
        <i class="el-icon-arrow-right"></i>
      </li>
      <li class="screen" @click="save">保存</li>
      <li class="screen" @click="screenfull">{{isFullscreen?'取消':'全屏'}}</li>
    </ul>
  </div>
</template>
<script>
// http://vip.ow365.cn/?i=34&n=5&furl=http%3A%2F%2Fofficeweb365.com%2Fviewfile%2F%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAHTML5%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91.pptx&p=1

import html2canvas from "html2canvas";
import screenfull from "screenfull";
export default {
  data() {
    return {
      colorList:['#F56C6C','#409EFF','#67C23A','#E6A23C','#909399','#000'],
      isFullscreen: false,
      canvas: null,
      ctx: "",
      pageWidth: "",
      pageHeight: "",
      paint: false,

      lastPoint: "",
      newPoint: "",
    };
  },
  methods: {
    prevPage(){
      document.getElementById('PPTIframe').contentWindow.postMessage("preAnim", '*')
    },
    nextPage(){
      console.log('next')
      document.getElementById('PPTIframe').contentWindow.postMessage("nextAnim", '*')
    },
    changeColor(color){
        this.ctx.strokeStyle = color;
    },
    save() {
      html2canvas(this.$refs.cavs, {
        backgroundColor: null, // 解决生成的图片有白边
      }).then((canvas) => {
        let dataURL = canvas.toDataURL("image/png");
        let saveImg = document.createElement("a");
        document.body.appendChild(saveImg);
        saveImg.href = dataURL;
        saveImg.download = "canvas" + new Date().getTime();
        saveImg.target = "_blank";
        saveImg.click();
      });
    },
    clearPPT() {
      this.ctx.clearRect(0, 0, this.pageWidth, this.pageHeight);
      this.initCanvas();
    },
    drawLine() {
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
      this.ctx.lineTo(this.newPoint.x, this.newPoint.y);
      this.ctx.stroke();
    },
    initCanvas() {
      let that = this;

      this.canvas = document.getElementById("cavs");

      // 指定了画布上绘制的类型为2d
      this.ctx = this.canvas.getContext("2d");
      // 获取画布相对于视窗的位置集合
      let rect = this.canvas.getBoundingClientRect();

      let initX = rect.x;
      let initY = rect.y;
      this.pageWidth = document.documentElement.clientWidth - rect.x - 120;
     
      this.pageHeight = document.documentElement.clientHeight - rect.y ;
      this.canvas.width = this.pageWidth;
      this.canvas.height = this.pageHeight;
      // 鼠标按下事件
      this.canvas.onmousedown = function (e) {
        that.paint = true;

        // e是浏览器坐标系上的点，必须减去canvas的原点坐标，才是准确的画布上的坐标
        let x = e.clientX - initX;
        let y = e.clientY - initY;

        that.lastPoint = { x: x, y: y };
        that.ctx.beginPath();
      };
      // 鼠标移动事件
      this.canvas.onmousemove = function (e) {
        if (that.paint) {
          let x = e.clientX - initX;
          let y = e.clientY - initY;
          that.newPoint = { x: x, y: y };
          that.drawLine();
          that.lastPoint = that.newPoint;
        }
      };
      // 鼠标松开事件
      this.canvas.onmouseup = function () {
        that.paint = false;
        that.ctx.closePath();
      };
    },
    
    screenfull() {
      screenfull.toggle();
      this.isFullscreen = !this.isFullscreen;
    },
  },
  watch:{
      
  },
  mounted() {
    this.initCanvas();
    
  },
};
</script>
<style lang="scss" scoped>
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
    #cavs {
      @include wh(100%);
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 99;
    }
  }
  .controlBox {
    position: absolute;
    z-index: 999;
    bottom: 0px;
    right: 0px;
    color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    li {
      background: #8b95af;
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
      &.colorList{
          width: 130px;
          height: 18px;
          padding: 10px 40px;
          border-radius: 30px;
          background-color: #fff;
          span{
               margin: 0px 5px;
               padding: 10px;
               border-radius: 50%;
               font-size: 12px;
               background-color: pink;
               display: inline-block;
               cursor: pointer;
               
          }
      }
    }
  }
}
</style>
