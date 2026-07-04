import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Row,
  Spinner,
} from "react-bootstrap";
import { TbBasket } from "react-icons/tb";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/defect";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(`${API_BASE}/defects`);

        if (response.status === 200) {
          console.log(response.data.data)
          setAssets(response.data.data);
        } else {
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center my-5 text-muted">
        <p>No reports found.</p>
      </div>
    );
  }

  return (
    <Row className="row-cols-xxl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
      {assets.map((asset) => {
        const imageSrc = asset.image ? asset.image : null;
        const formatDate = (raw) => {
          if (!raw) return "No time";

          // convert: "2026-04-20 18:55:05.503861"
          const cleaned = raw
            .replace(" ", "T")        // ISO format
            .split(".")[0];           // remove microseconds

          const date = new Date(cleaned);

          if (isNaN(date.getTime())) return raw;

          return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        };

        return (
          <Col key={asset._id}>
            <Card className="h-100 shadow-sm border-0">
              <CardBody className="pb-0 text-center">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    loading="lazy"
                    alt={asset.asset_name}
                    className="img-fluid rounded mb-3"
                  />
                ) : (
                  <div
                    className="bg-light d-flex align-items-center justify-content-center rounded mb-3"
                    style={{ height: 200 }}
                  >
                    <span className="text-muted small">No Image</span>
                  </div>
                )}

                <CardTitle className="fs-5 fw-semibold mb-2">
                  {formatDate(asset.time)}
                </CardTitle>

                <div className="text-muted small">
                  <div>Status: {asset.status || "—"}</div>
                  <div>Type: {asset.type || "—"}</div>
                  <div>Location: {asset.location || "—"}</div>
                </div>
              </CardBody>

              <CardFooter className="bg-transparent text-center">
                <Link
                  to={`/asset/view/${asset.asset_id}`}
                  className="btn btn-primary rounded-circle"
                >
                  <TbBasket className="fs-5 text-white" />
                </Link>
              </CardFooter>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default Assets;
