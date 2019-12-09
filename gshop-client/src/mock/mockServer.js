// 使用mockjs提供接口
import Mock from 'mockjs'
import data from './data'
// 提供goods的接口
Mock.mock('/goods', {code: 0, data: data.goods})
// 提供rating的接口
Mock.mock('/ratings', {code: 0, data: data.ratings})
// 提供info的接口
Mock.mock('/info', {code: 0, data: data.info})
