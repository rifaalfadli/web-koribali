import Cookies from 'js-cookie'

const BASE_URL = 'http://localhost:5000'

export const fetchAPI = async (enpoint, option = {}) => {
    const token = Cookies.get('access_token')

    const headers = {
        "Content-Type" : "application/json",
        ...option.headers
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${BASE_URL}${enpoint}`, {
        ...option,
        headers
    })
if (response.status === 401) {
    Cookies.remove("access_token");
}

return response
}