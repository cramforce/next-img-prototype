/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import type React from "react";
import { ReactEventHandler, useRef } from "react";

const dummyPlaceholder = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http%3A//www.w3.org/2000/svg' xmlns%3Axlink='http%3A//www.w3.org/1999/xlink' viewBox='0 0 10 6'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='.5'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='1 1'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter='url(%23b)' x='0' y='0' height='100%25' width='100%25' xlink%3Ahref='data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAA70lEQVR4AQXBTUvCcADA4Z/7z9xcmbEpdSg6CBYGRUcr6WJvUESfqHN07Jt47hBdBV/AFg2FYTGd2DZzmJiz54ndnpUX51cldvcvSWoqufwGcVlgmlX01CpLmsbD4xMiZ2zeS8MQNRgQX1Gweg6/owGvLxUyxjq2+4VtO8haPIGKxKfdxfpzmUgKruMSxX4QiqDfs2i1A+RwMmM+hsr4nbSvcnNaZHnqE8yTNDpvROGU7FYSueX3MUcuqbUExYsd9jICY66yyOrUm22aHY/vmYec304jRIRuaJROjmg8V/G8IXflawoHhxx/1KjVu/wDycJbrJ7yuz0AAAAASUVORK5CYII='%3E%3C/image%3E%3C/svg%3E`;
const dummySrcset =
  "https://www.industrialempathy.com/img/remote/ZiApcF-1920w.jpg 1920w, https://www.industrialempathy.com/img/remote/ZiApcF-1280w.jpg 1280w, https://www.industrialempathy.com/img/remote/ZiApcF-640w.jpg 640w, https://www.industrialempathy.com/img/remote/ZiApcF-320w.jpg 320w";
interface ImgProps {
  src: string;
  width: number | string;
  height: number | string;
  sizes?: string;
  loading?: "lazy" | "eager" | undefined;
  decoding?: "async" | "async";
  style?: React.CSSProperties;
  onLoad?: ReactEventHandler;
}

export function Img({
  src,
  width,
  height,
  sizes,
  loading,
  decoding,
  onLoad,
  style,
  ...rest
}: ImgProps) {
  const loadingStrategy = loading !== undefined ? loading : "lazy";
  if (loadingStrategy === "lazy" && decoding === undefined) {
    decoding = "async";
  }
  if (!style) {
    style = {};
  }
  style.backgroundSize = "cover";
  style.backgroundImage = `url("${dummyPlaceholder}")`;
  style.contentVisibility = "auto";
  const ref = useRef<HTMLImageElement>(null);
  let srcSet: string | undefined = dummySrcset;
  const sizesAttr = sizes ? sizes : undefined;
  return (
    <>
      <img
        ref={ref}
        src={sizesAttr ? src : dummyPlaceholder}
        width={width}
        height={height}
        sizes={sizesAttr}
        loading={loadingStrategy}
        decoding={decoding}
        srcSet={sizesAttr ? srcSet : undefined}
        data-srcSet={srcSet}
        style={style}
        onLoad={(e) => {
          if (ref.current) {
            ref.current.style.backgroundImage = "none";
          }
          if (onLoad) {
            return onLoad(e);
          }
        }}
        {...rest}
      />
      {!sizes && (
        <script
          dangerouslySetInnerHTML={{ __html: `(${observe.toString()})()` }}
        ></script>
      )}
    </>
  );
}

function observe() {
  const img = document.currentScript
    ?.previousElementSibling as HTMLImageElement;
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.contentRect) {
        img.setAttribute("sizes", Math.round(entry.contentRect.width) + "px");
        img.setAttribute("srcset", img.getAttribute("data-srcset") || "");
      }
    }
  });
  resizeObserver.observe(img);
}
