

function Draw(opt) {
    this.initCanvas(opt);
  }
  function getOffsetTop(el) {
    return el.offsetParent
      ? el.offsetTop + getOffsetTop(el.offsetParent)
      : el.offsetTop;
  }
  function getOffsetLeft(el) {
    return el.offsetParent
      ? el.offsetLeft + getOffsetLeft(el.offsetParent)
      : el.offsetLeft;
  }
  Draw.prototype = {
    options: "",
    constructor: this,
    ctx: null,
    showStep: false, //是否显示动态绘制过程
    isClosePen: false,
    isdrawing: false,
    penwidth: "",
    pencolor: "",
    isClick: false,
    //清空所有的线条数据
    clearPath: function () {
      this.ctx.doPath = []; //存储所有的线条数据数组
    },
    //获取所有的线条数据
    getPath: function () {
      console.log(this.ctx.doPath)
      return this.ctx.doPath;
    },
    initCanvas: function (opt) {
      if (typeof opt.id == "undefined" || opt.id == null || opt.id == "") {
        //增加自定义canvas标签id
        opt.id = "canvas";
      }
      this.options = opt;
      let		canvas = document.getElementById('canvas');
     
      // var canvas = document.createElement("canvas");
      canvas.setAttribute("id", opt.id);
      canvas.style.width = "100%";
      if (opt.maskElem) {
        var elem = document.body.querySelector(opt.maskElem);
        elem.parentNode.appendChild(canvas);
        canvas.style.position = "absolute";
        canvas.style.top = elem.offsetTop;
        canvas.style.left = elem.offsetLeft;
        canvas.style.width = elem.offsetWidth;
        canvas.style.height = elem.offsetHeight;
      } else if (opt.container) {
        document.body.querySelector(opt.container).appendChild(canvas);
      } else {
        document.body.appendChild(canvas);
      }
      canvas.setAttribute("width", opt.width ? opt.width : 1920);
      canvas.setAttribute("height", opt.height ? opt.height : 1000);
      canvas.style.background = opt.background ? opt.background : "";
  
      this.ctx = canvas.getContext("2d");
      console.log(this.ctx)
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.doPath = [];
      this.ctx.fullPathData = []; //用于记录接收到的“实时画笔传输”的单次作画数据，实时传输的数据是连续的不完整的，这里根据传输状态，记录完整的一次作画数据（鼠标/手指按下作画到抬起）
      this.showStep = opt.showStep ? opt.showStep : this.showStep;
      if (opt.clickCallBack) {
        canvas.onclick = function (ev) {
          if (this.isClick) {
            var pointX = ev.clientX;
            var direction = "right";
            if (pointX < document.body.clientWidth / 2) {
              //左侧点击
              direction = "left";
            }
            opt.clickCallBack(direction);
            ev.preventDefault();
          }
        };
      }
    },
    //画笔
    drawPen: function (type, color, weight) {  
      
      var _this = this;
      _this.isClosePen = false;
  
      //设置颜色和宽度
      _this.ctx.strokeStyle =
        color.length == 9 ? "#" + color.substr(3, 7) : color;
      _this.ctx.lineWidth = weight;
      this.ctx.setLineDash([0, 0]);
      this.ctx.globalCompositeOperation = "source-over";
  
      //存储当前画笔信息
      _this.isdrawing = true;
      _this.penwidth = weight;
      _this.pencolor = _this.ctx.strokeStyle;
  
      // _this.ctx.canvas.onclick = null; //画笔开启后，原click取消，走画笔的mouseup/touchend，避免事件重复执行
  
      _this.ctx.canvas.onmousedown = _this.ctx.canvas.ontouchstart = function (
        ev
      ) {
         
        ev.stopPropagation();
        let isClick = true;
        if (!_this.isClosePen) {
          var ev = ev || event;
          if (ev.type == "touchstart") {
            ev = ev.changedTouches[0];
          }
          
          var newLine = {
            type: 10,
            data: {
              graphtype: 5,
              id: new Date().getTime(),
              color: _this.ctx.strokeStyle,
              weight: _this.ctx.lineWidth,
              point: [],
              deleteId: {
                id: 0,
              },
            },
            timestamp: new Date().getTime(),
          };
          var newLine2 = {
            type: 10,
            data: {
              graphtype: 5,
              id: new Date().getTime(),
              color: _this.ctx.strokeStyle,
              weight: _this.ctx.lineWidth,
              point: [],
              deleteId: {
                id: 0,
              },
              drawstate: 1, //单次作画状态：1.开始画，2.作画中，3.作画结束
            },
            timestamp: new Date().getTime(),
          };
          var parentNode = _this.ctx.canvas.parentNode;
          let parentLeft;
          var parentTop = (parentLeft = 0);
          if (parentNode.offsetTop > 0 || parentNode.offsetLeft > 0) {
            parentTop = parentNode.offsetTop;
            parentLeft = parentNode.offsetLeft;
          }
          _this.ctx.beginPath();
          //缩放比例  canvas/实际
          var scaleX =
            _this.ctx.canvas.getAttribute("width") / _this.ctx.canvas.clientWidth;
          var scaleY =
            _this.ctx.canvas.getAttribute("height") /
            _this.ctx.canvas.clientHeight;
          var elem =
            document.scrollingElement ||
            document.documentElement ||
            document.body;
          var scollleft = elem.scrollLeft;
          var scolltop = elem.scrollTop;
          console.log(_this.ctx.canvas.getAttribute("width"))
          console.log(_this.ctx.canvas.clientWidth)
          console.log(scaleX)
          var pointX = parseInt(
            (ev.clientX -
              parseInt($(_this.ctx.canvas).parent().offset().left) +
              scollleft) *
              scaleX
          );
          console.log(pointX)
          var pointY = parseInt(
            (ev.clientY -
              parseInt($(_this.ctx.canvas).parent().offset().top) +
              scolltop) *
              scaleY
          );
          _this.ctx.moveTo(pointX, pointY);
          var point = [pointX, pointY];
          newLine.data.point.push(point);
          newLine2.data.point.push(point);
  
          _this.ctx.canvas.onmousemove = _this.ctx.canvas.ontouchmove = function (
            ev
          ) {
            console.log(23333) 
            ev.stopPropagation();
            var ev = ev || event;
            if (ev.type == "touchmove") {
              ev = ev.changedTouches[0];
            }
            var elem =
              document.scrollingElement ||
              document.documentElement ||
              document.body;
            var scollleft = elem.scrollLeft;
            var scolltop = elem.scrollTop;
            //var pointX = parseInt((ev.clientX - _this.ctx.canvas.offsetLeft + document.scrollingElement.scrollLeft) * scaleX);
            //var pointY = parseInt((ev.clientY - _this.ctx.canvas.offsetTop + document.scrollingElement.scrollTop) * scaleY);
            var pointX = parseInt(
              (ev.clientX -
                parseInt($(_this.ctx.canvas).parent().offset().left) +
                scollleft) *
                scaleX
            );
            var pointY = parseInt(
              (ev.clientY -
                parseInt($(_this.ctx.canvas).parent().offset().top) +
                scolltop) *
                scaleY
            );
            _this.ctx.lineTo(pointX, pointY);
            _this.ctx.stroke();
            var point = [pointX, pointY];
            console.log(point)
            newLine.data.point.push(point);
            newLine2.data.point.push(point);
            if (_this.options.penCallBack2 && newLine2.data.point.length > 4) {
              _this.options.penCallBack2(newLine2);
              var lastPoint = newLine2.data.point[newLine2.data.point.length - 1];
              newLine2 = {
                type: 10,
                data: {
                  graphtype: 5,
                  id: new Date().getTime(),
                  color: _this.ctx.strokeStyle,
                  weight: _this.ctx.lineWidth,
                  point: [],
                  deleteId: {
                    id: 0,
                  },
                  drawstate: 2,
                },
                timestamp: new Date().getTime(),
              };
              newLine2.data.point.push(lastPoint);
            }
          };
          document.onmouseup = _this.ctx.canvas.onmouseup = _this.ctx.canvas.ontouchend = function (
            ev
          ) {
            console.log(4444) 
            //加document.onmouseup的原因是支持超出画布范围的事件
            ev.stopPropagation();
            document.onmouseup = _this.ctx.canvas.onmousemove = _this.ctx.canvas.onmouseup = _this.ctx.canvas.ontouchmove = _this.ctx.canvas.ontouchend = null;
            _this.ctx.closePath();
            if (newLine.data.point.length > 1) {
              //判断是否触发click逻辑
              if (newLine.data.point.length <= 3) {
                for (var i = 1; i < newLine.data.point.length; i++) {
                  if (
                    newLine.data.point[i][0] != newLine.data.point[0][0] ||
                    newLine.data.point[i][1] != newLine.data.point[0][1]
                  ) {
                    isClick = false;
                  }
                }
              } else {
                isClick = false;
              }
  
              //存入路径数组
              _this.ctx.doPath.push(newLine.data);
              if (_this.options.penCallBack) {
                _this.options.penCallBack(newLine);
              }
              if (_this.options.penCallBack2) {
                newLine2.data.drawstate = 3; //单次作画状态置为结束
                try {
                  _this.options.penCallBack2(newLine2);
                } catch (e) {}
              }
              ev.preventDefault();
            }
  
            //解决白板在ios中部分页面不能支持click事件，以touchend事件代替处理
            if (_this.options.wbClickCallBack) {
              if (newLine.data.point.length <= 3) {
                //小于等于3个像素时，当作单击处理
                if (
                  !_this.lastClickTime ||
                  new Date().getTime() - _this.lastClickTime > 500
                ) {
                  //临时方案：解决触摸屏点击事件触发两次的问题（onmouseup和ontouchend都会触发），间隔500ms的只执行一次
                  if (ev.target.id == _this.options.id) {
                    //判断触发单击事件来源是否是当前画布，是就响应单击事件，否则不响应
                    _this.options.wbClickCallBack();
                    _this.lastClickTime = new Date().getTime();
                  }
                }
              }
            }
          };
          document.onmousemove = document.ontouchmove = function (ev) {
            _this.ctx.canvas.onmousemove = _this.ctx.canvas.ontouchmove = null;
          };
        }
      };
    },
    //关闭画笔模式
    closePen: function () {
      this.ctx.canvas.onmousedown = this.ctx.canvas.ontouchstart;
      document.onmousemove = document.onmouseup = document.ontouchup = document.ontouchend = null;
      this.isClosePen = true;
    },
    dodraw: function (data) {
      
      //显示线条
      data = data.data;
      
      this.drawGraphical(data, this.showStep);
      if (data.graphtype > 0 && data.graphtype <= 8) {
        //计入笔迹历史
        if (data.drawstate) {
          //实时传输
          if (data.drawstate == 1) {
            //实时传输，单次作画开始
            console.log(data.point)
            this.ctx.fullPathData = data.point;
          } else {
            this.ctx.fullPathData = this.ctx.fullPathData.concat(data.point);
            if (data.drawstate == 3) {
              //结束
              this.ctx.doPath.push({
                graphtype: data.graphtype,
                id: data.id,
                color: data.color,
                weight: data.weight,
                point: this.ctx.fullPathData,
              });
              this.ctx.fullPathData = [];
            }
          }
        } else {
          //单次完整传输
          this.ctx.doPath.push({
            graphtype: data.graphtype,
            id: data.id,
            color: data.color,
            weight: data.weight,
            point: data.point,
          });
        }
      }
    },
    //画--type:是否显示每一根线条的绘制动画，true:显示。false:不显示
    drawGraphical: function (data, type) {
      var graphtype = parseInt(data.graphtype);
      var id = data.id ? data.id : "";
      var color = this.ctx.strokeStyle;
      if (data.color) {
        color =
          data.color.length == 9 ? "#" + data.color.substr(3, 7) : data.color;
      }
      var weight = data.weight ? parseInt(data.weight) : 0;
      var point = data.point ? data.point : "";
      var deleteId = data.deleteId ? data.deleteId.id : "";
  
      this.ctx.lineJoin = "round"; //线的交汇处的样式，miter(尖角，默认)，bevel（斜角）,round（圆角）
      this.ctx.lineCap = "round"; //线段端点butt：方形,round：圆形,square:方形多一段
      this.ctx.lineWidth = weight;
      this.ctx.strokeStyle = color;
  
      this.ctx.setLineDash([0, 0]);
      this.ctx.globalCompositeOperation = "source-over";
      switch (graphtype) {
        case 1:
          //矩形
          this.drawRectangle(point);
          break;
        case 2:
          //圆
          this.drawCircle(point);
          break;
        case 3:
          //直线
          this.drawLine(point, type);
          break;
        case 4:
          //虚直线
          this.drawDottedLine(point, type);
          break;
        case 5:
          //曲线
          this.drawCurve(point, type);
          break;
        case 6:
          //虚曲线
          this.drawDottedCurve(point, type);
          break;
        case 7:
          //橡皮擦
          this.eraser(point, type);
          break;
        case 8:
          //清空画布，保留笔迹历史
          this.clearCanvas();
          break;
        //			case 9:
        //				//显示板书内容
        //				this.redraw();
        //				break;
        //			case 10:
        //				//隐藏板书内容
        //				this.clearCanvas();
        //				break;
        case 11:
          //撤销
          this.redo();
          break;
        default:
          break;
      }
    },
    //8位16进制颜色转rgba
    rexToRGBA: function (hex) {
      hex = hex.split("#")[1];
      var a = parseInt(hex.substr(0, 2), 16) / 255;
      var r = parseInt(hex.substr(2, 2), 16);
      var g = parseInt(hex.substr(4, 2), 16);
      var b = parseInt(hex.substr(6, 2), 16);
      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    },
    //矩形
    drawRectangle: function (point) {
      //起点X,Y,矩形宽度，高度
      this.ctx.strokeRect(
        point[0][0],
        point[0][1],
        point[1][0] - point[0][0],
        point[1][1] - point[0][1]
      );
    },
    //圆
    drawCircle: function (point) {
      this.ctx.beginPath();
      var r = Math.max(point[1][0] - point[0][0], point[1][1] - point[0][1]) / 2;
      //圆中心点X,Y,半径，起始角，结束角，逆时针还是顺时针，False 为 顺时针，true 为 逆时针
      this.ctx.arc(point[0][0], point[0][1], r, 0, 2 * Math.PI, true);
      this.ctx.stroke(); //沿着绘制路径的坐标点顺序绘制
      this.ctx.closePath();
    },
    //直线--type为是否显示
    drawLine: function (point, type) {
      var _this = this;
      _this.ctx.beginPath(); //开始一个新的绘制路径
      //起点x,y
      if (type) {
        var i = 1;
        var timer = setInterval(function () {
          if (i < point.length) {
            _this.ctx.moveTo(point[i - 1][0], point[i - 1][1]);
            _this.ctx.lineTo(point[i][0], point[i][1]);
            _this.ctx.stroke();
            i++;
          } else {
            clearInterval(timer);
            _this.ctx.closePath();
          }
        }, 1);
      } else {
        _this.ctx.moveTo(point[0][0], point[0][1]);
        for (var i = 1; i < point.length; i++) {
          //终点X,Y
          _this.ctx.lineTo(point[i][0], point[i][1]);
        }
        _this.ctx.stroke();
        _this.ctx.closePath(); //如果当前的绘制路径是打开的，则关闭掉该绘制路径
      }
    },
    //虚直线
    drawDottedLine: function (point, type) {
      this.ctx.setLineDash([5, 10]);
      this.drawLine(point, type);
    },
    //曲线
    drawCurve: function (point, type) {
      var _this = this;
      _this.ctx.beginPath();
  
      if (type) {
        var i = 1;
        var timer = setInterval(function () {
          if (i < point.length) {
            _this.ctx.moveTo(point[i - 1][0], point[i - 1][1]);
            _this.ctx.quadraticCurveTo(
              point[i - 1][0],
              point[i - 1][1],
              point[i][0],
              point[i][1]
            );
            _this.ctx.stroke();
            i++;
          } else {
            clearInterval(timer);
            _this.ctx.closePath();
          }
        }, 1);
      } else {
        _this.ctx.moveTo(point[0][0], point[0][1]);
        for (var i = 1; i < point.length; i++) {
          //控制点x,y,终点x,y
          _this.ctx.quadraticCurveTo(
            point[i - 1][0],
            point[i - 1][1],
            point[i][0],
            point[i][1]
          );
        }
        _this.ctx.stroke();
        _this.ctx.closePath();
      }
    },
    //虚曲线
    drawDottedCurve: function (point, type) {
      this.ctx.setLineDash([5, 10]);
      this.drawCurve(point, type);
    },
    //橡皮擦-擦除
    eraser: function (point, type) {
      this.ctx.globalCompositeOperation = "destination-out";
      var _this = this;
      _this.ctx.beginPath();
      if (type) {
        var i = 1;
        var timer = setInterval(function () {
          if (i < point.length) {
            _this.ctx.moveTo(point[i - 1][0], point[i - 1][1]);
            _this.ctx.quadraticCurveTo(
              point[i - 1][0],
              point[i - 1][1],
              point[i][0],
              point[i][1]
            );
            _this.ctx.stroke();
            i++;
          } else {
            clearInterval(timer);
            _this.ctx.closePath();
            //如果之前是画笔模式，则继续画笔模式
            if (_this.isdrawing) {
              _this.drawPen(5, _this.pencolor, _this.penwidth);
            }
          }
        }, 1);
      } else {
        _this.ctx.moveTo(point[0][0], point[0][1]);
        for (var i = 1; i < point.length; i++) {
          //控制点x,y,终点x,y
          _this.ctx.quadraticCurveTo(
            point[i - 1][0],
            point[i - 1][1],
            point[i][0],
            point[i][1]
          );
        }
        _this.ctx.stroke();
        _this.ctx.closePath();
        //如果之前是画笔模式，则继续画笔模式
        if (_this.isdrawing) {
          _this.drawPen(5, _this.pencolor, _this.penwidth);
        }
      }
    },
    //删除线条
    deleteLine: function (deleteId) {
      for (var line in this.ctx.doPath) {
        if (this.ctx.doPath[line].id == deleteId) {
          //重绘
          this.ctx.doPath.splice(line, 1);
          this.redraw(this.ctx.doPath);
          break;
        }
      }
    },
    //清空画布
    clearCanvas: function () {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    },
    //清空全部内容
    clear: function () {
      this.clearPath();
      this.clearCanvas();
    },
    //重绘所有线条
    redraw: function () {
      this.clearCanvas(); //清空画板,但不清空存储数组
      if (this.ctx.doPath.length > 0) {
        for (var index in this.ctx.doPath) {
          this.drawGraphical(this.ctx.doPath[index], false);
        }
      }
    },
    //撤销--清空画板,重绘
    redo: function () {
      console.log(this.ctx.doPath);
      this.ctx.doPath.pop();
      this.redraw();
    },
    //一次性绘制大量数据
    drawMultiData: function (data) {
      this.clearCanvas();
      if (data.length > 0) {
        for (var index in data) {
          this.drawGraphical(data[index].data, false);
          if (data[index].data.graphtype > 0 && data[index].data.graphtype <= 8) {
            this.ctx.doPath.push({
              graphtype: data[index].data.graphtype,
              id: data[index].data.id,
              color: data[index].data.color,
              weight: data[index].data.weight,
              point: data[index].data.point,
            });
          }
        }
      }
    },
  };

  export {
    Draw
  }