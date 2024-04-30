import React from 'react';
import { useEffect, useState } from "react";
import { getFAPI } from '../../libs/fastapi';

import { Button, Spinner } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";

import StatTabContent from './components/StatTabContent';
import ErrorBoundary from "../../components/ErrorBoundary";



function Stats() {
    // Adquisición de clientes:
    // Nuevos clientes: 500
    // Clientes recurrentes: 700
    // Tasa de retención de clientes: 70%
    // Análisis de inventario:
    // Ratio de rotación de inventario: 5 veces
    // Ocurrencias de desabastecimiento: 2
    // Artículos de movimiento lento: Producto D, Producto E

    const [urlArray, setUrlArray] = useState([])
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState({})


    const main = {
        key: 'main',
        level: 0,
        tabsAriaLabel: "panel principal de opciones",
        tabs: [
            {
                key: "products",
                label: "Productos",
                level: 1,
                tabsAriaLabel: "opciones de productos",
                tabs: [
                    {
                        key: "all",
                        label: "Todos",
                        level: 2,
                        tabsAriaLabel: "opciones de productos: todos",
                        tabs: [
                            {
                                key: "tops",
                                label: "Tops",
                                content: content?.products?.all?.tops
                            },
                            {
                                key: "means",
                                label: "Promedios",
                                content: content?.products?.all?.means
                            },
                        ],
                    },
                    {
                        key: "category",
                        label: "Categoria",
                        level: 2,
                        tabsAriaLabel: "opciones de productos: categoria",
                        tabs: [
                            {
                                key: "tops",
                                label: "Tops",
                                content: content?.products?.category?.tops
                            },
                            {
                                key: "means",
                                label: "Promedios",
                                content: content?.products?.category?.means
                            },
                        ],
                    },
                ],
            },
            {
                key: "clients",
                label: "Clientes",
                level: 1,
                tabsAriaLabel: "opciones de clientes",
                tabs: [
                    {
                        key: "all",
                        label: "Todos",
                        level: 2,
                        tabsAriaLabel: "opciones de clientes: todos",
                        tabs: [
                            {
                                key: "tops",
                                label: "Tops",
                                content: content?.clients?.all?.tops
                            },
                            {
                                key: "means",
                                label: "Promedios",
                                content: content?.clients?.all?.means
                            },
                        ],
                    },
                    {
                        key: "category",
                        label: "Categoria",
                        level: 2,
                        tabsAriaLabel: "opciones de clientes: categoria",
                        tabs: [
                            {
                                key: "tops",
                                label: "Tops",
                                content: content?.clients?.category?.tops
                            },
                            {
                                key: "means",
                                label: "Promedios",
                                content: content?.clients?.category?.means
                            },
                        ],
                    },

                ]
            },
            {
                key: "tickets",
                label: "Tickets",
                level: 1,
                tabsAriaLabel: "opciones de tickets",
                tabs: [
                    {
                        key: "tops",
                        label: "Tops",
                        content: content?.tickets?.tops
                    },
                    {
                        key: "means",
                        label: "Promedios",
                        content: content?.tickets?.means
                    },
                ],
            },
            {
                key: "sells",
                label: "Ventas",
                level: 1,
                tabsAriaLabel: "opciones de ventas",
                tabs: [
                    {
                        key: "frequency",
                        label: "Frecuencias",
                        level: 2,
                        tabsAriaLabel: "opciones de frecuencias",
                        tabs: [
                            {
                                key: "day",
                                label: "Diario",
                                content: content?.sells?.frequency?.day
                            },
                            {
                                key: "week",
                                label: "Semanal",
                                content: content?.sells?.frequency?.week
                            },
                            {
                                key: "month",
                                label: "Mensual",
                                content: content?.sells?.frequency?.month
                            },
                            {
                                key: "year",
                                label: "Anual",
                                content: content?.sells?.frequency?.year
                            },
                        ],
                    },
                ],
            },
        ]
    }

    const content_none = <p className='p-2 text-neutral-500'>Sin Contenido</p>


    const checkTabContent = tab => {
        if (tab.tabs) {
            return <Tabs
                aria-label={tab.tabsAriaLabel || "opciones de " + tab.label}
                variant="bordered"
                className="dark"
                classNames={{
                    base: "justify-center",
                    tabList: "flex-wrap justify-center",
                    tab: "w-auto",
                    panel: "max-w-screen flex flex-col items-center"
                }}
                onSelectionChange={e => {
                    const new_urlArray = [...urlArray]
                    new_urlArray[tab.level] = e
                    setUrlArray(new_urlArray.slice(0, tab.level + 1))
                }}
                isDisabled={loading}
            >
                {tab.tabs.map(subtab =>
                    <Tab key={subtab.key} title={subtab.label}>
                        {checkTabContent(subtab)}
                    </Tab>
                )}
            </Tabs>
        }
        else if (tab.hasOwnProperty('content')) {
            return tab.content
        }

        return content_none
    }

    const searchContent = async () => {
        setLoading(true)

        // reviso si es necesario buscar el contenido
        var have_to_search = false
        let aux = false
        for (const key of urlArray) {
            if (aux) {
                aux = aux.filter(e => e.key === key)[0]
            } else {
                aux = main.tabs.filter(e => e.key === key)[0]
            }

            if (typeof aux === 'object') {
                if (aux.hasOwnProperty('content')) {
                    have_to_search = true
                    break
                } else if (aux.hasOwnProperty('tabs')) {
                    aux = aux.tabs
                } else {
                    break
                }
            } else {
                break
            }
        }

        if (have_to_search) {
            const new_content = { ...content }

            // creo las claves necesarias en content y agrego el nuevo contenido
            let content_aux = new_content
            for (let i = 0; i < urlArray.length; i++) {
                const key = urlArray[i]

                if (i < urlArray.length - 1) {
                    if (!content_aux.hasOwnProperty(key)) content_aux[key] = {}
                } else {
                    content_aux[key] = <Spinner className='mt-4' />
                }
                content_aux = content_aux[key]
            }
            setContent(new_content)


            // busco la informacion necesaria y agrego el contenido
            const url = urlArray.join('/')
            const response = await getFAPI('stats/' + url)

            var content_end = content_none
            if (response.bool && response.value) {
                content_end = <ErrorBoundary>
                    <StatTabContent
                        data={response.value}
                        loading={loading}
                        urlArray={urlArray}
                    />
                </ErrorBoundary>
            }

            let content_end_aux = new_content
            for (let i = 0; i < urlArray.length; i++) {
                const key = urlArray[i]
                if (i === urlArray.length - 1) {
                    content_end_aux[key] = content_end
                }
                content_end_aux = content_end_aux[key]
            }

            setContent(new_content)
        }

        setLoading(false)
    }


    useEffect(() => {
        searchContent()
        // eslint-disable-next-line
    }, [urlArray])



    return (
        <section className="flex flex-col gap-4 items-center" >

            {checkTabContent(main)}

        </section>
    );
}

export default Stats;
