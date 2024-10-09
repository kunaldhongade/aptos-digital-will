/* eslint-disable react-hooks/exhaustive-deps */
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Col, Form, message, Row, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export function CreateCollection() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([{ beneficiary_address: "", percentage: 0 }]);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [willId, setWillId] = useState<number>(0);
  const [willData, setWillData] = useState<Will[]>([]);

  interface Beneficiary {
    beneficiary_address: string;
    percentage: number;
  }

  interface Will {
    id: string;
    testator: string;
    total_assets: string;
    is_executed: boolean;
    beneficiaries: Beneficiary[];
  }

  const addBeneficiary = () => {
    setBeneficiaries([...beneficiaries, { beneficiary_address: "", percentage: 0 }]);
  };

  const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
    return value * Math.pow(10, decimal);
  };

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const fetchAllWillsBy = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::DigitalWillSystem::view_wills_by_testator`,
        functionArguments: [account?.address],
      };

      const result = await aptosClient().view({ payload });
      const itemList = result[0] as {
        id: string;
        testator: string;
        total_assets: string;
        is_executed: boolean;
        beneficiaries: { beneficiary_address: string; percentage: number }[];
      }[];

      if (Array.isArray(itemList)) {
        const wills: Will[] = itemList.map(
          (item): Will => ({
            id: item.id,
            testator: item.testator,
            total_assets: item.total_assets,
            is_executed: item.is_executed,
            beneficiaries: item.beneficiaries.map(
              (b: { beneficiary_address: string; percentage: number }): Beneficiary => ({
                beneficiary_address: b.beneficiary_address,
                percentage: b.percentage,
              }),
            ),
          }),
        );
        setWillData(wills);
      } else {
        setWillData([]);
      }
    } catch (error) {
      console.error("Failed to get Will by address:", error);
    }
  };

  const handelCreateWill = async () => {
    try {
      const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
      if (totalPercentage !== 100) {
        message.error("Total percentage must sum to 100.");
        return;
      }

      const beneficiaryAddresses = beneficiaries.map((b) => b.beneficiary_address);
      const beneficiaryPercentages = beneficiaries.map((b) => b.percentage);
      const totalAssetsAMT = convertAmountFromHumanReadableToOnChain(totalAssets, 8);

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::DigitalWillSystem::create_will`,
          functionArguments: [beneficiaryAddresses, beneficiaryPercentages, totalAssetsAMT],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Will Created Successfully!");
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
      console.log("Error Creating Will.", error);
    }
  };

  const handleUpdateWill = async () => {
    try {
      const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
      if (totalPercentage !== 100) {
        message.error("Total percentage must sum to 100.");
        return;
      }

      const beneficiaryAddresses = beneficiaries.map((b) => b.beneficiary_address);
      const beneficiaryPercentages = beneficiaries.map((b) => b.percentage);

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::DigitalWillSystem::update_will`,
          functionArguments: [willId, beneficiaryAddresses, beneficiaryPercentages, totalAssets],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Will Updated Successfully!");
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
      console.log("Error Updating Will", error);
    }
  };

  const handleRevokeWill = async () => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::DigitalWillSystem::revoke_will`,
          functionArguments: [willId],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Will Revoked Successfully!");
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
      console.log("Error Revoking Will", error);
    }
  };

  const handleExecuteWill = async () => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::DigitalWillSystem::execute_will`,
          functionArguments: [willId],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Will executed successfully!");
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
      console.log("Error Executing Will", error);
    }
  };

  const handleBeneficiaryChange = (index: number, field: keyof Beneficiary, value: string | number) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index] = { ...updatedBeneficiaries[index], [field]: value };
    setBeneficiaries(updatedBeneficiaries);
  };

  useEffect(() => {
    fetchAllWillsBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, willData]);

  return (
    <>
      <LaunchpadHeader title="Create Will" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Create Will</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handelCreateWill}
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
                <Form.Item label="Total Assets (APT)">
                  <Input
                    type="number"
                    value={totalAssets}
                    onChange={(e) => setTotalAssets(Number(e.target.value))}
                    placeholder="Enter total assets in APT"
                  />
                </Form.Item>

                {/* Beneficiaries */}
                <h2 className="text-xl font-semibold mb-4">Beneficiaries</h2>

                {beneficiaries.map((beneficiary, index) => (
                  <Row gutter={16} key={index} className="mb-4">
                    <Col span={12}>
                      <Form.Item label={`Beneficiary Address ${index + 1}`}>
                        <Input
                          value={beneficiary.beneficiary_address}
                          onChange={(e) => handleBeneficiaryChange(index, "beneficiary_address", e.target.value)}
                          placeholder="Enter beneficiary address"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={`Percentage ${index + 1} (%)`}>
                        <Input
                          type="number"
                          value={beneficiary.percentage}
                          onChange={(e) => handleBeneficiaryChange(index, "percentage", Number(e.target.value))}
                          placeholder="Enter percentage"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Button variant="init" onClick={addBeneficiary} className="mb-6 text-slate-950">
                  Add Beneficiary
                </Button>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Create Will
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Update Will</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleUpdateWill}
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
                <Form.Item label="Will ID">
                  <Input
                    type="number"
                    value={willId}
                    onChange={(e) => setWillId(Number(e.target.value))}
                    placeholder="Enter Will ID"
                  />
                </Form.Item>

                {/* Total Assets */}
                <Form.Item label="Total Assets (APT)">
                  <Input
                    type="number"
                    value={totalAssets}
                    onChange={(e) => setTotalAssets(Number(e.target.value))}
                    placeholder="Enter total assets in APT"
                  />
                </Form.Item>

                {/* Beneficiaries */}
                <h2 className="text-xl font-semibold mb-4">Beneficiaries</h2>
                {beneficiaries.map((beneficiary, index) => (
                  <Row gutter={16} key={index} className="mb-4">
                    <Col span={12}>
                      <Form.Item label={`Beneficiary Address ${index + 1}`}>
                        <Input
                          value={beneficiary.beneficiary_address}
                          onChange={(e) => handleBeneficiaryChange(index, "beneficiary_address", e.target.value)}
                          placeholder="Enter beneficiary address"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={`Percentage ${index + 1} (%)`}>
                        <Input
                          type="number"
                          value={beneficiary.percentage}
                          onChange={(e) => handleBeneficiaryChange(index, "percentage", Number(e.target.value))}
                          placeholder="Enter percentage"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Button variant="init" onClick={addBeneficiary} className="mb-6 text-slate-950">
                  Add Beneficiary
                </Button>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Update Will
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Revoke Will</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleRevokeWill}
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
                {/* Will ID */}
                <Form.Item label="Will ID">
                  <Input
                    type="number"
                    value={willId}
                    onChange={(e) => setWillId(Number(e.target.value))}
                    placeholder="Enter Will ID"
                  />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Revoke Will
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Execute Will</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleExecuteWill}
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
                {/* Will ID */}
                <Form.Item label="Will ID">
                  <Input
                    type="number"
                    value={willId}
                    onChange={(e) => setWillId(Number(e.target.value))}
                    placeholder="Enter Will ID"
                  />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Execute Will
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Your Will</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {willData && willData.length > 0 ? (
                  <Card className="mb-6 shadow-lg p-4">
                    <Paragraph className="text-sm text-gray-500 mb-4">Will ID: {willData[0].id}</Paragraph>
                    <Paragraph>
                      <strong>Testator:</strong> <Tag>{willData[0].testator}</Tag>
                    </Paragraph>
                    <Paragraph>
                      <strong>Total Assets:</strong>{" "}
                      {convertAmountFromOnChainToHumanReadable(Number(willData[0].total_assets), 8)} APT
                    </Paragraph>
                    <Paragraph>
                      <strong>Executed:</strong> <Tag>{willData[0].is_executed ? "Yes" : "No"}</Tag>
                    </Paragraph>
                    <h2 className="text-xl font-semibold mb-4">Beneficiaries</h2>
                    {willData[0].beneficiaries.map((beneficiary, index) => (
                      <div key={index} className="mb-4">
                        <Paragraph>
                          <strong>Address:</strong> {beneficiary.beneficiary_address}
                        </Paragraph>
                        <Paragraph>
                          <strong>Percentage:</strong> {beneficiary.percentage} %
                        </Paragraph>
                      </div>
                    ))}
                  </Card>
                ) : (
                  <Paragraph>No Will Data Found.</Paragraph>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
