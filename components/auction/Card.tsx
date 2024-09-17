import React from "react";
import locationimg from "../../src/assets/shared/location.svg";
export default function Card() {
  return (
    <div className="max-h-200px max-w-500px border-2 border-black p-4 rounded-md flex felx-col gap-2">
      <div id="item-dp" className="w-[30%]">
        <img
          src="https://picsum.photos/200"
          alt="item image"
          className=" rounded-md"
        />{" "}
      </div>
      <div id="item-info" className="w-[70%] flex flex-col text-xs justify-between">
        <div className=" flex flex-row justify-between">
          <p className="font-bold text-red-500 text-lg"> Wheat</p>
          <p className="bg-orange-100 p-1 rounded-xl text-yellow-800"> AID:1511551</p>
        </div>

        <p> ₹200/QT</p>
        <p> Item Quantity</p>
        <div className=" flex flex-row justify-between">
          <div className=" flex items-center flex-row">
            {" "}
            <img src={locationimg} alt="loc" /> Location
          </div>
          <p>Ends:20 oct'24 </p>
        </div>
      </div>
    </div>
  );
}
