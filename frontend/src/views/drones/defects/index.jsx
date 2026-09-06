import { useState, useEffect } from "react";
import axios from "axios";
import AssetImage from "@/views/drones/defects/components/AssetImage";
import AssetInformation from "@/views/drones/defects/components/AssetInformation";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Button, Col, Container, Row } from "react-bootstrap";
import { LuClipboardX, LuPlus, LuSave } from "react-icons/lu";

const AddAsset = () => {
  const [assetName, setAssetName] = useState("");
  const [assetID, setAssetID] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [receiverDate, setReceiverDate] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [vender, setVender] = useState("");
  const [ownershipType, setOwnershipType] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  // Defect-specific state
  const [defectType, setDefectType] = useState("");
  const [confidence, setConfidence] = useState("");
  const [severity, setSeverity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [droneId, setDroneId] = useState("");
  const [cameraId, setCameraId] = useState("");
  const [defectImage, setDefectImage] = useState(null);

  // Fetch next Asset ID from backend
  const fetchNextAssetID = async () => {
    try {
      const response = await axios.get(
        "http://localhost/ASSET-API/asset/next-asset-id"
      );
      if (response.data.status && response.data.asset_id) {
        setAssetID(response.data.asset_id);
      }
    } catch (error) {
      console.error("Error fetching next Asset ID:", error);
    }
  };

  useEffect(() => {
    fetchNextAssetID();
  }, []);

  // Convert files to Base64
  const convertFilesToBase64 = async (files) => {
    return Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            if (file.size > 5 * 1024 * 1024) {
              return reject(
                new Error(`${file.name} is too large. Max 5MB allowed.`)
              );
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
          })
      )
    );
  };

  const handleDiscard = () => {
    setAssetName("");
    setModel("");
    setSerialNumber("");
    setCategory("");
    setLocation("");
    setHandoverDate("");
    setReceiverDate("");
    setEmployeeID("");
    setVender("");
    setOwnershipType("");
    setDescription("");
    setFiles([]);
  };

  const handleSaveDraft = () => {
    const draft = {
      assetName,
      assetID,
      model,
      serialNumber,
      category,
      location,
      handoverDate,
      receiverDate,
      employeeID,
      vender,
      ownershipType,
      description,
      files,
    };
    localStorage.setItem("assetDraft", JSON.stringify(draft));
    alert("Draft saved locally!");
  };

  const handlePublish = async () => {
    if (!assetName || !model || !serialNumber || !category) {
      return alert("Please fill all required fields!");
    }

    try {
      const base64Images = await convertFilesToBase64(files);

      const payload = {
        asset_id: assetID,
        asset_name: assetName,
        model,
        serial_number: serialNumber,
        type: category,
        location,
        handover_date: handoverDate,
        receiver_date: receiverDate,
        employee_id: employeeID,
        vender,
        ownership_type: ownershipType,
        specification: description,
        asset_image: base64Images[0] || null,
      };

      const response = await axios.post(
        "http://localhost/ASSET-API/asset/add",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status) {
        alert("Asset saved successfully!");

        // Clear all fields
        handleDiscard();

        // Fetch next asset ID automatically
        fetchNextAssetID();
      } else {
        alert("Failed: " + response.data.message);
      }
    } catch (error) {
      console.error(error.response || error);
      alert(error.message || "Error saving asset");
    }
  };

  // Handle adding a defect
  const handleAddDefect = async () => {
    if (!defectType || !confidence || !severity || !latitude || !longitude || !defectImage) {
      return alert("Please fill all required defect fields!");
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(defectImage);
      reader.onload = async () => {
        const base64Image = reader.result.split(",")[1];

        const payload = {
          crack_type: defectType,
          confidence: parseFloat(confidence),
          severity: severity,
          location: {
            lat: parseFloat(latitude),
            Lng: parseFloat(longitude),
          },
          image: base64Image,
          drone_id: droneId || "unknown",
          camera_id: cameraId || "unknown",
          detected_time: model ? new Date(model).toISOString() : new Date().toISOString(),
          description: description,
          status: "open",
        };

        try {
          const response = await axios.post(
            "http://localhost:5000/api/defects",
            payload,
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.data.success || response.data.message === "Defect created" || response.status === 201) {
            alert("Defect added successfully!");

            // Reset defect fields
            setDefectType("");
            setConfidence("");
            setSeverity("");
            setLatitude("");
            setLongitude("");
            setDroneId("");
            setCameraId("");
            setDefectImage(null);
            setModel("");
            setDescription("");
          } else {
            alert("Failed to add defect: " + (response.data.message || "Unknown error"));
          }
        } catch (error) {
          console.error("Error response:", error.response);
          alert(error.response?.data?.message || error.message || "Error adding defect");
        }
      };
    } catch (error) {
      console.error(error);
      alert("Error processing defect image");
    }
  };

  return (
    <Container fluid className="py-3">
      <PageBreadcrumb title="Defect" subtitle="Drone Navigation" />
      <Row className="justify-content-center">
        <Col xxl={10} xl={11} lg={12}>
          <AssetInformation
            assetName={assetName}
            setAssetName={setAssetName}
            assetID={assetID}
            setAssetID={setAssetID}
            model={model}
            setModel={setModel}
            serialNumber={serialNumber}
            setSerialNumber={setSerialNumber}
            category={category}
            setCategory={setCategory}
            location={location}
            setLocation={setLocation}
            handoverDate={handoverDate}
            setHandoverDate={setHandoverDate}
            receiverDate={receiverDate}
            setReceiverDate={setReceiverDate}
            employeeID={employeeID}
            setEmployeeID={setEmployeeID}
            vender={vender}
            setVender={setVender}
            ownershipType={ownershipType}
            setOwnershipType={setOwnershipType}
            description={description}
            setDescription={setDescription}
            // Defect props
            defectType={defectType}
            setDefectType={setDefectType}
            confidence={confidence}
            setConfidence={setConfidence}
            severity={severity}
            setSeverity={setSeverity}
            latitude={latitude}
            setLatitude={setLatitude}
            longitude={longitude}
            setLongitude={setLongitude}
            droneId={droneId}
            setDroneId={setDroneId}
            cameraId={cameraId}
            setCameraId={setCameraId}
            defectImage={defectImage}
            setDefectImage={setDefectImage}
            onAddDefect={handleAddDefect}
          />
          <AssetImage files={files} setFiles={setFiles} />

          <div className="mt-4 mb-5 d-flex flex-wrap justify-content-center gap-3">
            <Button
              variant="link"
              className="bg-danger text-white fw-semibold px-3"
              onClick={handleDiscard}
            >
              <LuClipboardX className="fs-5 me-2" /> Discard
            </Button>

            <Button
              variant="link"
              className="bg-warning text-white px-3"
              onClick={handleSaveDraft}
            >
              <LuSave className="fs-5 me-2" /> Save as Draft
            </Button>

            <Button variant="success" className="px-3" onClick={handlePublish}>
              <LuPlus className="fs-5 me-2" /> Publish
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddAsset;
