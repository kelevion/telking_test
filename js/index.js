window.addEventListener('load', function() {
    // 1. 获取元素
    var arrow_l = document.querySelector('.arrow-l');
    var arrow_r = document.querySelector('.arrow-r');
    var focus = document.querySelector('.focus');
    var focusWidth = focus.offsetWidth;
  
    // 2. 鼠标经过focus 就显示隐藏左右按钮
    focus.addEventListener('mouseenter', function() {
        arrow_l.style.display = 'block';
        arrow_r.style.display = 'block';
        clearInterval(timer);
        timer = null; // 清除定时器变量
    });
    focus.addEventListener('mouseleave', function() {
        arrow_l.style.display = 'none';
        arrow_r.style.display = 'none';
        timer = setInterval(function() {
            //手动调用点击事件
            arrow_r.click();
        }, 2000);
    });
    // 3. 动态生成轮播图的小li
    var ul = focus.querySelector('ul');
    var ol = focus.querySelector('.circle');
    // console.log(ul.children.length);
    for (var i = 0; i < ul.children.length; i++) {
        // 创建一个小li 
        var li = document.createElement('li');
        // 记录当前小圆圈的索引号 通过自定义属性来做 
        li.setAttribute('index', i);
        ol.appendChild(li);
        // 4. 排他思想 在生成小li的同时直接绑定点击事件
        li.addEventListener('click', function() {
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            this.className = 'current';
            // 5. 点击li，移动图片
            // ul 的移动距离 li的索引号 乘以 图片的宽度 注意是负值
            // 当我们点击了某个小li 就拿到当前小li 的索引号
            var index = this.getAttribute('index');
            // 当我们点击了某个小li 就要把这个li 的索引号给 num  
            num = index;
            // 当我们点击了某个小li 就要把这个li 的索引号给 circle  
            circle = index;
            // num = circle = index;
            console.log(focusWidth);
            console.log(index);

            animate(ul, -index * focusWidth);
        })
    }
    // 把ol里面的第一个小li设置类名为 current
    ol.children[0].className = 'current';
    // 6. 克隆第一张图片(li)放到ul 最后面
    var first = ul.children[0].cloneNode(true);
    ul.appendChild(first);
    // 7. 点击右侧按钮， 图片滚动一张
    var num = 0;
    // circle 控制小圆圈的播放
    var circle = 0;
    // flag 节流阀
    var flag = true;
    arrow_r.addEventListener('click', function() {
        if (flag) {
            flag = false; // 关闭节流阀
            // 如果走到了最后复制的一张图片，此时 ul 要快速复原 left 改为 0
            if (num == ul.children.length - 1) {
                ul.style.left = 0;
                num = 0;
            }
            num++;
            animate(ul, -num * focusWidth, function() {
                flag = true; // 打开节流阀
            });
            // 8. 点击右侧按钮，小li跟随一起变化 可以再声明一个变量控制播放
            circle++;
            // 如果circle == 5 说明走到最后我们克隆的这张图片了 我们就复原
            if (circle == ol.children.length) {
                circle = 0;
            }
            // 调用函数
            circleChange();
        }
    });

    // 9. 左侧按钮做法
    arrow_l.addEventListener('click', function() {
        if (flag) {
            flag = false;
            if (num == 0) {
                num = ul.children.length - 1;
                ul.style.left = -num * focusWidth + 'px';

            }
            num--;
            animate(ul, -num * focusWidth, function() {
                flag = true;
            });
            // 点击左侧按钮，小li跟随一起变化 可以再声明一个变量控制小li的播放
            circle--;
            circle = circle < 0 ? ol.children.length - 1 : circle;
            // 调用函数
            circleChange();
        }
    });
    function circleChange() {
        // 先清除其余小li的current类名
        for (var i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        // 留下当前的小圆圈的current类名
        ol.children[circle].className = 'current';
    }
    // 10. 自动播放轮播图
    var timer = setInterval(function() {
        //手动调用点击事件
        arrow_r.click();
    }, 2000);
})
var li = document.querySelectorAll('ul li a');
for (let index = 0; index < li.length; index++) {
  li[index].addEventListener('click', function () {
    for (let i = 0; i < li.length; i++) {
      li[i].style.borderBottom = 'none';

    }
    this.style.borderBottom = '3px solid #cccfd0';
  })

}
var lineChart = echarts.init(document.getElementById('line_graph'));
var xhr1 =new XMLHttpRequest()
xhr1.open('get','https://edu.telking.com/api/?type=month')
xhr1.onreadystatechange = function(){
if (xhr1.readyState == 4 && xhr1.status ==200){
var result1 = JSON.parse(xhr1.responseText);
var option = {
  title:{
  text:'曲线图数据展示',
  left:'center'
  },
xAxis: {
data: result1.data.xAxis
},
yAxis: {},
series: [
{
data:result1.data.series,
type: 'line',
smooth: true,
emphasis:{
  focus:'series'
},
label:{
  show:true,
  position:'top'
}
}
]
}
lineChart.setOption(option);
}
}
xhr1.send()
var pieChart = echarts.init(document.getElementById('pie_chart'));
var xhr2 =new XMLHttpRequest()
xhr2.open('get','https://edu.telking.com/api/?type=week')
xhr2.onreadystatechange = function(){
if (xhr2.readyState == 4 && xhr2.status ==200){
var result2 = JSON.parse(xhr2.responseText);
var xAxis1= result2.data.xAxis;
var serise1= result2.data.series;
var data1= serise1.map((value,i) => ({value,name:xAxis1[i]}))
var option = {
  title:{
  text:'饼状图数据展示',
  left:'center'
  },
series: [
{
data:data1,
type: 'pie',
radius:'50%',
emphasis:{
  focus:'series'
},
}
]
}
pieChart.setOption(option);
}
}
xhr2.send()
var barChart = echarts.init(document.getElementById('bar_graph'));
var xhr3 =new XMLHttpRequest()
xhr3.open('get','https://edu.telking.com/api/?type=week')
xhr3.onreadystatechange = function(){
if (xhr3.readyState == 4 && xhr3.status ==200){
var result3 = JSON.parse(xhr3.responseText);
var option = {
  title:{
  text:'柱状图数据展示',
  left:'center'
  },
xAxis: {
data: result3.data.xAxis
},
yAxis: {
type:'value'
},
series: [
{
data:result3.data.series,
type: 'bar',

}
]
}
barChart.setOption(option);
}
}
xhr3.send()
;