import { useState } from "react";
import { deleteFAPI, getFAPI, putFAPI } from "../../libs/fastapi";

import { Button, Input } from "@nextui-org/react";
import { Form, Formik } from "formik";

import InputSearch from "../../components/InputSearch";
import TableCustom from "./components/TableCustom";
import ErrorBoundary from "../../components/ErrorBoundary";

import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";



function ShowClients() {

    const columns = [
        {
            key: "actions",
            label: "",
        },
        {
            key: "id_client",
            label: "ID",
        },
        {
            key: "name_client",
            label: "Nombre",
        },
        {
            key: "category_client",
            label: "Categoria",
        },
        {
            key: "date",
            label: "Actualizacion",
        },
    ]

    const [data, setData] = useState([])
    const [rows, setRows] = useState([])
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)


    const getData = async (e) => {
        setLoading(true)

        var url = 'getAll'
        if (typeof e === 'object' && e.id_client && e.id_client !== '') {
            url = 'getById/' + e.id_client
        }

        const response = await getFAPI('clients/' + url)
        console.log(response)
        if (response.bool && Array.isArray(response.value)) {
            setData(response.value)
        } else {
            setData([])
        }

        setLoading(false)
    }

    const handleDelete = async id => {
        setLoading(true)
        await deleteFAPI('clients/delete/' + id)
        getData()
        setLoading(false)
    }

    const handleUpdate = async e => {
        setLoading(true)
        var equal = true
        for (const k of Object.keys(e)) {
            if (e[k] !== edit[k]) {
                equal = false
                break
            }
        }

        if (!equal) {
            const response = await putFAPI('clients/update', e)
            if (response.bool) getData()
        }

        handleClean()
        setLoading(false)
    }

    const handleClean = () => {
        document.querySelector('#form_update_client').reset()
        setEdit(false)

        if (window.location.hash) window.location.hash = ""
    }

    const renderCell = (item, key) => {
        const val = item[key] || ''
        switch (key) {
            case 'actions':
                return <div className="flex gap-2 max-sm:flex-col">
                    <Button
                        isIconOnly
                        className="bg-transparent hover:text-danger"
                        isDisabled={loading}
                        onClick={() => handleDelete(item.id_client || false)}
                    >
                        <MdDeleteOutline size={25} />
                    </Button>

                    <Button
                        isIconOnly
                        className="bg-transparent hover:text-primary "
                        onClick={() => {
                            if (!loading) {
                                setEdit(false)

                                setTimeout(() => {
                                    setEdit(item)
                                    document.getElementById("update_client").scrollIntoView()
                                }, 300)
                            }
                        }}
                    >
                        <CiEdit size={25} />
                    </Button>
                </div>
            case 'date':
                return <div className="min-w-36 ">
                    {val}
                </div>

            default:
                return <div>
                    {val}
                </div>
        }
    }



    return (
        <div className="flex flex-col items-center">
            
            <InputSearch
                name={'id_client'}
                label={'ID Cliente'}
                onSubmit={getData}
                loading={loading}
            />


            <div id="update_client">
                {edit && (
                    <Formik
                        initialValues={{ ...edit }}
                        onSubmit={handleUpdate}
                        onReset={handleClean}
                    >
                        {({ handleChange, values }) => (
                            <Form className="flex flex-col gap-4 mt-4 bg-content3 p-2 rounded-lg max-w-[95vw]" id="form_update_client">
                                <Input
                                    name="name_client"
                                    label='Nombre'
                                    defaultValue={values.name_client}
                                    onChange={handleChange}
                                />

                                <Input
                                    name="category_client"
                                    label='Categoria'
                                    defaultValue={values.category_client}
                                    onChange={handleChange}
                                />

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
                )}
            </div>


            <ErrorBoundary>
                <TableCustom
                    label={'clientes'}
                    data={data}
                    columns={columns}
                    rows={rows}
                    setRows={setRows}
                    id_row={'id_client'}
                    renderCell={renderCell}
                    loading={loading}
                />
            </ErrorBoundary>

        </div >
    );
}

export default ShowClients;
