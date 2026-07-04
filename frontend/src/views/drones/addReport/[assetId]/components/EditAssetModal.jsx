import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const EditAssetModal = ({
  show,
  toggle,
  editAssetData,
  setEditAssetData,
  handleEditSave,
}) => {
  return (
    <Modal show={show} onHide={toggle} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Asset</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <h6 className="mb-3 text-primary">Basic Information</h6>

          <Form.Group className="mb-3">
            <Form.Label>Asset Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter asset name"
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
              placeholder="Enter model"
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
              placeholder="Enter type"
              value={editAssetData.type || ""}
              onChange={(e) =>
                setEditAssetData({ ...editAssetData, type: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location"
              value={editAssetData.location || ""}
              onChange={(e) =>
                setEditAssetData({
                  ...editAssetData,
                  location: e.target.value,
                })
              }
            />
          </Form.Group>

          <h6 className="mt-4 mb-3 text-primary">Assignment Details</h6>
          <Form.Group className="mb-3">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter employee ID"
              value={editAssetData.employee_id || ""}
              onChange={(e) =>
                setEditAssetData({
                  ...editAssetData,
                  employee_id: e.target.value,
                })
              }
            />
          </Form.Group>

          

          <h6 className="mt-4 mb-3 text-primary">Vendor & Description</h6>
          <Form.Group className="mb-3">
            <Form.Label>Vendor</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter vendor name"
              value={editAssetData.vender || ""}
              onChange={(e) =>
                setEditAssetData({ ...editAssetData, vender: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Asset Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description or specifications"
              value={editAssetData.specification || ""}
              onChange={(e) =>
                setEditAssetData({
                  ...editAssetData,
                  specification: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Asset Ownership Type</Form.Label>
            <Form.Select
              value={editAssetData.ownership_type || "select ownership type"}
              onChange={(e) =>
                setEditAssetData({
                  ...editAssetData,
                  ownership_type: e.target.value,
                })
              }
            >
              <option value={"company own"}>Company Own</option>
              <option value={"rented"}>Rented</option>
            </Form.Select>
          </Form.Group>

          <h6 className="mt-4 mb-3 text-primary">Additional Information</h6>
          <Form.Group className="mb-3">
            <Form.Label>Created Date</Form.Label>
            <Form.Control
              type="date"
              value={
                editAssetData.created_date
                  ? editAssetData.created_date.split(" ")[0]
                  : ""
              }
              onChange={(e) =>
                setEditAssetData({
                  ...editAssetData,
                  created_date: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={editAssetData.status || "active"}
              onChange={(e) =>
                setEditAssetData({
                  ...editAssetData,
                  status: e.target.value,
                })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleEditSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAssetModal;
