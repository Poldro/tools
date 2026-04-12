import { FC, useState } from "react";
import Head from "next/head";
import Layout from "../containers/layout";
import { HexAlphaColorPicker, RgbaColorPicker } from "react-colorful";
import convert from "color-convert";
import { Input } from "../components/Input";
import { useForm } from "react-hook-form";
import { Title } from "../components/Title";
import { NextPage } from "next";
import { CopyOnClick } from "../components/ClickToCopy";

type ColorRgba = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const ColorConverter: NextPage = () => {
  const [colorHex, setColorHex] = useState("#aabbcc");
  const [colorRgba, setColorRgba] = useState<ColorRgba>({
    r: 170,
    g: 187,
    b: 204,
    a: 1,
  });
  const [inputColor, setInputColor] = useState("#aabbcc");
  const [colorFormat, setColorFormat] = useState("hex");

  const {
    register,
    formState: { errors },
  } = useForm();

  const hexStats = [
    { name: "hex α", stat: colorHex },
    {
      name: "rgba",
      stat:
        colorHex.length === 9 // Check if alpha channel exists in the HEX color
          ? `rgba(${convert.hex.rgb(colorHex.slice(0, 7)).toString()},${(
              parseInt(colorHex.slice(7), 16) / 255
            ).toFixed(2)})` // Convert last 2 digits of HEX color from [0,255] to [0,1] and round to 2 decimal places
          : `rgb(${convert.hex.rgb(colorHex).toString()})`, // If no alpha channel, set alpha to 1
    },
    { name: "hsl", stat: `hsl(${convert.hex.hsl(colorHex).toString()})` },
    { name: "cmyk", stat: `cmyk(${convert.hex.cmyk(colorHex).toString()})` },
  ];

  const rgbaStats = [
    {
      name: "hex α",
      stat:
        colorRgba.a < 1
          ? `#${convert.rgb.hex(
              colorRgba.r,
              colorRgba.g,
              colorRgba.b
            )}${Math.floor(colorRgba.a * 255)
              .toString(16)
              .padStart(2, "0")}` // convert alpha from [0,1] to [0,255] and then to hex
          : `#${convert.rgb.hex(colorRgba.r, colorRgba.g, colorRgba.b)}`, // If alpha equals 1, return HEX without alpha
    },
    {
      name: "rgba",
      stat: `rgba(${colorRgba.r},${colorRgba.g},${colorRgba.b},${colorRgba.a})`,
    },
    {
      name: "hsl",
      stat: `hsl(${convert.rgb
        .hsl(colorRgba.r, colorRgba.g, colorRgba.b)
        .toString()})`,
    },
    {
      name: "cmyk",
      stat: `cmyk(${convert.rgb
        .cmyk(colorRgba.r, colorRgba.g, colorRgba.b)
        .toString()})`,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputColor(inputValue); // directly connected to the input

    if (inputValue.startsWith("#") || /^[0-9A-Fa-f]{6}$/i.test(inputValue)) {
      setColorHex(inputValue.startsWith("#") ? inputValue : `#${inputValue}`);
      setColorFormat("hex");
    } else if (inputValue.toLowerCase().startsWith("rgb")) {
      const rgbaValues = inputValue
        .replace(/rgba?\(/i, "")
        .replace(/\)/, "")
        .split(",")
        .map(Number);

      if (rgbaValues.length === 4) {
        const [r = 0, g = 0, b = 0, a = 1] = rgbaValues;
        setColorRgba({ r, g, b, a });
        setColorFormat("rgba");
      } else if (rgbaValues.length === 3) {
        const [r = 0, g = 0, b = 0] = rgbaValues;
        setColorRgba({ r, g, b, a: colorRgba.a });
        setColorFormat("rgba");
      }
    } else {
      setColorFormat("invalid");
    }
  };

  const handleHexChange = (color: string) => {
    setColorHex(color);
    setInputColor(color);
  };

  const handleRgbaChange = (color: ColorRgba) => {
    setColorRgba(color);
    const rgbString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    setInputColor(rgbString);
  };

  return (
    <>
      <Head>
        <title>Color Converter</title>
        <meta name="description" content="A simple color converter." />
      </Head>
      <Layout>
        <div className="flex w-full flex-col items-center justify-start space-y-4 lg:space-y-6">
          <Title title="Color Converter" />

          <div className="w-full max-w-3xl rounded-lg border border-gray-700 bg-dark/50 shadow">
            <div
              style={{
                backgroundColor:
                  colorFormat === "rgba"
                    ? `rgba(${colorRgba.r},${colorRgba.g},${colorRgba.b},${colorRgba.a})`
                    : colorHex,
              }}
              className={`flex flex-col rounded-md px-4 py-8 lg:px-6`}
            >
              <div className="space-y-4 lg:space-y-6">
                <div className="relative flex justify-center">
                  <Input
                    type={"text"}
                    name={"colorFormat"}
                    value={inputColor}
                    errors={errors}
                    errorsType={{ required: true }}
                    register={register}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex w-full justify-center">
                  <ColorPicker
                    colorFormat={colorFormat}
                    colorHex={colorHex}
                    handleHexChange={handleHexChange}
                    colorRgba={colorRgba}
                    handleRgbaChange={handleRgbaChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {colorFormat === "rgba" ? (
            <Stats stats={rgbaStats} />
          ) : (
            <Stats stats={hexStats} />
          )}
        </div>
      </Layout>
    </>
  );
};

export default ColorConverter;

const ColorPicker: FC<{
  colorFormat: string;
  colorHex: string;
  handleHexChange: (color: string) => void;
  colorRgba: ColorRgba;
  handleRgbaChange: (color: ColorRgba) => void;
}> = ({
  colorFormat,
  colorHex,
  handleHexChange,
  colorRgba,
  handleRgbaChange,
}) => {
  if (colorFormat === "rgba") {
    return <RgbaColorPicker color={colorRgba} onChange={handleRgbaChange} />;
  } else {
    return <HexAlphaColorPicker color={colorHex} onChange={handleHexChange} />;
  }
};

type StatsProps = {
  stats: { name: string; stat: string }[];
};

const Stats = ({ stats }: StatsProps) => {
  return (
    <div className="w-full max-w-3xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
        {stats &&
          stats.map((stat) => (
            <CopyOnClick
              copyText={stat.stat}
              allClickable={true}
              key={stat.name}
              className="top-1 right-1"
            >
              <div className="group relative h-full rounded-md bg-white/10 px-2 py-2 shadow-md transition hover:bg-white/20 lg:px-4 lg:py-4">
                <p className="text-sm font-medium leading-6 text-gray-400">
                  {stat.name}
                </p>
                <p className="mt-2 flex items-baseline gap-x-2">
                  <span className="text-md font-semibold tracking-tight text-gray-50">
                    {stat.stat}
                  </span>
                </p>
              </div>
            </CopyOnClick>
          ))}
      </div>
    </div>
  );
};
