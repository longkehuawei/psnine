import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const list = []

  $('table tr').each(function (i, elem) {
    const $this = $(this)
    const info = {}

    const text = $this.text()
    const arr = text.split('\n').map(item => item.trim()).filter(item => item)
    arr.unshift('')
    info.rank = arr[0]
    info.avatar = $this.find('img').attr('src')
    info.href = $this.find('a').attr('href')
    info.psnid = arr[1]
    info.exp = (arr[2].split('经验') || [])[1]
    info.level = (arr[2].split('经验') || [])[0]
    info.content = `<div>${$this.find('p').parent().html().trim().replace(/<p>.*?<\/p>/,'')}</div>`
    info.games = arr[3]
    info.perfectRate =arr[4]
    info.platinum = arr[5]
    info.gold = arr[6]
    info.silver = arr[7]
    info.bronze = arr[8]
    info.type = 'general'
    list.push(info)
  })

  return list
}