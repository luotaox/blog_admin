import moment from "moment/moment"
moment.locale('zh-cn');
const formatTime = {
  getTime: (date) => {
    // 格式化时间
    return moment(date).format('YYYY/MM/DD')
  }
}

export default formatTime