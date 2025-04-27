/* eslint-disable react/prop-types */
import "./style.css";
import React, { useEffect, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { Field } from "formik";
export function extractAttributesFromDelta(delta) {
  const attributesArray = [];

  // Iterate through the ops array in the Delta object
  delta.ops.forEach((op) => {
    if (op.attributes) {
      // If attributes exist, add them to the attributesArray
      attributesArray.push(op.attributes);
    }
  });

  // Merge all attributes into a single object
  const mergedAttributes = attributesArray.reduce((acc, curr) => {
    return { ...acc, ...curr }; // Merge properties
  }, {});

  return mergedAttributes;
}

const toolBarOptions = {
  toolbar: [
    [{ size: ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"] }],
    ["bold", "italic"],
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],
  ],
};

function addCustomFontSizes(Quill) {
  const Size = Quill.import("attributors/style/size");
  Size.whitelist = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
  Quill.register(Size, true);
}

export function TextEditor({ name, setFieldValue, placeholder = "" }) {
  const [Quill, setQuill] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-quill")
        .then((QuillModule) => {
          if (QuillModule && QuillModule.default) {
            setQuill(() => {
              addCustomFontSizes(QuillModule.default.Quill);
              return QuillModule.default;
            });
          } else {
            console.error("React Quill module or default export not found");
          }
        })
        .catch((error) => console.error("Failed to load react-quill", error));
    }
  }, []);

  const handleSetValue = (content) => {
    const baseName = name;
    setFieldValue(baseName, content);
  };
  return (
    <ClientOnly fallback={<FallbackComponent />}>
      {() =>
        Quill ? (
          <>
            <Field name={`${name}`}>
              {({ field }) => (
                <>
                  <Quill
                    value={field.value}
                    onChange={(content, delta, source, editor) =>
                      handleSetValue(content, editor, delta, source)
                    }
                    modules={toolBarOptions}
                    placeholder={placeholder}
                  />
                </>
              )}
            </Field>
          </>
        ) : (
          <div>Loading editor...</div>
        )
      }
    </ClientOnly>
  );
}

function FallbackComponent() {
  return <div>Fallback</div>;
}
