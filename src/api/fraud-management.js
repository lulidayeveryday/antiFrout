import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'

export function fetchhawkeyeDailyList(param) {
  return request({
    url: baseUrl + '/hawkOutRate/getTableData',
    method: 'post',
    params: param
  })
}

export function fetchfraudDetailsList(param) {
  return request({
    url: baseUrl + '/farudDetails/getTableData',
    method: 'post',
    params: param
  })
}

export function fetchfraudDetailsDownLoad(param) {
  return request({
    url: baseUrl + '/farudDetails/downLoadData',
    method: 'post',
    params: param
  })
}

export function fetchdowntimeWhiteList(param) {
  return request({
    url: baseUrl + '/whiteManage/getTableData',
    method: 'post',
    params: param
  })
}

export function fetchdowntimeWhiteListWhite(param) {
  return request({
    url: baseUrl + '/whiteManage/downLoadData',
    method: 'post',
    params: param
  })
}

export function fetchdowntimeWhiteAdd(param) {
  return request({
    url: baseUrl + '/whiteManage/addData',
    method: 'post',
    params: param
  })
}

export function deleteWhiteData(param) {
  return request({
    url: baseUrl + '/whiteManage/deleteData',
    method: 'post',
    params: param
  })
}

/*涉嫌号码*/
export function involvedReportList(param) {
  return request({
    url: baseUrl + '/involvedReport/getTableData',
    method: 'post',
    params: param
  })
}

export function involvedReportDown(param) {
  return request({
    url: baseUrl + '/involvedReport/downloadTableData',
    method: 'post',
    params: param
  })
}

/*鹰眼检出*/
export function fraudNumDeteList(param) {
  return request({
    url: baseUrl + '/fraudNumDete/getTableData',
    method: 'post',
    params: param
  })
}

export function fraudNumDeteDown(param) {
  return request({
    url: baseUrl + '/fraudNumDete/downloadTableData',
    method: 'post',
    params: param
  })
}

/*销量突增*/
export function warnSuddenReportList(param) {
  return request({
    url: baseUrl + '/warnSuddenReport/getTableData',
    method: 'post',
    params: param
  })
}

export function warnSuddenReportDown(param) {
  return request({
    url: baseUrl + '/warnSuddenReport/downloadTableData',
    method: 'post',
    params: param
  })
}

export function warnSuddenReportDownDetail(param) {
  return request({
    url: baseUrl + '/warnSuddenReport/downloadTableDataDetail',
    method: 'post',
    params: param
  })
}

/*高危漫游*/
export function highRiskRoamList(param) {
  return request({
    url: baseUrl + '/highRiskRoam/getTableData',
    method: 'post',
    params: param
  })
}

export function highRiskRoamDown(param) {
  return request({
    url: baseUrl + '/highRiskRoam/downloadTableData',
    method: 'post',
    params: param
  })
}


export function involvedReportExcel(param) {
  return request({
    url: baseUrl + '/involvedReport/importExcel',
    method: 'post',
    params: param,
    data:param
  })
}

export function batchShutdownExcel(param) {
  return request({
    url: baseUrl + '/batchShutdown/importExcel',
    method: 'post',
    params: param,
    data:param
  })
}



export function fraudNumDeteExcel(param) {
  return request({
    url: baseUrl + '/fraudNumDete/importExcel',
    method: 'post',
    params: param,
    data:param
  })
}

export function specialTreatList(param) {
  return request({
    url: baseUrl + '/specialTreat/getTableData',
    method: 'post',
    params: param,
    data:param
  })
}

export function specialTreatAdd(param) {
  return request({
    url: baseUrl + '/specialTreat/insertData',
    method: 'post',
    params: param,
    data:param
  })
}

export function specialFruldTreatList(param) {
  return request({
    url: baseUrl + '/specialTreat/getFruldHarassData',
    method: 'post',
    params: param,
    data:param
  })
}

export function specialFruldTreatAdd(param) {
  return request({
    url: baseUrl + '/specialTreat/insertFruldHarassData',
    method: 'post',
    params: param,
    data:param
  })
}
