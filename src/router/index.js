import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/customers',
    children: [
      {
        path: 'customers',
        component: () => import('@/views/customers/index'),
        name: 'Customers',
        meta: { title: '潜在客户', icon: 'el-icon-s-unfold', affix: true }
      }
    ]
  },
  
  {
    path: '/key-word',
    component: Layout,
    children: [
      {
        path: 'key-word',
        component: () => import('@/views/key-word/index'),
        name: 'KeyWord',
        meta: { title: '视频关键词', icon: 'el-icon-video-camera-solid', affix: true }
      }
    ]
  },
  {
    path: '/company-manage',
    component: Layout,
    role: true,
    children: [
      {
        path: 'company-manage',
        component: () => import('@/views/company-manage/index'),
        name: 'companyManage',
        meta: { title: '公司管理', icon: 'el-icon-suitcase-1', affix: true }
      }
    ]
  },
  {
    path: '/user-manage',
    component: Layout,
    role: true,
    children: [
      {
        path: 'user-manage',
        component: () => import('@/views/user-manage/index'),
        name: 'UserManage',
        meta: { title: '用户管理', icon: 'el-icon-s-custom', affix: true }
      }
    ]
  },
  {
    path: '/system-setting',
    component: Layout,
    meta: { title: '系统设置', icon: 'el-icon-setting', affix: true },
    name: 'system',
    children: [
      {
        path: '',
        component: () => import('@/views/system-setting/system-setting'),
        name: 'SystemSetting',
        meta: { title: '系统设置', icon: 'el-icon-setting', affix: true }
      },
      {
        path: 'comment',
        component: () => import('@/views/system-setting/comment'),
        name: 'Comment',
        meta: { title: '评论过滤', icon: 'el-icon-s-operation', affix: true }
      },
      {
        path: 'log',
        component: () => import('@/views/system-setting/log'),
        name: 'Log',
        meta: { title: '操作日志', icon: 'el-icon-s-data', affix: true }
      }
    ]
  },
  {
    path: '/account-info',
    component: Layout,
    children: [
      {
        path: 'account-info',
        component: () => import('@/views/account-info/index'),
        name: 'AccountInfo',
        meta: { title: '账户信息', icon: 'el-icon-coin', affix: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
