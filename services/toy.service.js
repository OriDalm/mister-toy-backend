import fs from 'fs'
import { utilService } from './util.service.js'
const toys = utilService.readJsonFile('data/toy.json')

export const toyService = {
  query,
  get,
  remove,
  save,
}

function query(filterBy, sortBy) {
  if (!filterBy) return Promise.resolve(toys)

  let toysToDisplay = toys
  if (filterBy.name) {
    const regExp = new RegExp(filterBy.name, 'i')
    toysToDisplay = toysToDisplay.filter((toy) => regExp.test(toy.name))
  }

  if (filterBy.inStock !== '') {
    toysToDisplay = toysToDisplay.filter((toy) => (filterBy.inStock === 'true' ? toy.inStock : !toy.inStock))
  }

  if (filterBy.labels && filterBy.labels.length > 0) {
    toysToDisplay = toysToDisplay.filter((toy) => filterBy.labels.every((label) => toy.labels.includes(label)))
  }
  toysToDisplay = getSortedToys(toysToDisplay, sortBy)
  return Promise.resolve(toysToDisplay)
}

function get(toyId) {
  const toy = toys.find((toy) => toy._id === toyId)
  if (!toy) return Promise.reject('toy not found!')
  return Promise.resolve(toy)
}

function remove(toyId) {
  const idx = toys.findIndex((toy) => toy._id === toyId)
  if (idx === -1) return Promise.reject('No Such Toy')
  toys.splice(idx, 1)
  return _saveToysToFile()
}

function save(toy) {
  if (toy._id) {
    const idx = toys.findIndex((currToy) => currToy._id === toy._id)
    toys[idx] = { ...toys[idx], ...toy }
  } else {
    toy.createdAt = new Date(Date.now())
    toy._id = _makeId()
    toys.unshift(toy)
  }
  return _saveToysToFile()
}

function getSortedToys(toysToSort, sortBy) {
  if (sortBy.type === 'txt') {
    return toysToSort.sort((b2, b1) => {
      const title1 = (b1.name || '').toLowerCase()
      const title2 = (b2.name || '').toLowerCase()
      return sortBy.desc * title1.localeCompare(title2)
    })
  } else {
    toysToSort.sort((b1, b2) => sortBy.desc * (b2[sortBy.type] - b1[sortBy.type]))
  }
  return toysToSort
}

function _makeId(length = 5) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const toysStr = JSON.stringify(toys, null, 4)
    fs.writeFile('data/toy.json', toysStr, (err) => {
      if (err) {
        return console.log(err)
      }
      console.log('The file was saved!')
      resolve()
    })
  })
}
