import { XMLParser } from "fast-xml-parser";

/* Parse XML fields for table (with type 'g') */
export function parseXMLTable(fields, table) {
  const xml_fileds = [];
  fields.forEach((field) => {
    if (field.type === "g") xml_fileds.push(field.key);
  });

  const parser = new XMLParser();

  xml_fileds.forEach((xml) => {
    table.forEach((row) => {
      if (row[xml]) {
        const json = parser.parse(row[xml]);
        delete json["?xml"];
        const nodes = Object.keys(json);
        if (nodes.length !== 1) {
          const err = new Error(`Expect only ONE parent node for xml, but found: ${nodes.length}`);
          err.name = "WebServerError";
          err.codeString = "XML_INVALID_PARENT_NODE_COUNT";
          throw err;
        }
        row[xml] = json[nodes[0]];
      }
    });
  });
}
