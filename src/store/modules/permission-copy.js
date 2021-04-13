import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '@/api/role' // 获取路由的接口方法
import Layout from '@/layout'

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
    debugger
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
      debugger;
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
    const tmp = { ...route }
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

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      debugger;
      let accessedRoutes
      let asyncRoutes;
      let test01 = [
        {
          path: '/',
          component: Layout,
          redirect: '/index',
          alwaysShow: false, // will always show the root menu
          name:'首页',
          meta: {
            title: '首页',
            icon: 'dashboard' // you can set roles in root nav
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/dashboard/index'),
              name: '首页',
              meta: { title: '首页', icon: 'dashboard', affix: true }
            }
          ]
        },
        {
          path: '/fraud-management',
          component: Layout,
          redirect: '/fraud-management/hawkeye-daily',
          alwaysShow: true, // will always show the root menu
          name: '欺诈管理',
          meta: {
            title: '欺诈管理',
            icon: 'lock' // you can set roles in root nav
          },
          children: [
            {
              path: 'hawkeye-daily',
              component: "() => import('@/views/fraud-management/hawkeye-daily')",
              name: '鹰眼停机率日报',
              meta: { title: '鹰眼停机率日报', icon: 'documentation'}
            },
            {
              path: 'fraud-details',
              component: "() => import('@/views/fraud-management/fraud-details')",
              name: '欺诈明细',
              meta: { title: '欺诈明细', icon: 'excel' }
            },
            {
              path: 'downtime-white-list',
              component: "() => import('@/views/fraud-management/downtime-white-list')",
              name: '停机白名单管理',
              meta: { title: '停机白名单管理', icon: 'tab' }
            },
            {
              path: 'batch-shutdown',
              component: "() => import('@/views/fraud-management/batch-shutdown')",
              name: '批量停机',
              meta: { title: '批量停机', icon: 'skill' }
            },
          ]
        },
        {
          path: '/limitsAuthority',
          component: Layout,
          redirect: '/limitsAuthority/organization',
          alwaysShow: true, // will always show the root menu
          name: '权限管理',
          meta: {
            title: '权限管理',
            icon: 'list',
          },
          children: [
            {
              path: 'organization',
              component: "() => import('@/views/limits-authority/organization')",
              name: '组织机构管理',
              meta: { title: '组织机构管理', icon: 'tree-table' }
            },
            {
              path: 'channel-management',
              component: "() => import('@/views/limits-authority/channel-management')",
              name: '渠道管理',
              meta: { title: '渠道管理', icon: 'chart' }
            },
            {
              path: 'user',
              component: "() => import('@/views/limits-authority/user')",
              name: '用户管理',
              meta: { title: '用户管理', icon: 'peoples' }
            },
            {
              path: 'role-management',
              component: "() => import('@/views/limits-authority/role-management')",
              name: '角色管理',
              meta: { title: '角色管理', icon: 'component' }
            },
          ]
        },
      ]
      asyncRoutes = getAsyncRoutes(test01)

      /*let param = {};
      param.loginId = 'admin'
      let test;
      getRoutes(param).then(response => {
        debugger;
        test = response;
        let role = []
        for(let i = 0;i<test.length;i++){
          let row = test[i];
          let info = {};
          if(i===0){
            if (row.name==='首页'){
              let a = {
                path: '/',
                component: Layout,
                redirect: '/index',
                alwaysShow: false, // will always show the root menu
                name:'首页',
                meta: {
                  title: '首页',
                  icon: 'dashboard' // you can set roles in root nav
                },
                children: [
                  {
                    path: 'index',
                    component: () => import('@/views/dashboard/index'),
                    name: '首页',
                    meta: { title: '首页', icon: 'dashboard', affix: true }
                  }
                ]
              }
              role.push(a);
              continue;
            }else {
              let b ={
                path: '/',
                component: Layout,
                redirect: '/index',
                alwaysShow: false, // will always show the root menu
                name:'首页',
                meta: {
                  title: '首页',
                  icon: 'dashboard' // you can set roles in root nav
                },
                children: [
                  {
                    path: 'index',
                    component: () => import('@/views/error-page/401'),
                    name: '首页',
                    meta: { title: '首页', icon: 'dashboard'}
                  }
                ]
              }
              role.push(b)
            }
          }
          /!*if(row.children.length>0){
            info.path = row.path;
            info.component = Layout;
            info.redirect = row.redirect;
            info.alwaysShow = true
            info.name = row.name
            info.meta = {};
            info.meta.icon = row.icon;
            info.meta.title = row.title;
            info.children=[]
            for(let m = 0;m < row.children.length;m++){
              let childInfo={};
              childInfo.path = row.children[m].path
              childInfo.name = row.children[m].name
              childInfo.meta = {}
              childInfo.meta.icon = row.children[m].icon;
              childInfo.meta.title = row.children[m].title;
              debugger;
              let comp = row.children[m].component;
              comp = comp.split('@')[1];
              comp = comp.split("')")[0];
              comp = '@' + comp;
              childInfo.component =  () => import(comp)
              info.children.push(childInfo)
            }
            role.push(info)
          }*!/
        }
        asyncRoutes = getAsyncRoutes(role)
      })*/
      // 获取到后台路由
       // 对路由格式进行处理
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
