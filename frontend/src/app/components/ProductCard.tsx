/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductProps {
  product: {
    title: string;
    price: number;
    description: string;
    images: string[];
  };
}

export default function ProductCard({ product }: ProductProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    try {
      // Validate URL
      new URL(product.images[0]);
      return product.images[0];
    } catch {
      return "/placeholder.svg?height=300&width=300";
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        <Image
          src={imgSrc || "/placeholder.svg"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-2"
          onError={() => {
            setImgSrc("/placeholder.svg?height=300&width=300");
          }}
          priority={false}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-black">
          {product.title}
        </h3>
        <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">
          {product.description.slice(0, 100)}...
        </p>
      </div>
    </div>
  );
}
