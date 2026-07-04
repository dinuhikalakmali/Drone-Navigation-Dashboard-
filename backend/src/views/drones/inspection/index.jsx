import React, { useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Map click handler
const LocationPicker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const Index = () => {
  const [user, setUser] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Registration fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [staffId, setStaffId] = useState("");
  const [role, setRole] = useState("");
  const [siteName, setSiteName] = useState("");
  const [position, setPosition] = useState(null);

  const qrRef = useRef(null);
  const barcodeRef = useRef(null);

  const handleRegister = () => {
    if (!fullName || !email || !staffId || !role || !siteName || !position)
      return;

    setUser({
      fullName,
      email,
      staffId,
      role,
      siteName,
      location: position,
    });

    setShowModal(false);
    setGenerated(false);

    setFullName("");
    setEmail("");
    setStaffId("");
    setRole("");
    setSiteName("");
    setPosition(null);
  };

  const downloadAsImage = (ref, filename) => {
    if (!ref.current) return;
    const svg = ref.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const img = new Image();
    const blob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <Container fluid className="py-3">
      <PageBreadcrumb title="Inspection Setup" subtitle="registration" />

      <Row className="justify-content-center mt-4">
        <Col md={10}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Registered User</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    value={user ? user.fullName : ""}
                    placeholder="No user registered"
                    disabled
                  />
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowModal(true)}
                  >
                    Register User
                  </Button>
                </div>
              </Form.Group>

              {user && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Role</Form.Label>
                    <Form.Control value={user.role} disabled />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Site Location</Form.Label>
                    <Form.Control value={user.siteName} disabled />
                  </Form.Group>
                </>
              )}

              <div className="text-center">
                <Button disabled={!user} onClick={() => setGenerated(true)}>
                  Generate Identification
                </Button>
              </div>

              {generated && user && (
                <Row className="mt-5 gy-4 justify-content-center">
                  {(user.role === "QA Engineer" ||
                    user.role === "Site Supervisor") && (
                    <Col md={6} className="text-center">
                      <h6>QR Code</h6>
                      <div ref={qrRef}>
                        <QRCode
                          value={`${user.staffId}-${user.siteName}`}
                          size={180}
                        />
                      </div>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          downloadAsImage(
                            qrRef,
                            `QR_${user.staffId}.png`
                          )
                        }
                      >
                        Download QR
                      </Button>
                    </Col>
                  )}

                  {(user.role === "Site Engineer" ||
                    user.role === "Site Supervisor") && (
                    <Col md={6} className="text-center">
                      <h6>Barcode</h6>
                      <div ref={barcodeRef}>
                        <Barcode value={user.staffId} />
                      </div>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          downloadAsImage(
                            barcodeRef,
                            `BAR_${user.staffId}.png`
                          )
                        }
                      >
                        Download Barcode
                      </Button>
                    </Col>
                  )}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* REGISTRATION MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>User & Site Registration</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Staff ID</Form.Label>
                <Form.Control
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Site Name</Form.Label>
                <Form.Control
                  placeholder="Construction Site / Location"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Check
                  type="radio"
                  name="role"
                  label="QA Engineer"
                  onChange={() => setRole("QA Engineer")}
                />
                <Form.Check
                  type="radio"
                  name="role"
                  label="Site Engineer"
                  onChange={() => setRole("Site Engineer")}
                />
                <Form.Check
                  type="radio"
                  name="role"
                  label="Site Supervisor"
                  onChange={() => setRole("Site Supervisor")}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Label>Select Site Location (Map)</Form.Label>
              <MapContainer
                center={[7.8731, 80.7718]}
                zoom={7}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker setPosition={setPosition} />
                {position && <Marker position={position} />}
              </MapContainer>

              {position && (
                <small className="text-muted">
                  Lat: {position.lat.toFixed(4)} | Lng:{" "}
                  {position.lng.toFixed(4)}
                </small>
              )}
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              !fullName ||
              !email ||
              !staffId ||
              !role ||
              !siteName ||
              !position
            }
            onClick={handleRegister}
          >
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Index;
