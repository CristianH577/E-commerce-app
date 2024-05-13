import { useState } from "react";
import { getFAPI } from "../../libs/fastapi";

import { Button } from "@nextui-org/react";

import TableCustom from "./components/TableCustom";
import ErrorBoundary from "../../components/ErrorBoundary";

// import { MdDeleteOutline } from "react-icons/md";
import { IoSearch } from "react-icons/io5";



function ShowHistory() {

    const columns = [
        // {
        //     key: "actions",
        //     label: "",
        // },
        {
            key: "id_history",
            label: "ID",
        },
        {
            key: "table_name",
            label: "Tabla",
        },
        {
            key: "action",
            label: "Accion",
        },
        {
            key: "data_element",
            label: "Data",
        },
        {
            key: "date",
            label: "Fecha de accion",
        },
    ]

    const labels = {
        products: 'Productos',
        clients: 'Clientes',
        update: 'Actualizacion',
        delete: 'Eliminacion',
    }

    const [data, setData] = useState([])
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)


    const getData = async () => {
        setLoading(true)

        const response = await getFAPI('history/getAll')
        if (response.bool && Array.isArray(response.value)) {
            setData(response.value)
        } else {
            setData([])
        }

        setLoading(false)
    }

    // const handleDelete = async id => {
    //     setLoading(true)
    //     await deleteFAPI('history/delete/' + id)
    //     getData()
    //     setLoading(false)
    // }


    const renderCell = (item, key) => {
        const val = item[key] || ''
        switch (key) {
            // case 'actions':
            //     return <div className="flex gap-2 max-sm:flex-col">
            //         <Button
            //             isIconOnly
            //             className="bg-transparent hover:text-danger"
            //             isDisabled={loading}
            //         // onClick={() => handleDelete(item.id_client || false)}
            //         >
            //             <MdDeleteOutline size={25} />
            //         </Button>
            //     </div>

            case 'table_name':
            case 'action':
                return labels[val] || val

            case 'data_element':
                return <div className="min-w-52 ">
                    {val}
                </div>
            case 'date':
                return <div className="min-w-36 ">
                    {val}
                </div>

            default:
                return val
        }
    }



    return (
        <div className="flex flex-col items-center">

            <Button
                isIconOnly
                isLoading={loading}
                onClick={getData}
            >
                <IoSearch size={28} />
            </Button>

            <ErrorBoundary>
                <TableCustom
                    label={'registros'}
                    data={data}
                    columns={columns}
                    rows={rows}
                    setRows={setRows}
                    id_row={'id_history'}
                    renderCell={renderCell}
                    loading={loading}
                />
            </ErrorBoundary>

        </div >
    );
}

export default ShowHistory;
