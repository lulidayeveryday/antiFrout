import {asyncRoutes, constantRoutes} from '@/router'
import {getRoutes} from '@/api/role' // 获取路由的接口方法
import Layout from '@/layout'
import organization from '@/views/limits-authority/organization'
import channelManagement from '@/views/limits-authority/channel-management'
import roleManagement from '@/views/limits-authority/role-management'
import user from '@/views/limits-authority/user'
import batchShutdown from '@/views/fraud-management/batch-shutdown'
import downtimeWhiteList from '@/views/fraud-management/downtime-white-list'
import fraudDetails from '@/views/fraud-management/fraud-details'
import hawkeyeDaily from '@/views/fraud-management/hawkeye-daily'


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 把后台返回菜单组装成routes要求的格式
 * @param {*} routes
 */
export function getAsyncRoutes(routes) {
  console.log(routes)
  const res = [...routes]
  const keys = ['path', 'name', 'children', 'redirect', 'alwaysShow', 'meta', 'hidden']
  /*routes.forEach(item => {

    const newItem = {}
    if (item.component) {
      if (item.component === 'layout/Layout') {
        newItem.component = Layout
      } else {

      }
    }
    for (const key in item) {
      if (keys.includes(key)) {
        newItem[key] = item[key]
      }
    }
    if (newItem.children && newItem.children.length) {
      newItem.children = getAsyncRoutes(item.children)
    }
    res.push(newItem)
  })*/
  return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {...route}
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  console
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

const actions = {
  generateRoutes({commit}, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      let asyncRoutes;

      let param = {};
      param.loginId = sessionStorage.getItem('loginId')
      let test;
      getRoutes(param).then(response => {
        test = response;
        /*test = [
          {
          "affix": "true",
          "alwaysShow": "false",
          "children": [],
          "component": "Layout",
          "icon": "dashboard",
          "level": "1",
          "name": "首页",
          "parentId": "ROOT",
          "path": "/",
          "redirect": "/index",
          "resourcesId": "8a8ae5a36afe7fe8016afe8078030001",
          "title": "首页"
        }, {
          "affix": null,
          "alwaysShow": "true",
          "children": [{
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "fraud-management/hawkeye-daily",
            "icon": "documentation",
            "level": "2",
            "name": "鹰眼停机率日报",
            "parentId": "8a8ae5a36afe7fe8016afe8177730003",
            "path": "hawkeye-daily",
            "redirect": null,
            "resourcesId": "8a8ae5a36afe7fe8016afe8177730004",
            "title": "鹰眼停机率日报"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "fraud-management/fraud-details",
            "icon": "excel",
            "level": "2",
            "name": "欺诈明细",
            "parentId": "8a8ae5a36afe7fe8016afe8177730003",
            "path": "fraud-details",
            "redirect": null,
            "resourcesId": "8a8ae5a36afe7fe8016afe8177730005",
            "title": "欺诈明细"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "fraud-management/downtime-white-list",
            "icon": "tab",
            "level": "2",
            "name": "停机白名单管理",
            "parentId": "8a8ae5a36afe7fe8016afe8177730003",
            "path": "downtime-white-list",
            "redirect": null,
            "resourcesId": "8a8ae5a36afe7fe8016afe8177730006",
            "title": "停机白名单管理"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "fraud-management/batch-shutdown",
            "icon": "skill",
            "level": "2",
            "name": "批量停机",
            "parentId": "8a8ae5a36afe7fe8016afe8177730003",
            "path": "batch-shutdown",
            "redirect": null,
            "resourcesId": "8a8ae5a36afe7fe8016afe8177730007",
            "title": "批量停机"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "fraud-management/report-involved",
            "icon": "clipboard",
            "level": "2",
            "name": "涉案号码举报",
            "parentId": "8a8ae5a36afe7fe8016afe8177730003",
            "path": "report-involved",
            "redirect": null,
            "resourcesId": "8a8ae5a36afe7fe8016afe8177730008",
            "title": "涉案号码举报"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "fraud-management/hawk-eye-detection",
            "icon": "link",
            "level": "2",
            "name": "鹰眼检出诈骗号码",
            "parentId": "8a8ae5a36afe7fe8016afe8177730003",
            "path": "hawk-eye-detection",
            "redirect": null,
            "resourcesId": "8a8ae5a36afe7fe8016afe8177730009",
            "title": "鹰眼检出诈骗号码"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "fraud-management/high-risk-roaming",
            "icon": "example",
            "level": "2",
            "name": "高危漫游话务异常",
            "parentId": "8a8ae5a36afe7fe8016afe8177730003",
            "path": "high-risk-roaming",
            "redirect": null,
            "resourcesId": "8a8ae5a36afe7fe8016afe8177730010",
            "title": "高危漫游话务异常"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "fraud-management/sales-increase",
            "icon": "form",
            "level": "2",
            "name": "销量突增预警",
            "parentId": "8a8ae5a36afe7fe8016afe8177730003",
            "path": "sales-increase",
            "redirect": null,
            "resourcesId": "8a8ae5a36afe7fe8016afe8177730011",
            "title": "销量突增"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "fraud-management/special-treatment",
            "icon": "form",
            "level": "2",
            "name": "专项治理",
            "parentId": "8a8ae5a36afe7fe8016afe8177730003",
            "path": "special-treatment",
            "redirect": null,
            "resourcesId": "8a8ae5a36afe7fe8016afe8177730011",
            "title": "专项治理"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "fraud-management/fraud-special-treatment",
            "icon": "form",
            "level": "2",
            "name": "诈骗专项治理",
            "parentId": "8a8ae5a36afe7fe8016afe8177730003",
            "path": "fraud-pecial-treatment",
            "redirect": null,
            "resourcesId": "8a8ae5a36afe7fe8016afe8177730011",
            "title": "诈骗专项治理"
          }],
          "component": "Layout",
          "icon": "lock",
          "level": "1",
          "name": "欺诈管理",
          "parentId": "ROOT",
          "path": "/fraud-management",
          "redirect": "/fraud-management/hawkeye-daily",
          "resourcesId": "8a8ae5a36afe7fe8016afe8177730003",
          "title": "欺诈管理"
        }, {
          "affix": null,
          "alwaysShow": "true",
          "children": [{
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "limits-authority/organization",
            "icon": "tree-table",
            "level": "2",
            "name": "组织机构管理",
            "parentId": "2c90bfc35e080e14015e080e149d0000",
            "path": "organization",
            "redirect": null,
            "resourcesId": "2c90bfc35e5053af015e50545c020002",
            "title": "组织机构管理"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "limits-authority/channel-management",
            "icon": "chart",
            "level": "2",
            "name": "渠道管理",
            "parentId": "2c90bfc35e080e14015e080e149d0000",
            "path": "channel-management",
            "redirect": null,
            "resourcesId": "2c90bfc35e5053af015e5053afba0003",
            "title": "渠道管理"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "limits-authority/user",
            "icon": "peoples",
            "level": "2",
            "name": "用户管理",
            "parentId": "2c90bfc35e080e14015e080e149d0000",
            "path": "user",
            "redirect": null,
            "resourcesId": "2c90bfc35e4fcf9f015e4fd01b200002",
            "title": "用户管理"
          }, {
            "affix": null,
            "alwaysShow": null,
            "children": [],
            "component": "limits-authority/role-management",
            "icon": "component",
            "level": "2",
            "name": "角色管理",
            "parentId": "2c90bfc35e080e14015e080e149d0000",
            "path": "role-management",
            "redirect": null,
            "resourcesId": "2c90bfc35e5053af015e5053afba0000",
            "title": "角色管理"
          }],
          "component": "Layout",
          "icon": "list",
          "level": "1",
          "name": "权限管理",
          "parentId": "ROOT",
          "path": "/limitsAuthority",
          "redirect": "/limitsAuthority/organization",
          "resourcesId": "2c90bfc35e080e14015e080e149d0000",
          "title": "权限管理"
        }]*/
        let role = []
        for (let i = 0; i < test.length; i++) {
          let row = test[i];
          let info = {};
          if (i === 0) {
            if (row.name === '首页') {
              let a = {
                path: '/',
                component: Layout,
                redirect: '/index',
                alwaysShow: false, // will always show the root menu
                name: '首页',
                meta: {
                  title: '首页',
                  icon: 'dashboard' // you can set roles in root nav
                },
                children: [
                  {
                    path: 'index',
                    component: () => import('@/views/dashboard/index'),
                    name: '首页',
                    meta: {title: '首页', icon: 'dashboard', affix: true}
                  }
                ]
              }
              role.push(a);
              continue;
            } else {
              let b = {
                path: '/',
                component: Layout,
                redirect: '/index',
                alwaysShow: false, // will always show the root menu
                name: '首页',
                meta: {
                  title: '首页',
                  icon: 'dashboard' // you can set roles in root nav
                },
                children: [
                  {
                    path: 'index',
                    component: () => import('@/views/error-page/401'),
                    name: '首页',
                    meta: {title: '首页', icon: 'dashboard'}
                  }
                ]
              }
              role.push(b)
            }
          }
          if (row.children.length > 0) {
            info.path = row.path;
            info.component = Layout;
            info.redirect = row.redirect;
            info.alwaysShow = true
            info.name = row.name
            info.meta = {};
            info.meta.icon = row.icon;
            info.meta.title = row.title;
            info.children = []
            for (let m = 0; m < row.children.length; m++) {
              let childInfo = {};
              childInfo.path = row.children[m].path
              childInfo.name = row.children[m].name
              childInfo.meta = {}
              childInfo.meta.icon = row.children[m].icon;
              childInfo.meta.title = row.children[m].title;
              let comp = row.children[m].component;
              /*if(comp.indexOf("hawkeye-daily") != -1){
                childInfo.component =  hawkeyeDaily;
              }else if(comp.indexOf("fraud-details") != -1){
                childInfo.component =  fraudDetails;
              }else if(comp.indexOf("downtime-white-list") != -1){
                childInfo.component =  downtimeWhiteList;
              }else if(comp.indexOf("batch-shutdown") != -1){
                childInfo.component =  batchShutdown;
              }else if(comp.indexOf("organization") != -1){
                childInfo.component =  organization;
              }else if(comp.indexOf("channel-management") != -1){
                childInfo.component =  channelManagement;
              }else if(comp.indexOf("user") != -1){
                childInfo.component =  user;
              }else if(comp.indexOf("role-management") != -1){
                childInfo.component =  roleManagement;
              }*/
              childInfo.component = loadView(comp)
              info.children.push(childInfo)
            }
            role.push(info)
          }
        }
        asyncRoutes = getAsyncRoutes(role)
        // 对路由格式进行处理
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })

    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
