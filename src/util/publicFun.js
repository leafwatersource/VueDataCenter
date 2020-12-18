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
    formateTime(time) {
        //格式化时间格式，返回年月日时分
        if (time) {
            let datetime = new Date(time);
            let year = datetime.getFullYear();
            let month = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1);
            let date = datetime.getDate();
            let hour = datetime.getHours() > 9 ? datetime.getHours() : '0' + datetime.getHours();
            let min = datetime.getMinutes() > 9 ? datetime.getMinutes() : '0' + datetime.getMinutes();
            return year + '-' + month + '-' + date + ' ' + hour + ':' + min;
        }
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
    JSONToOrderExcelConvertor(JSONData) {
        let columnsArr = Object.keys(JSONData[0]);
        var str = Object.keys(JSONData[0]).join(',')+'\n';
        console.log(str)
        for (let i = 0; i < JSONData.length; i++) {
            // var result = '';
            // if (JSONData[i].orderStatusc == '0') {
            //     result = "是";
            // } else {
            //     result = "否";
            // }
            // str += (i + 1).toString() + ',' + JSONData[i].orderId + '\t' + ',' + foramateDate(JSONData[i].orderTime) + '\t' + ',' + JSONData[i].p1 + '\t' + ',' + JSONData[i].userName + '\t' + ',' + JSONData[i].recMobile + '\t' + ',' + JSONData[i].productName + '\t' + ',' + result + '\t' + ',\n'

            columnsArr.forEach(item=>{
                str+=JSONData[i][item]+'\t';
            });
            str+='\n'
        }
        // console.log(str)
        // var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
        // //解决中文乱码问题
        // blob = new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
        // let object_url = window.URL.createObjectURL(blob);
        // var link = document.createElement("a");
        // link.href = object_url;
        // link.download = "导出订单.xls";
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    }
};
export default Fun;
