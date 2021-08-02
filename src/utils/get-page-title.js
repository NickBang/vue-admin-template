import defaultSettings from '@/settings'

const title = defaultSettings.title || '拓客'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
