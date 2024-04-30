import { useEffect, useState } from "react";

import { deleteFAPI, getFAPI, getProductsImgs } from "../../libs/fastapi";

import { Button, Image, ScrollShadow } from "@nextui-org/react";

import EditProduct from "./components/EditProduct";
import InputSearch from "../../components/InputSearch";
import TableCustom from "./components/TableCustom";
import ErrorBoundary from "../../components/ErrorBoundary";

import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

import product_unknown from '../../assets/imgs/product_unknown.svg'



function ShowProducts() {

    const columns = [
        {
            key: "actions",
            label: "",
        },
        {
            key: "img",
            label: "",
        },
        {
            key: "id_product",
            label: "ID",
        },
        {
            key: "name_product",
            label: "Nombre",
        },
        {
            key: "category_product",
            label: "Categoria",
        },
        {
            key: "price",
            label: "Precio",
        },
        {
            key: "stock",
            label: "Stock",
        },
        {
            key: "description",
            label: "Descripcion",
        },
        {
            key: "date",
            label: "Actualizacion",
        },
    ]

    const [data, setData] = useState([])
    const [rows, setRows] = useState([])
    const [rowImgs, setRowsImgs] = useState({})
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)


    const getData = async (e) => {
        setLoading(true)

        var url = 'getAll'
        if (typeof e === 'object' && e.id_product && e.id_product !== '') {
            url = 'getById/' + e.id_product
        }

        const response = await getFAPI('products/' + url)
        if (response.bool && Array.isArray(response.value)) {
            setData(response.value)
        } else {
            setData([])
        }

        setLoading(false)
    }

    const handleDelete = async id => {
        setLoading(true)
        await deleteFAPI('products/delete/' + id)
        getData()
        setLoading(false)
    }

    const renderCell = (item, key) => {
        const val = item[key] || ''
        switch (key) {
            case 'actions':
                return <div className='flex gap-2 flex-col'>
                    <Button
                        isIconOnly
                        className="bg-transparent hover:text-danger"
                        isDisabled={loading}
                        onClick={() => handleDelete(item.id_product || false)}
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
                                    document.getElementById("update_product").scrollIntoView()
                                }, 100)
                            }
                        }}
                    >
                        <CiEdit size={25} />
                    </Button>
                </div>

            case 'price':
                return <div className='min-w-12'>
                    $ {val}
                </div>

            case 'img':
                var imgs = rowImgs[item.id_product]
                if (!imgs) {
                    imgs = [{
                        name: "desconocido",
                        src: product_unknown
                    }]
                }

                return <ScrollShadow orientation="horizontal" className='max-w-[200px] max-h-[200px] flex'>
                    <div className="flex gap-2 p-2 ">
                        {imgs.map((img, i) =>
                            <Image
                                key={img.name}
                                src={img.src}
                                alt={'Imagen ' + (i + 1) + ' de ' + item.name_product}
                                className="w-full h-full object-contain"
                                classNames={{
                                    wrapper: 'w-[150px] h-[150px] bg-content1'
                                }}
                            />
                        )}
                    </div>
                </ScrollShadow>

            case 'description':
                return <ScrollShadow hideScrollBar className='max-h-[170px] min-w-52 max-w-96 border-2 rounded-lg p-1'>
                    {val}
                </ScrollShadow>

            default:
                return <div>
                    {val}
                </div>
        }
    }


    useEffect(() => {
        getProductsImgs(rows, setRowsImgs)
        // eslint-disable-next-line
    }, [rows])


    return (
        <section className="flex flex-col items-center">

            <InputSearch
                name={'id_product'}
                label={'ID Producto'}
                onSubmit={getData}
                loading={loading}
            />

            <div id="update_product" >
                {edit && (
                    <EditProduct
                        edit={edit}
                        setEdit={setEdit}
                        imgs_current={rowImgs[edit.id_product] || []}
                        handleEndEdit={getData}
                        loading={loading}
                        setLoading={setLoading}
                    />
                )}
            </div>

            <ErrorBoundary>
                <TableCustom
                    label={'productos'}
                    data={data}
                    columns={columns}
                    rows={rows}
                    setRows={setRows}
                    id_row={'id_product'}
                    renderCell={renderCell}
                    loading={loading}
                />
            </ErrorBoundary>

        </section>
    );
}

export default ShowProducts;
