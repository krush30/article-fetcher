/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { DataTable, DataTableUnselectEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const rowsPerPage = 12;

interface Table {
  title?: string;
  place_of_origin?: string;
  artist_display?: string;
  inscriptions?: undefined;
  date_start?: number;
  date_end?: number;
}

const Fetcher = () => {
  const op = useRef<OverlayPanel>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [table, setTable] = useState<Table[]>();
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [selectedProducts, setSelectedProducts] = useState<Table[] | null>(
    null
  );
  const [selectedRows, setSelectedRows] = useState<number>(() => {
    const savedRows = localStorage.getItem("selectedRows");
    return Number(savedRows) ? Number(savedRows) : 0;
  });
  const [totalRecord, setTotalRecords] = useState<number>(0);

  useEffect(() => {
    localStorage.removeItem("selectedRows");
    localStorage.removeItem("ids");
  }, []);

  useEffect(() => {
    const FetchAPI = async (pageNumber: number) => {
      const data = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber}`
      );
      const json = await data.json();
      setTable(json.data);
      setTotalRecords(json.pagination.total);
      console.log(json.data);
      const noOfRowsSelected: number =
        (selectedRows ?? 0) - rowsPerPage * (page - 1);
      if (noOfRowsSelected > 0) {
        const data = [...json.data.slice(0, noOfRowsSelected)];
        const ids = localStorage.getItem("ids");
        const array = ids?.split(",");
        const filteredArray = data.filter(
          (item) => !array?.includes(item.id.toString())
        );
        console.log(filteredArray);
        setSelectedProducts(filteredArray);
        //DATA = [...JSON.DATA];
        //get IDs from local
        //convert it to array
        //filteredArray => data-> ids -> match -> if there exist matching ids stored in local storage
        //setSelectedProducts with filteredArray

        // setSelectedProducts(json.data?.slice(0,noOfRowsSelected) ?? [])
        console.log(json.data?.slice(0, noOfRowsSelected) ?? []);
      }
    };
    FetchAPI(page);
  }, [page, selectedRows]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page + 1);
  };

  const onRowsDeselect = (event: DataTableUnselectEvent) => {
    const id = event.data.id;
    const ids = localStorage.getItem("ids");
    if (!ids) {
      localStorage.setItem("ids", id);
    } else {
      const arr = ids.split(",");
      arr.push(id);
      localStorage.setItem("ids", arr.toString());
    }
  };

  const handleOverlay = () => {
    return (
      <div>
        <Button
          type="button"
          icon="pi pi-chevron-down"
          onClick={(e) => op.current?.toggle(e)}
        />
        <OverlayPanel ref={op}>
          <input type="text" placeholder="Submit rows.." ref={inputRef} />
          <button
            onClick={() => {
              setSelectedRows(Number(inputRef.current?.value));
              if (inputRef.current?.value)
                localStorage.setItem(
                  "selectedRows",
                  inputRef.current?.value.toString()
                );
            }}
          >
            {" "}
            Submit
          </button>
        </OverlayPanel>
      </div>
    );
  };

  return (
    <div>
      <DataTable
        value={table}
        selectionMode={"multiple"}
        selection={selectedProducts!}
        onSelectionChange={(e: any) => {
          setSelectedProducts(e.value);
        }}
        dataKey="id"
        onRowUnselect={onRowsDeselect}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column header={handleOverlay()}></Column>
        <Column field="title" header="Title" style={{ width: "25%" }}></Column>
        <Column
          field="place_of_origin"
          header="Place of Origin"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="artist_display"
          header="Artist Display"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="inscriptions"
          header="Inscriptions"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="date_start"
          header="Year start"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="date_end"
          header="Year End"
          style={{ width: "25%" }}
        ></Column>
      </DataTable>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecord}
        rowsPerPageOptions={[rowsPerPage]}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Fetcher;
