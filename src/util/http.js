//引入安装的axios插件
import axios from 'axios'
import qs from 'qs'
import cookie from 'vue-cookie'


// var api = 'http://pmser.szratetec.com:8088/';
var api = 'https://localhost:44309/';
// var api = 'http://tenglongapi.szratetec.cn/';

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
        //headers默认传递json格式数据，这里也可以设置token，每次调用都会携带
        newOptions.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'empID':empID,
            'token':token,
            'sysID':sysID
        };
        //这里可以在调用的时候看到你的method、url、data、headers等参数
        //console.log(newOptions);
        axios({
            method: 'post',
            url: api+newOptions.url,
            data: newOptions.data?qs.stringify(newOptions.data):'',
            headers: newOptions.headers
        }).then(res => {
            //根据返回的状态码判断，注意re1s返回的并不一定都是status，比如小程序就是statusCode
            if (res.status == 200) {
                //这里我们只需要获取返回的data中的数据即可
                if (res.data === 301){
                    window.location.replace('/');
                } else{
                    // try {
                    //     res.data.data = JSON.parse(res.data.data)
                    // }catch (e) {
                    //     console.log(e)
                    // }
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
