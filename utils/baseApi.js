import axios from 'axios'


const createApiRequest = async ({url, method, data, params}) => {
  try {
    const {data: resp} = await axios({
      method,
      url: url,
      data,
      params,
    })

    return {
      success: true,
      data: resp,
    }
  } catch (e) {
    const {response} = e
    const message = response ? response.statusText : e.message || e
    const _data = response ? response.data : ''
    return {
      success: false,
      message,
      _data,
    }
  }
}

export default createApiRequest
