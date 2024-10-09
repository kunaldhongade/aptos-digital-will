/* eslint-disable react-hooks/exhaustive-deps */
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, message, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export function CreateCollection() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [itemRegisterBy, setItemRegisterBy] = useState<LostItem[]>([]);

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

  const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
    return value * Math.pow(10, decimal);
  };

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const handleListLostItem = async (values: LostItem) => {
    try {
      const rewardAMT = convertAmountFromHumanReadableToOnChain(values.reward, 8);

      if (!values.description) {
        values.description = "None";
      }

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::LostAndFoundRegistry::register_lost_item`,
          functionArguments: [values.title, values.description, rewardAMT],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Item Listed Successfully!");
      fetchAllItemsListBy();
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
      console.log("Error Listing Item.", error);
    }
  };

  const handleVerifyClaim = async (values: { item_id: number; finder: string }) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::LostAndFoundRegistry::verify_finder`,
          functionArguments: [values.item_id, values.finder],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Claim Verified Successfully!");
      fetchAllItemsListBy();
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
      console.log("Error Verifying Claim.", error);
    }
  };

  const fetchAllItemsListBy = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::LostAndFoundRegistry::view_items_by_owner`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const itemList = result[0] as LostItem[];

      if (Array.isArray(itemList)) {
        setItemRegisterBy(
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
        setItemRegisterBy([]);
      }
    } catch (error) {
      console.error("Failed to get Policies by address:", error);
    }
  };

  useEffect(() => {
    fetchAllItemsListBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, fetchAllItemsListBy]);

  return (
    <>
      <LaunchpadHeader title="List Lost Items" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>List You Lost Item</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleListLostItem}
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
                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                  <Input placeholder="Eg. Please, find my Dog" />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                  <Input placeholder="Eg. Describe the lost item" />
                </Form.Item>

                <Form.Item label="Reward" name="reward" rules={[{ required: true }]}>
                  <Input placeholder="Enter Reward for finder" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    List Lost Item
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Verify Finders Claim</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleVerifyClaim}
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
                <Form.Item label="Item ID" name="item_id" rules={[{ required: true }]}>
                  <Input placeholder="eg. 1001" />
                </Form.Item>

                <Form.Item label="Finders Address" name="finder" rules={[{ required: true }]}>
                  <Input placeholder="eg. 0x0" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Verify Claim
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get Items Listed By You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {itemRegisterBy.map((policy, index) => (
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
