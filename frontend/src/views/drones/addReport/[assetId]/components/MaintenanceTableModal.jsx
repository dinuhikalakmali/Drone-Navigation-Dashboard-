import { useEffect, useState } from "react";
import { Modal, Table, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router";
import MaintenanceModal from "./MaintenanceModel";

const MaintainanceTableModal = ({ show, onHide, assetId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maintainanceData, setMaintainanceData] = useState({});
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const toggleMaintainModel = () =>
    setShowMaintenanceModal(!showMaintenanceModal);

  // Replace with your API base URL
  const API_BASE_URL = "http://localhost/ASSET-API";

  useEffect(() => {
    if (show && assetId) {
      fetchMaintainanceData();
    }
  }, [show, assetId, showMaintenanceModal]);

  const fetchMaintainanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/maintainance/view/${assetId}`
      );

      if (response.data.status) {
        setRecords(response.data.data);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintainanceSingleData = async (maintainId) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/maintainance/view/${assetId}/${maintainId}`
      );

      if (response.data.status) {
        const record = response.data.data;

        setMaintainanceData(record); // <-- PUT DATA IN MODAL FIELDS
        setShowMaintenanceModal(true); // <-- OPEN MODAL
      }
    } catch (error) {
      console.error("Error fetching single record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaintainDetails = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/maintainance/update/${maintainanceData.asset_id}/${maintainanceData.id}`,
        maintainanceData
      );
      toggleMaintainModel();
    } catch (error) {
      if (error.response) {
        console.error("Backend error:", error.response.data);
      } else {
        console.error("Network error:", error.message);
      }
    }
  };

  return (
    <Modal
      show={show || showMaintenanceModal}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Maintenance History for Asset: {assetId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : records.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Description</th>
                <th>Performed By</th>
                <th>Date</th>
                <th>Next Due</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, index) => (
                <tr
                  key={rec.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => fetchMaintainanceSingleData(rec.id)}
                >
                  <td>{rec.id}</td>
                  <td>{rec.maintainance_type}</td>
                  <td>{rec.description}</td>
                  <td>{rec.performed_by}</td>
                  <td>
                    {rec.maintainance_date
                      ? rec.maintainance_date.split(" ")[0]
                      : ""}
                  </td>
                  <td>
                    {rec.next_due_date ? rec.next_due_date.split(" ")[0] : ""}
                  </td>
                  <td>{rec.cost}</td>
                  <td>{rec.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">
            No maintenance records found for this asset.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
      <MaintenanceModal
        show={showMaintenanceModal}
        toggle={toggleMaintainModel}
        asset={{ asset_id: assetId }}
        maintainanceData={maintainanceData}
        setMaintainanceData={setMaintainanceData}
        handleMaintainDetails={handleMaintainDetails}
      />
    </Modal>
  );
};

export default MaintainanceTableModal;
