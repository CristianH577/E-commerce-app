import { useState } from "react";
import { deleteFAPI, getFAPI } from "../../libs/fastapi";

import { Button } from "@nextui-org/react";

import InputSearch from "../../components/InputSearch";
import TableCustom from "./components/TableCustom";
import ErrorBoundary from "../../components/ErrorBoundary";

import unit_values from '../../assets/files/unit_values.json'


function ShowSells() {
    const columns = [
        {
            key: "id_ticket",
            label: "ID Ticket",
        },
        {
            key: "id_product",
            label: "ID Producto",
        },
        {
            key: "category_product",
            label: "Categoria",
        },
        {
            key: "name_product",
            label: "Producto",
        },
        {
            key: "quantity",
            label: "Cantidad",
        },
    ]


    const [data, setData] = useState([])
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)


    const getData = async (e) => {
        setLoading(true)

        var url = 'getAll'
        if (typeof e === 'object' && e.id_product && e.id_product !== '') {
            url = 'getById/' + e.id_product
        }

        const response = await getFAPI('sells/' + url)
        if (response.bool && Array.isArray(response.value)) {
            setData(response.value)
        } else {
            setData([])
        }

        setLoading(false)
    }

    const cleanUnknownSells = async () => {
        setLoading(true)
        await deleteFAPI('sells/cleanUnknownSells')
        await getData()
        setLoading(false)
    }
    const renderCell = (item, key) => {
        const val = item[key] || ''
        switch (key) {
            case 'quantity':
                const rule = unit_values[item.category_product] || unit_values.default
                var quantity = (item.quantity * rule.quantity_value)
                if (quantity % 1 !== 0) quantity = quantity.toFixed(1)
                const unit = rule.unit

                return <p>
                    {quantity + unit}
                </p>

            default:
                return <p>
                    {val}
                </p>
        }

    }



    return (
        <section className="flex flex-col items-center ">

            <InputSearch
                name={'id_product'}
                label={'ID Producto'}
                onSubmit={getData}
                loading={loading}
            />

            <div className="flex gap-4 items-center justify-center max-sm:flex-col mt-4" >
                <Button onClick={cleanUnknownSells} isDisabled={loading}>
                    Limpiar ventas desconocidas
                </Button>
            </div>


            <ErrorBoundary>
                <TableCustom
                    label={'ventas'}
                    data={data}
                    columns={columns}
                    rows={rows}
                    setRows={setRows}
                    id_row={'id_ticket'}
                    renderCell={renderCell}
                    loading={loading}
                />
            </ErrorBoundary>

        </section>
    );
}

export default ShowSells;
