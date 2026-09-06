import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  FormSelect,
  Button,
} from "react-bootstrap";
import CustomQuill from "@/components/CustomQuill";

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
  ],
};

export const assetTypes = [
  {
    value: "drone",
    label: "Drone"
  },
  {
    value: "sensor",
    label: "Sensor"
  },
  {
    value: "camera",
    label: "Camera"
  }
];

export const defectTypes = [
  { value: "longitudinal_crack", label: "Longitudinal Crack" },
  { value: "transverse_crack", label: "Transverse Crack" },
  { value: "vertical_crack", label: "Vertical Crack" },
  { value: "pothole", label: "Pothole" },
  { value: "spalling", label: "Spalling" },
  { value: "other", label: "Other" },
];

export const severityLevels = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" },
];

const AssetInformation = ({
  assetName,
  setAssetName,
  assetID,
  setAssetID,
  model,
  setModel,
  serialNumber,
  setSerialNumber,
  category,
  setCategory,
  location,
  setLocation,
  handoverDate,
  setHandoverDate,
  receiverDate,
  setReceiverDate,
  employeeID,
  setEmployeeID,
  vender,
  setVender,
  ownershipType,
  setOwnershipType,
  description,
  setDescription,
  // Defect-specific props
  defectType,
  setDefectType,
  confidence,
  setConfidence,
  severity,
  setSeverity,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  droneId,
  setDroneId,
  cameraId,
  setCameraId,
  defectImage,
  setDefectImage,
  onAddDefect,
}) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDefectImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Card>
      <CardHeader className="d-block p-3">
        <h4 className="card-title mb-1">Defect Information</h4>
        <p className="text-muted mb-0">
          Fill in the details to add a new defect.
        </p>
      </CardHeader>
      <CardBody>
        <Row>
          {/* Defect Type */}
          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Defect Type *</FormLabel>
              <FormSelect
                value={defectType}
                onChange={(e) => setDefectType(e.target.value)}
              >
                <option value="">Select defect type</option>
                {defectTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
          </Col>

          {/* Confidence Level */}
          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Confidence Level (0-100) *</FormLabel>
              <FormControl
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                placeholder="e.g., 87.5"
              />
            </FormGroup>
          </Col>

          {/* Severity Level */}
          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Severity Level *</FormLabel>
              <FormSelect
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="">Select severity</option>
                {severityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
          </Col>

          {/* Status/Timestamp */}
          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Detected Time *</FormLabel>
              <FormControl
                type="datetime-local"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </FormGroup>
          </Col>

          {/* Latitude */}
          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Latitude *</FormLabel>
              <FormControl
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 7.2906"
              />
            </FormGroup>
          </Col>

          {/* Longitude */}
          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Longitude *</FormLabel>
              <FormControl
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., 80.6337"
              />
            </FormGroup>
          </Col>

          {/* Drone ID */}
          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Drone ID</FormLabel>
              <FormControl
                value={droneId}
                onChange={(e) => setDroneId(e.target.value)}
                placeholder="e.g., drone_01"
              />
            </FormGroup>
          </Col>

          {/* Camera ID */}
          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Camera ID</FormLabel>
              <FormControl
                value={cameraId}
                onChange={(e) => setCameraId(e.target.value)}
                placeholder="e.g., DRONE001"
              />
            </FormGroup>
          </Col>

          {/* Image Upload */}
          <Col lg={12}>
            <FormGroup className="mb-3">
              <FormLabel>Defect Image *</FormLabel>
              <FormControl
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
            </FormGroup>
          </Col>

          {/* Description */}
          <Col xs={12}>
            <FormGroup>
              <FormLabel>Description</FormLabel>
              <CustomQuill
                theme="snow"
                modules={modules}
                value={description}
                onChange={setDescription}
              />
            </FormGroup>
          </Col>

          {/* Add Defect Button */}
          <Col xs={12}>
            <Button
              variant="primary"
              onClick={onAddDefect}
              className="mt-3"
              disabled={!defectType || !confidence || !severity || !latitude || !longitude || !defectImage}
            >
              Add Defect
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default AssetInformation;
