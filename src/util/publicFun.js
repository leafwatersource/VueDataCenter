var Fun = {
    foramateDate(time) {
        //格式化时间格式返回年月日
        if (time) {
            let datetime = new Date(time);
            let year = datetime.getFullYear();
            let month = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1);
            let date = datetime.getDate() > 9 ? datetime.getDate() : '0' + datetime.getDate();
            return year + '-' + month + '-' + date;
        }
    },
    formateTime(time,showYear) {
      //格式化时间格式，返回年月日时分
      if(!time){
        return time;
      }
      let datetime = new Date(time);
      let year = datetime.getFullYear();
      let month = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1);
      let date = datetime.getDate();
      let hour = datetime.getHours() > 9 ? datetime.getHours() : '0' + datetime.getHours();
      let min = datetime.getMinutes() > 9 ? datetime.getMinutes() : '0' + datetime.getMinutes();
      if (showYear) {
        return month + '-' + date + ' ' + hour + ':' + min;
      }
      return year + '-' + month + '-' + date + ' ' + hour + ':' + min;
    },
    getCusDateTime(type) {
        var datetime = new Date();
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1);
        var date = datetime.getDate();
        if (type === 'week') {
            //获取七天的日期
            if (date < 8) {
                datetime.setMonth(month - 1);
            }
            datetime.setDate(datetime.getDate() - 7);
            date = datetime.getDate();
            month = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1);
        } else if (type === 'month') {
            //获取前一个月的日期
            datetime.setMonth(datetime.getMonth() - 1);
            month = datetime.getMonth() + 1;
        } else if (type === "ThreeMonth") {
            //获取前三个月的日期
            datetime.setMonth(datetime.getMonth() - 2);
            month = datetime.getMonth() + 1;
        } else if (type === "HalfYear") {
            //获取前六个月的日期
            datetime.setMonth(datetime.getMonth() - 6);
            month = datetime.getMonth() + 1;
        }
        return year + '-' + month + '-' + date + ' 00:00';
    },
    Deduplication(Arr) {
        //数组去重
        let newArr = [];
        let obj = {};
        for (let i = 0; i < Arr.length; i++) {
            if (!obj[Arr[i]]) {
                obj[Arr[i]] = true;
                newArr.push(Arr[i])
            }
        }
        return newArr;
    },
    sortData(data, way) {
        //时间字符串的排序
        if (way === "order") {
            return data.sort(function (a, b) {
                //这里的time要根据本身的数据来，后面的正则匹配也要根据自己数据来
                return Date.parse(a.replace(/-/g, "/")) - Date.parse(b.replace(/-/g, "/"));
            });
        } else if (way === "back") {
            return data.sort(function (a, b) {
                return Date.parse(b.replace(/-/g, "/")) - Date.parse(a.replace(/-/g, "/"));
            });
        }
    },
};
export default Fun;
