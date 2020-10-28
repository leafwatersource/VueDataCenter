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
        let datetime = new Date();
        let year = datetime.getFullYear();
        let month = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1);
        let date = datetime.getDate();
        if (type === 'week') {
            //获取七天的日期
            datetime.setDate(datetime.getDate() - 7);
            date = datetime.getDate();
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
            datetime.setMonth(datetime.getMonth() - 5);
            month = datetime.getMonth() + 1;
        }
        return year + '-' + month + '-' + date + ' 00:00';
    },
};
export default Fun;
