var Fun = {
    foramateDate(time) {
        //格式化时间格式返回年月日
        if (time) {
            var datetime = new Date(time);
            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1);
            var date = datetime.getDate() > 9 ? datetime.getDate() : '0' + datetime.getDate();
            return year + '-' + month + '-' + date;
        }
    },
    formateTime(time) {
        //格式化时间格式，返回年月日时分
        if (time) {
            var datetime = new Date(time);
            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1);
            var date = datetime.getDate();
            var hour = datetime.getHours() > 9 ? datetime.getHours() : '0' + datetime.getHours();
            var min = datetime.getMinutes() > 9 ? datetime.getMinutes() : '0' + datetime.getMinutes();
            return year + '-' + month + '-' + date + ' ' + hour + ':' + min;
        }
    },
};

export default Fun;
