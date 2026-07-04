import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { TbPencil, TbPlus, TbList } from "react-icons/tb";
import AssetDisplay, { AssetDisplayTable } from "./AssetDisplay";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import EditAssetModal from "./EditAssetModal";
import MaintenanceModal from "./MaintenanceModel";
import MaintenanceTableModal from "./MaintenanceTableModal";
import { QRCodeSVG } from "qrcode.react";

const AssetDetails = () => {
  const { assetId } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editAssetData, setEditAssetData] = useState({});
  const [maintainanceData, setMaintainanceData] = useState({});
  const [showMaintainModel, setShowMaintainModel] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMaintainTable, setShowMaintainTable] = useState(false);

  const API_BASE = "http://localhost/ASSET-API";

  const toggleEditModal = () => setShowEditModal(!showEditModal);
  const toggleMaintainModel = () => setShowMaintainModel(!showMaintainModel);
  const toggleMaintainTable = () => setShowMaintainTable(!showMaintainTable);

  // 🔹 Fetch Asset Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/asset/view/${assetId}`);
        setAsset(data);

        const imgRes = await axios.get(`${API_BASE}/asset/image/${assetId}`);
        if (imgRes.data.status) {
          setAsset((prev) => ({
            ...prev,
            asset_image: imgRes.data.data.asset_image,
          }));
        }
      } catch (err) {
        console.error("Error fetching asset:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assetId]);

  if (loading) return <div>Loading...</div>;
  if (!asset) return <div>Asset not found</div>;

  // 🔹 Edit
  const handleEditClick = () => {
    setEditAssetData(asset);
    toggleEditModal();
  };

  const handleEditSave = async () => {
    try {
      await axios.post(
        `${API_BASE}/asset/update/${editAssetData.asset_id}`,
        editAssetData
      );
      setAsset(editAssetData);
      toggleEditModal();
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  // 🔹 Maintenance
  const handleMaintainClick = () => {
    setMaintainanceData({ asset_id: asset.asset_id });
    toggleMaintainModel();
  };

  const handleMaintainDetails = async () => {
    try {
      await axios.post(`${API_BASE}/maintainance/add`, maintainanceData);
      toggleMaintainModel();
    } catch (error) {
      if (error.response) {
        console.error("Backend error:", error.response.data);
      } else {
        console.error("Network error:", error.message);
      }
    }
  };

  // 🔹 View Maintenance Table
  const handleViewClick = () => {
    toggleMaintainTable();
  };

  // ⭐ PRINT QR CODE FUNCTION
  const handlePrintQR = () => {
    const printWindow = window.open("", "_blank", "width=500,height=600");

    const qrHtml = `
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { 
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .qr-box {
              border: 1px solid #ddd;
              padding: 20px;
              display: inline-block;
              border-radius: 12px;
            }
            .label {
              margin-top: 10px;
              font-size: 14px;
              color: #444;
            }
          </style>
        </head>
        <body>
          <div class="qr-box">
            ${document.getElementById("qr-box").innerHTML}
            <div class="label"><strong>${asset.asset_name}</strong></div>
            <div class="label">ID: ${asset.asset_id}</div>
          </div>

          <script>
            window.print();
            window.onafterprint = window.close;
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(qrHtml);
    printWindow.document.close();
  };

  return (
    <>
      {/* Page Header */}
      <Row className="align-items-center mb-3">
        <Col>
          <h3 className="fw-semibold mb-0">{asset.asset_name}</h3>
          <p className="text-muted mb-0">Asset ID: {asset.asset_id}</p>
        </Col>
        <Col xs="auto">
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={handleEditClick}
          >
            <TbPencil className="me-1" /> Edit
          </Button>

          <Button
            variant="outline-success"
            className="me-2"
            onClick={handleMaintainClick}
          >
            <TbPlus className="fs-sm me-2" /> Add Maintenance
          </Button>

          <Button variant="outline-secondary" onClick={handleViewClick}>
            <TbList className="me-1" /> View Maintenance
          </Button>
        </Col>
      </Row>

      {/* Main Page */}
      <Card className="border-0 shadow-sm">
        <CardBody>
          {/* Image + QR */}
          <Row className="mb-4">
            <Col xl={6}>
              <AssetDisplay asset={asset} />
            </Col>

            <Col xl={6}>
              <Card className="p-4 shadow-sm h-100 d-flex flex-column justify-content-center align-items-center">
                <h5 className="fw-bold mb-3">QR Code</h5>

                {/* QR Holder For Print */}
                <div id="qr-box">
                  <QRCodeSVG value={asset.asset_id} size={220} />
                </div>

                <p className="mt-3 text-muted">Asset ID: {asset.asset_id}</p>

                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onClick={handlePrintQR}
                >
                  Print QR Code
                </Button>
              </Card>
            </Col>
          </Row>

          {/* Table */}
          <Row>
            <Col xl={12}>
              <Card className="p-3 shadow-sm">
                <AssetDisplayTable asset={asset} />
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <EditAssetModal
        show={showEditModal}
        toggle={toggleEditModal}
        editAssetData={editAssetData}
        setEditAssetData={setEditAssetData}
        handleEditSave={handleEditSave}
      />

      {/* Add Maintenance Modal */}
      <MaintenanceModal
        show={showMaintainModel}
        toggle={toggleMaintainModel}
        asset={asset}
        maintainanceData={maintainanceData}
        setMaintainanceData={setMaintainanceData}
        handleMaintainDetails={handleMaintainDetails}
      />

      {/* Maintenance Table Modal */}
      <MaintenanceTableModal
        show={showMaintainTable}
        onHide={toggleMaintainTable}
        assetId={asset.asset_id}
      />
    </>
  );
};

export default AssetDetails;
