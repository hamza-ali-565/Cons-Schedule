import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ButtonDis from "../../Components/Button/ButtonDis";
import GRNReportPDF from "../../Components/PDFDetails/GRNReportPDF";
import { pdf } from "@react-pdf/renderer";
import { v4 as uuidv4 } from "uuid";
import { json } from "react-router-dom";
import Loader from "../../Components/Modal/Loader";
function ExcelToJson() {
  const [jsonData, setJsonData] = useState(null);
  const [category, setCategory] = useState([]);
  const [fileval, setfileval] = useState(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Function to handle file upload and parse Excel
  const handleFileUpload = (event) => {
    setOpen(true)
    const file = event.target.files[0];
    setfileval(event.target.files[0]);
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            // Get the first worksheet in the Excel file
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert the worksheet to JSON
        const JSONDATA = XLSX.utils.sheet_to_json(worksheet);
        setJsonData(JSONDATA);
        console.log(JSONDATA);
        
        // Extract unique "Item Category" values and log them
        const uniqueTypes = Array.from(
            new Set(JSONDATA.map((item) => item["Item Category"]))
        ).map((type) => ({ type }));

        setCategory(uniqueTypes);
    };
    reader.readAsArrayBuffer(file);
    setOpen(false)
    }
  };

  // Function to download the JSON file
  const downloadJsonFile = (value) => {
    // if (!jsonData) return;

    // const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
    //   type: "application/json",
    // });
    // saveAs(jsonBlob, "data.json");

    // value = "General Item"
    setOpen(true)
    const filterJson = jsonData.filter(
      (items) =>
        items?.["Item Category"] === value && items?.["Deleted"] !== true
    );
    console.log("Filter Json", filterJson);

    const grouped = filterJson.reduce((acc, curr) => {
      // Find if the group already exists for the speciality
      let group = acc.find(
        (group) => group[0]?.["Item Name"] === curr["Item Name"]
      );

      // If group exists, push the current element into it
      if (group) {
        group.push(curr);
      } else {
        // If no group exists, create a new group
        acc.push([curr]);
      }

      return acc;
    }, []);

    grouped.sort((a, b) => a[0]["Item Name"].localeCompare(b[0]["Item Name"]));
    console.log("grouped", grouped);
    printGRNReportPDF(grouped, value);
  };

  const printGRNReportPDF = async (data, value) => {
    const key = uuidv4();

    // Create a PDF document as a Blob
    const blob = await pdf(<GRNReportPDF resultData={data} category={value}/>).toBlob();

    // Create a Blob URL and open it in a new tab
    let url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    url = "";
    setOpen(false);
  };

  const resetFileInput = () => {
    setfileval(null); // Clear any state holding the file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input field
    }
    setJsonData(null);
  };

  return (
    <div>
      {/* <h1>Upload Excel and Download as JSON</h1> */}

      {/* File upload input */}
      <div className="flex justify-center mt-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="bg-blue-500"
          ref={fileInputRef}
        />
      </div>

      {/* Download JSON button */}
      {jsonData &&
        category.map((items, index) => (
          <div className="flex justify-center mt-4">
            <ButtonDis
              onClick={() => downloadJsonFile(items?.type)}
              title={items?.type}
            />
          </div>
        ))}
      <div className="flex justify-center mt-4">
        <ButtonDis title={"Reset"} onClick={resetFileInput} />
      </div>

      {/* Optional: Displaying the JSON data */}
      {/* {jsonData && (
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {JSON.stringify(jsonData, null, 2)}
        </pre>
      )} */}
      <Loader onClick={open} title={"Please Wait ..."} />
    </div>
  );
}

export default ExcelToJson;
