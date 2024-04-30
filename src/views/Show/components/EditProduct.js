import { useState } from "react";

import { putFAPI } from "../../../libs/fastapi";

import { Button, Input, Textarea, Image } from "@nextui-org/react";
import { Form, Formik } from "formik";
import ErrorBoundary from "../../../components/ErrorBoundary";


function EditProduct({ edit, setEdit, loading, setLoading, imgs_current, handleEndEdit }) {

    const [currentImgs, setCurrentImgs] = useState(imgs_current)
    const [imgs, setImgs] = useState([])
    const [imgsPrev, setImgsPrev] = useState([...imgs_current])
    const [toDeleteImgs, setToDeleteImgs] = useState([])


    const handleFiles = (e) => {
        var clean = false
        const new_preview = [...currentImgs]
        const current_length = currentImgs.length

        if (e.target.files.length === 0) {
            clean = true
        } else if ((e.target.files.length + current_length) > 6) {
            alert("Maximo 6 archivos")
            clean = true
        } else {
            for (const file of e.target.files) {
                if (file.type && !file.type.startsWith('image/')) {
                    alert("Solo se permiten imagenes")
                    clean = true
                    break
                }

                const reader = new FileReader()
                reader.onload = function (e) {
                    new_preview.push({
                        name: 'new_img_' + file.name,
                        src: e.target.result
                    })
                }
                reader.readAsDataURL(file)
            }
        }

        if (clean) {
            handleCleanPrev()
        } else {
            setImgs(e.target.files)

            setImgsPrev([])
            setTimeout(() => {
                setImgsPrev(new_preview)
            }, 300)
        }

    }

    const handleCleanPrev = () => {
        setImgs([])
        document.querySelector('#input_imgs').value = ''
        setImgsPrev(currentImgs)
    }

    const handleDeleteCurrentImg = name => {
        toDeleteImgs.push(name)
        setCurrentImgs(currentImgs.filter(e => e.name !== name))
        setImgsPrev(imgsPrev.filter(e => e.name !== name))
    }

    const handleClean = () => {
        setCurrentImgs([])
        setImgs([])
        setImgsPrev([])
        setToDeleteImgs([])
        document.querySelector('#form_update_product').reset()
        document.querySelector('#input_imgs').value = ''

        setEdit && setEdit(false)

        if (window.location.hash) window.location.hash = ""
    }

    const handleUpdate = async e => {
        setLoading && setLoading(true)

        // actualizo datos
        var equal = true
        for (const k of Object.keys(e)) {
            if (e[k] !== edit[k]) {
                equal = false
                break
            }
        }

        if (!equal) await putFAPI('products/update', e)

        // actualizo imgs
        if (imgs.length || toDeleteImgs.length) {
            const form_data = new FormData()

            form_data.append('id', edit.id_product)

            toDeleteImgs.forEach(e => {
                form_data.append("toDelete", e)
            })

            for (const img of imgs) {
                form_data.append("imgs", img)
            }

            await putFAPI('/products/updateImgs', form_data)
        }

        if (!equal || imgs.length || toDeleteImgs.length) handleEndEdit && await handleEndEdit()

        handleClean()
        setLoading && setLoading(false)
    }

    function PreviewOfImgs() {
        return <div className="flex gap-2 flex-wrap justify-center ">
            {imgsPrev.map(img =>
                <div key={img.name} className="flex flex-col justify-center items-center gap-2 relative">
                    <Image
                        src={img.src}
                        className="w-32 h-32 object-cover"
                    />

                    {!img.name.includes('new_img_') && (
                        <Button color="danger" size="sm" className="absolute bottom-1 z-10" onClick={() => handleDeleteCurrentImg(img.name)}>
                            Borrar
                        </Button>
                    )}
                </div>
            )}
        </div>
    }


    return (
        <Formik
            initialValues={{ ...edit }}
            onSubmit={handleUpdate}
            onReset={handleClean}
        >
            {({ handleChange, values }) => (
                <Form className="flex flex-col gap-4 mt-4 bg-content3 p-2 rounded-lg max-w-80" id="form_update_product">
                    <Input
                        name="name_product"
                        label='Nombre'
                        defaultValue={values.name_product}
                        onChange={handleChange}
                    />

                    <Input
                        name="category_product"
                        label='Categoria'
                        defaultValue={values.category_product}
                        onChange={handleChange}
                    />

                    <Input
                        type="number"
                        name="price"
                        label='Precio'
                        defaultValue={values.price}
                        onChange={handleChange}
                    />

                    <Input
                        type="number"
                        name="stock"
                        label='Stock'
                        defaultValue={values.stock}
                        onChange={handleChange}
                    />

                    <Textarea
                        name="description"
                        label='Descripcion'
                        maxLength={300}
                        defaultValue={values.description}
                        onChange={handleChange}
                    />



                    <div className="flex gap-2 flex-col">
                        <input
                            type="file"
                            name="imgs"
                            id="input_imgs"
                            multiple
                            accept="image/*"
                            className="hover:bg-content3 p-1 rounded-lg cursor-pointer"
                            onChange={handleFiles}
                        />

                        <ErrorBoundary>
                            <PreviewOfImgs />
                        </ErrorBoundary>
                    </div>

                    <div className="flex max-sm:flex-col gap-2 justify-center">
                        <Button type="submit" isDisabled={loading}>
                            Actualizar
                        </Button>

                        <Button type="reset" isDisabled={loading} >
                            Cancelar
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default EditProduct;
