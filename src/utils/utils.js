export function getArray(interval = 0, start = new Date(), end = new Date()) {
  start.setDate(start.getDate() - interval);
  end.setDate(end.getDate() + interval);
  var array = [];
  var dataArr = [];
  var weeks = ['日', '一', '二', '三', '四', '五', '六'];
  var num = 0;
  while((end.getTime() - start.getTime()) >= 0) {
    num ++;
    var month = (start.getMonth() + 1).toString().length == 1 ? "0" + (start.getMonth() + 1).toString() : (start.getMonth() + 1);
    var day = start.getDate().toString().length == 1 ? "0" + start.getDate() : start.getDate();
    var week = weeks[start.getDay()];
    dataArr.push(month + "月" + day + '日（周' + week + '）');
    var obj = {};
    if(num == 1){
      obj.week = '今天';
    }else{
      obj.week = '周'+week;
    }
    obj.date = new Date().getFullYear()+'-'+month + '-' + day;
    obj.date2 = month + '-' + day;
    array.push(obj);
    start.setDate(start.getDate() + 1);
  }
  return array;
}

export function format(array) {
  return array.map((item) => {
    return {
      title: item.date.slice(5),
      dataKey: item.date,
      key: item.date,
      width: 60
    }
  })
}

//获取两日期之间日期列表函数
export function getDiffDate(stime,etime){
    //初始化日期列表，数组
  var diffDate = new Array();
  var i=0;
  //开始日期小于等于结束日期,并循环
  while(stime<=etime){
      diffDate[i] = stime;
      //获取开始日期时间戳
      var stime_ts = new Date(stime).getTime();
      //增加一天时间戳后的日期
      var next_date = stime_ts + (24*60*60*1000);

      //拼接年月日，这里的月份会返回（0-11），所以要+1
      var next_dates_y = new Date(next_date).getFullYear()+'-';
      var next_dates_m = (new Date(next_date).getMonth()+1 < 10)?'0'+(new Date(next_date).getMonth()+1)+'-':(new Date(next_date).getMonth()+1)+'-';
      var next_dates_d = (new Date(next_date).getDate() < 10)?'0'+new Date(next_date).getDate():new Date(next_date).getDate();
      stime = next_dates_y+next_dates_m+next_dates_d;
      //增加数组key
      i++;
  }
  diffDate[0] = diffDate[0].slice(0, 10)
  return diffDate;
}


export function randomColorAndNotRed() {
  var r = Math.floor(Math.random() * 200)
  var g = Math.floor(Math.random() * 206 + 50)
  var b = Math.floor(Math.random() * 206 + 50)
  return `rgb(${r},${g},${b})`
}

export function transformBeginTime(interval) {
  return getFormatDateTime(interval)
}

export function getFormatDateTime(interval){
  var date = new Date();
  date.setDate(date.getDate() - interval);
  var year= date.getFullYear();
  var month = date.getMonth() + 1;

  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, '-', month < 10 ? `0${month}` : month , '-', day < 10 ? `0${day}` : day, ' ', hour < 10 ? `0${hour}` : hour , ':', minute < 10 ? `0${minute}` : minute, ':', second < 10 ? `0${second}` : second ].join('');
}

export function transformJSON(str) {
  return (new Function("return " + str))()
}

export function range(str) {
  let [start, end] = str.split('-')
  start = parseInt(start)
  end = parseInt(end)
  let length = end - start + 1;
  let step = start - 1;
  return Array.apply(null,{length:length}).map((v,i) => { step++; return step;});
}