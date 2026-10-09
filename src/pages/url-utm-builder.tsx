import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Notice } from "../components/Notice";
import { OutputBlock } from "../components/OutputBlock";
import { Title } from "../components/Title";
import Layout from "../containers/layout";
import {
  buildUtmUrl,
  parseUrl,
  UTM_FIELDS,
  type UtmValues,
} from "../utils/url-utm";

const INPUT_CLASS =
  "w-full rounded-md border border-gray-600 bg-dark/50 p-3 font-mono text-sm text-gray-100 placeholder-gray-500 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary";

const UrlUtmBuilder: NextPage = () => {
  const [url, setUrl] = useState("");
  const [utm, setUtm] = useState<UtmValues>({});

  const hasInput = url.trim().length > 0;
  const parsed = parseUrl(url);
  const built = buildUtmUrl(url, utm) ?? "";
  const parts = parsed.valid
    ? [
        { name: "Protocol", value: parsed.protocol },
        { name: "Host", value: parsed.host },
        { name: "Path", value: parsed.path },
        { name: "Hash", value: parsed.hash },
      ].filter((part) => part.value)
    : [];

  return (
    <>
      <Head>
        <title>URL Parser & UTM Builder</title>
        <meta
          name="description"
          content="Break a URL into host, path, and decoded query parameters, and build campaign links with UTM tags."
        />
      </Head>
      <Layout>
        <Title title="URL & UTM Builder" />

        <div className="mb-4 flex flex-col gap-2">
          <label
            htmlFor="url-input"
            className="text-sm font-medium text-gray-300"
          >
            URL
          </label>
          <input
            id="url-input"
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/landing?ref=home"
            spellCheck={false}
            autoComplete="off"
            className={INPUT_CLASS}
          />
        </div>

        {hasInput && !parsed.valid && (
          <Notice tone="error">{parsed.error}</Notice>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section
            aria-labelledby="utm-heading"
            className="flex flex-col gap-3"
          >
            <h2 id="utm-heading" className="text-sm font-medium text-gray-300">
              UTM tags
            </h2>
            {UTM_FIELDS.map((field) => (
              <div key={field.key} className="flex flex-col gap-1">
                <label htmlFor={field.key} className="text-xs text-gray-400">
                  {field.label}{" "}
                  <span className="font-mono text-gray-500">{field.key}</span>
                </label>
                <input
                  id={field.key}
                  type="text"
                  value={utm[field.key] ?? ""}
                  onChange={(e) =>
                    setUtm({ ...utm, [field.key]: e.target.value })
                  }
                  placeholder={field.hint}
                  spellCheck={false}
                  autoComplete="off"
                  className={INPUT_CLASS}
                />
              </div>
            ))}
          </section>

          <div className="flex flex-col gap-4">
            <OutputBlock
              label="Tagged URL"
              text={built}
              placeholder="Enter a URL to build the link"
            />

            {parsed.valid && (
              <table className="w-full text-left text-sm">
                <caption className="mb-2 text-left font-medium text-gray-300">
                  URL parts
                </caption>
                <tbody>
                  {parts.map((part) => (
                    <tr key={part.name} className="border-t border-gray-700">
                      <th
                        scope="row"
                        className="py-2 pr-4 font-normal text-gray-400"
                      >
                        {part.name}
                      </th>
                      <td className="break-all py-2 font-mono text-gray-200">
                        {part.value}
                      </td>
                    </tr>
                  ))}
                  {parsed.params.map((param, index) => (
                    <tr
                      key={`${param.key}-${index}`}
                      className="border-t border-gray-700"
                    >
                      <th
                        scope="row"
                        className="break-all py-2 pr-4 font-mono font-normal text-primary"
                      >
                        {param.key}
                      </th>
                      <td className="break-all py-2 font-mono text-gray-200">
                        {param.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default UrlUtmBuilder;
