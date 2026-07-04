import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardFooter,
  Col,
  Row,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LuSearch } from "react-icons/lu";
import { TbPlus } from "react-icons/tb";

import DataTable from "@/components/table/DataTable";
import TablePagination from "@/components/table/TablePagination";

const columnHelper = createColumnHelper();

const DashbordAssetsList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });
  const [selectedRowIds, setSelectedRowIds] = useState({});

  const API_BASE = "http://localhost/ASSET-API";

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(`${API_BASE}/asset/all`);
        const assetList = response.data.status ? response.data.data : [];

        // No image fetching — clean version
        setAssets(assetList);
      } catch (error) {
        console.error("Error fetching assets:", error);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const columns = [
    {
      id: "select",
      maxSize: 45,
      size: 45,
      header: ({ table }) => (
        <input
          type="checkbox"
          className="form-check-input"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="form-check-input"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },

    // ✨ Removed asset_image column entirely

    columnHelper.accessor("asset_name", { header: "Asset Name" }),
    columnHelper.accessor("asset_id", { header: "Asset ID" }),
    columnHelper.accessor("model", { header: "Model" }),
    columnHelper.accessor("type", { header: "Type" }),
    columnHelper.accessor("location", { header: "Location" }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`badge ${
            row.original.status === "active"
              ? "badge-soft-success"
              : "badge-soft-warning"
          } fs-xxs`}
        >
          {row.original.status}
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: assets,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
      pagination,
      rowSelection: selectedRowIds,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setSelectedRowIds,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnFilters: true,
    enableRowSelection: true,
    globalFilterFn: "includesString",
  });

  const totalItems = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalItems);

  return (
    <Row>
      <Col xs={12}>
        <Card className="mb-4">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <div className="app-search">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search reports..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <LuSearch className="app-search-icon text-muted" />
              </div>
            </div>

            {/* <Link to="/add-asset">
              <Button size="sm" variant="primary">
                <TbPlus className="me-1" /> 
              </Button>
            </Link> */}
          </CardHeader>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {/* <DataTable table={table} emptyMessage="No assets found" /> */}

              {table.getRowModel().rows.length > 0 && (
                <CardFooter className="border-0">
                  <TablePagination
                    totalItems={totalItems}
                    start={start}
                    end={end}
                    itemsName="assets"
                    showInfo
                    previousPage={table.previousPage}
                    canPreviousPage={table.getCanPreviousPage()}
                    pageCount={table.getPageCount()}
                    pageIndex={pageIndex}
                    setPageIndex={table.setPageIndex}
                    nextPage={table.nextPage}
                    canNextPage={table.getCanNextPage()}
                  />
                </CardFooter>
              )}
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default DashbordAssetsList;
