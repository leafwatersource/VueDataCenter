//引入安装的axios插件
import axios from 'axios'
import qs from 'qs'
import cookie from 'vue-cookie'
import baseUrl from './config';
// console.log(baseUrl)
// BeiTeApi TengLongAPi   WoodFastApi  Local
var api = baseUrl['WoodFastApi'];
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
        axios({
            method: 'post',
            url: api+newOptions.url,
            data: newOptions.data?qs.stringify(newOptions.data):'',
            headers: newOptions.headers
        }).then(res => {
            if (res.status == 200) {
                //这里需要获取返回的data中的数据即可
                if (res.data === 301){
                    //返回到登录页面
                    window.location.replace('/');
                } else{
                    resolve(res.data);
                }
            } else {
                reject(res);
            }
        }).catch(err => {
          window.location.replace('/');
            reject(err);
        })
    });
};
export default http;
