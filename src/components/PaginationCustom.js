
import { useEffect, useMemo, useState } from "react"

import { Pagination } from "@nextui-org/react"


function PaginationCustom({ data, setRows, className }) {
    const [page, setPage] = useState(1)

    const rows_per_page = 10
    const pages = Math.ceil(data.length / rows_per_page)

    useMemo(() => {
        const start = (page - 1) * rows_per_page || 0
        const end = start + rows_per_page

        if (Array.isArray(data)) {
            setRows(data.slice(start, end))
        } else {
            setRows([])
        }
        // eslint-disable-next-line
    }, [page, data])


    useEffect(() => {
        setPage(1)
    }, [data])


    return (
        data.length > rows_per_page && (
            <div className={className}>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    page={page}
                    total={pages}
                    onChange={(page) => {
                        setPage(page)
                        window.scrollTo(0, 0)
                    }}
                />
            </div>
        )
    );
}

export default PaginationCustom;
