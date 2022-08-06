// ccus捕获成本
var ccus = echarts.init(document.getElementById("ccus"));

var jigouPrice1 = [[90, 130, ],[50, 70, ],[30, 50,],[20, 40,]];
var jigouPrice2 = [[190, 280, ],[100, 180, ],[80, 150,],[70, 120,]];
var jigouPrice3 = [[160, 390, ],[110, 230,],[90, 150, ],[80, 130,]];
var option = setOption();

function setOption() {
    let option;

    const category = ['2030年', '2040年', '2050年', '2060年'];
    const name = ['燃烧前', '燃烧后', '富氧燃烧'];
    const data = [jigouPrice1, jigouPrice2, jigouPrice3];

    let series = [];
    data.forEach((item, i) => {
        series = [...series, ...createSeries(item, name[i], true)];
    });

    let yAxis = {
        type: 'value',
        name:"元/吨",
        axisLine: {
            lineStyle: {
                color: '#fff',
            },
        },
    };

    let xAxis = {
        type: 'category',
        splitLine: {
            show: false,
        },
        axisLine: {
            lineStyle: {
                color: '#fff',
            },
        },
        data: category,
    };

    if (false) {
        [xAxis, yAxis] = [yAxis, xAxis];
    }

    option = {
        backgroundColor: '#0e1c47',
        title: {
            text: '二氧化碳捕集成本',
            itemGap:0,
            textStyle: {
                color: '#fff',
                fontSize: '16',
            },
            subtext: '参考《中国二氧化碳捕集利用与封存2021》',
        },
        color: ['#c63c26', '#65AC3A', '#36cfc9'],
        legend: {
            data: name,
            top: '33',
            textStyle: {
                color: '#fff',
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                var html = '';
                var axisValue = '';
                params.forEach((item) => {
                    axisValue = item.axisValue;
                    const range = item.data.range;
                    html += item.marker + item.name + range[0] + ' - ' + range[1] + '<br/>';
                });
                const {
                    name,
                    data: { range },
                } = params[0];
                return axisValue + '<br/>' + html;
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,
    };

    return option;
}

// 轴数据处理
function dataFormat(data, name, isReverse) {
    let min = []; // 区间的最小值
    let max = []; // 区间的最大值
    let minLabel = []; // 显示区间的最小值的 label 数据，在 max 上通过 markpoint 实现，以控制 label 颜色值和显示的柱子颜色值一致，并且显示隐藏有效

    data.forEach((item, i) => {
        min.push(item[0]);

        // 横向：coord: [offsetx，y]，等同于 xAxis: offsetx, yAxis: y。其中，offsetx 表示偏移值，y 表示bar的索引。
        // 竖向：[x, offsety]
        const coord = isReverse ? [item[0], i] : [i, item[0]];
        minLabel.push({
            value: item[0], // 对值进行格式化
            coord: item[0] ? coord : [],
        });

        max.push({
            value: item[1] - item[0], // 差值作为叠加值
            range: item, // tooltip 显示
            name, // legend 显示
            label: {
                formatter: '' + item[1], // 最终值作为显示值
            },
            itemStyle: {
                color: item[2],
            },
        });
    });

    return {
        min,
        max,
        minLabel,
    };
}

// 生成序列数据
function createSeries(arr, name, showLabel, isReverse) {
    let newSeries = [];

    const { min, max, minLabel } = dataFormat(arr, name, isReverse);

    const maxPosition = isReverse ? 'right' : 'top';
    const minPosition = isReverse ? 'left' : 'bottom';

    newSeries = [
        {
            type: 'bar',
            stack: name,
            tooltip: {
                show: false,
            },
            // 透明
            itemStyle: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)',
            },
            emphasis: {
                itemStyle: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)',
                },
            },
            label: {
                show: false,
            },
            data: min,
        },
        {
            type: 'bar',
            stack: name,
            name: name,
            tooltip: {
                show: true,
            },
            label: {
                show: showLabel,
                position: maxPosition,
            },
            markPoint: {
                symbol: 'rect',
                // 图形上面的小头隐藏
                symbolSize: 0.000000000000001,
                label: {
                    show: showLabel,
                    position: minPosition,
                },
                data: minLabel,
            },
            data: max,
        },
    ];

    return newSeries;
}
  
    ccus.setOption(option);
    window.addEventListener("resize", function () {
        ccus.resize();
    });

// ccus需求
    var myChart = echarts.init(document.getElementById("line"));
    option = {
        backgroundColor: '#0e1c47',
        title: {
            text: '各行业CCUS碳减排需求潜力',
            textStyle: {
                color: '#fff',
                fontSize: '14',
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: [ '全行业','煤电', '气电', '钢铁', '水泥', 'BECCS','DACCS' ,'石油和化工'],
            textStyle: {
                color: '#fff',
            },
            top:"5%"
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['2025', '2030', '2035', '2040', '2050', '2060',],
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    },
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '亿吨/年',
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    },
                },
            }
        ],
        series: [
            {
                name: '全行业',
                type: 'line',
                data: [0.3, 4.08, 8.5, 13, 14.5, 18.2,],
                emphasis: {
                    focus: 'series'
                },
                markLine: {
                    lineStyle: {
                        type: 'dashed'
                    },
                    data: [
                        [{type: 'min'}, {type: 'max'}]
                    ]
                }
            },
           
            {
                name: '煤电',
                type: 'bar',
                stack: '全行业',
                emphasis: {
                    focus: 'series'
                },
                data: [0.06, 0.2,1, 5, 5, 5,]
            },
            {
                name: '气电',
                type: 'bar',
                stack: '全行业',
                emphasis: {
                    focus: 'series'
                },
                data: [0.01, 0.05, 1,1, 1, 1, ]
            },
            {
                name: '钢铁',
                type: 'bar',
                stack: '全行业',
                emphasis: {
                    focus: 'series'
                },
                data: [0.01,0.05, 0.2, 0.3, 0.7, 1.1,]
            },
            {
                name: '水泥',
                type: 'bar',
                stack: '全行业',
                data: [0.17, 1.52, 0.8, 1.5, 1.8, 2.1,],
                emphasis: {
                    focus: 'series'
                },
        
            },
            {
                name: 'BECCS',
                type: 'bar',
                stack: '全行业',
                emphasis: {
                    focus: 'series'
                },
                data: [0.005, 0.01, 0.18, 1, 5, 6, ]
            },
            {
                name: 'DACCS',
                type: 'bar',
                stack: '全行业',
                emphasis: {
                    focus: 'series'
                },
                data: [0, 0, 0.01, 0.15, 1, 3, ]
            },
            {
                name: '石油和化工',
                type: 'bar',
                stack: '全行业',
                emphasis: {
                    focus: 'series'
                },
                data: [0.05, 0.5, 0.3, 0, 0, 0,]
            },
        ]
    };

    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });