import React, { useRef, useState } from "react";
import { Form, Input, Button, Space, Select } from "antd";
const lodash = require("lodash");

const Items = [
  { name: "String", value: 0 },
  { name: "Number", value: 1 },
  { name: "Nested", value: 2 },
];
const DynamicSchemaForm = () => {
  const [form] = Form.useForm();
  const fields = useRef({ dynamicSchemaForm: {} });
  const [updateKey, setUpdateKey] = useState(0);

  const onFinish = (values) => {
    console.log("Form values:", values);
    console.log(fields);
  };

  const removeField = (index) => {
    // const newFields = [...fields];
    // newFields.splice(index, 1);
    // setFields(newFields);
  };
  const addField = () => {
    fields.current = {
      dynamicSchemaForm: { ...fields.current.dynamicSchemaForm, "": "" },
    };
    setUpdateKey((prev) => prev + 1);
  };

  const getValue = (val: number) => {
    switch (val) {
      case 0:
        return "string";

      case 1:
        return "number";

      default:
        return {};
    }
  };

  const handleOnChange = (
    pathPrefix: string,
    e: any,
    index: number,
    oldField: string
  ) => {
    if (e?.target?.placeholder === "Field Name") {
      const fieldPath = { ...fields.current };
      const oldPath = `${pathPrefix}.${oldField}`;
      const valueToReplace = lodash.get(fieldPath, oldPath);

      // Set the value at the new path
      const newPath = `${pathPrefix}.${e.target.value}`;
      lodash.set(fieldPath, newPath, valueToReplace);

      // Remove the old path
      lodash.unset(fieldPath, oldPath);
      fields.current = fieldPath;
    } else {
      const path = `${pathPrefix}.${oldField}`;
      const fieldPath = { ...fields.current };
      const value = getValue(e);
      lodash.set(fieldPath, path, value);
      fields.current = fieldPath;
    }
    // setUpdateKey((prev) => prev + 1);
  };
  console.log(fields);
  const getSelectValue = (path: string, key: string) => {
    const value = lodash.get(fields, `${path}.${key}`);
    if (value === "string") return 0;
    else if (value === "number") return 1;
    else if (value === "") return null;
    else return 2;
  };
  const getFieldInputs = (fields, pathPrefix: string) => {
    return Object.keys(fields).map((key, index: number) => (
      <Space key={`${key}-${index}`}>
        <Form.Item
          rules={[
            {
              required: true,
              message: "This field is required",
            },
          ]}
        >
          <Input
            placeholder="Field Name"
            onChange={(e) => handleOnChange(pathPrefix, e, index, key)}
            // value={key}
            ref={fields}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "This field is required",
            },
          ]}
        >
          <Select
            onChange={(e) => handleOnChange(pathPrefix, e, index, key)}
            placeholder="Field Type"
            value={getSelectValue(pathPrefix, key)}
          >
            {Items.map((item) => (
              <Select.Option value={item.value}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Button onClick={() => removeField(index)}>Remove</Button>
      </Space>
    ));
  };

  return (
    <Form
      form={form}
      name="dynamic_schema_form"
      onFinish={onFinish}
      autoComplete="off"
      //   onChange={(event: any) => console.log(event)}
    >
      {getFieldInputs(fields.current.dynamicSchemaForm, "dynamicSchemaForm")}
      <Form.Item>
        <Button type="dashed" onClick={addField} style={{ width: "100%" }}>
          Add Field
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicSchemaForm;
