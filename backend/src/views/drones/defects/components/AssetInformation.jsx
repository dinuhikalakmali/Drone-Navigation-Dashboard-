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
} from "react-bootstrap";
import CustomQuill from "@/components/CustomQuill";

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
  ],
};



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
}) => {
  return (
    <Card>
      <CardHeader className="d-block p-3">
        <h4 className="card-title mb-1">Defect Information</h4>
        <p className="text-muted mb-0">
          Fill in the details to add a new asset.
        </p>
      </CardHeader>
      <CardBody>
        <Row>
          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Defect Name *</FormLabel>
              <FormControl
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="Enter defect name"
              />
            </FormGroup>
          </Col>

          

          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Drone Model *</FormLabel>
              <FormControl
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Drone Model"
              />
            </FormGroup>
          </Col>

          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Drone Serial Number *</FormLabel>
              <FormControl
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="serial Number"
              />
            </FormGroup>
          </Col>

          {/* <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Category / Type *</FormLabel>
              <FormSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {assetTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
          </Col> */}

          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Location *</FormLabel>
              <FormControl
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
              />
            </FormGroup>
          </Col>

          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Engineer ID *</FormLabel>
              <FormControl
                value={employeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
                placeholder="Engineer ID"
              />
            </FormGroup>
          </Col>

          <Col lg={6}>
            <FormGroup className="mb-3">
              <FormLabel>Employee Name *</FormLabel>
              <FormControl
                value={vender}
                onChange={(e) => setVender(e.target.value)}
                placeholder="employee"
              />
            </FormGroup>
          </Col>

          

          

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
        </Row>
      </CardBody>
    </Card>
  );
};

export default AssetInformation;
