
import { Button } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";

import StatsProducts from "./components/StatsProducts";
import StatsClients from "./components/StatsClients";



function Stats() {

    // Adquisición de clientes:
    // Nuevos clientes: 500
    // Clientes recurrentes: 700
    // Tasa de retención de clientes: 70%
    // Análisis de inventario:
    // Ratio de rotación de inventario: 5 veces
    // Ocurrencias de desabastecimiento: 2
    // Artículos de movimiento lento: Producto D, Producto E




    const panel_content_className = "flex gap-2 flex-wrap justify-center"
    const panel_tabs = [
        {
            key: "products",
            label: "Productos",
            content: <StatsProducts
                panel_content_className={panel_content_className}
            />
        },
        {
            key: "clients",
            label: "Clientes",
            content: <StatsClients
                panel_content_className={panel_content_className}
            />
        },
        {
            key: "tickets",
            label: "Tickets",
            content: <div className={panel_content_className}>
                <Button>
                    Mas grandes
                </Button>

            </div>
        },
        {
            key: "sells",
            label: "Ventas",
            content: <div className={panel_content_className}>
                <Button>
                    Frecuencia
                </Button>

                <Button>
                    Horarias
                </Button>

                <Button>
                    Mensuales
                </Button>

                <Button>
                    Anuales
                </Button>
            </div>
        },
    ]


    return (
        <section className="flex flex-col gap-4 items-center" >
            {/* <Button onClick={() => console.log(data)}>
                data
            </Button> */}

            <Tabs
                aria-label="panel de opciones"
                variant="bordered"
                className="dark mt-4"
                classNames={{
                    base: "justify-center",
                    tabList: "flex-wrap justify-center",
                    tab: "w-auto",
                    panel: "max-w-screen"
                }}
            >
                {panel_tabs.map(tab =>
                    <Tab key={tab.key} title={tab.label}>
                        {tab.content}
                    </Tab>
                )}
            </Tabs>

        </section>
    );
}

export default Stats;
