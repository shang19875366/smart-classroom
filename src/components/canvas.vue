<template>
  <div id="canvasContainer">
    <canvas id="canvas" width="1920px" height="1080px"></canvas>
  </div>
</template>

<script>
import {Draw} from '@/utils/draw.js'
export default {
  data() {
    return {
        draw:null,
        penWight:8,
        penColor:'#F31718'
    };
  },
  methods: {
    initDraw() {
      var width = 1920 || window.innerWidth;
      var height = 1080 || window.innerHeight;
      var openDrawPen = 1; //1为开启画笔功能
      this.draw = new Draw({
        container: "#canvasContainer",
        width: width, //原始画板宽度
        height: height, //原始画板高度
        //background:'#333333',				//画板背景色
        showStep: true,
        penCallBack: function (data) {
          //自由画笔绘制返回数据  一段之后连续的
        //   console.log(data); 
          //console.log("1绘制返回数据"+JSON.stringify(data));
          //parent.postMessage(JSON.stringify({cmd: 'canvasDrawing'}), '*');//通知父级已开始绘画//画板数据保存到速课
          //parent.postMessage(JSON.stringify({cmd: 'canvasDataToCourse', content: data}), '*');//画板数据保存到速课
        },
        penCallBack2: function (data) {
            console.log(data)  //连续的
          //自由画笔绘制返回数据
          //console.log("2绘制返回数据"+JSON.stringify(data));
          parent.postMessage(JSON.stringify({cmd: 'canvasDataToStu', content: data}), '*');//画板数据发给学生端和大屏端
        },
        clickCallBack: function (direction) {},
      });
      console.log(this.draw)
      if (openDrawPen == 1) {
          
        this.draw.drawPen(5, this.penColor, this.penWight,this);
      }
    },
  },
  created(){
      
  },
  mounted() {
       this.initDraw();
       window.addEventListener('message', function (e) {
        console.log(e)
        if(e.data.data==undefined) return
        console.log(111)
        let pageinfo = JSON.parse(e.data);
        var cmd = pageinfo.cmd;
        //console.log("收到message"+JSON.stringify(pageinfo))
        if (cmd == "drawingBoardToScreen") {
            //console.log("大屏端根据message绘画")
            //大屏端老师板书笔迹
            var drawData = pageinfo.content;
            if (drawData.data.graphtype != 9 && drawData.data.graphtype != 10) {
                draw.dodraw(drawData);
                var pc = penColor;
                var pw = penWight;
                if (drawData.data.color) {
                    penColor = drawData.data.color;
                }
                if (drawData.data.weight) {
                    penWight = drawData.data.weight;
                }

                if (pc != penColor || pw != penWight) {
                    //画笔设置有变化时，通知父级
                    var sendData = {
                        "penColor": penColor,
                        "penWight": penWight
                    }
                    parent.postMessage(JSON.stringify({ cmd: 'canvasPenSet', content: sendData }), '*');//通知父级已开始绘画
                }

                if (drawData.data.graphtype == 5) {
                    parent.postMessage(JSON.stringify({ cmd: 'canvasDrawing' }), '*');//通知父级已开始绘画
                }
            }
        } else if (cmd == "drawingPenSet") {
            var drawData = pageinfo.content;
            if (drawData.penColor) {
                penColor = drawData.penColor;
            }
            if (drawData.penWight) {
                penWight = drawData.penWight;
            }
            draw.drawPen(5, penColor, penWight);
        } else if (cmd == "drawingPenRedo") {//撤回
            var data = {
                "graphtype": 11,
                "id": (new Date()).getTime(),
                "deleteId": {
                    "id": 0
                }
            };
            var sendData = {
                "type": 10,
                "data": data,
                "timestamp": (new Date()).getTime()
            };
            draw.redo();
            draw.drawPen(5, penColor, penWight);//撤回的时候，会把画笔设置也撤回了，这里每次撤回都重新初始化一次
            parent.postMessage(JSON.stringify({ cmd: 'canvasDataToStu', content: sendData }), '*');//画板数据发给学生端和大屏端
        } else if (cmd == "drawingBoardClear") {//清空画板
            var data = {
                "graphtype": 8,
                "id": (new Date()).getTime(),
                "deleteId": {
                    "id": 0
                }
            }
            var sendData = {
                "type": 10,
                "data": data,
                "timestamp": (new Date()).getTime()
            }
            draw.dodraw(sendData);
            parent.postMessage(JSON.stringify({ cmd: 'canvasDataToStu', content: sendData }), '*');//画板数据发给学生端和大屏端
        } else if (cmd == "drawingBoardInit") {
            this.initDraw();
        }
    });
  },
};
</script>
<style lang="scss" scoped>
#canvasContainer {
  text-align: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
}
#canvas {
  width: 100%;
}
</style>