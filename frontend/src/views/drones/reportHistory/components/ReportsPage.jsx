import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";

const DefectSummaryPDF = () => {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");



  const downloadPDF = async () => {
    setError("");

    // Validate date range
    if (!fromDate || !toDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError("Start date must be before end date.");
      return;
    }

    setLoading(true);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        fromDate: new Date(fromDate).toISOString(),
        toDate: new Date(toDate).toISOString()
      });

      const response = await axios.get(
        `http://localhost:5000/api/defects/datapdf?${params}`
      );
      console.log(response)

      if (response.status === 200) {
        const defects = response.data.data || response.data || [];

        if (defects.length === 0) {
          setError("No defects found for the selected date range.");
          setLoading(false);
          return;
        }

        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        // Title
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text("Defect Summary Report", 14, 15);

        // Metadata
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
        doc.text(`Date Range: ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}`, 14, 28);
        doc.text(`Total Defects: ${defects.length}`, 14, 34);

        // Summary Table Headers
        const tableColumn = [
          "Camera ID",
          "Defect Type",
          "Confidence",
          "Severity",
          "Status"
        ];
        const tableRows = [];

        defects.forEach((item) => {
          // Format confidence as percentage
          const confidenceValue = item.confidence
            ? (typeof item.confidence === 'number' && item.confidence < 1
              ? (item.confidence * 100).toFixed(1)
              : item.confidence.toFixed(1))
            : "";

          tableRows.push([
            item.camera_id || "N/A",
            (item.crack_type || item.defect_type || "").replace(/_/g, " ").toUpperCase() || "N/A",
            confidenceValue ? `${confidenceValue}%` : "N/A",
            (item.severity || "").toUpperCase() || "N/A",
            (item.status || "").toUpperCase() || "N/A"
          ]);
        });

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 41,
          theme: "grid",
          headerStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 9,
            halign: "center"
          },
          bodyStyles: {
            fontSize: 8,
            textColor: 50
          },
          alternateRowStyles: {
            fillColor: [240, 248, 255]
          },
          margin: 10,
          didDrawPage: (data) => {
            // Footer
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.getHeight();
            const pageWidth = pageSize.getWidth();
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${data.pageNumber}`, pageWidth - 20, pageHeight - 10);
          }
        });

        // Add detailed pages for each defect
        defects.forEach((defect, index) => {
          doc.addPage();
          let yPosition = 15;

          // Defect number and title
          doc.setFontSize(14);
          doc.setTextColor(41, 128, 185);
          doc.text(`Defect #${index + 1}`, 14, yPosition);
          yPosition += 10;

          // Basic Information Box
          doc.setFontSize(11);
          doc.setTextColor(40, 40, 40);
          doc.setFont(undefined, "bold");
          doc.text("Basic Information", 14, yPosition);
          yPosition += 8;

          doc.setFont(undefined, "normal");
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);

          const basicInfo = [
            { label: "Camera ID", value: defect.camera_id || "N/A" },
            { label: "Drone ID", value: defect.drone_id || "N/A" },
            { label: "Defect Type", value: (defect.crack_type || defect.defect_type || "N/A").replace(/_/g, " ").toUpperCase() },
            { label: "Severity", value: (defect.severity || "N/A").toUpperCase() },
            { label: "Status", value: (defect.status || "N/A").toUpperCase() },
          ];

          basicInfo.forEach((info) => {
            doc.text(`${info.label}:`, 14, yPosition);
            doc.setFont(undefined, "normal");
            doc.text(info.value, 70, yPosition);
            doc.setFont(undefined, "bold");
            yPosition += 7;
          });

          yPosition += 5;

          // Detection Details Box
          doc.setFont(undefined, "bold");
          doc.setFontSize(11);
          doc.setTextColor(40, 40, 40);
          doc.text("Detection Details", 14, yPosition);
          yPosition += 8;

          doc.setFont(undefined, "normal");
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);

          const confidenceValue = defect.confidence
            ? (typeof defect.confidence === 'number' && defect.confidence < 1
              ? (defect.confidence * 100).toFixed(1)
              : defect.confidence.toFixed(1))
            : "N/A";

          const formattedTime = defect.detected_time || defect.timestamp || defect.time
            ? new Date(defect.detected_time || defect.timestamp || defect.time).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
            : "N/A";

          const detectionInfo = [
            { label: "Confidence Level", value: `${confidenceValue}%` },
            { label: "Detected Time", value: formattedTime },
            { label: "Latitude", value: defect.location?.lat ? defect.location.lat.toFixed(6) : "N/A" },
            { label: "Longitude", value: defect.location?.Lng ? defect.location.Lng.toFixed(6) : "N/A" },
          ];

          detectionInfo.forEach((info) => {
            doc.text(`${info.label}:`, 14, yPosition);
            doc.setFont(undefined, "normal");
            doc.text(info.value, 70, yPosition);
            doc.setFont(undefined, "bold");
            yPosition += 7;
          });

          yPosition += 5;

          // Description Box
          if (defect.description) {
            doc.setFont(undefined, "bold");
            doc.setFontSize(11);
            doc.setTextColor(40, 40, 40);
            doc.text("Description", 14, yPosition);
            yPosition += 8;

            doc.setFont(undefined, "normal");
            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);

            // Wrap text for description
            const descriptionText = doc.splitTextToSize(defect.description, 180);
            doc.text(descriptionText, 14, yPosition);
            yPosition += (descriptionText.length * 5) + 5;
          }

          // Image section
          if (defect.image) {
            try {
              doc.setFont(undefined, "bold");
              doc.setFontSize(11);
              doc.setTextColor(40, 40, 40);
              doc.text("Defect Image", 14, yPosition);
              yPosition += 8;

              // Add image
              const imgData = defect.image.startsWith('data:') ? defect.image : `data:image/jpeg;base64,${defect.image}`;
              doc.addImage(imgData, "JPEG", 14, yPosition, 180, 100);
              yPosition += 105;
            } catch (imgError) {
              doc.setFontSize(10);
              doc.setTextColor(200, 50, 50);
              doc.text("[Image could not be displayed]", 14, yPosition);
              yPosition += 7;
            }
          }

          // Add footer with page number
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.getHeight();
          const pageWidth = pageSize.getWidth();
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Page ${doc.internal.pages.length}`, pageWidth - 20, pageHeight - 10);
        });

        doc.save(`defect-summary-${new Date().toISOString().split('T')[0]}.pdf`);
      } else {
        setError("Failed to fetch defect data.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Defect Summary</h3>

      {/* Date Range Inputs */}
      <div style={{
        display: "flex",
        gap: "15px",
        marginBottom: "15px",
        alignItems: "flex-end",
        flexWrap: "wrap"
      }}>
        <div>
          <label style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#333"
          }}>
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px"
            }}
          />
        </div>

        <div>
          <label style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#333"
          }}>
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px"
            }}
          />
        </div>
      </div>

      {error && (
        <div style={{
          background: "#ffe0e0",
          color: "#c33",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "15px"
        }}>
          {error}
        </div>
      )}

      <button
        onClick={downloadPDF}
        disabled={loading || !fromDate || !toDate}
        style={{
          background: (loading || !fromDate || !toDate) ? "#ccc" : "#2980b9",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "5px",
          cursor: (loading || !fromDate || !toDate) ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          transition: "background 0.3s"
        }}
        onMouseEnter={(e) => (!loading && fromDate && toDate) && (e.target.style.background = "#1e5fa3")}
        onMouseLeave={(e) => (!loading && fromDate && toDate) && (e.target.style.background = "#2980b9")}
      >
        {loading ? "Generating PDF..." : "Download PDF"}
      </button>
    </div>
  );
};

export default DefectSummaryPDF;