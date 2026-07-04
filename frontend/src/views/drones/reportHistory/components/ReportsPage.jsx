import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";

const DefectSummaryPDF = () => {

  const [error, setError] = useState("");



  const downloadPDF = async () => {
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/defect/datapdf"
      );
      console.log(response)

      if (response.status === 200) {
        const defects = response.data.data;

        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Defect Summary Report", 14, 15);

        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

        const tableColumn = ["Status", "Time"];
        const tableRows = [];

        defects.forEach((item) => {

          const formattedTime = new Date(item.time).toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });

          tableRows.push([
            item.status,
            formattedTime,
          ]);
        });

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 30,
        });

        doc.save("defect-summary.pdf");
      } else {
        setError("Failed to fetch defect data.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Defect Summary</h3>

      <button
        onClick={downloadPDF}
        style={{
          background: "red",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        Download PDF
      </button>
    </div>
  );
};

export default DefectSummaryPDF;