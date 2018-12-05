/*
 * Created by Xinling.Liu on 2018/8/24.
*/
import { fetchGet } from './api'

export default {
  GetComboBoxList () {
    return fetchGet('/price/comboBoxList')
  },
  GetComparePrice (prices) {
    let params = {
      date: prices.date,
      city: prices.city,
      priceType: prices.priceType,
      catType: prices.catType,
      catStyle: prices.catStyle
    }
    return fetchGet('/price/comparePrice', params)
  },
  GetTrendPrice (prices) {
    let params = {
      city: prices.city,
      priceType: prices.priceType,
      catType: prices.catType,
      catStyle: prices.catStyle,
      startDate: prices.startDate,
      endDate: prices.endDate
    }
    return fetchGet('/price/tendencyPrice', params)
  }
}
