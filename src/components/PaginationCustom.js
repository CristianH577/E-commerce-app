
import { useEffect, useMemo, useState } from "react"

import { Pagination } from "@nextui-org/react"


function PaginationCustom({ data, setRows, className, sort }) {
    const [page, setPage] = useState(1)

    const rows_per_page = 10
    const pages = Math.ceil(data.length / rows_per_page)


    useMemo(() => {
        const start = (page - 1) * rows_per_page || 0
        const end = start + rows_per_page

        var data_sorted = data

        if (sort) {
            data_sorted = data.sort((a, b) => {
                let first = a[sort.column];
                let second = b[sort.column];
                let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

                if (sort.direction === "descending") {
                    cmp *= -1;
                }

                return cmp;
            })
        }

        var new_rows = []
        if (Array.isArray(data_sorted)) {
            new_rows = data_sorted.slice(start, end)
        }
        setRows && setRows(new_rows)
        // eslint-disable-next-line
    }, [page, data, sort])


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
