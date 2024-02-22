import React from "react";
import domtoimage from "dom-to-image";
import s from './GetScrinShot.module.scss';
import { useAppSelector } from "../../redux/hooks";
import allSelectors from "../../redux/selectors";

interface IProp {
    canvasRef: React.RefObject<HTMLDivElement>
}

const GetScrinShot: React.FC<IProp> = ({canvasRef}) => {

    const year = useAppSelector(allSelectors.getYearNum);
    const month = useAppSelector(allSelectors.getMonthNum);
    
    const saveAs = (uri: string, filename: string) => {
        const link = document.createElement("a");
    
        if (typeof link.download === "string") {
          link.href = uri;
          link.download = filename;
    
          document.body.appendChild(link);
    
          link.click();

          document.body.removeChild(link);
        } else {
          window.open(uri);
        }
      };

    const printDomToImage = (node: HTMLElement) => {
        if (canvasRef.current) {
          domtoimage
            .toPng(node)
            .then(function(dataUrl) {
              var img = new Image();
              img.src = dataUrl;
              saveAs(dataUrl, `calendar(${month}-${year})`);
            })
            .catch(function(error) {
              console.error("oops, something went wrong!", error);
            });
        }
      };

    const download = () => {
        if (canvasRef.current) {
          printDomToImage(canvasRef.current);
        }
      };

    return (
        <div className={s.wrapper} >
            <button className={s.button} onClick={download} data-html2canvas-ignore={true}>Get Scrinshot</button>
        </div>
    )
}

export default GetScrinShot;