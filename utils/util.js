import {CONFIG} from "config";

const crypto = require("des");
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const decrypt = (data) => {
    let keyHex = crypto.enc.Utf8.parse("flyingstudioisgood");
    let dataHex = crypto.enc.Base64.parse(data);
    console.info(dataHex);
    let result = crypto.DES.decrypt({ciphertext: dataHex}, keyHex, {
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7
    });
    return result.toString(crypto.enc.Utf8);
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// let rootUrl = "https://met.chpz527.cn/";
//
// let rootUrl = "http://127.0.0.1:8888/";

function req(url, data, su, fa, de = false) {
    wx.request({
        url: CONFIG.HTTP_BASE_URL + url,
        data: data,
        method: 'post',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync('token')
        },
        success: function (res) {
            if (res.statusCode < 399) {
                if (de) {
                    console.info(res.data);
                    res.data.data = JSON.parse(decrypt(res.data.data));
                    console.info(res.data.data);
                    return typeof su == "function" && su(res.data)
                }
                return typeof su == "function" && su(res.data);
            }
            else {
                showError(res.data.msg);
                return typeof fa == "function" && fa(res.data)
            }
        },
        fail: function (error) {
            showError(error.data.msg);
            return typeof fa == "function" && fa(error)
        }
    })
}


function getReq(url, data, su, fa, de = false) {
    wx.request({
        url: CONFIG.HTTP_BASE_URL + url,
        data: data,
        method: 'get',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync('token')
        },
        success: function (res) {
            if (res.statusCode < 399) {
                if (de) {
                    console.info(res.data);
                    res.data.data = JSON.parse(decrypt(res.data.data));
                    console.info(res.data.data);
                    return typeof su == "function" && su(res.data)
                }
                return typeof su == "function" && su(res.data)
            } else {
                showError(res.data.msg);
                return typeof fa == "function" && fa(res.data)
            }

        },
        fail: function (error) {
            showError(error.data.msg);
            return typeof fa == "function" && fa(error)
        }
    })
}


function deleteReq(url, data, su, fa) {
    wx.request({
        url: CONFIG.HTTP_BASE_URL + url,
        data: data,
        method: 'delete',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync('token')
        },
        success: function (res) {
            if (res.statusCode < 399)
                return typeof su == "function" && su(res.data);
            else {
                showError(res.data.msg);
                return typeof fa == "function" && fa(res.data)
            }

        },
        fail: function (error) {
            showError(error.data.msg);
            return typeof fa == "function" && fa(error)
        }
    })
}


function showError(msg) {
    wx.showToast({
        title: msg,
        icon: 'none'
    })
}


module.exports = {
    formatTime: formatTime,
    getReq: getReq,
    req: req,
    deleteReq: deleteReq,
    rootUrl: CONFIG.HTTP_BASE_URL,
    decrypt: decrypt
}
