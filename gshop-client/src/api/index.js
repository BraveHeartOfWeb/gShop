/*
包含多个封装接口请求函数
 */

import ajax from './ajax'

// const BASE_URL = 'http://loacalhost:4000'
// const BASE_URL = '/api'
// [1、根据经纬度获取位置详情](#1根据经纬度获取位置详情)<br/>
export const reqAddress = (geohash) => ajax(`/api/position/${geohash}`)
// [2、获取食品分类列表](#2获取食品分类列表)<br/>
export const reqCategorys = () => ajax('/api/index_category')
// [3、根据经纬度获取商铺列表](#3根据经纬度获取商铺列表)<br/>
export const reqShops = (longitude, latitude) => ajax('/api/shops', {longitude, latitude})
// [4、根据经纬度和关键字搜索商铺列表](#4根据经纬度和关键字搜索商铺列表)<br/>
export const reqSearchShops = (geohash, keyword) => ajax('/api/search_shops', {geohash, keyword})
// [5、获取一次性验证码](#5获取一次性验证码)<br/>
export const reqCaptcha = () => ajax('/api/captcha')
// [6、用户名密码登陆](#6用户名密码登陆)<br/>
export const reqLogin = ({name, pwd, captcha}) => ajax('/api/login_pwd', {name, pwd, captcha}, 'POST')
// [7、发送短信验证码](#7发送短信验证码)<br/>
export const reqCode = (phone) => ajax('/api/sendcode', {phone})
// [8、手机号验证码登陆](#8手机号验证码登陆)<br/>
export const reqSmsCode = (phone, code) => ajax('/api/login_sms', {phone, code}, 'POST')
// [9、根据会话获取用户信息](#9根据会话获取用户信息)<br/>
export const reqUsersInfo = () => ajax('/api/userinfo')
// [10、用户登出](#10用户登出)<br/>
export const reqLogout = () => ajax('/api/logout')
// 11、获取goods
export const reqGoods = () => ajax('/goods')
// 12、获取ratings
export const reqRatings = () => ajax('/ratings')
// 13、获取info
export const reqInfo = () => ajax('/info')
