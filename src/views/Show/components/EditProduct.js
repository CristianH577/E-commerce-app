import { useState } from "react";

import { putFAPI } from "../../../libs/fastapi";

import { Button, Input, Textarea, Image } from "@nextui-org/react";

import { Form, Formik } from "formik";


function EditProduct({ product, setProduct, loading, setLoading, imgs_current, handleEndEdit }) {

    const [imgs, setImgs] = useState([])
    const [newImgs, setNewImgs] = useState(false)
    const [currentImgs, setCurrentImgs] = useState(imgs_current)
    const [toDeleteImgs, setToDeleteImgs] = useState([])


    const handleFiles = (e) => {
        if (e.target.files.length === 0) {
            handleCleanInput()
            return false
        }

        const current_length = currentImgs ? currentImgs.length : 0
        if ((e.target.files.length + current_length) > 6) {
            alert("Maximo 6 archivos")
            handleCleanInput()
            return false
        }

        const new_imgs = []
        for (const file of e.target.files) {
            if (file.type && !file.type.startsWith('image/')) {
                alert("Solo se permiten imagenes")
                handleCleanInput()
                return false
            }

            const reader = new FileReader()
            reader.onload = function (e) {
                new_imgs.push({
                    name: file.name,
                    src: e.target.result
                })
            }
            reader.readAsDataURL(file)
        }

        setImgs(e.target.files)

        setNewImgs(false)
        setTimeout(() => {
            setNewImgs(new_imgs)
        }, 300)
    }

    const handleDeleteCurrentImg = name => {
        const new_current = currentImgs.filter(e => e.name !== name)
        toDeleteImgs.push(name)
        setCurrentImgs(new_current)
    }

    const handleCleanInput = () => {
        setImgs(false)
        setNewImgs(false)
        document.querySelector('#input_imgs').value = ''
    }
    const handleClean = () => {
        handleCleanInput()
        setCurrentImgs(false)
        setToDeleteImgs([])
        document.querySelector('#form_update_product').reset()

        setProduct && setProduct(false)
        setLoading && setLoading(false)

        if (window.location.hash) window.location.hash = ""
    }

    const handleUpdate = async e => {
        setLoading && setLoading(true)

        var equal = true
        for (const k of Object.keys(e)) {
            if (e[k] !== product[k]) {
                equal = false
                break
            }
        }

        if (!equal) await putFAPI('products/update', e)

        if (imgs.length || toDeleteImgs.length) {
            const form_data = new FormData()

            form_data.append('id', product.id_product)

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
    }


    return (
        <Formik
            initialValues={{ ...product }}
            onSubmit={values => handleUpdate(values)}
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
                        {(!currentImgs || currentImgs.length < 6) && (
                            <input
                                type="file"
                                name="imgs"
                                id="input_imgs"
                                multiple
                                accept="image/*"
                                className="hover:bg-content3 p-1 rounded-lg cursor-pointer"
                                onChange={handleFiles}
                            />
                        )}

                        {(currentImgs || newImgs) && (
                            <div className="flex gap-2 flex-wrap justify-center ">
                                {currentImgs && currentImgs.map(img =>
                                    <div key={img.name} className="flex flex-col justify-center items-center gap-2 relative">
                                        <Image
                                            src={img.src}
                                            className="w-32 h-32 object-cover"
                                        />

                                        <Button color="danger" size="sm" className="absolute bottom-1 z-10" onClick={() => handleDeleteCurrentImg(img.name)}>
                                            Borrar
                                        </Button>
                                    </div>
                                )}

                                {newImgs && newImgs.map(img =>
                                    <div key={img.name} className="flex flex-col justify-center items-center gap-2">
                                        <Image
                                            src={img.src}
                                            className="w-32 h-32 object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
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
