// import Vue from 'vue'
import {fetchGet,fetchPost,fetchDelete,fetchFormData, fetchGetDownload} from '@/api/apiNew'
import dialog from '@/util/dialog.js'
export const actions = {
  // 确认筛选
  checkSure ({commit, state}, params) {
    return new Promise((resolve, reject) => {
      dialog.confirm(params, function () {
        resolve({result: true})
      })
    })
  },
  // 用户信息
  getUser ({commit, state}, params) {
    return fetchGet('/index/getLoginInfo')
  },
  // 退出
  LogOut ({commit, state}, params) {
    return fetchGet('/geely-dataserver/index/logout')
  },
  // 获取菜单
  navMenuByCloud ({commit, state}, params) {
    let pass = {
      serviceId: '1014'
    }
    return fetchGet('/navMenuByCloud', pass)
  },
  // 数据列表
  getSearch ({commit, state}, params) {
    let pass = {
      formCode: params.id,
      pageNum: params.pageNum,
      numPerPage: params.numPerPage,
      key: params.key
    }
    return fetchGet('/import/importedTableList', pass)
  },
  // 新增
  addImportRecord ({commit, state}, params) {
    let pass = {
      formCode: params.formCode,
      dataListString: params.dataListString,
      createUser: params.createUser,
    }
    return fetchPost('/import/addImportRecord', pass)
  },
  // 更新
  updateRecord ({commit, state}, params) {
    let pass = {
      formCode: params.formCode,
      dataListString: params.dataListString,
      mainKey: params.mainKey,
    }
    return fetchPost('/import/updateRecord', pass)
  },
  // 删除
  deleteRecordLists ({commit, state}, params) {
    return fetchDelete(`/import/deleteRecordLists/${params.formCode}/${params.mainkeys}`)
  },
  // 导入
  importExcle ({commit, state}, params) {
    let pass = {
      formCode: params.formCode,
      file: params.file
    }
    return fetchFormData(`/import/importExcle?formCode=${pass.formCode}`, pass.file)
  },
  // 导出
  ReportExcle ({commit, state}, params) {
    let pass = {
      formCode: params.formCode
    }
    return fetchGetDownload('/import/getDataReportExcle', pass, '下载.xls')
  },
  // 权限
  checkCity ({commit, state}, params) {
    let pass = {
      city: params.city,
      formCode: params.formCode,
      date: params.date
    }
    return fetchGet('/import/checkCityAndDate', pass)
  }
}
