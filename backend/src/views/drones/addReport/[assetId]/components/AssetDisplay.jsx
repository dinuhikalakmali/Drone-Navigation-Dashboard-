import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Carousel,
  CarouselItem,
  Badge,
  Table,
} from "react-bootstrap";

const AssetDisplay = ({ asset }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Create slides array correctly
  const slides = useMemo(() => {
    if (!asset) return [];

    if (
      typeof asset.asset_image === "string" &&
      asset.asset_image.trim() !== ""
    ) {
      return [asset.asset_image];
    }

    if (Array.isArray(asset.asset_image)) {
      return asset.asset_image;
    }

    return [];
  }, [asset]);

  const handleSlideChange = useCallback((index) => {
    setActiveSlide(index);
  }, []);

  return (
    <Card className="border-0 bg-light-subtle">
      <CardBody className="p-3">
        <div className="position-relative text-center mb-3">
          {slides.length === 1 ? (
            <img
              src={
                slides[0].startsWith("data:")
                  ? slides[0]
                  : `data:image/jpeg;base64,${slides[0]}`
              }
              alt="asset"
              className="img-fluid rounded-3 border border-light"
              style={{
                maxHeight: "300px",
                objectFit: "contain",
                width: "100%",
              }}
            />
          ) : (
            <Carousel
              activeIndex={activeSlide}
              onSelect={handleSlideChange}
              fade
              controls
              indicators
            >
              {slides.map((img, i) => (
                <CarouselItem key={i}>
                  <img
                    src={
                      img.startsWith("data:")
                        ? img
                        : `data:image/jpeg;base64,${img}`
                    }
                    alt={`asset-${i + 1}`}
                    className="img-fluid"
                    style={{
                      maxHeight: "300px",
                      objectFit: "contain",
                      width: "100%",
                    }}
                  />
                </CarouselItem>
              ))}
            </Carousel>
          )}

          {/* STATUS BADGE */}
          <Badge
            bg="success"
            className="position-absolute top-0 end-0 m-2 rounded-pill px-3 py-1"
          >
            Active
          </Badge>
        </div>

        {/* Thumbnail Selector */}
        {slides.length > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-2">
            {slides.map((thumb, i) => (
              <button
                key={i}
                onClick={() => handleSlideChange(i)}
                className="border-0 p-0 bg-transparent"
              >
                <img
                  src={
                    thumb.startsWith("data:")
                      ? thumb
                      : `data:image/jpeg;base64,${thumb}`
                  }
                  alt={`thumb-${i}`}
                  className={`rounded-2 ${
                    i === activeSlide ? "border border-primary" : "opacity-75"
                  }`}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const AssetDisplayTable = ({ asset }) => {
  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <td>Model</td>
          <td>{asset.model}</td>
        </tr>

        <tr>
          <td>Type</td>
          <td>{asset.type}</td>
        </tr>

        <tr>
          <td>Location</td>
          <td>{asset.location}</td>
        </tr>

        <tr>
          <td>Employee ID</td>
          <td>{asset.employee_id}</td>
        </tr>

        

        <tr>
          <td>Vendor</td>
          <td>{asset.vender}</td>
        </tr>

        <tr>
          <td>Asset Description</td>
          <td>{asset.specification?.replace(/<\/?[^>]+(>|$)/g, "")}</td>
        </tr>

        <tr>
          <td>Ownership Type</td>
          <td>{asset.ownership_type}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default AssetDisplay;
export { AssetDisplayTable };
