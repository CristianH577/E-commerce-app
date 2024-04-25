
import { useState } from "react";

import { getFAPI, postFAPI } from "../../libs/fastapi";

import { Input, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";

import { Form, Formik } from "formik";



function AddClient() {
    const category_list = ["1", "2", "3"]

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        setLoading(true)
        const response = await postFAPI('/clients/add', e)
        if (response.bool) handleReset()
        setLoading(false)
    }

    const handleReset = () => {
        document.querySelector('#form_add_client').reset()
    }

    const addExamples = async () => {
        setLoading(true)
        await getFAPI('/clients/addExamples')
        setLoading(false)
    }



    return (
        <Formik
            initialValues={{
                name_client: '',
                category_client: '',
            }}
            onSubmit={values => handleSubmit(values)}
            onReset={handleReset}
        >
            {({ handleChange }) => (
                <Form className="flex flex-col gap-4" id='form_add_client' >
                    <Input
                        name="name_client"
                        label='Nombre'
                        onChange={handleChange}
                    />

                    <Select
                        name="category_client"
                        label='Categoria'
                        onChange={handleChange}
                    >
                        {category_list.map(e =>
                            <SelectItem key={e} value={e} className="capitalize">
                                {e}
                            </SelectItem>
                        )}
                    </Select>

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

export default AddClient;
