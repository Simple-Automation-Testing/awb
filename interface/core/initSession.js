const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes, defaultCapsAndBaseOptions } = getLocalEnv()

module.exports = function (params) {
  return async function (data, options) {

    if (!data) data = JSON.stringify(defaultCapsAndBaseOptions.defaultChromeCapabilities)
    if (!options) options = { ...baseOptions }

    const { body, status } = await fetchy_util.post(urlPathes.getSession(), data, options).catch(console.log)


    return body
  }

} 