import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Notice } from "../components/Notice";
import { OutputBlock } from "../components/OutputBlock";
import { Title } from "../components/Title";
import Layout from "../containers/layout";
import { decodeJwt, describeExpiry, readTimeClaims } from "../utils/jwt";

const formatDate = (date: Date): string =>
  `${date.toLocaleString()} (${date.toISOString()})`;

const JwtDecoder: NextPage = () => {
  const [input, setInput] = useState("");

  const hasInput = input.trim().length > 0;
  const result = decodeJwt(input);
  const expiry = result.valid
    ? describeExpiry(result.payload, new Date())
    : null;
  const timeClaims = result.valid ? readTimeClaims(result.payload) : [];

  return (
    <>
      <Head>
        <title>JWT Decoder</title>
        <meta
          name="description"
          content="Decode a JSON Web Token in your browser: header, claims, and expiry. The token is never sent to a server."
        />
      </Head>
      <Layout>
        <Title title="JWT Decoder" />

        <p className="mb-4 max-w-3xl text-sm text-gray-400">
          Paste a JSON Web Token to read its header and claims. Everything is
          decoded in your browser and the token is never sent anywhere. The
          signature is not verified.
        </p>

        <div className="mb-4 flex flex-col gap-2">
          <label
            htmlFor="jwt-input"
            className="text-sm font-medium text-gray-300"
          >
            Token
          </label>
          <textarea
            id="jwt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            spellCheck={false}
            className={`h-36 w-full resize-none break-all rounded-md border bg-dark/50 p-3 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary ${
              hasInput && !result.valid ? "border-red-500" : "border-gray-600"
            }`}
          />
        </div>

        {hasInput && !result.valid && (
          <Notice tone="error">{result.error}</Notice>
        )}
        {expiry?.status === "active" && (
          <Notice tone="success">Valid until {formatDate(expiry.at)}</Notice>
        )}
        {expiry?.status === "expired" && (
          <Notice tone="error">Expired on {formatDate(expiry.at)}</Notice>
        )}
        {expiry?.status === "not-yet-valid" && (
          <Notice tone="warning">
            Not valid before {formatDate(expiry.at)}
          </Notice>
        )}
        {expiry?.status === "none" && (
          <Notice tone="warning">This token has no expiry claim</Notice>
        )}

        {result.valid && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <OutputBlock
                label="Header"
                text={JSON.stringify(result.header, null, 2)}
              />
              <OutputBlock
                label="Payload"
                text={JSON.stringify(result.payload, null, 2)}
              />
            </div>

            {timeClaims.length > 0 && (
              <table className="w-full max-w-3xl text-left text-sm">
                <caption className="mb-2 text-left font-medium text-gray-300">
                  Time claims
                </caption>
                <tbody>
                  {timeClaims.map(({ claim, at }) => (
                    <tr key={claim} className="border-t border-gray-700">
                      <th
                        scope="row"
                        className="py-2 pr-4 font-mono font-normal text-primary"
                      >
                        {claim}
                      </th>
                      <td className="py-2 text-gray-200">{formatDate(at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </Layout>
    </>
  );
};

export default JwtDecoder;
