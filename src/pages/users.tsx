import React, { useContext } from "react";
import CrudTable, { CrudColumn } from "../components/crudtable";
import { User, UserPermission } from "../types/user";
import { editUserPermissions, getAllUsers } from "../client/user-client";
import { CopyOutlined } from "@ant-design/icons";
import { GlobalStateContext } from "../utils/context-provider";
import { Form, Input, Select } from "antd";

const columns: CrudColumn<User>[] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    type: "number",
  },
  {
    title: "Name",
    dataIndex: "display_name",
    key: "display_name",
    type: "text",
  },
  {
    title: "PoE Name",
    dataIndex: "account_name",
    key: "account_name",
    type: "text",
  },
  {
    title: "Discord Name",
    dataIndex: "discord_name",
    key: "discord_name",
    type: "text",
  },
  {
    title: "Discord ID",
    dataIndex: "discord_id",
    key: "discord_id",
    type: "number",
    render: (value: number) => {
      return (
        <a onClick={() => copyDiscordId(value)}>
          <CopyOutlined />
          {value}
        </a>
      );
    },
  },
  {
    title: "Permissions",
    dataIndex: "permissions",
    key: "permissions",
    type: "multiselect",
    render: (value: UserPermission[]) => {
      return value.join(", ");
    },
    options: Object.values(UserPermission),
    editable: true,
  },
];

function copyDiscordId(value: number) {
  navigator.clipboard.writeText("<@" + value.toString() + ">");
}

const UserPage: React.FC = () => {
  const { user } = useContext(GlobalStateContext);
  const [nameFilter, setNameFilter] = React.useState<string>("");
  const [roleFilter, setRoleFilter] = React.useState<UserPermission | "">("");
  if (!user || !user.permissions.includes(UserPermission.ADMIN)) {
    return <div>You do not have permission to view this page</div>;
  }
  return (
    <div style={{ marginTop: "20px" }}>
      <h1>Users</h1>
      <Form layout="inline" style={{ marginBottom: "20px" }}>
        <Form.Item label="Filter by name">
          <Input
            allowClear
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value.toLowerCase())}
          />
        </Form.Item>
        <Form.Item label="Filter by role" style={{ width: "300px" }}>
          <Select
            value={roleFilter}
            onChange={(value) => setRoleFilter(value)}
            allowClear
          >
            <Select.Option key="all" value={""}>
              All
            </Select.Option>
            {Object.values(UserPermission).map((role) => (
              <Select.Option key={role} value={role}>
                {role}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <CrudTable<User>
        resourceName="User"
        columns={columns}
        fetchFunction={getAllUsers}
        editFunction={editUserPermissions}
        filterFunction={(user) =>
          !!(
            user.account_name?.toLowerCase().includes(nameFilter) ||
            user.discord_name?.toLowerCase().includes(nameFilter) ||
            user.twitch_name?.toLowerCase().includes(nameFilter)
          ) &&
          (!roleFilter || user.permissions.includes(roleFilter))
        }
      />
    </div>
  );
};

export default UserPage;
