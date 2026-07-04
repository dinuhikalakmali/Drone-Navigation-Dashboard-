import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardFooter,
  Col,
  Row,
  Button,
  Spinner,
  Modal,
  Form,
  FormGroup,
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
import {
  TbEye,
  TbTrash,
  TbPlus,
  TbLayoutGrid,
  TbList,
  TbEdit,
} from "react-icons/tb";

import DataTable from "@/components/table/DataTable";
import TablePagination from "@/components/table/TablePagination";
import DeleteConfirmationModal from "@/components/table/DeleteConfirmationModal";
import { assetTypes } from "../../defects/components/AssetInformation";

const columnHelper = createColumnHelper();

const AssetsList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAssetData, setEditAssetData] = useState({});

  const navigate = useNavigate();

  const API_BASE = "http://localhost/ASSET-API";

  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);
  const toggleEditModal = () => setShowEditModal(!showEditModal);

  // Fetch all assets (WITHOUT IMAGE REQUEST)
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(`${API_BASE}/asset/all`);
        const assetList = response.data.status ? response.data.data : [];

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

  // View
  const handleViewClick = (row) => {
    navigate(`/asset/view/${row.original.asset_id}`);
  };

  // Delete selected assets
  const handleDelete = async () => {
    const selectedIds = Object.keys(selectedRowIds);
    try {
      await Promise.all(
        selectedIds.map((rowId) => {
          const asset = assets[rowId];
          return axios.post(`${API_BASE}/asset/delete/${asset.asset_id}`);
        })
      );
      setAssets((old) =>
        old.filter((_, idx) => !selectedIds.includes(idx.toString()))
      );
      setSelectedRowIds({});
      setPagination({ ...pagination, pageIndex: 0 });
      toggleDeleteModal();
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  // Edit click
  const handleEditClick = (row) => {
    setEditAssetData(row.original);
    toggleEditModal();
  };

  // Save edited asset
  const handleEditSave = async () => {
    try {
      await axios.post(
        `${API_BASE}/asset/update/${editAssetData.asset_id}`,
        editAssetData
      );
      setAssets((old) =>
        old.map((item) =>
          item.asset_id === editAssetData.asset_id ? editAssetData : item
        )
      );
      toggleEditModal();
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  // Table columns (IMAGE COLUMN REMOVED)
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

    // ✔ Asset Image Column Removed Completely

    columnHelper.accessor("site_id", { header: "Site ID" }),
    columnHelper.accessor("site_name", { header: "Site Name" }),
    columnHelper.accessor("drone_model", { header: "Drone Model" }),
    columnHelper.accessor("defect_type", { header: "Defect Type" }),
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

    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="d-flex gap-1">
          <Button
            variant="default"
            size="sm"
            className="btn-icon"
            onClick={() => handleViewClick(row)}
          >
            <TbEye className="fs-lg" />
          </Button>
          <Button
            variant="default"
            size="sm"
            className="btn-icon"
            onClick={() => handleEditClick(row)}
          >
            <TbEdit className="fs-lg" />
          </Button>
          <Button
            variant="default"
            size="sm"
            className="btn-icon"
            onClick={() => {
              toggleDeleteModal();
              setSelectedRowIds({ [row.id]: true });
            }}
          >
            <TbTrash className="fs-lg text-danger" />
          </Button>
        </div>
      ),
    },
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
                  placeholder="Search Reports..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>

              {Object.keys(selectedRowIds).length > 0 && (
                <Button variant="danger" size="sm" onClick={toggleDeleteModal}>
                  Delete
                </Button>
              )}

              <div className="d-flex gap-1">
                <Link to="/asset-grid">
                  <Button
                    variant="outline-primary"
                    className="btn-icon btn-soft-primary"
                  >
                    <TbLayoutGrid className="fs-lg" />
                  </Button>
                </Link>
                <Button variant="primary" className="btn-icon">
                  <TbList className="fs-lg" />
                </Button>
                <Link to="/add-asset">
                  <Button variant="danger" className="ms-1">
                    <TbPlus className="fs-sm me-2" /> Add New Report
                  </Button>
                </Link>
              </div>
            </div>

            <div className="d-flex gap-2">
              <div className="app-search">
                <select
                  className="form-select"
                  value={table.getColumn("type")?.getFilterValue() ?? "All"}
                  onChange={(e) =>
                    table
                      .getColumn("type")
                      ?.setFilterValue(
                        e.target.value === "All" ? undefined : e.target.value
                      )
                  }
                >
                  <option value="All">Type</option>
                  {assetTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="app-search">
                <select
                  className="form-select"
                  value={table.getColumn("status")?.getFilterValue() ?? "All"}
                  onChange={(e) =>
                    table
                      .getColumn("status")
                      ?.setFilterValue(
                        e.target.value === "All" ? undefined : e.target.value
                      )
                  }
                >
                  <option value="All">Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <select
                  className="form-select"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                >
                  {[5, 8, 10, 15, 20].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <DataTable table={table} emptyMessage="No reports found" />

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

          <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={toggleDeleteModal}
            onConfirm={handleDelete}
            selectedCount={Object.keys(selectedRowIds).length}
            itemName="asset"
          />
        </Card>
      </Col>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={toggleEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Asset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Asset Name</Form.Label>
              <Form.Control
                type="text"
                value={editAssetData.asset_name || ""}
                onChange={(e) =>
                  setEditAssetData({
                    ...editAssetData,
                    asset_name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                value={editAssetData.model || ""}
                onChange={(e) =>
                  setEditAssetData({ ...editAssetData, model: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={editAssetData.type || ""}
                onChange={(e) =>
                  setEditAssetData({ ...editAssetData, type: e.target.value })
                }
              />
            </Form.Group>
            <FormGroup className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editAssetData.location || ""}
                onChange={(e) =>
                  setEditAssetData({
                    ...editAssetData,
                    location: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label>Vendor</Form.Label>
              <Form.Control
                type="text"
                value={editAssetData.vender || ""}
                onChange={(e) =>
                  setEditAssetData({
                    ...editAssetData,
                    vender: e.target.value,
                  })
                }
              />
            </FormGroup>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editAssetData.status || "active"}
                onChange={(e) =>
                  setEditAssetData({ ...editAssetData, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default AssetsList;
