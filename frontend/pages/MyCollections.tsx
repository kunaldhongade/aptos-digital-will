import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, Input, message, Table, Tag, Typography } from "antd";
import "dotenv/config";
import { useEffect, useState } from "react";
const { Column } = Table;
const { Paragraph } = Typography;

interface LostItem {
  title: string;
  description: string;
  reward: number;
  is_claimed: boolean;
  owner: string;
  finders: {
    description: string;
    finder: string;
    is_verified: boolean;
  }[];
  unique_id: number;
}

export function MyCollections() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [itemById, setItemById] = useState<LostItem | null>(null);
  const [itemID, setItemID] = useState<number | null>(null);
  const [items, setItems] = useState<LostItem[]>([]);
  const [itemFoundBy, setItemFoundBy] = useState<LostItem[]>([]);

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const handleRequestClaim = async (values: { unique_id: number; description: string }) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::LostAndFoundRegistry::register_found_item`,
          functionArguments: [values.unique_id, values.description],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Listed Your Findings!");
      fetchAllItemsFoundBy();
      fetchAllItems();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error Registering Finding.", error);
    }
  };

  const fetchAllItems = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::LostAndFoundRegistry::view_all_items`,
        functionArguments: [],
      };

      const result = await aptosClient().view({ payload });

      const itemList = result[0] as LostItem[];

      if (Array.isArray(itemList)) {
        setItems(
          itemList.map((item) => ({
            title: item.title,
            description: item.description,
            reward: item.reward,
            is_claimed: item.is_claimed,
            owner: item.owner,
            finders: item.finders.map((finder) => ({
              description: finder.description,
              finder: finder.finder,
              is_verified: finder.is_verified,
            })),
            unique_id: item.unique_id,
          })),
        );
      } else {
        setItems([]);
      }
      fetchAllItemsFoundBy();
    } catch (error) {
      console.error("Failed to get Policies by address:", error);
    }
  };
  const handleFetchItemById = () => {
    if (itemID !== null) {
      fetchItemById(itemID);
    } else {
      message.error("Please enter a valid ID.");
    }
  };

  const fetchItemById = async (unique_id: number) => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::LostAndFoundRegistry::view_item_by_id`,
        functionArguments: [unique_id],
      };
      const result = await aptosClient().view({ payload });
      const fetchedJob = result[0] as LostItem;
      setItemById(fetchedJob);
      fetchAllItemsFoundBy();
    } catch (error) {
      console.error("Failed to fetch Policy by id:", error);
    }
  };

  const fetchAllItemsFoundBy = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::LostAndFoundRegistry::view_items_found_by_finder`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const itemList = result[0] as LostItem[];

      if (Array.isArray(itemList)) {
        setItemFoundBy(
          itemList.map((item) => ({
            title: item.title,
            description: item.description,
            reward: item.reward,
            is_claimed: item.is_claimed,
            owner: item.owner,
            finders: item.finders.map((finder) => ({
              description: finder.description,
              finder: finder.finder,
              is_verified: finder.is_verified,
            })),
            unique_id: item.unique_id,
          })),
        );
      } else {
        setItemFoundBy([]);
      }
      fetchAllItems();
    } catch (error) {
      console.error("Failed to get Policies by address:", error);
    }
  };

  useEffect(() => {
    fetchAllItems();
    fetchAllItemsFoundBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, items]);

  return (
    <>
      <LaunchpadHeader title="All Lost Items" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>All Available Items</CardDescription>
            </CardHeader>
            <CardContent>
              <Table dataSource={items} rowKey="" className="max-w-screen-xl mx-auto">
                <Column title="ID" dataIndex="unique_id" />
                <Column title="Title" dataIndex="title" />
                <Column
                  title="Reward"
                  dataIndex="reward"
                  render={(reward: number) => convertAmountFromOnChainToHumanReadable(reward, 8)}
                />
                <Column title="Owner" dataIndex="owner" render={(owner: string) => owner.substring(0, 6)} />
                <Column
                  title="Description"
                  dataIndex="description"
                  responsive={["md"]}
                  render={(creator: string) => creator.substring(0, 300)}
                />
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>List Your Findings</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleRequestClaim}
                labelCol={{
                  span: 4.04,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item label="Item ID" name="unique_id" rules={[{ required: true }]}>
                  <Input placeholder="eg. 1001" />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                  <Input placeholder="eg. Describe your Findings. how where did you find and how you would return!" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    List Findings
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>View Item By ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                <Input
                  placeholder="Enter Item ID"
                  type="number"
                  value={itemID || ""}
                  onChange={(e) => setItemID(Number(e.target.value))}
                  style={{ marginBottom: 16 }}
                />
                <Button
                  onClick={handleFetchItemById}
                  variant="submit"
                  size="lg"
                  className="text-base w-full"
                  type="submit"
                >
                  Fetch Policy
                </Button>
                {itemById && (
                  <Card key={itemById.unique_id} className="mb-6 shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-4">Policy ID: {itemById.unique_id}</p>
                    <Card key={itemById.unique_id} className="mb-6 shadow-lg p-4">
                      <p className="text-sm text-gray-500 mb-4">Policy ID: {itemById.unique_id}</p>
                      <Card style={{ marginTop: 16, padding: 16 }}>
                        {itemById && (
                          <div>
                            <Paragraph>
                              <strong>Title:</strong> {itemById.title}
                            </Paragraph>
                            <Paragraph>
                              <strong>Creator:</strong> <Tag>{itemById.owner}</Tag>
                            </Paragraph>
                            <Paragraph>
                              <strong>Reward:</strong>{" "}
                              <Tag>{convertAmountFromOnChainToHumanReadable(itemById.reward, 8)}</Tag>
                            </Paragraph>

                            <Paragraph>
                              <strong>Description:</strong> {itemById.description}
                            </Paragraph>

                            <Paragraph>
                              <strong>Claimed:</strong> <Tag>{itemById.is_claimed ? "Yes" : "No"}</Tag>
                            </Paragraph>

                            {itemById.finders.length > 0 ? (
                              <Card style={{ marginTop: 16, padding: 16 }}>
                                {itemById.finders.map((customer, idx) => (
                                  <div key={idx} className="mb-4">
                                    <Paragraph>
                                      <strong>Finder:</strong> <Tag>{customer.finder}</Tag>
                                    </Paragraph>
                                    <Paragraph>
                                      <strong>Verified:</strong> <Tag>{customer.is_verified ? "Yes" : "No"}</Tag>
                                    </Paragraph>
                                    <Paragraph>
                                      <strong>description:</strong> {customer.description}
                                    </Paragraph>
                                  </div>
                                ))}
                              </Card>
                            ) : (
                              <Paragraph>No Finders Found for this Items. </Paragraph>
                            )}
                          </div>
                        )}
                      </Card>
                    </Card>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get Items Found By You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {itemFoundBy.map((policy, index) => (
                  <Card key={index} className="mb-6 shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-4">Policy ID: {policy.unique_id}</p>
                    <Card style={{ marginTop: 16, padding: 16 }}>
                      {policy && (
                        <div>
                          <Paragraph>
                            <strong>Title:</strong> {policy.title}
                          </Paragraph>
                          <Paragraph>
                            <strong>Creator:</strong> <Tag>{policy.owner}</Tag>
                          </Paragraph>
                          <Paragraph>
                            <strong>Reward:</strong>{" "}
                            <Tag>{convertAmountFromOnChainToHumanReadable(policy.reward, 8)}</Tag>
                          </Paragraph>

                          <Paragraph>
                            <strong>Description:</strong> {policy.description}
                          </Paragraph>

                          <Paragraph>
                            <strong>Claimed:</strong> <Tag>{policy.is_claimed ? "Yes" : "No"}</Tag>
                          </Paragraph>

                          {policy.finders.length > 0 ? (
                            <Card style={{ marginTop: 16, padding: 16 }}>
                              {policy.finders.map((customer, idx) => (
                                <div key={idx} className="mb-4">
                                  <Paragraph>
                                    <strong>Finder:</strong> <Tag>{customer.finder}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>Verified:</strong> <Tag>{customer.is_verified ? "Yes" : "No"}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>description:</strong> {customer.description}
                                  </Paragraph>
                                </div>
                              ))}
                            </Card>
                          ) : (
                            <Paragraph>No Customers Found for this Policy. </Paragraph>
                          )}
                        </div>
                      )}
                    </Card>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>All Items on Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {items.map((policy, index) => (
                  <Card key={index} className="mb-6 shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-4">Policy ID: {policy.unique_id}</p>
                    <Card style={{ marginTop: 16, padding: 16 }}>
                      {policy && (
                        <div>
                          <Paragraph>
                            <strong>Title:</strong> {policy.title}
                          </Paragraph>
                          <Paragraph>
                            <strong>Creator:</strong> <Tag>{policy.owner}</Tag>
                          </Paragraph>
                          <Paragraph>
                            <strong>Reward:</strong>{" "}
                            <Tag>{convertAmountFromOnChainToHumanReadable(policy.reward, 8)}</Tag>
                          </Paragraph>

                          <Paragraph>
                            <strong>Description:</strong> {policy.description}
                          </Paragraph>

                          <Paragraph>
                            <strong>Claimed:</strong> <Tag>{policy.is_claimed ? "Yes" : "No"}</Tag>
                          </Paragraph>

                          {policy.finders.length > 0 ? (
                            <Card style={{ marginTop: 16, padding: 16 }}>
                              {policy.finders.map((customer, idx) => (
                                <div key={idx} className="mb-4">
                                  <Paragraph>
                                    <strong>Finder:</strong> <Tag>{customer.finder}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>Verified:</strong> <Tag>{customer.is_verified ? "Yes" : "No"}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>description:</strong> {customer.description}
                                  </Paragraph>
                                </div>
                              ))}
                            </Card>
                          ) : (
                            <Paragraph>No Customers Found for this Policy. </Paragraph>
                          )}
                        </div>
                      )}
                    </Card>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
