import fs from 'fs'
import * as path from 'path'
import { IsValidObject, UpdateArrayByKey, CustomSort } from '@/utils/globals'

export default {
  namespaced: true,
  state: {
    globalMessage: {
      type: '',
      message: ''
    },
    categories: [],
    types: [],
    user_path: '',
    tasks: [],
    isLoading: true,
    windowSize: window.innerWidth
  },
  mutations: {
    UPDATE_MESSAGE(state, payload) {
      state.globalMessage = payload
    },
    UPDATE_CATEGORIES(state, payload) {
      state.categories = payload
    },
    UPDATE_TYPES(state, payload) {
      state.types = payload
    },
    SET_USER_PATH(state, payload) {
      state.user_path = payload
    },
    UPDATE_TASKS(state, payload) {
      state.tasks = payload
    },
    SET_LOADER_STATUS(state, payload) {
      state.isLoading = payload
    },
    SET_WINDOW_SIZE(state, payload) {
      state.windowSize = payload
    }
  },
  actions: {
    floatingMessages(context, payload) {
      context.commit('UPDATE_MESSAGE', payload)
    },
    async toggleFavorite(context, { item, type }) {
      const udPath = context.rootGetters['utils/getUserPath']
      if (!IsValidObject(item)) return false
      const existingData = context.state[type]
      const favStatus = item.favorite
      const updatedItem = {
        ...item,
        favorite: !favStatus
      }
      let dbPath
      if (type === 'types') {
        dbPath = path.resolve(udPath + '/data/types.json')
      } else {
        dbPath = path.resolve(udPath + '/data/categories.json')
      }
      const updatedData = UpdateArrayByKey(existingData, 'id', updatedItem)
      fs.writeFile(
        dbPath,
        JSON.stringify(updatedData, null, 2),
        { flag: 'w+' },
        (error) => {
          if (error) {
            context.dispatch(
              'utils/floatingMessages',
              {
                message: 'Error updating item!',
                type: 'error'
              },
              { root: true }
            )
            return
          }
          context.dispatch(
            'utils/floatingMessages',
            {
              message: 'Successfully updated!',
              type: 'success'
            },
            { root: true }
          )
          if (type === 'categories') {
            context.commit('UPDATE_CATEGORIES', updatedData)
          }
          if (type === 'types') {
            context.commit('UPDATE_TYPES', updatedData)
          }
        }
      )
    },
    async fetchAllCategories(context) {
      const udPath = context.rootGetters['utils/getUserPath']
      if (context.state.categories?.length) return false
      if (udPath) {
        const dbPath = path.resolve(udPath + '/data/categories.json')
        fs.readFile(dbPath, 'utf8', (err, data) => {
          if (err) {
            return context.dispatch(
              'utils/floatingMessages',
              {
                message: 'Error getting existing categories!',
                type: 'error'
              },
              { root: true }
            )
          }
          if (!data) {
            return context.dispatch(
              'utils/floatingMessages',
              {
                message: 'No categories! Please add one.',
                type: 'info'
              },
              { root: true }
            )
          }
          const dbData = JSON.parse(data)
          context.commit('UPDATE_CATEGORIES', dbData)
        })
      }
    },
    async fetchAllTypes(context) {
      const udPath = context.rootGetters['utils/getUserPath']
      if (context.state.types?.length) return false
      const dbPath = path.resolve(udPath + '/data/types.json')
      if (udPath) {
        fs.readFile(dbPath, 'utf8', (err, data) => {
          if (err) {
            return context.dispatch(
              'utils/floatingMessages',
              {
                message: 'Error getting existing types!',
                type: 'error'
              },
              { root: true }
            )
          }
          if (!data) {
            return context.dispatch(
              'utils/floatingMessages',
              {
                message: 'No types! Please add one.',
                type: 'info'
              },
              { root: true }
            )
          }
          const dbData = JSON.parse(data)
          context.commit('UPDATE_TYPES', dbData)
        })
      }
    },
    async addToList(context, { dataObj, dataType }) {
      const udPath = context.rootGetters['utils/getUserPath']
      const existingData = context.state[dataType]
      const updatedData = [...existingData, dataObj]
      let dbPath
      if (dataType === 'types') {
        dbPath = path.resolve(udPath + '/data/types.json')
      } else {
        dbPath = path.resolve(udPath + '/data/categories.json')
      }
      fs.writeFile(
        dbPath,
        JSON.stringify(updatedData, null, 2),
        { flag: 'w+' },
        (error) => {
          if (error) {
            return context.dispatch(
              'utils/floatingMessages',
              {
                message: 'Error adding item!',
                type: 'error'
              },
              { root: true }
            )
          }
          context.dispatch(
            'utils/floatingMessages',
            {
              message: 'Successfully updated!',
              type: 'success'
            },
            { root: true }
          )
          if (dataType === 'categories') {
            context.commit('UPDATE_CATEGORIES', updatedData)
          }
          if (dataType === 'types') {
            context.commit('UPDATE_TYPES', updatedData)
          }
        }
      )
    },
    async fetchAllTasks(context) {
      const udPath = context.rootGetters['utils/getUserPath']
      if (context.state.tasks?.length) return false
      if (udPath) {
        const dbPath = path.resolve(udPath + '/data/tasks.json')
        fs.readFile(dbPath, 'utf8', (err, data) => {
          if (err) {
            return context.dispatch(
              'utils/floatingMessages',
              {
                message: 'Error getting existing tasks!',
                type: 'error'
              },
              { root: true }
            )
          }
          if (!data) {
            return context.dispatch(
              'utils/floatingMessages',
              {
                message: 'No tasks! Please add one.',
                type: 'info'
              },
              { root: true }
            )
          }
          const dbData = JSON.parse(data)
          context.commit('UPDATE_TASKS', dbData)
        })
      }
    },
    async updateTasks(context, { dataObj, type }) {
      const udPath = context.rootGetters['utils/getUserPath']
      const existingData = context.state.tasks
      let updatedData = []
      if (type === 'update') {
        updatedData = UpdateArrayByKey(existingData, 'id', dataObj)
      } else {
        updatedData = [...existingData, dataObj]
      }

      const dbPath = path.resolve(udPath + '/data/tasks.json')
      fs.writeFile(
        dbPath,
        JSON.stringify(updatedData, null, 2),
        { flag: 'w+' },
        (error) => {
          if (error) {
            return context.dispatch(
              'utils/floatingMessages',
              {
                message: 'Error adding item!',
                type: 'error'
              },
              { root: true }
            )
          }
          context.dispatch(
            'utils/floatingMessages',
            {
              message: 'Successfully added/updated!',
              type: 'success'
            },
            { root: true }
          )

          context.commit('UPDATE_TASKS', updatedData)
        }
      )
    },
    async updateList(context, { dataObj, dataType }) {
      const udPath = context.rootGetters['utils/getUserPath']
      const existingData = context.state[dataType]
      const updatedData = UpdateArrayByKey(existingData, 'id', dataObj)
      let dbPath
      if (dataType === 'types') {
        dbPath = path.resolve(udPath + '/data/types.json')
      } else {
        dbPath = path.resolve(udPath + '/data/categories.json')
      }
      fs.writeFile(
        dbPath,
        JSON.stringify(updatedData, null, 2),
        { flag: 'w+' },
        (error) => {
          if (error) {
            return context.dispatch(
              'utils/floatingMessages',
              {
                message: 'Error updating item!',
                type: 'error'
              },
              { root: true }
            )
          }
          context.dispatch(
            'utils/floatingMessages',
            {
              message: 'Successfully updated!',
              type: 'success'
            },
            { root: true }
          )
          if (dataType === 'categories') {
            context.commit('UPDATE_CATEGORIES', updatedData)
          }
          if (dataType === 'types') {
            context.commit('UPDATE_TYPES', updatedData)
          }
        }
      )
    },
    async deleteById(context, { dataId, dataType }) {
      const udPath = context.rootGetters['utils/getUserPath']
      if (!dataId || !dataType) return false
      const filteredList = context.state[dataType]?.filter(
        (i) => i.id !== dataId
      )

      let dbPath
      if (dataType === 'types') {
        dbPath = path.resolve(udPath + '/data/types.json')
      } else if (dataType === 'categories') {
        dbPath = path.resolve(udPath + '/data/categories.json')
      } else if (dataType === 'tasks') {
        dbPath = path.resolve(udPath + '/data/tasks.json')
      }

      fs.writeFile(
        dbPath,
        JSON.stringify(filteredList, null, 2),
        { flag: 'w+' },
        (error) => {
          if (error) {
            return context.dispatch(
              'utils/floatingMessages',
              {
                message: 'Error deleting item!',
                type: 'error'
              },
              { root: true }
            )
          }
          context.dispatch(
            'utils/floatingMessages',
            {
              message: 'Successfully updated!',
              type: 'success'
            },
            { root: true }
          )
          if (dataType === 'categories') {
            context.commit('UPDATE_CATEGORIES', filteredList)
          }
          if (dataType === 'types') {
            context.commit('UPDATE_TYPES', filteredList)
          }
          if (dataType === 'tasks') {
            context.commit('UPDATE_TASKS', filteredList)
          }
        }
      )
    },
    setUserPath(context, payload) {
      if (payload) {
        context.commit('SET_USER_PATH', payload)
      }
    },
    setLoaderStatus(context, payload) {
      context.commit('SET_LOADER_STATUS', payload)
    },
    setWindowSize(context, payload) {
      context.commit('SET_WINDOW_SIZE', payload)
    }
  },
  getters: {
    getAllCategories: (state) => {
      return CustomSort(state.categories)
    },
    getAllTypes: (state) => {
      return CustomSort(state.types)
    },
    getGlobalMsgs: (state) => {
      return state.globalMessage
    },
    getUserPath: (state) => {
      return state.user_path
    },
    getLoaderStatus: (state) => {
      return state.isLoading
    },
    getAllTasks: (state) => {
      return state.tasks
    },
    getWindowSize: (state) => {
      return state.windowSize
    }
  }
}
