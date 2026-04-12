import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Tabs from "../components/Tabs";
import { DummyEmail } from "../containers/dummy-data-generator/DummyEmail";
import { DummyPhone } from "../containers/dummy-data-generator/DummyPhone";
import { DummyText } from "../containers/dummy-data-generator/DummyText";
import Layout from "../containers/layout";
import { Title } from "../components/Title";

const tabs = [
  { name: "Text", current: true },
  { name: "Email", current: false },
  { name: "Phone", current: false },
];

const CountWords: NextPage = () => {
  const [currentTabs, setCurrentTabs] = useState(tabs);

  const renderTab = () => {
    const activeTab = currentTabs.find((tab) => tab.current);
    if (!activeTab) {
      return <p>No tab is currently active</p>;
    }
    switch (activeTab.name) {
      case "Email":
        return <DummyEmail />;
      case "Phone":
        return <DummyPhone />;
      case "Text":
        return <DummyText />;
      default:
        return null;
    }
  };
  return (
    <>
      <Head>
        <title>Dummy Data Generator</title>
        <meta
          name="description"
          content="A tool to generate random text, emails and phone numbers"
        />
      </Head>
      <Layout>
        <div className="flex w-full flex-col items-center justify-start space-y-4 lg:space-y-6">
          <Title title="Dummy Data Generator" />
          <div className="flex w-full max-w-3xl flex-col space-y-4 lg:space-y-6">
            <Tabs tabs={currentTabs} setTabs={setCurrentTabs} />
            <div className="space-y-4 rounded-md bg-white/10 p-4 lg:space-y-6 lg:p-6">
              {renderTab()}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CountWords;
