import { type GetServerSideProps } from "next";

import { navigation, SITE_URL } from "../utils/const";
import { buildSitemap } from "../utils/sitemap";

// The home page plus every tool, so a new entry in `navigation` is listed automatically.
const paths = ["/", ...navigation.map((item) => item.href)];

export const getServerSideProps: GetServerSideProps = ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.write(buildSitemap(SITE_URL, paths));
  res.end();

  return Promise.resolve({ props: {} });
};

// The response is written in getServerSideProps; nothing is rendered.
const Sitemap = () => null;

export default Sitemap;
