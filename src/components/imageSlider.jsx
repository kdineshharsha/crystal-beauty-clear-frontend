import React, { useState } from "react";

export default function ImageSlider(props) {
  const images = props.images;
  const [activeImage, setActiveImage] = useState(images[0]);

  //   console.log(props.images);

  return (
    <div className="w-full h-full  bg-amber-500 flex items-center justify-center">
      <div className="bg-green-600 w-[70%] aspect-square relative">
        <img
          src={activeImage}
          alt="product"
          className="w-full h-full object-cover"
        />
        <div className="h-[100px] w-full absolute bottom-0 right-0 flex gap-2 justify-center backdrop-blur-3xl">
          {images.map((image, index) => {
            return (
              <img
                key={index}
                src={image}
                alt="product"
                className="h-full aspect-square cursor-pointer "
                onClick={() => setActiveImage(image)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
