import { Card, CardBody, CardHeader, Col, Row } from "react-bootstrap";
import FileUploader from "@/components/FileUploader";

const AssetImage = ({ files, setFiles }) => {
  return (
    <Card>
      <CardHeader className="d-block p-3">
        <h4 className="card-title mb-1">Defect Images</h4>
        <p className="text-muted mb-0">
          Upload images of this asset (max 5, 10MB each).
        </p>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={12}>
            <FileUploader
              files={files}
              setFiles={setFiles}
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
              maxSize={1024 * 1024 * 10}
              maxFileCount={5}
              multiple
              className="mb-3"
            />
            <p className="text-muted small mb-0">
              Accepted: JPG, PNG, GIF, WEBP. Max size: 10MB/file.
            </p>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default AssetImage;
