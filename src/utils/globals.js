import ErrorMessages from '@/constants/Errors'
import fs from 'fs'
import * as path from 'path'

export const ensureDirExists = (filePath) => {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirExists(dirname)
  fs.mkdirSync(dirname)
}

const TrimString = (s) => {
  let l = 0
  let r = s.length - 1
  while (l < s.length && s[l] === ' ') l++
  while (r > l && s[r] === ' ') r -= 1
  return s.substring(l, r + 1)
}

const CompareObjects = (o1, o2) => {
  let k = ''
  for (k in o1) {
    if (o1[k] !== o2[k]) return false
  }
  for (k in o2) {
    if (o1[k] !== o2[k]) return false
  }
  return true
}

const ItemExists = (haystack, needle) => {
  for (let i = 0; i < haystack.length; i++) {
    if (CompareObjects(haystack[i], needle)) return true
  }
  return false
}

const SortArrayObjects = (a, b, type) => {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false
  }
  let modifier = 1
  if (type === 'desc') {
    modifier = -1
  }
  if (a[0].sortKey < b[0].sortKey) {
    return -1 * modifier
  }
  if (a[0].sortKey > b[0].sortKey) {
    return 1 * modifier
  }
  return 0
}

const SortPrimitives = (a, b, type) => {
  let modifier = 1
  if (type === 'desc') {
    modifier = -1
  }
  if (a < b) {
    return -1 * modifier
  }
  if (a > b) {
    return 1 * modifier
  }
  return 0
}

const ExpandAllByKey = (dataArray, key) => {
  const expanded = dataArray.map((i) => {
    return i[key].map((j) => ({ ...i, [key]: j }))
  })
  return expanded.flat()
}

export const HideBodyOverlay = (event, itemsClass) => {
  event?.preventDefault()
  if (itemsClass) {
    const items = document.getElementsByClassName(itemsClass)
    for (let i = 0; i < items.length; i++) {
      items[i].classList.add('d-none')
    }
  }
  document.getElementById('bodyOverlay').remove()
}

export const AddBodyOverlay = (event, itemsClass, backdropColor) => {
  event?.preventDefault()
  document.getElementById('bodyOverlay')?.remove()
  const elem = document.createElement('div')
  elem.setAttribute('id', 'bodyOverlay')
  elem.setAttribute('class', backdropColor || 'dark')
  elem.onclick = () => HideBodyOverlay(event, itemsClass)
  document.body.appendChild(elem)
}

export const IsSimilarObject = (oldObject, newObject) => {
  const xObject = ParseObject(oldObject)
  const yObject = ParseObject(newObject)
  const ObjOld = xObject?.constructor?.name
  const ObjNew = yObject?.constructor?.name
  if (ObjOld !== 'Object' || ObjNew !== 'Object') {
    return false
  }
  let count = 0
  Object.keys(xObject).forEach((key) => {
    const checkKey = Object.hasOwnProperty.call(yObject, key)
    const noSameKey = yObject[key] !== xObject[key]
    if ((!checkKey || noSameKey) && key !== 'id') {
      count++
    }
  })

  if (count > 0) {
    return false
  }
  return true
}

export const PushUniqueObjects = (dataArray, newObj) => {
  if (newObj?.constructor.name !== 'Object') {
    return {
      type: 'error',
      message: ErrorMessages.VALID_OBJECT
    }
  }

  if (dataArray?.constructor.name !== 'Array') {
    return {
      type: 'error',
      message: ErrorMessages.VALID_ARRAY
    }
  }

  const res = dataArray.map((item) => {
    return IsSimilarObject(item, newObj)
  })
  const checkIt = res.some((i) => i === true)
  if (dataArray.length && checkIt) {
    alert(ErrorMessages.NO_DUPLICATES)
  } else {
    dataArray.push(newObj)
  }
  return dataArray
}

export const ParseObject = (objectData) => {
  return JSON.parse(JSON.stringify(objectData))
}

export const StringifyObject = (objectData) => {
  return JSON.stringify(objectData)
}

export const IsValidObject = (obj) => {
  return (
    typeof obj === 'object' &&
    Object.keys(obj).length !== 0 &&
    !Array.isArray(obj) &&
    obj !== null
  )
}

export const CustomSort = (objectsArray, key, type) => {
  if (!objectsArray) return false
  if (!key) key = 'sortKey'
  if (!type) type = 'asc'
  return objectsArray?.sort((a, b) => {
    const keyExists = Object.hasOwnProperty.call(a, key)
    if (!keyExists) return false
    let itemA = a[key]
    const itemB = b[key]

    if (!isNaN(itemA)) itemA = Number(itemA)
    if (!isNaN(itemA)) itemA = Number(itemA)

    if (Array.isArray(itemA)) {
      return SortArrayObjects(itemA, itemB, type)
    }
    return SortPrimitives(itemA, itemB, type)
  })
}

export const SearchTheData = (searchData, searchKey) => {
  if (!searchData.length || !searchKey) return false
  const results = []
  const toSearch = TrimString(searchKey).toLowerCase() // trim it
  for (let i = 0; i < searchData.length; i++) {
    for (const key in searchData[i]) {
      let searchItem = searchData[i][key]
      if (Array.isArray(searchItem)) {
        searchItem = searchItem
          .reduce(function (str, i) {
            return str + ' ' + i.sortKey
          }, '')
          .toLowerCase()
      } else {
        searchItem = searchItem.toLowerCase()
      }
      if (searchItem.indexOf(toSearch) !== -1) {
        if (!ItemExists(results, searchData[i])) {
          results.push(searchData[i])
        }
      }
    }
  }
  return results
}

export const RemoveMultiSpaces = (str) => {
  return str.replace(/\s\s+/g, ' ')
}

export const SpaceToUnderscore = (str) => {
  const lowerStr = str.toLowerCase()
  const noSpaces = lowerStr.replace(/\s/g, '_')
  return noSpaces
}

export const UnderscoreToSpace = (str) => {
  const withSpaces = str.replace(/_+/g, ' ')
  const capitalized = withSpaces.Capitalize()
  return capitalized
}

export const UpdateArrayByKey = (dataArray, key, item) => {
  return dataArray?.map((i) => {
    if (i[key] === item[key]) {
      return item
    }
    return i
  })
}

export const GroupByKey = (dataArray, key) => {
  const validData = Array.isArray(dataArray) && dataArray.length
  if (!validData) return false
  const expandedData = ExpandAllByKey(dataArray, key)

  const result = expandedData.reduce((r, a) => {
    r[a[key].optValue] = r[a[key].optValue] || []
    r[a[key].optValue].push(a)
    return r
  }, Object.create(null))
  return result
}

export const CustomDates = (format, dateStr) => {
  let dateObj = new Date()
  if (dateStr) {
    dateObj = new Date(dateStr)
  }
  let DateFormatted
  const fullYear = dateObj.getFullYear()
  const digitsMonth = ('0' + (dateObj.getMonth() + 1)).slice(-2)
  const digitsDate = ('0' + dateObj.getDate()).slice(-2)
  // Hours calculations
  const hours24 = ('0' + dateObj.getHours()).slice(-2)
  const minutes = ('0' + dateObj.getMinutes()).slice(-2)
  const amPm = hours24 >= 12 ? 'PM' : 'AM'
  let hours12 = hours24 % 12
  hours12 = hours12 || 12
  const strTime = hours12 + ':' + minutes + ' ' + amPm

  switch (format) {
    case 'YYYY-MM':
      DateFormatted = `${fullYear}-${digitsMonth}`
      break

    case 'YYYY-MM-DD':
      DateFormatted = `${fullYear}-${digitsMonth}-${digitsDate}`
      break

    case 'YYYY-MM-DD HH:MM':
      DateFormatted = `${fullYear}-${digitsMonth}-${digitsDate} ${strTime}`
      break

    default:
      DateFormatted = `${fullYear}-${digitsMonth}-${digitsDate}`
      break
  }

  return DateFormatted
}

export const FilterByMonth = (itemsArray, filterDate) => {
  if (!itemsArray?.length) return []
  if (!filterDate) filterDate = CustomDates('YYYY-MM')
  return itemsArray?.filter((i) => {
    return CustomDates('YYYY-MM', i.date) === filterDate
  })
}

export const FilterByDay = (itemsArray, filterDate) => {
  if (!itemsArray?.length) return []
  if (!filterDate) filterDate = CustomDates('YYYY-MM-DD')
  return itemsArray?.filter((i) => {
    return CustomDates('YYYY-MM-DD', i.date) === filterDate
  })
}
