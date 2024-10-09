import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Input, message, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
const { Column } = Table;
const { Paragraph } = Typography;

export function MyCollections() {
  const { account } = useWallet();
  const [willID, setWillID] = useState<string>("");

  const [willDataBy, setWillDataBy] = useState<Will[]>([]);
  const [willDataByID, setWillDataByID] = useState<Will | null>(null);
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

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const fetchAllWillsBy = async () => {
    try {
      const walletAddress = await account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::DigitalWillSystem::view_wills_by_testator`,
        functionArguments: [walletAddress],
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
        setWillDataBy(wills);
      } else {
        setWillDataBy([]);
      }
    } catch (error) {
      console.error("Failed to get Will by address:", error);
    }
  };
  // Fetch all wills on the platform
  const fetchAllWills = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::DigitalWillSystem::view_all_wills`,
        functionArguments: [],
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
      console.error("Failed to get all wills:", error);
    }
  };

  const handleFetchItemById = () => {
    if (willID !== "") {
      fetchWillByID(Number(willID));
    } else {
      message.error("Please enter a valid ID.");
    }
  };

  // Fetch a will by ID
  const fetchWillByID = async (unique_id: number) => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::DigitalWillSystem::view_will_by_id`,
        functionArguments: [unique_id],
      };

      const result = await aptosClient().view({ payload });
      const itemList = result[0] as {
        id: string;
        testator: string;
        total_assets: string;
        is_executed: boolean;
        beneficiaries: { beneficiary_address: string; percentage: number }[];
      };

      if (itemList) {
        const will: Will = {
          id: itemList.id,
          testator: itemList.testator,
          total_assets: itemList.total_assets,
          is_executed: itemList.is_executed,
          beneficiaries: itemList.beneficiaries.map(
            (b: { beneficiary_address: string; percentage: number }): Beneficiary => ({
              beneficiary_address: b.beneficiary_address,
              percentage: b.percentage,
            }),
          ),
        };
        setWillDataByID(will);
      } else {
        setWillDataByID(null);
      }
    } catch (error) {
      console.error("Failed to fetch Will by ID:", error);
    }
  };
  useEffect(() => {
    fetchAllWills();
    fetchAllWillsBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, willID]);

  return (
    <>
      <LaunchpadHeader title="All Wills" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          {/* Table to display all wills */}
          <Card>
            <CardHeader>
              <CardDescription>All Available Wills</CardDescription>
            </CardHeader>
            <CardContent>
              <Table dataSource={willData} rowKey="id" className="max-w-screen-xl mx-auto">
                <Column title="ID" dataIndex="id" />
                <Column
                  title="Assets"
                  dataIndex="total_assets"
                  render={(reward: number) => convertAmountFromOnChainToHumanReadable(reward, 8)}
                />
                <Column title="Owner" dataIndex="testator" render={(owner: string) => owner.substring(0, 12)} />
                <Column
                  title="Is Executed"
                  dataIndex="is_executed"
                  render={(is_executed: boolean) => (is_executed ? "Yes" : "No")}
                />
              </Table>
            </CardContent>
          </Card>

          {/* Fetch a will by ID */}
          <Card>
            <CardHeader>
              <CardDescription>View Will By ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                <Input
                  placeholder="Enter Will ID"
                  type="number"
                  value={willID}
                  onChange={(e) => setWillID(e.target.value)}
                  style={{ marginBottom: 16 }}
                />
                <Button
                  onClick={handleFetchItemById}
                  variant="submit"
                  size="lg"
                  className="text-base w-full"
                  type="submit"
                >
                  Fetch Will
                </Button>
                {willDataByID ? (
                  <Card className="mb-6 shadow-lg p-4">
                    <Paragraph className="text-sm text-gray-500 mb-4">Will ID: {willDataByID.id}</Paragraph>
                    <Paragraph>
                      <strong>Testator:</strong> <Tag>{willDataByID.testator}</Tag>
                    </Paragraph>
                    <Paragraph>
                      <strong>Total Assets:</strong>{" "}
                      {convertAmountFromOnChainToHumanReadable(Number(willDataByID.total_assets), 8)} APT
                    </Paragraph>
                    <Paragraph>
                      <strong>Executed:</strong> <Tag>{willDataByID.is_executed ? "Yes" : "No"}</Tag>
                    </Paragraph>
                    <h2 className="text-xl font-semibold mb-4">Beneficiaries</h2>
                    {willDataByID.beneficiaries.map((beneficiary, index) => (
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

          {/* Your Will (based on account) */}
          <Card>
            <CardHeader>
              <CardDescription>Your Will</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {willDataBy && willDataBy.length > 0 ? (
                  <Card className="mb-6 shadow-lg p-4">
                    <Paragraph className="text-sm text-gray-500 mb-4">Will ID: {willDataBy[0].id}</Paragraph>
                    <Paragraph>
                      <strong>Testator:</strong> <Tag>{willDataBy[0].testator}</Tag>
                    </Paragraph>
                    <Paragraph>
                      <strong>Total Assets:</strong>{" "}
                      {convertAmountFromOnChainToHumanReadable(Number(willDataBy[0].total_assets), 8)} APT
                    </Paragraph>
                    <Paragraph>
                      <strong>Executed:</strong> <Tag>{willDataBy[0].is_executed ? "Yes" : "No"}</Tag>
                    </Paragraph>
                    <h2 className="text-xl font-semibold mb-4">Beneficiaries</h2>
                    {willDataBy[0].beneficiaries.map((beneficiary, index) => (
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

          <Card>
            <CardHeader>
              <CardDescription>All Wills on Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {willData.map((will) => (
                  <Card key={will.id} className="mb-6 shadow-lg p-4">
                    <Paragraph className="text-sm text-gray-500 mb-4">Will ID: {will.id}</Paragraph>
                    <Paragraph>
                      <strong>Testator:</strong> <Tag>{will.testator}</Tag>
                    </Paragraph>
                    <Paragraph>
                      <strong>Total Assets:</strong>{" "}
                      {convertAmountFromOnChainToHumanReadable(Number(will.total_assets), 8)} APT
                    </Paragraph>
                    <Paragraph>
                      <strong>Executed:</strong> <Tag>{will.is_executed ? "Yes" : "No"}</Tag>
                    </Paragraph>
                    <h2 className="text-xl font-semibold mb-4">Beneficiaries</h2>
                    {will.beneficiaries.map((beneficiary, index) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
