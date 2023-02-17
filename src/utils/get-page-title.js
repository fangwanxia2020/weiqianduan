import defaultSettings from '@/settings'
import store from '@/store'


export default function getPageTitle(pageTitle, appName) {
  // const userInfo = store.state.user.userInfo || {}
  // const { orgName, orgType } = userInfo.org || {}
  // const navTitle = orgType !== 1 ? title : orgName || '危化品全生命周期'
  let title = defaultSettings.title
  if (appName) {
    title = appName
  }

  if (pageTitle) {
    return `${pageTitle} - ${title}`
    store
  }
  return `${title}`
}
