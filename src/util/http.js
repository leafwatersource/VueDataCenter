//引入安装的axios插件
import axios from 'axios'
import qs from 'qs'
import cookie from 'vue-cookie'


// var api = 'http://pmser.szratetec.com:8088/';
// var api = 'https://localhost:44309/';
var api = 'http://tenglongapi.szratetec.cn/';
const http = options => {
    return new Promise((resolve, reject) => {
        const defaultOptions = {};
        const newOptions = {
            ...defaultOptions,
            ...options
        };
        var token = cookie.get('token');
        var empID = cookie.get('empID');
        var sysID = cookie.get('sysID');
        newOptions.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'empID':empID,
            'token':token,
            'sysID':sysID
        };
        //这里可以在调用的时候看到method、url、data、headers等参数
        axios({
            method: 'post',
            url: api+newOptions.url,
            data: newOptions.data?qs.stringify(newOptions.data):'',
            headers: newOptions.headers
        }).then(res => {
            if (res.status == 200) {
                //这里我们只需要获取返回的data中的数据即可
                if (res.data === 301){
                    window.location.replace('/');
                } else{
                    resolve(res.data);
                }
            } else {
                reject(res);
            }
        }).catch(err => {
           window.location.replace(',');

            reject(err);
        })
    })
};

export default http
