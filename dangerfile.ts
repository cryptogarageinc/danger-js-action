/* eslint-disable no-console */
import { danger, warn } from 'danger'
import marked from 'marked'
import { JSDOM } from 'jsdom'

const checkExistTitle = (html: string) => {
  if (html.indexOf('Proposed Changes') == -1) {
    warn('Proposed Changesがありません。追加してください。')
  }

  if (html.indexOf('Implementation') == -1) {
    warn('Implementationがありません。追加してください。')
  }

  if (html.indexOf('Task list to merge this PR') == -1) {
    warn('Task list to merge this PRがありません。追加してください。')
  }
}

const checkTextContext = (dom: JSDOM) => {
  const ulList = dom.window.document.querySelectorAll('ul')

  if (ulList.length < 3) {
    warn('Proposed Change、Implementation、Task list to merge this PRが適切に入力されていません')
  }
}

const checkCheckboxList = (dom: JSDOM) => {
  const inputList = dom.window.document.querySelectorAll('input')

  let checkedFlag: boolean = true
  for (let index = 0; index < inputList.length; index++) {
    const inputElm = inputList[index]
    if (inputElm.type === 'checkbox' && !inputElm.checked) {
      checkedFlag = false
    }
  }

  if (!checkedFlag) {
    warn('チェックされていないタスクがあります。')
  }
}

const main = () => {
  try {
    const body = danger.github.pr.body
    const html = marked(body)
    const dom = new JSDOM(html)

    checkExistTitle(html)

    checkTextContext(dom)

    checkCheckboxList(dom)
  } catch (e) {
    console.error(e)
    warn('PRテンプレートが正しく使用されていません。最新の状態であるか確認してください')
  }
}

main()
