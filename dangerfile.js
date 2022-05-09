/* eslint-disable no-console */
const {danger, warn} = require('danger');
const marked = require('marked');
const {JSDOM} = require('jsdom');

const checkExistTitle = (html) => {
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

const checkTextContext = (dom) => {
  const ulList = dom.window.document.querySelectorAll('ul')

  if (ulList.length < 3) {
    warn('Proposed Change、Implementation、Task list to merge this PRが適切に入力されていません')
  }
}

const checkCheckboxList = (dom) => {
  const inputList = dom.window.document.querySelectorAll('input')

  let checkedFlag = true
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
