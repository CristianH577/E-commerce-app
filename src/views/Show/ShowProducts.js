import { useEffect, useState } from "react";

import { deleteFAPI, getFAPI, imgFAPI, postFAPI } from "../../libs/fastapi";

import { Button, Image, Input, Link, ScrollShadow, Spinner } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

import { Form, Formik } from "formik";

import EditProduct from "./components/EditProduct";

import { IoSearch } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

import product_unknown from '../../assets/imgs/product_unknown.svg'
import PaginationCustom from "../../components/PaginationCustom";



function ShowProducts() {

    const columns = [
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
        {
            key: "actions",
            label: "",
        },
    ]
    const cells_className = {
        '': '',
        actions: 'flex gap-2 max-lg:flex-col',
        price: 'min-w-12',
        img: 'grid grid-cols-2 gap-2 min-w-16 justify-center max-w-[200px]',
        description: 'max-h-24 min-w-52 max-w-96',
    }

    const [data, setData] = useState([])
    const [rows, setRows] = useState([])
    const [rowImgs, setRowsImgs] = useState({})
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)


    const getById = async (e) => {
        setLoading(true)
        if (e.id_product && e.id_product !== '') {
            const response = await getFAPI('products/getById/' + e.id_product)
            if (response.bool) {
                if (response.value) {
                    setData([response.value])
                } else {
                    setData([])
                }
            }
        }
        setLoading(false)
    }

    const getAll = async () => {
        setLoading(true)
        const response = await getFAPI('products/getAll')
        if (response.bool) setData(response.value)
        setLoading(false)
    }

    const getImgs = async () => {
        if (rows.length > 0) {
            const form_data = new FormData()
            rows.forEach(e => {
                form_data.append('ids', e.id_product)
            })

            const response = await postFAPI('products/getListImgs', form_data)

            if (response.bool) {
                const new_rowImgs = {}
                for (const id in response.value) {
                    const list = response.value[id]

                    new_rowImgs[id] = []

                    await Promise.all(
                        list.map(async name => {
                            const src = await imgFAPI(`products/getImgByName/${id}/${name}`)
                            new_rowImgs[id].push({
                                name: name,
                                src: src.value
                            })
                        })
                    )
                }

                setRowsImgs(new_rowImgs)
            }
        }
    }

    const handleDelete = async id => {
        setLoading(true)
        await deleteFAPI('products/delete/' + id)
        getAll()
        setLoading(false)
    }

    const renderCell = (item, columnKey) => {
        switch (columnKey) {
            case 'actions':
                return <div className={cells_className.actions}>
                    <Button
                        isIconOnly
                        className="bg-transparent hover:text-danger"
                        isDisabled={loading}
                        onClick={() => handleDelete(item.id_product)}
                    >
                        <MdDeleteOutline size={25} />
                    </Button>

                    <Button
                        isIconOnly
                        className="bg-transparent hover:text-primary "
                        href="#update_product"
                        as={Link}
                        onClick={() => {
                            if (!loading) {
                                setEdit(false)

                                setTimeout(() => {
                                    setEdit(item)
                                }, 300)
                            }
                        }}
                    >
                        <CiEdit size={25} />
                    </Button>
                </div>
            case 'price':
                return <div className={cells_className.price}>
                    $ {item.price}
                </div>
            case 'img':
                var img = product_unknown
                const imgs = rowImgs[item.id_product]
                if (imgs) {
                    if (imgs.length === 1) {
                        img = imgs[0].src
                    } else {
                        img = false
                    }
                }

                return <div className={cells_className.img}>
                    {img
                        ? <span className="col-span-2">
                            <Image
                                src={img}
                                alt={'Imagen de ' + item.name_product}
                                radius="none"
                                removeWrapper
                                className="w-full h-full object-cover"
                            />
                        </span>
                        : imgs.map((img, i) =>
                            <span key={img.name} className="col-span-1">
                                <Image
                                    src={img.src}
                                    alt={'Imagen ' + (i + 1) + ' de ' + item.name_product}
                                    radius="none"
                                    removeWrapper
                                    className="w-full h-full object-cover"
                                />
                            </span>
                        )
                    }
                </div>
            case 'description':
                return <ScrollShadow hideScrollBar className={cells_className.description}>
                    {item.description}
                </ScrollShadow>


            default:
                return <div className={cells_className['']}>
                    {item[columnKey]}
                </div>
        }
    }



    useEffect(() => {
        getImgs()
        // eslint-disable-next-line
    }, [rows])



    return (
        <section className="flex flex-col items-center">

            <div className="flex gap-4 items-center justify-center max-sm:flex-col" >
                <Formik
                    initialValues={{
                        id_product: false,
                    }}
                    onSubmit={values => getById(values)}
                >
                    {({ handleChange }) => (
                        <Form className="flex gap-4 items-center" >
                            <Input
                                type='number'
                                name="id_product"
                                label='ID Producto'
                                size="sm"
                                className="w-40"
                                endContent={
                                    <button type="submit" className="hover:text-warning" disabled={loading}>
                                        <IoSearch size={28} />
                                    </button>
                                }
                                onChange={handleChange}
                            />
                        </Form>
                    )}
                </Formik>

                <Button onClick={getAll} isDisabled={loading}>
                    Todos los productos
                </Button>
            </div>


            <div id="update_product">
                {edit && (
                    <EditProduct
                        product={edit}
                        setProduct={setEdit}
                        imgs_current={rowImgs[edit.id_product]}
                        handleEndEdit={getAll}
                        loading={loading}
                        setLoading={setLoading}
                    />
                )}
            </div>


            {loading
                ? <Spinner className="mt-8" />
                :
                <Table
                    aria-label="Tabla de productos"
                    className="mt-8 max-w-[95vw]"
                    selectionMode="single"
                    topContent={<p className="text-neutral-500">Total: {data.length} productos</p>}
                    bottomContent={
                        <PaginationCustom
                            data={data}
                            setRows={setRows}
                            className={"flex justify-center mt-4 w-fit sm:w-full"}
                        />
                    }
                >
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>

                    <TableBody
                        items={rows}
                        emptyContent={"Sin resultados"}
                        isLoading={loading}
                        loadingContent={<Spinner label="Loading..." />}
                    >
                        {rows.map(row =>
                            <TableRow key={row.id_product}>
                                {columns.map(col =>
                                    <TableCell key={`${row.id_product}_${col.key}`}>
                                        {renderCell(row, col.key)}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            }


        </section>
    );
}

export default ShowProducts;
