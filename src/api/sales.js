/**
 * Created by lina.zhang on 2018/8/20.
 */
import {fetchGet} from './api'

export default {
  // 获取下拉数据
  GetComboBoxList () {
    return fetchGet('/sale/comboBoxList')
  },
  // 获取销售对比分析数据
  GetCompareAnalyze (queryInfo, groupName) {
    let params = Object.assign({}, queryInfo, groupName)
    return fetchGet('/sale/compareAnalyze', params)
  },
  // 获取销售趋势分析数据
  GetTendencyAnalyze (queryInfo, groupName) {
    let params = Object.assign({}, queryInfo, groupName)
    return fetchGet('/sale/tendencyAnalyze', params)
  }
}
