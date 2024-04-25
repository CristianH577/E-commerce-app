
import { useState } from "react";

import { getFAPI, postFAPI } from "../../libs/fastapi";

import { Button, Image, Input, Textarea } from "@nextui-org/react";
// import { Select, SelectItem } from "@nextui-org/react";

import { Form, Formik } from "formik";


function AddProduct() {

    // const color_list = ["rojo", "azul", "blanco", "negro", "amarillo"]
    // const sizes_list = ["sm", "md", "lg", "xl", "+xl"]

    const [imgs, setImgs] = useState(false)
    const [imgsPrev, setImgsPrev] = useState(false)
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e) => {
        setLoading(true)
        const response = await postFAPI('/products/add', e)

        if (response.bool) {
            if (imgs) {
                const form_data = new FormData()

                form_data.append('id', response.value)

                for (let i = 0; i < imgs.length; i++) {
                    form_data.append("imgs", imgs[i])
                }

                await postFAPI('/products/addImgs', form_data)
            }

            handleReset()
        }
        setLoading(false)
    }

    const handleFiles = (e) => {
        if (e.target.files.length === 0) return false

        if (e.target.files.length > 6) {
            alert("Maximo 6 archivos")
            document.querySelector('#input_imgs').value = ''
            return false
        }

        const new_preview = []
        for (const file of e.target.files) {
            if (file.type && !file.type.startsWith('image/')) {
                alert("Solo se permiten imagenes")
                document.querySelector('#input_imgs').value = ''
                return false
            }

            const reader = new FileReader()
            reader.onload = function (e) {
                new_preview.push(e.target.result)
            }
            reader.readAsDataURL(file)
        }

        setImgs(e.target.files)

        setImgsPrev(false)
        setTimeout(() => {
            setImgsPrev(new_preview)
        }, 300)
    }

    const handleReset = () => {
        setImgs(false)
        setImgsPrev(false)
        document.querySelector('#form_add_product').reset()
        document.querySelector('#input_imgs').value = ''
        setLoading(false)
    }

    const addExamples = async () => {
        setLoading(true)
        await getFAPI('/products/addExamples')
        setLoading(false)
    }



    return (
        <Formik
            initialValues={{
                name_product: '',
                category_product: '',
                price: 0,
                stock: 0,
                description: '',
                // colors: '',
                // sizes: '',
            }}
            onSubmit={values => handleSubmit(values)}
            onReset={handleReset}
        >
            {({ handleChange }) => (
                <Form className="flex flex-col gap-4 max-w-80" id='form_add_product' >
                    <Input
                        name="name_product"
                        label='Nombre'
                        maxLength={50}
                        onChange={handleChange}
                    />

                    <Input
                        name="category_product"
                        label='Categoria'
                        onChange={handleChange}
                    />

                    <Input
                        type="number"
                        name="price"
                        label='Precio'
                        startContent="$"
                        onChange={handleChange}
                    />

                    <Input
                        type="number"
                        name="stock"
                        label='Stock'
                        onChange={handleChange}
                    />

                    <Textarea
                        name="description"
                        label='Descripcion'
                        maxLength={300}
                        onChange={handleChange}
                    />

                    <input
                        type="file"
                        name="imgs"
                        id="input_imgs"
                        multiple
                        accept="image/*"
                        className="hover:bg-content3 p-2 rounded-lg cursor-pointer max-w-[100vw]"
                        onChange={handleFiles}
                    />

                    {imgsPrev && (
                        <div className="flex gap-2 flex-wrap justify-center">
                            {imgsPrev.map((img, i) =>
                                <Image
                                    key={img}
                                    src={img}
                                    alt={"Vista previa de la imagen " + (i + 1)}
                                    className="w-32 h-32"
                                />
                            )}
                        </div>
                    )}

                    {/* 
                    <Select
                        name="colors"
                        label='Colores'
                        selectionMode="multiple"
                        onChange={handleChange}
                    >
                        {color_list.map(e =>
                            <SelectItem key={e} value={e} className="capitalize">
                                {e}
                            </SelectItem>
                        )}
                    </Select>

                    <Select
                        name="sizes"
                        label='Tamaños'
                        selectionMode="multiple"
                        onChange={handleChange}
                    >
                        {sizes_list.map(e =>
                            <SelectItem key={e} value={e} className="capitalize">
                                {e}
                            </SelectItem>
                        )}
                    </Select> */}

                    <Button type="submit" isLoading={loading}>
                        Agregar
                    </Button>

                    <Button type="reset" isDisabled={loading}>
                        Limpiar
                    </Button>

                    <Button onClick={addExamples} isDisabled={loading}>
                        Agregar ejemplos
                    </Button>

                </Form>
            )}
        </Formik>
    );
}

export default AddProduct;
