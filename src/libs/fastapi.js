import axios from 'axios';

import { toast } from 'react-toastify';


const client = axios.create({
    baseURL: 'http://127.0.0.1:8000/'
})


const defaultAlert = {
    bool: false,
    value: false,
    status: false,
    msg: false
}
var alert = { ...defaultAlert }


const analyzeResponse = (response) => {
    // console.log(response)
    if (response) {
        alert.msg = false
        alert.status = response.status

        if (alert.status >= 200 && alert.status < 300) alert.bool = true

        if (alert.status === 200) {
            alert.variant = 'success'

            alert.msg = response.data?.detail
            alert.value = response.data?.value
        } else if (alert.status === 206) {
            alert.variant = 'info'

            alert.msg = response.data.detail?.detail
            alert.value = response.data.detail?.value
        }

        if (alert.msg) showAlert()
    }
}
const analyzeError = (e) => {
    // console.log(e)

    if (["ERR_NETWORK", "ERR_BAD_RESPONSE"].includes(e.code)) {
        alert.status = 500
    } else if (e.code === "ERR_BAD_REQUEST") {
        alert.status = e.response.request.status
    }

    if (alert.status) {
        alert.variant = 'error'
        alert.msg = false

        if (alert.status < 500) {
            alert.msg = e?.response?.data?.detail
        } else {
            alert.msg = "Error de servidor"
        }
    }

    if (alert.msg) showAlert()
}


const showAlert = async () => {
    const toast_config = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        type: alert.variant
    }

    toast(alert.msg, toast_config)
}


export async function getFAPI(action) {
    alert = { ...defaultAlert }

    await client.get(action)
        .then(response => analyzeResponse(response))
        .catch(e => analyzeError(e))

    return alert
}

export async function postFAPI(action, data) {
    alert = { ...defaultAlert }

    await client.post(action, data)
        .then(response => analyzeResponse(response))
        .catch(e => analyzeError(e))

    return alert
}


export async function deleteFAPI(action) {
    alert = { ...defaultAlert }

    await client.delete(action)
        .then(response => analyzeResponse(response))
        .catch(e => analyzeError(e))

    return alert
}


export async function putFAPI(action, data) {
    alert = { ...defaultAlert }

    await client.put(action, data)
        .then(response => analyzeResponse(response))
        .catch(e => analyzeError(e))

    return alert
}

export async function imgFAPI(action) {
    alert = { ...defaultAlert }

    const config_get = {
        responseType: "blob",
    }

    await client.get(action, config_get)
        .then(response => {
            const url = URL.createObjectURL(response.data)

            alert.bool = true
            alert.value = url
        })
        .catch(e => {
            if (e?.response?.data) {
                var reader = new FileReader()
                reader.onload = function (x) {
                    const texto = x.target.result
                    e.response.data = JSON.parse(texto)
                    analyzeError(e)
                }
                reader.readAsText(e.response.data)
            }
        })

    return alert
}


export async function getProductsImgs(rows, setImgs) {
    if (rows.length > 0) {
        const form_data = new FormData()
        rows.forEach(e => {
            form_data.append('ids', e.id_product)
        })

        const response = await postFAPI('products/getListImgs', form_data)

        if (response.bool && typeof response.value === 'object') {
            const new_rowImgs = {}
            for (const id in response.value) {
                const list = response.value[id]
                new_rowImgs[id] = []

                await Promise.all(
                    list.map(async name => {
                        const src = await imgFAPI(`products/getImgByName/${id}/${name}`)
                        if (src.bool && src.value) {
                            new_rowImgs[id].push({
                                name: name,
                                src: src.value
                            })
                        }
                    })
                )
            }
            setImgs(new_rowImgs)
        }
    }
}