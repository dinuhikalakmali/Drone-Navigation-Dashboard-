import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const MaintenanceModal = ({
  show,
  toggle,
  asset,
  maintainanceData,
  setMaintainanceData,
  handleMaintainDetails,
}) => {
  return (
    <Modal show={show} onHide={toggle} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Maintenance Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Asset ID</Form.Label>
            <Form.Control type="text" value={asset.asset_id || ""} readOnly plaintext />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Maintenance Type</Form.Label>
            <Form.Control
              type="text"
              placeholder="Routine Check, Repair..."
              value={maintainanceData.maintainance_type || ""}
              onChange={(e) =>
                setMaintainanceData({
                  ...maintainanceData,
                  maintainance_type: e.target.value,
                  asset_id: asset.asset_id,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter maintenance details..."
              value={maintainanceData.description || ""}
              onChange={(e) =>
                setMaintainanceData({
                  ...maintainanceData,
                  description: e.target.value,
                })
              }
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Maintenance Date</Form.Label>
                <Form.Control
                  type="date"
                  value={maintainanceData.maintainance_date || ""}
                  onChange={(e) =>
                    setMaintainanceData({
                      ...maintainanceData,
                      maintainance_date: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Next Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={maintainanceData.next_due_date || ""}
                  onChange={(e) =>
                    setMaintainanceData({
                      ...maintainanceData,
                      next_due_date: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Performed By</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Technician or vendor name"
                  value={maintainanceData.performed_by || ""}
                  onChange={(e) =>
                    setMaintainanceData({
                      ...maintainanceData,
                      performed_by: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cost (LKR)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter cost"
                  value={maintainanceData.cost || ""}
                  onChange={(e) =>
                    setMaintainanceData({
                      ...maintainanceData,
                      cost: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              type="text"
              placeholder="Any additional notes..."
              value={maintainanceData.remarks || ""}
              onChange={(e) =>
                setMaintainanceData({
                  ...maintainanceData,
                  remarks: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={maintainanceData.status || "pending"}
              onChange={(e) =>
                setMaintainanceData({
                  ...maintainanceData,
                  status: e.target.value,
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            await handleMaintainDetails();
            setMaintainanceData({});
            toggle();
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MaintenanceModal;
